# How to configure Spring boot java application
Create folder `.github/workflows/` folder in your repo.
Add workflow files as described in the following sections.

secrets.REGISTRY_URL in `felleslosninger` organization referes to Azure Container Registery (ACR) in digdirnrl-tenant.

## Build branch when pull request created
This workflow runs maven tests.
We also do container-scan in this step to detect vulnerabilities early before merge to main.

Example of configuration of buildmaven workflow is below. You can use java version of your choice and remember to replace application-name.
```
name: Build Maven Java

on:
    pull_request:
        branches: [ main ]

jobs:
  call-workflow-maven-build:
    uses: felleslosninger/eid-github-workflows/.github/workflows/maven-build.yml@main
    with:
      java-version: 17
    secrets:
      maven-user: ${{ secrets.MAVEN_USER }}
      maven-password: ${{ secrets.MAVEN_PASSWORD }}
  call-container-scan:
    uses: felleslosninger/eid-github-workflows/.github/workflows/spring-boot-container-scan.yml@main
    with:
      image-name: <YOUR-APPLICATION-NAME>
      java-version: 17
    secrets:
      eid-build-token: ${{ secrets.EID_BUILD_PAT }}
      maven-user: ${{ secrets.MAVEN_USER }}
      maven-password: ${{ secrets.MAVEN_PASSWORD }}
    
```
For more details see description in workflow [maven-build.yml](../.github/workflows/maven-build.yml) and [spring-boot-container-scan.yml](../.github/workflows/spring-boot-container-scan.yml).


## Build and publish image to ACR and update kubernetes configuration with new image version

With this workflow you must update image-name with your application-name. 
Your can choose `java-version` as input and if you have allure-tests (need dependencies in pom.xml) you can enable this with input argument `allure-enabled`.
For the update-image-version job you can also specify kubernetes config repository to update image version in with `kubernetes-repo` input argument.

Example:

```
name: Build/publish Docker image

on:
  push:
    branches: [ main ]

jobs:
  build-publish-image:
    uses: felleslosninger/eid-github-workflows/.github/workflows/spring-boot-build-publish-image.yml@main
    with:
      image-name: <YOUR-APPLICATION-NAME>
      allure-enabled: false
      java-version: 17
    secrets:
      eid-build-token: ${{ secrets.EID_BUILD_PAT }}
      maven-user: ${{ secrets.MAVEN_USER }}
      maven-password: ${{ secrets.MAVEN_PASSWORD }}
      registry-url: ${{ secrets.REGISTRY_URL }}
      registry-username: ${{ secrets.REGISTRY_USERNAME }}
      registry-password: ${{ secrets.REGISTRY_PASSWORD }}
      allure-user: ${{ secrets.ALLURE_USER }}
      allure-password: ${{ secrets.ALLURE_PASSWORD }}
  update-image-version:
    uses: felleslosninger/eid-github-workflows/.github/workflows/update-image-version.yml@main
    needs: build-publish-image
    with:
      image-name: <YOUR-APPLICATION-NAME>
      image-version: ${{ needs.build-publish-image.outputs.image-version }}
      image-digest: ${{ needs.build-publish-image.outputs.image-digest }}
    secrets:
      eid-build-token: ${{ secrets.EID_BUILD_PAT }}
      registry-url: ${{ secrets.REGISTRY_URL }}
```
For more details see description in workflow [spring-boot-build-publish-image.yml](../.github/workflows/spring-boot-build-publish-image.yml) and [update-image-version.yml](../.github/workflows/update-image-version.yml).
## Deprecated: Both build/publish image and update kubernetes repo idporten-cd in same workflow
This is the old way with no possiblity to configure allure or kubernetes-configuration repository.
Adapted to idporten-cd.
```
name: Build/publish Docker image & update image version in kubernetes

on:
  push:
    branches: [ main ]

jobs:
  call-workflow-image-build-publish:
    uses: felleslosninger/eid-github-workflows/.github/workflows/spring-boot-build-publish-image-config.yml@main
    with:
      image-name: <YOUR-APPLICATION-NAME>
      java-version: 17
    secrets:
      eid-build-token: ${{ secrets.EID_BUILD_PAT }}
      maven-user: ${{ secrets.MAVEN_USER }}
      maven-password: ${{ secrets.MAVEN_PASSWORD }}
      registry-url: ${{ secrets.REGISTRY_URL }}
      registry-username: ${{ secrets.REGISTRY_USERNAME }}
      registry-password: ${{ secrets.REGISTRY_PASSWORD }}
      allure-user: ${{ secrets.ALLURE_USER }}
      allure-password: ${{ secrets.ALLURE_PASSWORD }}
```
