# Contributing to Barista

## Found a bug?

If you find a bug/issue in the source code or a mistake in the documentation,
you can help us by
[creating an issue](https://github.com/dynatrace-oss/barista/issues/new/choose)
here on GitHub. Please provide an issue reproduction. Screenshots are also
helpful.

You can help the team even more and
[submit a pull request](#submitting-a-pull-request) with a fix.

## Want a feature?

You can request a new feature also by
[creating an issue](https://github.com/dynatrace-oss/barista/issues/new/choose).

- For a **major feature** (e.g. a new component), first open an issue and
  outline your proposal so that it can be discussed before you start with the
  implementation. Screenshots are helpful. If there is an agreement that this
  feature should be part of the Barista components library, either you or the
  team will take this issue, create an API proposal, implement it and
  [submit a pull request](#submitting-a-pull-request).
- Small features can be crafted and directly submitted as a pull request.

## Submitting a pull request

Before you submit your pull request (PR) consider the following guidelines:

- Search GitHub for an open or closed issue or PR that relates to your
  submission.
- Fork barista into your namespace by using the fork button on github.
- Make your changes in a new git branch: `git checkout -b my-fix-branch master`
- Create your patch/fix/feature including appropriate tests.
- Test your changes with our supported browsers.
- Follow our
  [coding standards](https://barista.dynatrace.com/components/coding-standards/).
- Document all public API methods and properties.
- Run unit, UI and universal tests, as described in the
  [developer documentation](https://barista.dynatrace.com/components/development/),
  and ensure that all tests pass.
- Commit your changes using a descriptive commit message that follows our
  [commit message conventions](#commit-message-guidelines).
- Push your branch to GitHub.
- Create a new pull request from your branch against the dynatrace-oss:master
  branch.
- The PR reviewers will be added depending on the owners-file or can be added
  optionally.
- If we suggest changes then:
  - Make the required updates.
  - Re-run all tests to make sure they are still passing.
  - Rebase your branch and force push to the repository (this will update your
    pull request):
    ```
    git rebase master -i
    git push -f
    ```

### PR approved – and now?

Once your pull request is approved and ready to merge, it gets marked as
`pr:merge-ready` and your work is done. The PR will be merged into master by
repository administrators (assignee).

If the PR contains a patch or bug fix, it is released with the next version of
the Barista components library.

If the PR contains a [breaking change](#breaking-changes), it is released with
the next major version upgrade.

## Commit message guidelines

Each commit message consists of a `type`, `scope` and `subject` (message).  
The `type` and `subject` are mandatory, the `scope` is optional in some specific
cases. Format: `<type>(<scope>): <subject>`

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space,
  formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **ci**: Changes that affect the CI
- **build**: Changes that affect the build system like npm scripts or
  angular-cli related changes
- **chore**: Other changes that don't modify src or test files
- **barista**: Changes that affect the design system app/build
- **ds**: Changes that affect the design system app/build

### Scope

The scope could be anything specifying the place of the commit change, in most
cases this would be the component name. For example select, button, etc.

### Message

**Subject**  
The commit message should describe the problem it solves or the feature it
introduces. Not the changes you have done. Furthermore the commit message has to
start with an uppercase letter and ends with a stop.

**Body**  
The body should include the motivation for the change and contrast this with
previous behavior.

**Footer**  
The footer should contain any information about Breaking Changes and is also the
place to reference GitHub issues that this commit closes.

Breaking Changes should start with the word BREAKING CHANGE: with a space or two
newlines. The rest of the commit message is then used for this.

### Examples

```
feat(filter-field): Added node removal on backspace.
```

```
fix(button): Fixes an issue where theming was not applied initially.

Closes #28
```

```
perf(filter-field): Removed deprecated sorting input for better performance.

BREAKING CHANGE: The sorting input has been removed. The default sorting is used for performance reasons.
```

## Breaking changes

Breaking changes can not always be avoided, so if you have to do one, consider
the following guidelines:

- If possible, deprecate and mark as a breaking change for the next (future)
  major release. Example:
  ```
    // @deprecated Use `DT_SOME_OTHER_OPTION` instead.
    // @breaking-change 2.0.0 To be changed to `DT_SOME_OTHER_OPTION`
    export const DT_SOME_OPTION = {};
  ```
- If you cannot deprecate, apply this breaking change, and commit it with the
  `BREAKING CHANGE` label (all uppercase) and a description in the commit
  message footer (see Commit message footer section)!

## PR workflow

![PR-workflow](https://user-images.githubusercontent.com/1368032/73261594-b0965f00-41cc-11ea-80e3-4969bbe49c5c.jpg)

### Open PR

A developer opens a PR in one of two ways:

1. The PR is already finished and can directly be reviewed.
2. The PR is still wip and is opened for others to be tracked. In this case the
   PR has to have the `pr: wip` and/or has to be opened as a
   [Draft](https://github.blog/2019-02-14-introducing-draft-pull-requests/).

### Draft/WIP

After the work on this draft/wip PR has been finished, remove the label
`pr: wip` and click the button `Ready for review` if it was opened as a Draft to
flag it for the codeowners/admins to review.

### Review

Now the review process kicks in. Depending on the scope of the PR one or more
[codeowners](https://github.com/dynatrace-oss/barista/blob/master/.github/CODEOWNERS)
must review this PR before the process can be continued (in most cases at least
2 codeowners will review and approve).

1. If we suggest changes to the code, the label `pr: needs-changes` will be
   applied. Now the developer has to apply this changes before the review will
   be done again.
2. If the code is ok, but something has to be done with the commit message (this
   would typically be a rebase if the commits need to be squashed, or just a
   simple reword to make the commit fit our guidelines) the label
   `pr: needs-rebase` will be applied. Also the reviewer has to provide
   additional guidance on what has to be done.
3. If the code and the commits are ok - the PR is ready to be merged.

### Merge-ready

After all the required codeowners (one or more; in most cases at least two), the
last reviewing codeowner will apply the label `pr: merge-ready` and assign the
PR to himself as a "caretaker". The caretaker is now responsible to wait for the
labeler to run and check whether the correct target labels depending on the
scope and type of the PR have been applied. If these are fine, the caretaker
will now merge the PR, and check whether the cherry-picker picks the commit(s)
to the correct release branches.
