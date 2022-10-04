# How to configure Java library
Create folder .github/workflows/ folder in your repo.
Add workflow files as described in the following sections.

## Build branch when pull request created
Create file `.github/workflows/call-maventests.yml` with content as below.
NB: Choose highest java-version possible for your clients of your lib.

```
name: Maven build

on:
  pull_request:
    branches: [ main ]

jobs:
  call-workflow-maven-build:
    uses: felleslosninger/eid-github-workflows/.github/workflows/maven-build-lib.yml@main
    with:
      java-version: 11
    secrets:
      maven-user: ${{ secrets.MAVEN_USER }}
      maven-password: ${{ secrets.MAVEN_PASSWORD }}
```

## Build maven artifacts when release created manually
Create file `.github/workflows/call-release.yml` with content as below.
NB: Choose highest java-version possible for your clients of your lib.

```
name: Release to github packages

on:
  release:
    types: [created]

jobs:
  call-workflow-release:
    uses: felleslosninger/eid-github-workflows/.github/workflows/maven-release-lib.yml@main
    with:
      java-version: 11
    secrets:
      packages-user: ${{ secrets.CREATE_PACKAGES_USER }}
      packages-token: ${{ secrets.CREATE_PACKAGES_TOKEN }}
      maven-user: ${{ secrets.MAVEN_USER }}
      maven-password: ${{ secrets.MAVEN_PASSWORD }}
```
