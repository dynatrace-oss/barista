/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { CircleCiApi, NO_PIPELINE_FOUND_ERROR } from './circle-ci-api';
import { NodeHTTPClient } from './node-http-client';

let client: CircleCiApi;
let testScheduler: TestScheduler;

beforeEach(() => {
  client = new CircleCiApi('a41b8755a116f4b26eaf17b5d390b13f1834212b');
  // Set up the TestScheduler to assert with jest
  testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
});

test('Should throw pipeline not found error if no pipeline matches to the commit', () => {
  const spy = jest
    .spyOn(NodeHTTPClient.prototype, 'get')
    .mockImplementationOnce(() => of(circleResponse([])));

  const commitSha = 'some-commit-sha';
  const stream$ = client.getArtifactUrlForBranch(commitSha);

  testScheduler.run(({ expectObservable }) => {
    expectObservable(stream$).toBe(
      '#',
      {},
      Error(NO_PIPELINE_FOUND_ERROR(commitSha)),
    );
  });

  spy.mockClear();
});

test('Should return artifacts and call appropriate urls', () => {
  const commitSha = '1a490a8ecdd51109da733318aa61fc8da97e2b01';
  const pipelineResponse = [pipeline(commitSha, 'workflow-id')];
  const workflowResponse = [workflow('job-id')];
  const jobResponse = [job('store-build-artifacts', 'job-number')];
  const artifactsResponse = [{ name: 'my-artifact' }];

  const httpGetSpy = jest
    .spyOn(NodeHTTPClient.prototype, 'get')
    .mockImplementation((url, ..._args) => {
      if (url.endsWith('/pipeline')) {
        return of(circleResponse(pipelineResponse));
      }
      if (url.endsWith('/workflow')) {
        return of(circleResponse(workflowResponse));
      }
      if (url.endsWith('/job')) {
        return of(circleResponse(jobResponse));
      }
      if (url.endsWith('artifacts')) {
        return of(circleResponse(artifactsResponse));
      }

      return of();
    });

  const stream$ = client.getArtifactUrlForBranch(commitSha);

  testScheduler.run(({ expectObservable }) => {
    expectObservable(stream$).toBe('(a|)', {
      a: artifactsResponse,
    });
  });

  expect(httpGetSpy).toHaveBeenCalledTimes(4);
  expect(httpGetSpy).toHaveBeenNthCalledWith(
    1,
    'project/github/dynatrace-oss/barista/pipeline',
  );
  expect(httpGetSpy).toHaveBeenNthCalledWith(
    2,
    'pipeline/workflow-id/workflow',
  );
  expect(httpGetSpy).toHaveBeenNthCalledWith(3, 'workflow/job-id/job');
  expect(httpGetSpy).toHaveBeenNthCalledWith(
    4,
    '/project/github/dynatrace-oss/barista/job-number/artifacts',
  );

  httpGetSpy.mockClear();
});

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// #
// #  F I X T U R E S

const circleResponse = (items: object[]) => ({
  next_page_token: 'some-string',
  items,
});

const workflow = (id: string) => ({
  id,
  name: 'pr-check',
});

const job = (name: string, jobNumber: string) => ({
  name,
  job_number: jobNumber,
});

const pipeline = (commitSha: string, id: string) => ({
  id,
  vcs: {
    revision: commitSha,
    branch: '10.x',
  },
});
