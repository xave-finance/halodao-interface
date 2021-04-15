# Integration testing using Cypress

## Writing tests

Test scripts are located on `/cypress/integration/` folder. To create a new test, simply add
another file under this folder. A file represents a page in the app.

If Cypress UI is running, it will automatically reload when updating the tests.

## Running tests via Cypress UI

### Important

Before running the test, be sure to build the app first!

```
yarn build
```

Then serve the app locally:

```
serve build -l 3000
```

Now you can run Cypress UI to start the integration tests

```
$(npm bin)/cypress open
```

Click any test or choose `Run all specs` to run all the tests. This will open up a new controlled browser where you can see the automated test in action!

## Running tests via CLI

Simply run the command on terminal:

```
npm run integaration-test
```