# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.7-beta.1](https://github.com/ParamagicDev/mrujs/compare/v0.3.6...v0.3.7-beta.1) (2021-08-09)


### Bug Fixes

* GET requests now properly submit URLSearchParams ([#91](https://github.com/ParamagicDev/mrujs/issues/91)) ([92a4e76](https://github.com/ParamagicDev/mrujs/commit/92a4e76d032080e2e968d3417505b267f33c0f05))

### [0.3.7-beta.0](https://github.com/ParamagicDev/mrujs/compare/v0.3.6...v0.3.7-beta.0) (2021-08-09)


### Bug Fixes

* GET requests now properly submit URLSearchParams ([#91](https://github.com/ParamagicDev/mrujs/issues/91)) ([92a4e76](https://github.com/ParamagicDev/mrujs/commit/92a4e76d032080e2e968d3417505b267f33c0f05))

### [0.3.6](https://github.com/ParamagicDev/mrujs/compare/v0.3.5...v0.3.6) (2021-07-25)

### [0.3.5](https://github.com/ParamagicDev/mrujs/compare/v0.3.4...v0.3.5) (2021-07-25)

* Adds button[data-disable] to querySelectors

### [0.3.4](https://github.com/ParamagicDev/mrujs/compare/v0.3.3...v0.3.4) (2021-07-25)

## Features

* Adds mrujs.enableElement and mrujs.disableElement top level. ([#87](https://github.com/ParamagicDev/mrujs/pull/87)) ([e898a5a](https://github.com/ParamagicDev/mrujs/pull/87/commits/e898a5a3dcbd908b5fdf5a49d914b54086755240))

* Adds `data-ujs-navigate`to opt out of the navigation adapter. ([#87](https://github.com/ParamagicDev/mrujs/pull/87)) ([e898a5a](https://github.com/ParamagicDev/mrujs/pull/87/commits/e898a5a3dcbd908b5fdf5a49d914b54086755240))

## Fixes

* Fixes needing `[data-remote]` on buttons ([#87](https://github.com/ParamagicDev/mrujs/pull/87)) ([e898a5a](https://github.com/ParamagicDev/mrujs/pull/87/commits/e898a5a3dcbd908b5fdf5a49d914b54086755240))

### [0.3.3](https://github.com/ParamagicDev/mrujs/compare/v0.3.2...v0.3.3) (2021-07-22)

### Features

* add status to event.detail ([#86](https://github.com/ParamagicDev/mrujs/issues/86)) ([5b2663a](https://github.com/ParamagicDev/mrujs/commit/5b2663a53faa3f0fc2499706becf8967972fddc8))

* **cablecar:** change the default mimetype ([#64](https://github.com/ParamagicDev/mrujs/issues/64)) ([0e12a0f](https://github.com/ParamagicDev/mrujs/commit/0e12a0fad4481ba58b6f2067b69e1ad07de63501))

### [0.3.2](https://github.com/ParamagicDev/mrujs/compare/v0.3.1...v0.3.2) (2021-07-18)


### Bug Fixes

* allow for cancelling nav adapter ([#84](https://github.com/ParamagicDev/mrujs/issues/84)) ([353a977](https://github.com/ParamagicDev/mrujs/commit/353a9773398f6df239ef42062908e5070bffd6f7))

* Use morphdom if redirecting to the current URL ([#84](https://github.com/ParamagicDev/mrujs/issues/84)) ([353a977](https://github.com/ParamagicDev/mrujs/commit/353a9773398f6df239ef42062908e5070bffd6f7))

### [0.3.1](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.31...v0.3.1) (2021-07-17)

## [0.3.0](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.31...v0.3.0) (2021-07-17)

## [0.3.0-beta.31](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.29...v0.3.0-beta.31) (2021-07-17)


### Features

* add cache operations ([#78](https://github.com/ParamagicDev/mrujs/issues/78)) ([9ff8c7e](https://github.com/ParamagicDev/mrujs/commit/9ff8c7ec3d1037acfa91d5be7482683083850883))

### Fixes

* element enabling regression ([#78](https://github.com/ParamagicDev/mrujs/issues/78)) ([9ff8c7e](https://github.com/ParamagicDev/mrujs/commit/9ff8c7ec3d1037acfa91d5be7482683083850883))

## [0.3.0-beta.29](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.28...v0.3.0-beta.29) (2021-07-16)


### Bug Fixes

* querySelectors for Turbo ([#75](https://github.com/ParamagicDev/mrujs/issues/75)) ([06c6d28](https://github.com/ParamagicDev/mrujs/commit/06c6d280f1de4cadd15dbc4c31b41ad283d1b374))

## [0.3.0-beta.28](https://github.com/ParamagicDev/mrujs/compare/v0.3.1-beta.0...v0.3.0-beta.28) (2021-07-16)

### Features

Add a initialize and observerCallback hook

## [0.3.0-beta.27](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.26...v0.3.0-beta.27) (2021-07-07)


### Features

* Add support for Turbo ([#65](https://github.com/ParamagicDev/mrujs/issues/65)) ([dd0b9ee](https://github.com/ParamagicDev/mrujs/commit/dd0b9eefa9b90f130428e36a659bfa7e1229ebc8))


### Bug Fixes

* event listeners now attach properly when attributes change ([#66](https://github.com/ParamagicDev/mrujs/issues/66)) ([39632a2](https://github.com/ParamagicDev/mrujs/commit/39632a20d6b0274623367c47220ee1cac8e62a00))
* json matching ([6ca5116](https://github.com/ParamagicDev/mrujs/commit/6ca51161ba7788344839b8ba6778224bccf0795d))

## [0.3.0-beta.26](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.25...v0.3.0-beta.26) (2021-07-03)


### Features

* **cablecar:** allow custom default MimeTypes ([#62](https://github.com/ParamagicDev/mrujs/issues/62)) ([606330e](https://github.com/ParamagicDev/mrujs/commit/606330e435a277d9d09f459e5ef51fe2cbdcb260))

# [0.3.0-beta.23](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.22...v0.3.0-beta.23) (2021-07-03)


### Features

* cable-car integration ([cb93691](https://github.com/ParamagicDev/mrujs/commit/cb93691b6cda09606ff91ed94383da455fbfd8ab))



# [0.3.0-beta.21](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.20...v0.3.0-beta.21) (2021-07-01)


### Bug Fixes

* addedNodesObserver properly observes attributes now ([#57](https://github.com/ParamagicDev/mrujs/issues/57)) ([bb52891](https://github.com/ParamagicDev/mrujs/commit/bb52891ec689c7197282099648f84c215089e100))



# [0.3.0-beta.21](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.20...v0.3.0-beta.21) (2021-07-01)


### Bug Fixes

* addedNodesObserver properly observes attributes now ([#57](https://github.com/ParamagicDev/mrujs/issues/57)) ([bb52891](https://github.com/ParamagicDev/mrujs/commit/bb52891ec689c7197282099648f84c215089e100))



# [0.3.0-beta.19](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.20...v0.3.0-beta.19) (2021-06-30)

### Features

* PLUGINS!!

# [0.3.0-beta.18](https://github.com/ParamagicDev/mrujs/compare/v0.3.0...v0.3.0-beta.18) (2021-06-30)

### Features

* Custom MimeType registering

### Fixes

* isJson checks on FetchResponse are now more inclusive.

# [0.3.0-beta.17](https://github.com/ParamagicDev/mrujs/compare/v0.3.0...v0.3.0-beta.17) (2021-06-27)


### Features

* custom query selectors ([#51](https://github.com/ParamagicDev/mrujs/issues/51)) ([17468c6](https://github.com/ParamagicDev/mrujs/commit/17468c6a089534892c7b724b46c8416399972daa))

### Fixes

* data-confirm event ordering on mutation observers
* confirm ordering on elements ([0324b54](https://github.com/ParamagicDev/mrujs/commit/0324b54ff02d64882b4fa4d6ab073089d7ff7bc3))

# [0.3.0-beta.16](https://github.com/ParamagicDev/mrujs/compare/v0.3.0...v0.3.0-beta.16) (2021-06-24)


### Features

* custom query selectors ([#51](https://github.com/ParamagicDev/mrujs/issues/51)) ([17468c6](https://github.com/ParamagicDev/mrujs/commit/17468c6a089534892c7b724b46c8416399972daa))


### Reverts

* Revert "chore(release): 0.3.0" ([dacf18e](https://github.com/ParamagicDev/mrujs/commit/dacf18e432f37d54e89831a07114c68534319b7e))



# [0.3.0-beta.15](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.12...v0.3.0-beta.15) (2021-06-17)

## [0.3.0-beta.14](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.12...v0.3.0-beta.14) (2021-06-13)


### Features

* Add checks for json responses. ([#44](https://github.com/ParamagicDev/mrujs/issues/44)) ([fe1ca93](https://github.com/ParamagicDev/mrujs/commit/fe1ca9367a6568130367945cd24f1c99480ae110))


### Bug Fixes

* data disable button handling ([#46](https://github.com/ParamagicDev/mrujs/issues/46)) ([7d12614](https://github.com/ParamagicDev/mrujs/commit/7d126144713759a3c08765463eec5e5f52b8b5f7))

# [0.3.0-beta.14](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.12...v0.3.0-beta.14) (2021-06-13)

### Bug Fixes

* Disabling of buttons now works as originally intended.


# [0.3.0-beta.11](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.9...v0.3.0-beta.11) (2021-06-12)


### Bug Fixes

* data-remote link submissions ([#37](https://github.com/ParamagicDev/mrujs/issues/37)) ([33698c1](https://github.com/ParamagicDev/mrujs/commit/33698c1b3dd31d9388a65a7cf726419e146653b8))



# [0.3.0-beta.10](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.9...v0.3.0-beta.10) (2021-06-11)


### Bug Fixes

* data-remote link submissions ([#37](https://github.com/ParamagicDev/mrujs/issues/37)) ([33698c1](https://github.com/ParamagicDev/mrujs/commit/33698c1b3dd31d9388a65a7cf726419e146653b8))



# [0.3.0-beta.8](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.7...v0.3.0-beta.8) (2021-06-10)



# [0.3.0-beta.8](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.7...v0.3.0-beta.8) (2021-06-09)



# [0.3.0-beta.2](https://github.com/ParamagicDev/mrujs/compare/v0.3.0-beta.1...v0.3.0-beta.2) (2021-06-08)

### Fixes

* Fix raising errors on forms that don't redirect on success.

# [0.3.0-beta.1](https://github.com/ParamagicDev/mrujs/compare/v0.2.1...v0.3.0-beta.1) (2021-06-08)

### Features

* refactor fetch ([#32](https://github.com/ParamagicDev/mrujs/issues/32)) ([d69c1f0](https://github.com/ParamagicDev/mrujs/commit/d69c1f0708e24439a58257c91d2ad719752bd686))



# [0.2.0](https://github.com/ParamagicDev/mrujs/compare/v0.1.2...v0.2.0) (2021-06-05)

### Deprecation Warning

* `data-response="json"` has been changed to `data-type="json"` to align
with UJS.

### Bug Fixes

* linting issue ([26a4524](https://github.com/ParamagicDev/mrujs/commit/26a45246a6651a57b9b0fa7a5e52e27178a16d0d))

### Features

* integrate morphdom ([#19](https://github.com/ParamagicDev/mrujs/issues/19)) ([e102fee](https://github.com/ParamagicDev/mrujs/commit/e102feed6ae2830ac9b40efcd7fd26f395f47c6b))

## [0.1.2](https://github.com/ParamagicDev/mrujs/compare/v0.1.1...v0.1.2) (2021-05-28)


### Bug Fixes

* dont fire turbolinks if not redirected ([d4d04dd](https://github.com/ParamagicDev/mrujs/commit/d4d04dd7d167ba3a77a78c7ed3074aa0aff154df))



## [0.1.1](https://github.com/ParamagicDev/mrujs/compare/v0.1.0...v0.1.1) (2021-05-28)



# [0.1.0](https://github.com/ParamagicDev/mrujs/compare/v0.1.0-beta.16...v0.1.0) (2021-05-27)



# [0.1.0-beta.14](https://github.com/ParamagicDev/mrujs/compare/v0.1.0-beta.13...v0.1.0-beta.14) (2021-05-23)



# [0.1.0-beta.13](https://github.com/ParamagicDev/mrujs/compare/v0.1.0-beta.11...v0.1.0-beta.13) (2021-05-23)



# [0.1.0-beta.11](https://github.com/ParamagicDev/mrujs/compare/v0.1.0-beta.10...v0.1.0-beta.11) (2021-05-23)



# [0.1.0-beta.10](https://github.com/ParamagicDev/mrujs/compare/v0.1.0-beta.9...v0.1.0-beta.10) (2021-05-23)


### Features

* create turbolinks adapter ([#14](https://github.com/ParamagicDev/mrujs/issues/14)) ([b7d02d4](https://github.com/ParamagicDev/mrujs/commit/b7d02d425d81f71ad3d0957d1b6a605a11823fab))



# [0.1.0-beta.9](https://github.com/ParamagicDev/mrujs/compare/v0.1.0-beta.8...v0.1.0-beta.9) (2021-05-17)



# [0.1.0-beta.8](https://github.com/ParamagicDev/mrujs/compare/v0.1.0-beta.7...v0.1.0-beta.8) (2021-05-17)



# [0.1.0-beta.7](https://github.com/ParamagicDev/mrujs/compare/v0.1.0-beta.6...v0.1.0-beta.7) (2021-05-10)



# [0.1.0-beta.6](https://github.com/ParamagicDev/mrujs/compare/v0.1.0-beta.5...v0.1.0-beta.6) (2021-05-09)



# [0.1.0-beta.5](https://github.com/ParamagicDev/mrujs/compare/v0.1.0-beta.4...v0.1.0-beta.5) (2021-05-09)



# [0.1.0-beta.4](https://github.com/ParamagicDev/mrujs/compare/v0.1.0-beta.3...v0.1.0-beta.4) (2021-05-08)



# [0.1.0-beta.3](https://github.com/ParamagicDev/mrujs/compare/v0.1.0-beta.2...v0.1.0-beta.3) (2021-05-08)


### Features

* add stopImmediatePropagation to method ([19da4f7](https://github.com/ParamagicDev/mrujs/commit/19da4f7404c05f3eeaf589a08927323d3fc003df))



# [0.1.0-beta.2](https://github.com/ParamagicDev/mrujs/compare/v0.0.6...v0.1.0-beta.2) (2021-05-08)


### Features

* add `data-method` support ([#12](https://github.com/ParamagicDev/mrujs/issues/12)) ([d02feeb](https://github.com/ParamagicDev/mrujs/commit/d02feeba0b04bfe8c899165601669f1eb60b4793))
* create a rubygem for mrujs ([#9](https://github.com/ParamagicDev/mrujs/issues/9)) ([18a57f1](https://github.com/ParamagicDev/mrujs/commit/18a57f1126169ff953d05e363460779c465b1ccf))



## [0.0.6](https://github.com/ParamagicDev/mrujs/compare/v0.0.5...v0.0.6) (2021-05-03)



## [0.0.5](https://github.com/ParamagicDev/mrujs/compare/v0.0.2...v0.0.5) (2021-05-03)



## 0.0.2 (2021-05-01)
