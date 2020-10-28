# About

Configurable logger.

# Getting started

1. `yarn install` - install the dependencies.
2. `yarn build:package` - build application.

# Why do we have that dev dependencies?

* `@eigenspace/codestyle` - includes lint rules, config for typescript.
* `@eigenspace/commit-linter` - linter for commit messages.
* `@eigenspace/helper-scripts` - used to copy project files to build directory.
* `eslint-plugin-eigenspace-script` - includes set of script linting rules and configuration for them.
* `@types/*` - contains type definitions for specific library.
* `jest` - testing framework to write unit specs (including snapshots).
* `ts-jest` - it lets you use Jest to test projects written in TypeScript.
* `typescript` - is a superset of JavaScript that have static type-checking and ECMAScript features.
    We need 3.8.x+ version because of `Promise.allSettled`.
* `husky` - used for configure git hooks.
* `lint-staged` - used for configure linters against staged git files.
* `eslint` - it checks code for readability, maintainability, and functionality errors.
