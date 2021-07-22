# Purpose

To provide an upgrade path for those looking to retain the features of
rails-ujs, but using a currently maintained library written in Typescript and using
modern features like MutationObservers and fetch.

## Check out the docs

The official docs can be found here:

<https://mrujs.netlify.app>

## Working on mrujs locally

1. Clone the repo

```bash
git clone https://github.com/ParamagicDev/mrujs
cd mrujs
```

2. Install packages

```bash
yarn install
```

### View Dev Server

```bash
yarn start
```

### Run tests

```bash
yarn test
```

## Rails

There is also a Rails dummy app attached in this repo for testing.

### Installation

Top level:

`bundle install`

### Starting

Must be run within the `test/ruby/dummy` directory.

`cd test/ruby/dummy && bundle exec rails server`

### Tests

From any where _outside_ of the `test/ruby/dummy` directory:

`bundle exec rake test`

## Docs

Docs are located in `/docs` and use Bridgetown + Netlify.

To start the docs server do the following:

`cd docs && yarn install && bundle install && yarn start`

