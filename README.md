# Github Action workflows for eID-group pipeline
[![Build Status](https://github.com/felleslosninger/eid-github-workflows/actions/workflows/check-syntax.yml/badge.svg)](https://github.com/felleslosninger/eid-github-workflows/actions/workflows/check-syntax.yml)

Shared github workflows libraries adapted to eID applications and libraries.

All secrets used in the workflows are available in organization level for `felleslosninger`, so no need to add any secrets to your repository if located in https://github.com/felleslosninger.

## Spring boot application workflows
For building branch on pull request created: [maven-build.yml](.github/workflows/maven-build.yml)

Building and publish image and update *-cd repository. Starts when branch is merged to main: [spring-boot-build-publish-image.yml](.github/workflows/spring-boot-build-publish-image.yml) and [spring-boot-container-scan.yml](.github/workflows/spring-boot-container-scan.yml).
The second workflow depends on the first, both must be refert to as jobs in your application.

If you only need to publish to idporten-cd the script below contains both the workflows above [spring-boot-build-publish-image-config.yml](.github/workflows/spring-boot-build-publish-image-config.yml).

See [how to configure](docs/spring-boot-app.md) for more details and examples for Spring boot applications.

## Java library workflows
Build java library on branch when pull request is created: [maven-build-lib.yml](.github/workflows/maven-build-lib.yml).

Starts when a release is created (manually), then builds the maven artifacts and publish this to Github packages: [maven-release-lib.yml](.github/workflows/maven-release-lib.yml).

See [how to configure](docs/java-library.md) for more details and examples for Java libraries.

## Syntax check of the action in this repository
See [check-syntax.yml](.github/workflows/check-syntax.yml) for details. Only for internal use in current repository.

## Container scan
Uses Trivy https://github.com/aquasecurity/trivy through action [Azure/container-scan](https://github.com/Azure/container-scan). Will soon be replaced by Trivy action directly.
You can test container scan locally by download trivy and run `trivy image <my-image:latest>`.