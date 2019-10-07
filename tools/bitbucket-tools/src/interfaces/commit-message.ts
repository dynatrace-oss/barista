export type CommitType =
  | 'feat'
  | 'fix'
  | 'docs'
  | 'style'
  | 'refactor'
  | 'perf'
  | 'test'
  | 'build'
  | 'chore'
  | 'barista';

export interface CommitMessage {
  issueNumber: string;
  type: CommitType;
  components: string[];
  breakingChange: boolean;
  releaseCommit: boolean;
  message: string;
  original: string;
}
