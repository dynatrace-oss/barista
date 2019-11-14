# Contributing to Barista

## Found a bug?

If you find a bug/issue in the source code or a mistake in the documentation,
you can help us by
[creating an issue](https://github.com/Dynatrace/barista/issues/new) here on
GitHub. Please provide an issue reproduction. Screenshots are also helpful.

You can help the team even more and
[submit a pull request](#submitting-a-pull-request) with a fix.

## Want a feature?

You can request a new feature also by
[creating an issue](https://github.com/Dynatrace/barista/issues/new).

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
- Make your changes in a new git branch: `git checkout -b my-fix-branch master`
- Create your patch/fix/feature including appropriate tests. 
- Test your changes with our supported browsers.
- Follow our [coding standards](https://barista.dynatrace.com/components/coding-standards/).
- Document all public API methods and properties.
- Run unit, UI and universal tests, as described in the
  [developer documentation](https://barista.dynatrace.com/components/development/),
  and ensure that all tests pass.
- Commit your changes using a descriptive commit message that follows our
  [commit message conventions](#commit-message-guidelines).
- Push your branch to GitHub.
- Create a new pull request from your branch against the master branch.
- The PR must be reviewed by [@thomas.pink](https://github.com/thomaspink),
  [@fabian.fiedl](https://github.com/ffriedl89) and/or
  [@thomas.heller](https://github.com/tomheller). Other reviewers will be added
  depending on the owners-file or can be added optionally.
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

**Type**  
Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space,
  formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system, CI configuration or external
  dependencies (example scopes: gulp, broccoli, npm)
- **chore**: Other changes that don't modify src or test files
- **barista**: Changes that affect the design system app/build

**Scope** The scope could be anything specifying place of the commit change, in
most cases this would be the component name. For example select, button, etc.

**Example** `feat(filter-field): added node removal on backspace`

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
  `BREAKING CHANGE` label (all uppercase) in the commit message!
