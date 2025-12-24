# app

This application was generated using JHipster 9.0.0-beta.0, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v9.0.0-beta.0](https://www.jhipster.tech/documentation-archive/v9.0.0-beta.0).

## Project Structure

## Development

Before you can build this project, you must install and configure the following dependencies on your machine:

1. [Node.js](https://nodejs.org/): Node is used to run a development web server and build the project.
   Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

```
npm install
```

We use npm scripts and [Webpack][] as our build system.

Run the following commands in two separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

```
npm backend:start
npm start
```

Npm is also used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](package.json). You can also run `npm update` and `npm install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `npm help update`.

The `npm run` command will list all the scripts available to run for this project.

### PWA Support

JHipster ships with PWA (Progressive Web App) support, and it's turned off by default. One of the main components of a PWA is a service worker.

The service worker initialization code is commented out by default. To enable it, uncomment the following code in `src/main/webapp/index.html`:

```html
<script>
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").then(function () {
      console.log("Service Worker Registered");
    });
  }
</script>
```

Note: [Workbox](https://developer.chrome.com/docs/workbox) powers JHipster's service worker. It dynamically generates the `service-worker.js` file.

### Managing dependencies

For example, to add [Leaflet][] library as a runtime dependency of your application, you would run the following command:

```
npm install --save --save-exact leaflet
```

To benefit from TypeScript type definitions from [DefinitelyTyped][] repository in development, you would run the following command:

```
npm install --save-dev --save-exact @types/leaflet
```

Then you would import the JS and CSS files specified in library's installation instructions so that [Webpack][] knows about them:
Note: There are still a few other things remaining to do for Leaflet that we won't detail here.

For further instructions on how to develop with JHipster, have a look at [Using JHipster in development][].

## Building for production

## Testing

### Client tests

Unit tests are run by [Jest][]. They're located near components and can be run with:

```
npm test
```

#### E2E tests

UI end-to-end tests are powered by [Cypress][]. They're located in [src/test/javascript/cypress/](src/test/javascript/cypress/)
and can be run by starting Spring Boot in one terminal (`npm run app:start`) and running the tests (`npm run e2e`) in a second one.

Before running Cypress tests, it's possible to specify user credentials by overriding the `CYPRESS_E2E_USERNAME` and `CYPRESS_E2E_PASSWORD` environment variables.

```
export CYPRESS_E2E_USERNAME="<your-username>"
export CYPRESS_E2E_PASSWORD="<your-password>"
```

See Cypress documentation for setting OS [environment variables](https://docs.cypress.io/app/references/environment-variables#Setting) to learn more.

#### Lighthouse audits

You can execute automated [Lighthouse audits](https://developer.chrome.com/docs/lighthouse/overview) with [cypress-audit](https://github.com/mfrachet/cypress-audit) by running `npm run e2e:cypress:audits`.
You should only run the audits when your application is packaged with the production profile.
The lighthouse report is created in `target/cypress/lhreport.html`.

[JHipster Homepage and latest documentation]: https://www.jhipster.tech/
[JHipster 9.0.0-beta.0 archive]: https://www.jhipster.tech/documentation-archive/v9.0.0-beta.0
[Using JHipster in development]: https://www.jhipster.tech/documentation-archive/v9.0.0-beta.0/development/
[Using Docker and Docker-Compose]: https://www.jhipster.tech/documentation-archive/v9.0.0-beta.0/docker-compose
[Using JHipster in production]: https://www.jhipster.tech/documentation-archive/v9.0.0-beta.0/production/
[Running tests page]: https://www.jhipster.tech/documentation-archive/v9.0.0-beta.0/running-tests/
[Code quality page]: https://www.jhipster.tech/documentation-archive/v9.0.0-beta.0/code-quality/
[Setting up Continuous Integration]: https://www.jhipster.tech/documentation-archive/v9.0.0-beta.0/setting-up-ci/
[Node.js]: https://nodejs.org/
[NPM]: https://www.npmjs.com/
[Webpack]: https://webpack.js.org/
[BrowserSync]: https://www.browsersync.io/
[Jest]: https://jestjs.io
[Leaflet]: https://leafletjs.com/
[DefinitelyTyped]: https://definitelytyped.org/
[Cypress]: https://www.cypress.io/
