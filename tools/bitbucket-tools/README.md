# Bitbucket tools

## Pull request commit message validator and cherry pick target finder

This tooling project works with the bitbucket api to apply some "labels" to the
pull requests. As a preliminary step to automate more steps in our development
and release cycles, we are starting to validate commit messages within pull
request for the angular-components repository.

### Architecture

The code for this tooling is bundled within a docker image at
***REMOVED***

This image is then being used by a jenkins task
***REMOVED***
which will run the code in the image. This jenkins task is being triggered by
the following bitbucket webhooks:

- Pull request opened
- Pull request modified
- Refs pushed

### Development

To start developing on this tool, first you will need to expose certain
environment variables required by the tooling.

- **BITBUCKET_USER**: Bitbucket username which will be used for api access.
  Needs write access to the repository.
- **BITBUCKET_PASSWORD**: Bitbucket password (either your password or a personal
  access token will work).
- **PR_ID**: Pull request number, for which the validation and labelling should
  be running.
- **REF_ID**: ReferenceId of the branch you want to apply the validations too,
  is only considered when no PR number is given.

You can start developing the commit message validator with the following command
from angular-components root:
`BITBUCKET_USER=*** BITBUCKET_PASSWORD=*** PR_ID=800 yarn bitbucket-tools ./tools/bitbucket-tools/src/validate-commit-message.ts`

You can start developing the cherry pick target finder with the following
command angular-components root:
`BITBUCKET_USER=*** BITBUCKET_PASSWORD=*** PR_ID=800 yarn bitbucket-tools ./tools/bitbucket-tools/src/find-cherrypick-target.ts`

### Running tests

To run the tests provided in the bitbucket-tools folder, run
`yarn bitbuckte-tools:test` from the angular-components root directory.

### Publish a new version

To publish a new version of the docker image, run the
`tools/bitbucket-tools/build.sh` script from the angular-components root
directory. This will create a local image
`docker.lab.dynatrace.org:6000/designops/angular-components-commit-message-validator:latest`
which can then be pushed to our dockerhub. The jenkins task will pull the latest
image each time it runs.

### Commit message validation rules

#### No temporary commit messages (Squash me)

Sometimes during development it can happen that you just want to commit your
progress and push it to the remote for savekeeping. These are usually containing
temporary commit message, like `squash me`, `squash` or `asdf`. If the commit
message checker detects these commits, it will note this on the pull request as
a comment and add the [needs-rebase] label.

#### No mixing of commit types

To keep a clean history and make reviewing of pull requests easier, we are
trying to follow a single-purpose pull request paradigm. Try to keep the commit
type (feat, fix, chore, ...) within a pull request to a single type. For
example, for documentation changes that tie to a feature, you do not need an
extra `docs` commit, you can squash it with the actual feature commit.

#### Spelling of BREAKING CHANGE

The `BREAKING CHANGE` keyword indicates that this commit will introduce a
breaking change, which we will release with certain major versions. As our
automation heavily relies on this keyword being applied correctly, the commit
message checker detects variants of `break(ing) change` and will flag any commit
message, that may be confusing our automation. If you come across a validation
error for this rule, maybe consider rewording your commit or fix the spelling of
the keyword.

#### Number of feat/fix/perf commits in a pull request

To keep a clean history and make reviewing of pull requests easier, we are
trying to follow a single-purpose pull request paradigm. Please make sure that
you are only tackling one feature, one fix or one performance fix within a pull
request. If a feature spans over multiple components, you do not have to split
them into multiple commits, but can rather provide a double scope with the
`feat`, `fix` or `perf` commit. i.e.
`fix(button, card): Fixes an issue where the spacing between two sibling buttons were not following the guidelines`.

#### Patch branch target allows only fixes

When directly targeting a patch release branch with a pull request, this pull
request is only allowed to contain `fix` or `perf` commits. If these are other
changes, please consider stating your pull request against master, and let the
cherry picker decide where the commits should end up.

#### Minor branch target allows only fixes

When directly targeting a minor release branch with a pull request, this pull
request is only allowed to contain `feat` commits. If these are other changes,
please consider stating your pull request against master, and let the cherry
picker decide where the commits should end up.

