# Integration testing using Cypress

### Prerequisite

Install cypress once (after installing all dependencies using `yarn`)

```
yarn cypress install
```

## Writing tests

Test scripts are located on `/cypress/integration/` folder. To create a new test, simply add
another file under this folder. A file represents a page in the app.

If Cypress UI is running, it will automatically reload when updating the tests.

## Running tests via Cypress UI

### Important

Before running the test, be sure to build the app first and serve it locally. Cypress listens to localhost:3000, so be sure there are no other apps occupying the port aside from the halodao-interface app.

```
yarn build
serve build -l 3000

// or use the shortcut:
yarn build-serve
```

Now you can run Cypress UI on another terminal using:

```
$(npm bin)/cypress open

// or use the shortcut:
yarn cy
```

Click any test or choose "Run all specs" to run all the tests. This will open up a new controlled browser where you can see the automated test in action! You can also inspect elements using the controlled browser or view console logs, but avoid using it to surf the web.

## Running tests via CLI

Simply run the command on terminal:

```
yarn integration-test
```