# Releasing

A new version of the Angular components is released at least once at the end of each sprint. If there are fixes and features ready earlier, a release in the middle of a sprint is also possible.

[Breaking changes](***REMOVED*** are released with the next (future) major version.

## How to Release
**Note: Releasing should only be done by the maintainers of the angular-components.**

* Make sure you are on the `master` branch.
* If you wanna do a major release run `yarn  breaking-changes` which will get you a list of breaking changes for the next major versions.
* If you do have breaking changes for the release version or have outdated breaking-changes.
  * Create a branch for applying the breaking changes for this release version. e.g. `fix/apply-breaking-changes-2.0.0`
  * Apply the breaking changes of the major version you want to release and outdated changes.
  * Commit the breaking-changes in related chunks. Do not forget the `BREAKING CHANGE` label (all uppercase) in the commit message!
  * Push the commit and create a PR
  * When merged continue with the release
* Make sure you are on the `master` branch again.
* Start the release Wizard by entering `yarn stage-release` in your command line tool.
* The Wizard will now prompt you for the new version number. You can select between a `patch`, `minor` and `major` release. The Wizard will also recommend you the version bumb based on the commits between now and the last release.
* Based on the version you have selected, a new state-release branch will be created (e.g. `release-stage/2.0.0`) and the version in the package json will be set.
* A changelog based on the commits going to be created and attached to the CHANGELOG.md file.
* Please review CHANGELOG.md and ensure that the log contains only changes that apply to the public library release.
* When done, proceed by confirming the prompt.
* The new changelog and the version bump will automatically be commited, and pushed to the remote.
* Create a new PR from this branch against the master.
* Once all required tests in the PR have successfully been run and you have clicked the merge button, this version will be released.
