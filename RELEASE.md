# Releasing

A new version of the Angular components is released at least once at the end of
each sprint. If there are fixes and features ready earlier, a release in the
middle of a sprint is also possible.

[Breaking changes](***REMOVED***
are released with the next (future) major version.

## Versioning

The versioning of the angular component library closely follows **SemVer**. This
means, every version number consists of three parts (x.y.z) that have a
different meaning and describe the type of change this version introduces.

- **Patch:** (x.y.**z**): A patch version only includes fixes and small patches.
- **Minor:** (x.**y**.z): A minor version includes new features that do **NOT**
  introduce a breaking change
- **Major:** (**x**.y.z): A major version is the only version that can contain
  breaking changes. These versions are released very rarely and are announced
  weeks in advance.

## How to release

**Note: Releasing should only be done by the maintainers of the
angular-components.**

Go to the
[pull request overview page](***REMOVED***
of the angular-components repository and merge all pull requests marked as
`[merge-ready]` into master. Only merge pull requests marked with `[major]` when
releasing a new major version. Once all branches are merged and all merge
conflicts are resolved, follow these steps:

- Check out and update your local `master` branch.
- If you wanna do a major release run `yarn breaking-changes` which will get you
  a list of breaking changes for the next major version. If you do have breaking
  changes for the release version or have deprecations:
  - Create a branch for applying the breaking changes for this release version,
    e.g. `fix/apply-breaking-changes-4.0.0`.
  - Apply the breaking changes of the major version you want to release and
    remove deprecations.
  - Commit the breaking changes in related chunks. Add a `BREAKING CHANGE` label
    (all uppercase) in the commit message!
  - Push the commits and create a pull request.
  - When merged continue with the release. (Make sure you are on the updated
    `master` branch again.)
- Start the release wizard by entering `yarn stage-release` in your command line
  tool.
- The wizard will now prompt you for the new version number. You can select
  between a `patch`, `minor` and `major` release. The wizard will also recommend
  you the new version number based on the commits between now and the last
  release.
- Based on the version you have selected, a new release-stage branch will be
  created (e.g. `release-stage/2.0.0`) and the new version will be set in the
  `package.json`.
- A changelog based on the commits will be created and attached to the
  `CHANGELOG.md` file.
- Review the `CHANGELOG.md` file and ensure that the log contains only changes
  that apply to the public library release. Move commits marked with
  `BREAKING CHANGE` to an extra "Breaking changes" section on top. When done,
  proceed by confirming the prompt in your command line tool.
- The new changelog and the version bump will automatically be commited, and
  pushed to the remote repository.
- Create a new pull request from this branch against the master branch.
- Once all required tests in the pull request have successfully been run and you
  have clicked the merge button, this version will be released.
- Create a tag for the version bump commit by running `yarn create-tag`.

## After the release

After a successful release the Barista examples (code demos) build is triggered
and the updated content for the design system is built. Check the pull request
that is automatically opened in the
[barista-content repository](***REMOVED***
and the generated preview. When merging this pull request all updates to
component demos and the
[new changelog](***REMOVED*** will be
published in [Barista](***REMOVED***

Announce the new version upgrade in our Slack channels
[#help-ng-components](https://dynatrace.slack.com/messages/CJUCU3J6T) and
[#news-ui-dev](https://dynatrace.slack.com/messages/C9CCJJ9M1) following this
pattern:

```
*Angular Components Version X.x.x (YYYY-MM-DD) released*

:fire: *Breaking Changes*
> commit message 1
...

:beetle: *Bug Fixes*
> commit message 1
> commit message 2
...

:gift: *Features*
> commit message 1
...
```
