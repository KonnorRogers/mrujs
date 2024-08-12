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
pnpm install
```

### View Dev Server

```bash
pnpm run start
```

### Run tests

```bash
pnpm test
```

## Rails

There is also a Rails dummy app attached in this repo for testing.

### Installation

Top level:

`bundle install`

### Starting

Must be run within the `test/rails/dummy` directory.

`cd test/rails/dummy && bundle exec rails server`

### Tests

From any where _outside_ of the `test/rails/dummy` directory:

`bundle exec rake test`

## Docs

Docs are located in `/docs` and use Bridgetown + Netlify.

To start the docs server do the following:

`cd docs && bundle install && bin/bridgetown start`

