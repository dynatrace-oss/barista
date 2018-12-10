# Contributing to the Angular Components Library

## Found an Issue?
If you find a bug/issue in the source code or a mistake in the documentation, you can help us by [submitting a Jira issue](https://dev-jira.dynatrace.org/secure/CreateIssue!default.jspa). Please provide an issue reproduction. Screenshots are also helpful.

Jira issues should be find under the "Dynatrace (APM)" project and tagged with "Angular Components". It is also possible to assign them directly to @thomas.pink or @fabian.friedl.

You can help the team even more and [submit a Pull Request](#submitting-a-pull-request) with a fix.

## Want a Feature?
You can request a new feature by [submitting a Jira issue](https://dev-jira.dynatrace.org/secure/CreateIssue!default.jspa). 

* For a **Major Feature** (e.g. a new component), first open an issue and outline your proposal so that it can be discussed. Screenshots are helpful. If there is an agreement that this feature should be part of the Angular Component Library, either you or the team will take this issue, create an API proposal, implement it and [submit a Pull Request](#submitting-a-pull-request).
* Small Features can be crafted and directly submitted as a Pull Request.

## Submitting a Pull Request
Before you submit your Pull Request (PR) consider the following guidelines:

* Search Jira and Bitbucket for an open or closed issue or PR that relates to your submission.
* Make your changes in a new git branch: `git checkout -b my-fix-branch master`
* Create your patch/fix/feature including appropriate test.
* Test your changes with our supported browsers
* Run unit, ui and universal tests, as described in the [developer documentation](DEVELOPMENT.md), and ensure that all tests pass.
* Commit your changes using a descriptive commit message that follows our [commit message conventions](#commit-message-guidelines).
* Push your branch to Bitbucket:
* Create a new Pull Request from your branch against the master
* If you want to create a PR that is not ready for review, mark it as "WIP" in the title.
* The PR must be reviewed by @thomas.pink and/or @fabian.fiedl. Other reviewers can also be specified but optional.
* If we suggest changes then:
  * Make the required updates.
  * Re-run all tests to make sure they are still passing.
  * Rebase your branch and force push to the repository (this will update your Pull Request):
    ```
    git rebase master -i
    git push -f
    ```

Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

## Commit Message Guidelines

***Commit Message Format***
Each commit message consists of an `issue`, a `type`, `scope` and `subject` (message).
The `issue`, `type` and `subject` are mandatory, the `scope` can be optional in some specific cases.
Format: `<issue> <type>(<scope>): <subject>`

**Type**   
Must be one of the following:
* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests or correcting existing tests
* **build**: Changes that affect the build system, CI configuration or external dependencies (example scopes: gulp, broccoli, npm)
* **chore**: Other changes that don't modify src or test files

**Scope**
The scope could be anything specifying place of the commit change, in most cases this would be the component name. For example select, button, etc.

**Example**
`***REMOVED*** feat(filter-field): added node removal on backspace`
