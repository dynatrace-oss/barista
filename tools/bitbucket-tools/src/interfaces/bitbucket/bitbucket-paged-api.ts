export interface BitbucketPagedApi {
  limit: number;
  size: number;
  isLastPage: boolean;
  start: number;
  nextPageStart: number | null;
}
