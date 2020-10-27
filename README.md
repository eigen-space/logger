# About

This is invoice service.

# Getting started

1. `yarn install` - install the dependencies.
2. `yarn build` - build application.
2. `yarn start` - start on the localhost at 3230 port.

# Why do we use `--esModuleInterop`

We use `lodash`. `lodash` modules are CommonJS modules. We import them as 
`import * as smth`. Typescript warns us that it’s not a great way. 
To remove them we had put the `ts-ignore` tag. 

We can use `--esModuleInterop` to eliminate the problem without workarounds
like `ts-ignore`:
* [Stackoverflow. Understanding --esModuleInterop](https://stackoverflow.com/questions/56238356/understanding-esmoduleinterop-in-tsconfig-file)
* [Official Docs](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

# Why do we have that dependencies?

* `@eigenspace/web-imap-client` - sdk for email fetching.
* `@eigenspace/utils` - used for helpful string utils.
an appropriate client app.
* `form-data` - to send multipart data.
* `lodash.camelcase` - to convert responses to app format.
* `node-fetch` - js fetch for Node js.
* `node-postgres-named` - arguments escaper for postgres queries.
* `pg` - to operate with postgres database.
* `xero-node` - used to auth to xero.

# Why do we have that dev dependencies?

* `@eigenspace/codestyle` - includes lint rules, config for typescript.
* `@eigenspace/common-types` - includes common types.
* `@eigenspace/helper-scripts` - helps us copy files.
* `@eigenspace/commit-linter` - linter for commit messages.
* `eslint-plugin-eigenspace-script` - includes set of script linting rules and configuration for them.
* `@types/*` - contains type definitions for specific library.
* `flat` - it helps make objects flattened and use as a pair to `json2csv`
to get readable reports on base of flattened xero contacts.
* `jest` - testing framework to write unit specs (including snapshots).
* `json2csv` - it is used only in dev scripts to convert json files with
xero contacts to csv reports.
* `ts-jest` - it lets you use Jest to test projects written in TypeScript.
* `typescript` - is a superset of JavaScript that have static type-checking and ECMAScript features.
    We need 3.8.x+ version because of `Promise.allSettled`.
* `husky` - used for configure git hooks.
* `lint-staged` - used for configure linters against staged git files.
* `cross-env` - used for switching environments between mocks and dev.
* `eslint` - it checks code for readability, maintainability, and functionality errors.
* `nodemon` - Starts server with auto update.
* `ts-node` - to run without build typescript.
* `ts-jest` - *
* `jest` - *
* `ts-loader` - *
* `whatwg-fetch` - this project is a polyfill for `window.fetch`.
