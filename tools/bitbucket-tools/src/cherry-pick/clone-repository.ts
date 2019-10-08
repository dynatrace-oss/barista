import { mkdirSync } from 'fs';

import { GitClient } from '../../../release/git-client';
import { LOCAL_GIT_REPO_PATH } from '../config';
import { addAuthorizationToRemoteUrl } from '../utils/add-username-password-to-remote';

export function cloneRepository(remoteUrl: string): boolean {
  console.log('about to create directory', LOCAL_GIT_REPO_PATH);
  mkdirSync(LOCAL_GIT_REPO_PATH, { recursive: true });
  console.log('created directory', LOCAL_GIT_REPO_PATH);
  const gitClient = new GitClient(
    LOCAL_GIT_REPO_PATH,
    addAuthorizationToRemoteUrl(remoteUrl),
  );
  return gitClient.clone();
}
