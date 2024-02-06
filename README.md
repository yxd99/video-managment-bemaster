# Video Managment Be Master
This project consists to manage videos, users, comments, likes, etc. is a cloudinary as SaaS to be able to save videos and store in an optimal way the videos. The project is made in NestJS.

## Installation
Make sure you have Node Version Manager (nvm) installed on your system. You can install it from https://github.com/nvm-sh/nvm.
```bash
# Select the version of Node.js recommended for the project
nvm use

# Install project dependencies
npm i
```

## Run
In development mode:

```bash
npm run start:dev
```
In production mode:
```bash
npm run start:prod
```

## Commands
| Command   | Description |
| --------- | ----------- |
| build     | Compiles the project for production. |
| format    | Format source code with Prettier. |
| start     | Start the server in development mode. |
| start:dev | Starts the server in development mode with supervision. |
| start:debug | Starts the server in development mode with debugging. |
| start:prod | Starts the server in production mode. |
| lint      | Run ESLint to find syntax and style errors. |
| test      | Run Jest to perform unit tests. |
| test:watch | Runs Jest for continuous unit testing. |
| test:cov  | Run Jest to perform unit tests and generate code coverage. |
| test:debug | Run Jest to perform unit tests with debugging. |



## Setup
The project uses a configuration file called example.env. This file contains the following variables:

| Category | Key | Value |
| --- | --- | --- |
| General | PORT | 3000 |
| General | ENV | development |
| Database | DB_USER | root |
| Database | DB_PASSWORD |  |
| Database | DB_HOST | 127.0.0.1 |
| Database | DB_PORT | 3306 |
| Database | DB_NAME | video_bemaster |
| Security | JWT_SECRET |  |
| Security | ENCRYPT_PASSWORD |  |
| Cloudinary | CLOUDINARY_NAME |  |
| Cloudinary | CLOUDINARY_API_KEY |  |
| Cloudinary | CLOUDINARY_API_SECRET |  |


You must copy the .env.example file and rename it to .env.

## Docker
The project includes a DockerCompose to create a Docker container. To create the container, run the following command:

```bash
docker up
```

## Documentation
The project has documentation made in swagger, to visualize it visit:

```bash
http://localhost:3000/api
```

## Unit Testing
It also has unit tests, uses `npm run test:cov` to generate the document and check the coverage.