#### Breaking changes can only target master

When your pull request contains `BREAKING CHANGES`, the pull request is only
allowed to target the master branch.

### Rules for targets of the cherry picker

The cherrypicker currently is only able to determine commit targets for pull
requests that are stated agains the master branch. Here is the descicion tree
that it follows:

```
                       PR contains
                  BREAKING CHANGE COMMITS?
                  /               \
                /                  \
              Yes                  No
             /                      \
           /                         \
      Add label *major*           contains *feat* commits
                                   /            \
                                 /               \
                              Yes                No
                              /                   \
                            /                      \
                     Add labels *minor*         contains *fix* or *perf* commits
                     and *target:minor*          /           \
                                               /              \
                                            Yes               No
                                            /                  \
                                          /                     \
                                     Add labels *patch*,       Add labels
                                     *target:patch* and        *target:minor*
                                     *target:minor*            *target:patch*
```

## Auto cherry picker

This tooling project works with git and the bitbucket api to cherry pick the
relevant commits into their respective release branches after the merge. The
auto-cherry-picker will look at the labels added by the
cherry-pick-target-finder (see above) and cherry pick the commits within a pull
request to the target branches.

### Architecture

The code for this tooling is bundled within a docker image at
***REMOVED***

This image is then being used by a jenkins task
***REMOVED***
which will run the code in the image. This jenkins task is being triggered by
the following bitbucket webhooks:

- Pull request merged

### Development

To start developing on this tool, first you will need to expose certain
environment variables required by the tooling.

- **BITBUCKET_USER**: Bitbucket username which will be used for api access.
  Needs write access to the repository.
- **BITBUCKET_PASSWORD**: Bitbucket password (either your password or a personal
  access token will work).
- **PR_ID**: Pull request number, for which the validation and labelling should
  be running.
- **LOCAL_GIT_REPO_PATH**: Local file path where the angular components can be
  cloned to.

You can start developing the auto-cherry-picker with the following command from
angular-components root:
`BITBUCKET_USER=*** BITBUCKET_PASSWORD=*** PR_ID=800 LOCAL_GIT_REPO_PATH=/path/to/your/local/git/repo yarn bitbucket-tools ./tools/bitbucket-tools/src/auto-cherry-picker.ts`

:warning: Running this tool will change the history of the given target
repository and the remote (determined from the pull request to reference). Make
sure to work on a clone of the angular-components when developing on this tool.

### Rules for the auto cherry picker and flow graph

```
               +--------------------------------+
               |                                |
               | PR:Merged event from Bitbucket |
               |                                |
               +--------------+-----------------+
                              |
                              v
   +--------------------------+-----------------------------+
   |                                                        |
   |  if the title contains [cherrypick-needs-human] label  +----->  YES  +--->  BAIL out, nothing to do
   |                                                        |
   +--------------------------+-----------------------------+
                              |
                              v

                              NO

                              +
                              |
         +--------------------+----------------------+
         |                                           |
         |  Get the commits within the pull request  |
         |                                           |
         +--------------------+----------------------+
                              |
                              v
                   +----------+------------+
                   |                       |
                   |  Get target branches  |
                   |                       |
                   +----------+------------+
                              |
            v-----------------+--------------v
   +---------------------+         +---------------------+
   |                     |         |                     |
   |  if [target:minor]  |         |  if [target:patch]  |
   |                     |         |                     |
   +--------+------------+         +---------+-----------+
            |                                |
            v                                v
+-----------+--------------------------------+------------------+
|                                                               |
|  * checkout branch                                            |
|                                                               |
|  * iterate over commits and cherry pick #commit               |
|                                                               |
|  * if cherry pick fails, switch target branch to temp-branch  |
|                                                               |
|  * push target branch                                         |
|                                                               |
+-----------+--------------------------------+------------------+
            |                                |
            v                                v
         +--+--------------------------------+----+
         |                                        |
         |  If successful, report the outcome     |
         |  to the original pull request.         |
         |                                        |
         |  If it fails, report the outcome to    |
         |  the original pull request and open a  |
         |  pull request to resolve the failing   |
         |  cherry picks.                         |
         |                                        |
         +----------------------------------------+
```
