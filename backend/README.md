# CSIT314 Scrumbags - Backend

## DISCLAIMER - READ CAREFULLY BEFORE PROCEEDING

```
Before proceeding with the following steps, ensure that
you have changed directory (cd) into the 'backend' directory.

Ensure that have "nodeJS" installed and added to your path

Ensure that "Docker Desktop" is installed and working
```

### Downloaded the repo for the first time?

Make sure to run `npm i` to install the necessary dependencies

### Running the development environment

Start the dockerized PostgreSQL database (do this first): `docker compose up -d`
Start the dev server: `npm run dev`

### Running the unit tests

Start the test database (do this first): `docker compose -f docker-compose.test.yaml up -d`
Run the tests: `npm run tests`

### Building the application

`npm run build`
