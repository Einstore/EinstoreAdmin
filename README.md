
# Einstore web admin UI

[![CircleCI](https://circleci.com/gh/Einstore/EinstoreAdmin/tree/master.svg?style=svg)](https://circleci.com/gh/Einstore/EinstoreAdmin/tree/master)

## Trying Einstore

If you want to just try Einstore go to https://github.com/Einstore/Einstore for the easiest setup with Docker.<br>
This repository is for customizing the admin UI.

## Docker-compose

Use `make`, `make help` prints all avaible commands.

[Direnv](https://direnv.net) is used for adding `bin-docker` to PATH

Ports are exposed using `docker-compose.override.yaml`

For initial login in basic data is email `core@liveui.io`, default password: `sup3rS3cr3t`

## Install

- `yarn install` Install all dependencies

## Usage

In the project directory, you can run:

#### Make helper scripts

```
Usage:
  make <target>

Targets:
  help           Display this help
  yarn-install   Runs yarn install in docker
  up             Does docker-compose up, automaticly create docker-compose.override.yaml
  update         Update to the latest docker images
  clean          Deletes all containers and volumes. WILL DROP ALL DB DATA
  install-db     Install basic data
  install-demo   Install demo data
  direnv         Create .envrc for bin-docker
  local          Start against local development API server
```

#### `yarn start`

- You need to provide URL to Einstore API with env variable:

```sh
# Your local API
REACT_APP_API_URL=http://localhost:8080 yarn start

# or just the following using our Makefile
make local

# Try our running demo
REACT_APP_API_URL=https://demo.einstore.io/api yarn start
```

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view in the browser.

The page will reload, should you make edits, on file save.<br>
You will also see any lint errors in the console.

##### Test run, connected to our demo API

<pre>
<b>REACT_APP_API_URL=https://demo.einstore.io/api</b> yarn start
</pre>

##### Run with SENTRY_DSN

<pre>
REACT_APP_API_URL=https://demo.einstore.io/api <b>REACT_APP_SENTRY_DSN=https://secret@sentry.mangoweb.org/your-project</b> yarn start
</pre>

#### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

> **Warning!** By default `yarn build` expects you to manually replace `%REACT_APP_API_URL%` inside `public/index.html` with URL to EinstoreCore API. Or you can provide it with env variable in build command.

