
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

## Dev Scripts

In the project directory, you can run:

### `yarn start`

- Dont forget to install dependencies with `yarn install`.
- You need to provide URL to Einstore API with env variable:

```sh
# Your local API
REACT_APP_API_URL=http://localhost:8080 yarn

# Try our running demo
REACT_APP_API_URL=https://demo.einstore.io/api yarn
```

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### Careful

By default `yarn build` expects you to manually replace `%REACT_APP_API_URL%` inside `public/index.html` with URL to EinstoreCore API. Or you can provide it with env variable in build command.

### Example of build with connection to demo API

<pre>
<b>REACT_APP_API_URL=https://demo.einstore.io/api</b> yarn start
</pre>

### You can also provide SENTRY_DSN

<pre>
REACT_APP_API_URL=https://demo.einstore.io/api <b>REACT_APP_SENTRY_DSN=https://secret@sentry.mangoweb.org/your-project</b> yarn start
</pre>
