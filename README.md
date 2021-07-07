# Bolius samleside

[![CI/CD](https://github.com/Mikster4/samlesiden/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Mikster4/samlesiden/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Mikster4/samlesiden/branch/main/graph/badge.svg?token=IGKN3TK3M8)](https://codecov.io/gh/Mikster4/samlesiden)
![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/Mikster4/samlesiden/Docker/main?label=container%20build)

## To do

- [ ] ReadMe
- [ ] Mulighed for at overlaye kommuner
- [ ] Bedre input til DST-explorer
  - [x] Bedre valg af tidsperioder
  - [ ] Mulighed for at klik-vælge flere kommuner
  - [ ] Lav en try-catch til "Hent tabel", så tastefejl ikke crasher siden
- [ ] Links til genererede grader
- [ ] Links til predefinerede grafer
- [ ] Implementering af et Danmarkskort?
- [ ] Mulighed for eksportering af data? CSV?
- [ ] Login? Adskillelse af værktøjer og fremvisning af data

## Code structure

## Environment variables

Since the app [water_comes][water] is imported into this project, an access token for Google Maps has to be given en `.env`.

### Technical setup

Docker-compose is set up:

```bash
$ docker-compose up
```

We have automated builds of Docker containers on main, which available from GitHub:

```bash
# Pull latest image from main:
$ docker pull ghcr.io/mikster4/samlesiden:main

# Or pull and run latest image from main 
$ docker run -p 3000:3000 ghcr.io/mikster4/samlesiden:main

```

## Queries til afprøvning

```text
  Flere forbrydelser overlay
  {"table":"STRAF22","format":"JSONSTAT","variables":[{"code":"OVERTRÆD","values":["1316","1320"]},{"code":"OMRÅDE","values":["000"]},{"code":"ANMSIGT","values":["ANM"]},{"code":"Tid","values":[">=2007"]}]}
```

## Fredagsopgaven

_Sektion slettes efter workflow er implementeret_ 

### AWS set-up

#### Create an ECR repository to store your images.

For example: `aws ecr create-repository --repository-name my-ecr-repo --region us-east-2`.

Replace the value of `ECR_REPOSITORY` in the workflow below with your repository's name.

Replace the value of `aws-region` in the workflow below with your repository's region.

#### Create an ECS task definition, an ECS cluster, and an ECS service.

For example, follow the Getting Started guide on the ECS console:
https://us-east-2.console.aws.amazon.com/ecs/home?region=us-east-2#/firstRun

Replace the values for `service` and `cluster` in the workflow below with your service and cluster names.

#### Store your ECS task definition as a JSON file in your repository.

The format should follow the output of `aws ecs register-task-definition --generate-cli-skeleton`. 
Replace the value of `task-definition` in the workflow below with your JSON file's name.
Replace the value of `container-name` in the workflow below with the name of the container in the `containerDefinitions` section of the task definition.

#### Store an IAM user access key in GitHub Actions secrets named `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

See the documentation for each action used below for the recommended IAM policies for this IAM user, and best practices on handling the access key credentials.

### Workflow file

`./github/workflows/aws.yml`

```yaml
# This workflow will build and push a new container image to Amazon ECR,
# and then will deploy a new task definition to Amazon ECS, when a release is created

on:
  release:
    types: [created]

name: Deploy

jobs:
  deploy:
    name: Deploy to AWS
    runs-on: ubuntu-latest
    environment: production

    steps:
    - name: Checkout
      uses: actions/checkout@v2

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-2

    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1

    - name: Build, tag, and push image to Amazon ECR
      id: build-image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: my-ecr-repo
        IMAGE_TAG: ${{ github.sha }}
      run: |
        # Build a docker container and
        # push it to ECR so that it can
        # be deployed to ECS.
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
        echo "::set-output name=image::$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"

    - name: Fill in the new image ID in the Amazon ECS task definition
      id: task-def
      uses: aws-actions/amazon-ecs-render-task-definition@v1
      with:
        task-definition: task-definition.json
        container-name: sample-app
        image: ${{ steps.build-image.outputs.image }}

    - name: Deploy Amazon ECS task definition
      uses: aws-actions/amazon-ecs-deploy-task-definition@v1
      with:
        task-definition: ${{ steps.task-def.outputs.task-definition }}
        service: sample-app-service
        cluster: default
        wait-for-service-stability: true

```

[water]: https://github.com/Bolius/water_comes'