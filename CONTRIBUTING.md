# Contributing to the Angular Components Library

## Found an Issue?
If you find a bug/issue in the source code or a mistake in the documentation, you can help us by [submitting a bug in Jira](https://dev-jira.dynatrace.org/secure/CreateIssueDetails!init.jspa?pid=10490&issuetype=1&priority=4&customfield_12900=19282&customfield_10671=21985&components=18387&labels=angular-components&%20&description=You%20are%20in%20the%20process%20of%C2%A0reporting%20an%20issue%20in%20Angular%20Components.To%20ensure%20a%20quick%20turnaround%2C%20please%20enter%2Fchange%2Fupdate%20the%20following%20fields%3A%0A%0A*What%20is%20the%20expected%20behavior%3F*%0A%0A*What%20is%20the%20current%20behavior%3F*%0A%0A*What%20are%20the%20steps%20to%20reproduce%3F*%0A%0A*Which%20versions%20of%20Angular%2C%20Angular%20Components%2C%20OS%2C%20TypeScript%2C%20browsers%20are%20affected%3F*%0A%0A*Is%20there%20anything%20else%20we%20should%20know%3F*). Please provide an issue reproduction. Screenshots are also helpful.

Jira issues should be filed under the "Dynatrace (APM)" project and tagged with "Angular Components". It is also possible to assign them directly to @thomas.pink or @fabian.friedl.

You can help the team even more and [submit a Pull Request](#submitting-a-pull-request) with a fix.

## Want a Feature?
You can request a new feature by [submitting a story in Jira](https://dev-jira.dynatrace.org/secure/CreateIssueDetails!init.jspa?pid=10490&issuetype=38&priority=3&components=18387&labels=angular-components&&description=You%20are%20in%20the%20process%20of%20proposing%20a%20new%20feature%20in%20Angular%20Components.To%20ensure%20a%20quick%20turnaround%2C%20please%20enter%2Fchange%2Fupdate%20the%20following%20fields%3A%0A%0A*Please%20describe%20the%20feature%20you%20would%20like%20to%20request.*%0A%0A*What%20is%20the%20use-case%20or%20motivation%20for%20this%20proposal%3F*%0A%0A*Is%20there%20anything%20else%20we%20should%20know%3F*). 

* For a **Major Feature** (e.g. a new component), first open an issue and outline your proposal so that it can be discussed. Screenshots are helpful. If there is an agreement that this feature should be part of the Angular Component Library, either you or the team will take this issue, create an API proposal, implement it and [submit a Pull Request](#submitting-a-pull-request).
* Small Features can be crafted and directly submitted as a Pull Request.

## Submitting a Pull Request
Before you submit your Pull Request (PR) consider the following guidelines:

* Search Jira and Bitbucket for an open or closed issue or PR that relates to your submission.
* Make your changes in a new git branch: `git checkout -b my-fix-branch master`
* Create your patch/fix/feature including appropriate test.
* Test your changes with our supported browsers
* Run unit, ui and universal tests, as described in the [developer documentation](***REMOVED*** and ensure that all tests pass.
* Commit your changes using a descriptive commit message that follows our [commit message conventions](#commit-message-guidelines).
* Push your branch to Bitbucket.
* Create a new Pull Request from your branch against the master
* If you want to create a PR that is not ready for review, mark it as "WIP" in the title.
* The PR must be reviewed by @thomas.pink and/or @fabian.fiedl. Other reviewers can be added optionally.
* If we suggest changes then:
  * Make the required updates.
  * Re-run all tests to make sure they are still passing.
  * Rebase your branch and force push to the repository (this will update your Pull Request):
    ```
    git rebase master -i
    git push -f
    ```

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
