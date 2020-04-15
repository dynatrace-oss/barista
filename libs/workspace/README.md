# Workspace library

This library should contain all workspace related builders and schematics.

test

## Important ⚠️

If you import from other libraries make sure that the docker build is passing:
`docker build -t designops/workspace-base:latest . -f .deployment/workspace-base.Dockerfile`

It might be that those libraries have to be added in the `.dockerignore` and
afterwards copied in the `.deployment/workspace-base.Dockerfile` Dockerfile.
This should be done in the `FROM base as workspace-builders` builder step.

## Builders

- **[build-barista](./libs/workspace/src/builders/barista-build/builder.ts)**:
  Is generating static sites out of the barista design system.

## Scripts

- **[affected-args](./libs/workspace/src/scripts/affected-args.ts)**: Is used on
  the ci to calculate the base hash to run affected against.
