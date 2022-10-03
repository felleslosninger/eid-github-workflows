# Github Action workflows for eID-group pipeline
![Build Status](https://github.com/felleslosninger/eid-github-workflows/actions/workflows/check-syntax.yml/badge.svg?branch=main)

Container shared github workflows libraries for eID applications.

## Spring boot application workflows
For building branch on pull request created:
.github/workflows/maven-build.yml

Building and publish image and update *-cd repository. Starts when branch is merged to main.
.github/workflows/spring-boot-build-publish-image.yml
.github/workflows/spring-boot-container-scan.yml
The second workflow depends on the first, both must be refert to as jobs in your application.

If you only need to publish to idporten-cd the script below contains both the workflows above:
.github/workflows/spring-boot-build-publish-image-config.yml

## Java library workflows
Build java library on branch when pull request is created.
.github/workflows/maven-build-lib.yml
Starts when a release is created (manually), then builds the maven artifacts and publish this to Github packages.
.github/workflows/maven-release-lib.yml

## Syntax check of the action in this repository
.github/workflows/check-syntax.yml

