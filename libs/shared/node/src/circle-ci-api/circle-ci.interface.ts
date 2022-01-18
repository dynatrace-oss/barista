/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

export interface CircleServerError {
  message: string;
}

export interface CircleResponse<T> {
  /** A list of items */
  items: T[];
  /** A token to pass as a page-token query parameter to return the next page of results. */
  next_page_token: string;
}

export type CirclePipelineState = 'errored' | 'created';

export interface CirclePipeline {
  /** The unique ID of the pipeline. */
  id: string;
  /** A sequence of errors that have occurred within the pipeline. */
  errors: CirclePipelineError[];
  /** The project-slug for the pipeline. */
  project_slug: string;
  /** The number of the pipeline. */
  // eslint-disable-next-line id-denylist
  number: number;
  /** The current state of the pipeline. */
  state: 'errored' | 'created' | string;
  /** The date and time the pipeline was created. */
  created_at: string;
  /** A summary of the trigger. */
  trigger: CirclePipelineTrigger;
  /** VCS information for the pipeline. */
  vcs?: CirclePipelineVCS;
  /** The date and time the pipeline was last updated. */
  updated_at?: string;
}

export interface CirclePipelineError {
  /** The type of error. */
  type: string;
  /** A human - readable error message. */
  message: string;
}

export interface CirclePipelineVCS {
  /** Name of the VCS provider (e.g. GitHub, Bitbucket). */
  provider_name: 'GitHub';
  /**
   * URL for the repository where the trigger originated.
   * For fork-PR pipelines, this is the URL to the fork.
   * For other pipelines the origin_ and
   * target_repository_urls will be the same.
   */
  origin_repository_url: string;
  /**
   * URL for the repository the trigger targets (i.e. the repository
   * where the PR will be merged). For fork-PR pipelines, this is
   * the URL to the parent repo. For other pipelines, the
   * origin_ and target_repository_urls will be the same.
   */
  target_repository_url: string;
  /** The code revision the pipeline ran. */
  revision: string;
  /**
   * The branch where the pipeline ran.
   * The HEAD commit on this branch was used for the pipeline.
   * Note that branch and tag are mutually exclusive.
   */
  branch?: string;
  /** The tag used by the pipeline. The commit that this tag points to was used for the pipeline. Note that branch and tag are mutually exclusive. */
  tag?: string;
  /** The latest commit in the pipeline. */
  commit?: CirclePipelineVCSCommit;
}

export interface CirclePipelineVCSCommit {
  /** The subject of the commit message. */
  subject: string;
  /** The body of the commit message. */
  body: string;
}

export interface CirclePipelineTrigger {
  /** The date and time the trigger was received. */
  received_at: string;
  /** The type of trigger. */
  type: 'webhook' | 'explicit' | string;
  /** The user who triggered the Pipeline. */
  actor: CIrclePipelineActor;
}

export interface CIrclePipelineActor {
  /** The login information for the user on the VCS. */
  login: string;
  /** URL to the user's avatar on the VCS */
  avatar_url: string;
}

export interface CircleWorkflow {
  /** The unique ID of the workflow. */
  id: string;
  /** The name of the workflow. */
  name: string;
  /** The current status of the workflow. */
  status: string;
  /** The date and time the workflow was created. */
  created_at: string;
  /** The date and time the workflow stopped. */
  stopped_at: string;
  /** The ID of the pipeline this workflow belongs to. */
  pipeline_id: string;
  /** The number of the pipeline this workflow belongs to. */
  pipeline_number: number;
  /** The project-slug for the pipeline this workflow belongs to. */
  project_slug: string;
  /** A token to pass as a page-token query parameter to return the next page of results. */
}

export interface CircleJob {
  /** A sequence of the unique job IDs for the jobs that this job depends upon in the workflow. */
  dependencies: string[];
  /** The number of the job. */
  job_number: number;
  /** The unique ID of the job. */
  id: string;
  /** The date and time the job started. */
  started_at: string;
  /** The name of the job. */
  name: string;
  /** The project-slug for the job. */
  project_slug: string;
  /* The type of job. */
  type: string;
  /** The current status of the job. */
  status: any;
  /** The time when the job stopped. */
  stopped_at?: string;
  /** The unique ID of the user. */
  canceled_by?: string;
  /** The unique ID of the user. */
  approved_by?: string;
}

/** Circle ci jobs  artifact object */
export interface CircleArtifact {
  /** The artifact path. */
  path: string;
  /** The index of the node that stored the artifact. */
  node_index: number;
  /** The URL to download the artifact contents. */
  url: string;
}

export interface CircleRecentWorkflow {
  /** The unique ID of the workflow. */
  id: string;
  /** The duration in seconds of a run. */
  duration: number;
  /** The date and time the workflow was created. */
  created_at: string;
  /** The date and time the workflow stopped. */
  stopped_at: string;
  /** The number of credits used during execution */
  credits_used: number;
  /** Workflow status. */
  status: 'success' | 'canceled' | 'failed';
}
