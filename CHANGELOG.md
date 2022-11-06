# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.10.1](https://github.com/KonnorRogers/mrujs/compare/v0.10.0...v0.10.1) (2022-04-06)

## [0.10.0](https://github.com/KonnorRogers/mrujs/compare/v0.9.0...v0.10.0) (2022-04-06)


### Features

* Add `data-ujs-morph-root` for morphdom rendering ([#187](https://github.com/KonnorRogers/mrujs/issues/187)) ([cdf47da](https://github.com/KonnorRogers/mrujs/commit/cdf47da6884af354e88d6c979a5b91aeef6a0d92))

## [0.9.0](https://github.com/KonnorRogers/mrujs/compare/v0.8.4...v0.9.0) (2022-03-13)


### Features

* allow alternate rendering techniques ([#186](https://github.com/KonnorRogers/mrujs/issues/186)) ([ec4d0b6](https://github.com/KonnorRogers/mrujs/commit/ec4d0b69dfaa998cfadf18aedc40546c7d6071d2))

### [0.8.4](https://github.com/KonnorRogers/mrujs/compare/v0.8.3...v0.8.4) (2022-02-21)


### Bug Fixes

* confirm:complete now fires appropriately ([#183](https://github.com/KonnorRogers/mrujs/issues/183)) ([322b209](https://github.com/KonnorRogers/mrujs/commit/322b209f2d6c2f3c6ec41a2ecc9ad6bff1053dec))

### [0.8.3](https://github.com/KonnorRogers/mrujs/compare/v0.8.3-beta.8...v0.8.3) (2022-01-27)

* Fix typings for main entrypoint and plugins entrypoint

### [0.8.2](https://github.com/KonnorRogers/mrujs/compare/v0.8.1...v0.8.2) (2022-01-27)


### Bug Fixes

* rework internal plugin structure ([#178](https://github.com/KonnorRogers/mrujs/issues/178)) ([e86f419](https://github.com/KonnorRogers/mrujs/commit/e86f419a204138b00e61212fbb904ada943f5f74))

### [0.8.1](https://github.com/KonnorRogers/mrujs/compare/v0.8.0...v0.8.1) (2022-01-27)

## [0.8.0](https://github.com/KonnorRogers/mrujs/compare/v0.7.4...v0.8.0) (2022-01-22)

- Remove ActiveStorage [https://github.com/KonnorRogers/mrujs/pull/175](https://github.com/KonnorRogers/mrujs/pull/175)

### [0.7.4](https://github.com/KonnorRogers/mrujs/compare/v0.7.3...v0.7.4) (2021-12-26)

### [0.7.3](https://github.com/KonnorRogers/mrujs/compare/v0.7.2...v0.7.3) (2021-12-26)


### Bug Fixes

* shoelace plugin uses target instead of currentTarget" ([17eeb36](https://github.com/KonnorRogers/mrujs/commit/17eeb36e312153c25093997e56cb24705e96896b))

### [0.7.2](https://github.com/KonnorRogers/mrujs/compare/v0.7.1...v0.7.2) (2021-12-02)


### Bug Fixes

* submit events no longer need details. ([#172](https://github.com/KonnorRogers/mrujs/issues/172)) ([4af9efc](https://github.com/KonnorRogers/mrujs/commit/4af9efcd96ce236f0e885986c6689dec0e4b6950))

### [0.7.1](https://github.com/KonnorRogers/mrujs/compare/v0.7.0...v0.7.1) (2021-11-26)


### Bug Fixes

* CSRF Tokens not attaching on non-GET requests ([#166](https://github.com/KonnorRogers/mrujs/issues/166)) ([3bac5af](https://github.com/KonnorRogers/mrujs/commit/3bac5afd84d2846374964f7fca62b3771111c72c))

## [0.7.0](https://github.com/KonnorRogers/mrujs/compare/v0.6.1...v0.7.0) (2021-11-23)

### Changed

* align selectors off rails-ujs ([#165](https://github.com/KonnorRogers/mrujs/issues/165)) ([917d362](https://github.com/KonnorRogers/mrujs/commit/917d362376973e2679e2eaef6597c0ab36888f69))
* no longer stopEverything on link clicks ([#165](https://github.com/KonnorRogers/mrujs/issues/165)) ([917d362](https://github.com/KonnorRogers/mrujs/commit/917d362376973e2679e2eaef6597c0ab36888f69))

### Bug Fixes

* button submitters now work ([#165](https://github.com/KonnorRogers/mrujs/issues/165)) ([917d362](https://github.com/KonnorRogers/mrujs/commit/917d362376973e2679e2eaef6597c0ab36888f69))

### [0.6.1](https://github.com/KonnorRogers/mrujs/compare/v0.6.0...v0.6.1) (2021-11-21)


### Features

* integrate AS into mrujs ([#162](https://github.com/KonnorRogers/mrujs/issues/162)) ([ac8a2d4](https://github.com/KonnorRogers/mrujs/commit/ac8a2d4c4324ff571f9e7ae62295c4c9f4760f03))

## [0.6.0](https://github.com/KonnorRogers/mrujs/compare/v0.5.11...v0.6.0) (2021-10-30)

- Changed
  - match => matches
  - findFormElements => formElements
  - refresh => refreshCSRFTokens()
  - getToken => csrfToken()
  - getParam => csrfParam()
  - querySelectors got a revamp and now are the same as in
  Rails-UJS

- Removed
  - ajax()
  - serializeElement()
  - getData()
  - setData()
  - handleRemote()
  - href()
  - isCrossDomain()
  - loadCSPNonce()
  - formSubmitButtonClick()
  - AsyncConfirm()
  - config object (querySelectors removed, mimeType now top level on the Mrujs object)

- Modified
  - CSRFProtection takes a Request object instead of an
  XmlHttpRequest

- Added
  - toArray
  - $ (document.querySelectorAll)
  - delegate (backwards compatibility)
  - fileInputSelector

- Aliases
  - fire === dispatch (dispatch returns the event, fire
  returns if it was prevented)

### [0.5.11](https://github.com/KonnorRogers/mrujs/compare/v0.5.10...v0.5.11) (2021-10-28)

### [0.5.10](https://github.com/KonnorRogers/mrujs/compare/v0.5.9...v0.5.10) (2021-10-26)


### Bug Fixes

* Better support for data-params ([#157](https://github.com/KonnorRogers/mrujs/issues/157)) ([89b7a35](https://github.com/KonnorRogers/mrujs/commit/89b7a351b00b94a2617c4f11577ab491a5645fc5))

### [0.5.9](https://github.com/KonnorRogers/mrujs/compare/v0.5.8...v0.5.9) (2021-10-17)


### Bug Fixes

* jsErb headers and submit-event polyfill ([#154](https://github.com/KonnorRogers/mrujs/issues/154)) ([a9a7ea0](https://github.com/KonnorRogers/mrujs/commit/a9a7ea04e0dd39e150cbdf415ca94eec32678a1c))

### [0.5.8](https://github.com/KonnorRogers/mrujs/compare/v0.5.7...v0.5.8) (2021-10-16)

### [0.5.7](https://github.com/KonnorRogers/mrujs/compare/v0.5.6...v0.5.7) (2021-10-16)


### Features

* add shoelace-plugin ([#147](https://github.com/KonnorRogers/mrujs/issues/147)) ([5222887](https://github.com/KonnorRogers/mrujs/commit/52228872f04e694a23431ba4b6c8763758931861))


### Bug Fixes

* conditional operator on formdata ([#148](https://github.com/KonnorRogers/mrujs/issues/148)) ([2c6c031](https://github.com/KonnorRogers/mrujs/commit/2c6c0314a07acf158eb44277b010d507ab70f108))

### [0.5.6](https://github.com/KonnorRogers/mrujs/compare/v0.5.5...v0.5.6) (2021-10-15)


### Bug Fixes

* allow remote submissions on formInputSelectors ([#145](https://github.com/KonnorRogers/mrujs/issues/145)) ([fb57a39](https://github.com/KonnorRogers/mrujs/commit/fb57a391350a17ad1a6696e25f34a69b5ed40b6d))

### [0.5.5](https://github.com/KonnorRogers/mrujs/compare/v0.5.4...v0.5.5) (2021-10-09)


### Bug Fixes

* disable form submits from Turbo ([#142](https://github.com/KonnorRogers/mrujs/issues/142)) ([ded156b](https://github.com/KonnorRogers/mrujs/commit/ded156b40a504e187ddd626e1fe92fa44feb8783))

### [0.5.4](https://github.com/KonnorRogers/mrujs/compare/v0.5.3...v0.5.4) (2021-10-04)


### Bug Fixes

* typings should now work properly ([#140](https://github.com/KonnorRogers/mrujs/issues/140)) ([b428d67](https://github.com/KonnorRogers/mrujs/commit/b428d67b59405fd825f1413b6fcfb3ae18e9e114))

### [0.5.3](https://github.com/KonnorRogers/mrujs/compare/v0.5.2...v0.5.3) (2021-09-27)

### [0.5.2](https://github.com/KonnorRogers/mrujs/compare/v0.5.1...v0.5.2) (2021-09-27)


### Bug Fixes

* minor perf improvements ([#136](https://github.com/KonnorRogers/mrujs/issues/136)) ([2c828bb](https://github.com/KonnorRogers/mrujs/commit/2c828bb7e9832c0732bcaae6edecf283872a5f6e))

### [0.5.1](https://github.com/KonnorRogers/mrujs/compare/v0.5.0...v0.5.1) (2021-09-25)


### Features

* disable <select> elements on change ([#133](https://github.com/KonnorRogers/mrujs/issues/133)) ([fccbb00](https://github.com/KonnorRogers/mrujs/commit/fccbb006304629d35f6561c844651a7d0ee01a32))


### Bug Fixes

* use animation frames when nodes are added ([#135](https://github.com/KonnorRogers/mrujs/issues/135)) ([a2e5a10](https://github.com/KonnorRogers/mrujs/commit/a2e5a1023760d6c6ef165ff7f88925d2c3149eed))

## [0.5.0](https://github.com/KonnorRogers/mrujs/compare/v0.5.0-beta.5...v0.5.0) (2021-09-24)


### Bug Fixes

* submit-event-polyfill ([#132](https://github.com/KonnorRogers/mrujs/issues/132)) ([5fdc3d7](https://github.com/KonnorRogers/mrujs/commit/5fdc3d790992a20b52d77b06e52ef8ee611b3239))

## [0.5.0-beta.5](https://github.com/KonnorRogers/mrujs/compare/v0.5.0-beta.4...v0.5.0-beta.5) (2021-09-20)


### Bug Fixes

* element disabling aligned with rails-ujs ([#129](https://github.com/KonnorRogers/mrujs/issues/129)) ([81b7da1](https://github.com/KonnorRogers/mrujs/commit/81b7da10aed16255c7e1b99fb2c0630778db4706))

## [0.5.0-beta.4](https://github.com/KonnorRogers/mrujs/compare/v0.5.0-beta.3...v0.5.0-beta.4) (2021-09-20)


### Features

* add turbo stream integration ([#127](https://github.com/KonnorRogers/mrujs/issues/127)) ([32ea091](https://github.com/KonnorRogers/mrujs/commit/32ea091911d01effdf11676fee78704bfbb70278))

## [0.5.0-beta.3](https://github.com/KonnorRogers/mrujs/compare/v0.5.0-beta.2...v0.5.0-beta.3) (2021-09-18)


### Bug Fixes

* invalid authenticity token crap ([#125](https://github.com/KonnorRogers/mrujs/issues/125)) ([a397d85](https://github.com/KonnorRogers/mrujs/commit/a397d8595ebbc307c6a3c2b78b58f586dc94c08d))

## [0.5.0-beta.2](https://github.com/KonnorRogers/mrujs/compare/v0.5.0-beta.1...v0.5.0-beta.2) (2021-09-17)


### Bug Fixes

* use response.clone() ([#124](https://github.com/KonnorRogers/mrujs/issues/124)) ([d3ef19d](https://github.com/KonnorRogers/mrujs/commit/d3ef19dbf2d4c38cf90425bc672a4becb01b9dcf))

## [0.5.0-beta.1](https://github.com/KonnorRogers/mrujs/compare/v0.5.0-beta.0...v0.5.0-beta.1) (2021-09-17)

## [0.5.0-beta.0](https://github.com/KonnorRogers/mrujs/compare/v0.4.21...v0.5.0-beta.0) (2021-09-17)


### Bug Fixes

* CableCar refactor ([#123](https://github.com/KonnorRogers/mrujs/issues/123)) ([40bc622](https://github.com/KonnorRogers/mrujs/commit/40bc622d97af0739686340ea4cbcdabb4b545e0d))

### [0.4.21](https://github.com/KonnorRogers/mrujs/compare/v0.4.20...v0.4.21) (2021-09-14)

### [0.4.20](https://github.com/KonnorRogers/mrujs/compare/v0.4.18...v0.4.20) (2021-09-14)

### [0.4.19](https://github.com/KonnorRogers/mrujs/compare/v0.4.18...v0.4.19) (2021-09-14)

### [0.4.18](https://github.com/KonnorRogers/mrujs/compare/v0.4.17...v0.4.18) (2021-09-13)

### [0.4.17](https://github.com/KonnorRogers/mrujs/compare/v0.4.16...v0.4.17) (2021-09-13)

### [0.4.16](https://github.com/KonnorRogers/mrujs/compare/v0.4.15...v0.4.16) (2021-09-13)

### [0.4.15](https://github.com/KonnorRogers/mrujs/compare/v0.4.14...v0.4.15) (2021-09-13)

### [0.4.14](https://github.com/KonnorRogers/mrujs/compare/v0.4.13...v0.4.14) (2021-09-13)


### Features

* support js.erb ([#116](https://github.com/KonnorRogers/mrujs/issues/116)) ([544c458](https://github.com/KonnorRogers/mrujs/commit/544c4581fba377fb1c065a68c4b3a3b0d01fc9ca))


### Bug Fixes

* getHeaders not receiving element ([#118](https://github.com/KonnorRogers/mrujs/issues/118)) ([9122a80](https://github.com/KonnorRogers/mrujs/commit/9122a807a18371b9e813a0f6eb77a06a7b55cb68))

### [0.4.13](https://github.com/KonnorRogers/mrujs/compare/v0.4.12...v0.4.13) (2021-09-08)


### Features

* re-add async confirms ([#115](https://github.com/KonnorRogers/mrujs/issues/115)) ([810c5e6](https://github.com/KonnorRogers/mrujs/commit/810c5e6738804ecfb1e7d34c1c34afc32bfce9e6))

### [0.4.12](https://github.com/KonnorRogers/mrujs/compare/v0.4.11...v0.4.12) (2021-09-07)


### Bug Fixes

* Check if submit-event polyfill exists ([#114](https://github.com/KonnorRogers/mrujs/issues/114)) ([75baf0f](https://github.com/KonnorRogers/mrujs/commit/75baf0f2bfa1ee7e096540bacdcc5290bceb0aa9))

### [0.4.11](https://github.com/KonnorRogers/mrujs/compare/v0.4.10...v0.4.11) (2021-09-07)

### [0.4.10](https://github.com/KonnorRogers/mrujs/compare/v0.4.9...v0.4.10) (2021-09-05)

### [0.4.9](https://github.com/KonnorRogers/mrujs/compare/v0.4.8...v0.4.9) (2021-09-05)

### [0.4.8](https://github.com/KonnorRogers/mrujs/compare/v0.4.7...v0.4.8) (2021-09-05)

### [0.4.7](https://github.com/KonnorRogers/mrujs/compare/v0.4.6...v0.4.7) (2021-09-05)

### [0.4.6](https://github.com/KonnorRogers/mrujs/compare/v0.4.5...v0.4.6) (2021-09-05)

### [0.4.5](https://github.com/KonnorRogers/mrujs/compare/v0.4.4...v0.4.5) (2021-09-05)

### [0.4.4](https://github.com/KonnorRogers/mrujs/compare/v0.4.3...v0.4.4) (2021-09-05)

### Breaking Changes

CableCar plugin has been moved into its own seperate entrypoint at
"mrujs/plugins"

### [0.4.3](https://github.com/KonnorRogers/mrujs/compare/v0.4.2...v0.4.3) (2021-09-02)

### Bug Fixes

* Remote GET links now navigate. ([#111](https://github.com/KonnorRogers/mrujs/pull/111)) ([b748e60](https://github.com/KonnorRogers/mrujs/commit/b748e6000bb7e83c8f1cbb028fd3a02609f413f4))

### [0.4.2](https://github.com/KonnorRogers/mrujs/compare/v0.4.1...v0.4.2) (2021-08-29)


### Features

* auto attach data-turbo="false" ([#108](https://github.com/KonnorRogers/mrujs/issues/108)) ([7612aba](https://github.com/KonnorRogers/mrujs/commit/7612aba151015650d7625c966e3758cf05fff46f))

### Bug Fixes

* Fixes a bug in the mutation observer not checking attributes ([#108](https://github.com/KonnorRogers/mrujs/issues/108)) ([7612aba](https://github.com/KonnorRogers/mrujs/commit/7612aba151015650d7625c966e3758cf05fff46f))

### [0.4.1](https://github.com/KonnorRogers/mrujs/compare/v0.4.0...v0.4.1) (2021-08-26)

## [0.4.0](https://github.com/KonnorRogers/mrujs/compare/v0.3.8-beta.0...v0.4.0) (2021-08-26)

### BREAKING CHANGES

* API Changes:
  - `FetchResponse.responseHtml -> FetchResponse.html()`
  - `FetchResponse.responseText -> FetchResponse.text()`
  - `FetchResponse.responseJson -> FetchResponse.json()`
  - responses are no longer stored so they cannot be consumed twice.
  - ([#103](https://github.com/KonnorRogers/mrujs/issues/103)) ([6ff3a6f](https://github.com/KonnorRogers/mrujs/commit/6ff3a6f540441834159f93cbb2a35d72e7c4f41f))



### Features

* Refactor from classes ([#103](https://github.com/KonnorRogers/mrujs/issues/103)) ([6ff3a6f](https://github.com/KonnorRogers/mrujs/commit/6ff3a6f540441834159f93cbb2a35d72e7c4f41f))

### [0.3.8-beta.0](https://github.com/KonnorRogers/mrujs/compare/v0.3.7...v0.3.8-beta.0) (2021-08-24)

### [0.3.7](https://github.com/KonnorRogers/mrujs/compare/v0.3.7-beta.6...v0.3.7) (2021-08-20)


### Bug Fixes

* CableCar mime types more permissive. ([#101](https://github.com/KonnorRogers/mrujs/issues/101)) ([1d13a95](https://github.com/KonnorRogers/mrujs/commit/1d13a95fb7be05ba6444ff538eb037f688f9ce86))

### [0.3.7-beta.6](https://github.com/KonnorRogers/mrujs/compare/v0.3.7-beta.5...v0.3.7-beta.6) (2021-08-11)

### [0.3.7-beta.5](https://github.com/KonnorRogers/mrujs/compare/v0.3.7-beta.4...v0.3.7-beta.5) (2021-08-11)

### [0.3.7-beta.4](https://github.com/KonnorRogers/mrujs/compare/v0.3.7-beta.3...v0.3.7-beta.4) (2021-08-11)

### [0.3.7-beta.3](https://github.com/KonnorRogers/mrujs/compare/v0.3.7-beta.2...v0.3.7-beta.3) (2021-08-11)


### Features

* add async confirm dialogs ([#94](https://github.com/KonnorRogers/mrujs/issues/94)) ([aa88306](https://github.com/KonnorRogers/mrujs/commit/aa88306b0e8cf712bc07d1521f61c60c87d8e4da))

### [0.3.7-beta.2](https://github.com/KonnorRogers/mrujs/compare/v0.3.7-beta.1...v0.3.7-beta.2) (2021-08-09)

### Bug Fixes

* mrujs.fetch now properly accepts Request objects.

### [0.3.7-beta.1](https://github.com/KonnorRogers/mrujs/compare/v0.3.6...v0.3.7-beta.1) (2021-08-09)

### Features

* mrujs.fetch can now dispatch events! ([#91](https://github.com/KonnorRogers/mrujs/issues/91)) ([92a4e76](https://github.com/KonnorRogers/mrujs/commit/92a4e76d032080e2e968d3417505b267f33c0f05))

### Bug Fixes

* GET requests now properly submit URLSearchParams ([#91](https://github.com/KonnorRogers/mrujs/issues/91)) ([92a4e76](https://github.com/KonnorRogers/mrujs/commit/92a4e76d032080e2e968d3417505b267f33c0f05))

### [0.3.7-beta.0](https://github.com/KonnorRogers/mrujs/compare/v0.3.6...v0.3.7-beta.0) (2021-08-09)


### Bug Fixes

* GET requests now properly submit URLSearchParams ([#91](https://github.com/KonnorRogers/mrujs/issues/91)) ([92a4e76](https://github.com/KonnorRogers/mrujs/commit/92a4e76d032080e2e968d3417505b267f33c0f05))

### [0.3.6](https://github.com/KonnorRogers/mrujs/compare/v0.3.5...v0.3.6) (2021-07-25)

### [0.3.5](https://github.com/KonnorRogers/mrujs/compare/v0.3.4...v0.3.5) (2021-07-25)

* Adds button[data-disable] to querySelectors

### [0.3.4](https://github.com/KonnorRogers/mrujs/compare/v0.3.3...v0.3.4) (2021-07-25)

## Features

* Adds mrujs.enableElement and mrujs.disableElement top level. ([#87](https://github.com/KonnorRogers/mrujs/pull/87)) ([e898a5a](https://github.com/KonnorRogers/mrujs/pull/87/commits/e898a5a3dcbd908b5fdf5a49d914b54086755240))

* Adds `data-ujs-navigate`to opt out of the navigation adapter. ([#87](https://github.com/KonnorRogers/mrujs/pull/87)) ([e898a5a](https://github.com/KonnorRogers/mrujs/pull/87/commits/e898a5a3dcbd908b5fdf5a49d914b54086755240))

## Fixes

* Fixes needing `[data-remote]` on buttons ([#87](https://github.com/KonnorRogers/mrujs/pull/87)) ([e898a5a](https://github.com/KonnorRogers/mrujs/pull/87/commits/e898a5a3dcbd908b5fdf5a49d914b54086755240))

### [0.3.3](https://github.com/KonnorRogers/mrujs/compare/v0.3.2...v0.3.3) (2021-07-22)

### Features

* add status to event.detail ([#86](https://github.com/KonnorRogers/mrujs/issues/86)) ([5b2663a](https://github.com/KonnorRogers/mrujs/commit/5b2663a53faa3f0fc2499706becf8967972fddc8))

* **cablecar:** change the default mimetype ([#64](https://github.com/KonnorRogers/mrujs/issues/64)) ([0e12a0f](https://github.com/KonnorRogers/mrujs/commit/0e12a0fad4481ba58b6f2067b69e1ad07de63501))

### [0.3.2](https://github.com/KonnorRogers/mrujs/compare/v0.3.1...v0.3.2) (2021-07-18)


### Bug Fixes

* allow for cancelling nav adapter ([#84](https://github.com/KonnorRogers/mrujs/issues/84)) ([353a977](https://github.com/KonnorRogers/mrujs/commit/353a9773398f6df239ef42062908e5070bffd6f7))

* Use morphdom if redirecting to the current URL ([#84](https://github.com/KonnorRogers/mrujs/issues/84)) ([353a977](https://github.com/KonnorRogers/mrujs/commit/353a9773398f6df239ef42062908e5070bffd6f7))

### [0.3.1](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.31...v0.3.1) (2021-07-17)

## [0.3.0](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.31...v0.3.0) (2021-07-17)

## [0.3.0-beta.31](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.29...v0.3.0-beta.31) (2021-07-17)


### Features

* add cache operations ([#78](https://github.com/KonnorRogers/mrujs/issues/78)) ([9ff8c7e](https://github.com/KonnorRogers/mrujs/commit/9ff8c7ec3d1037acfa91d5be7482683083850883))

### Fixes

* element enabling regression ([#78](https://github.com/KonnorRogers/mrujs/issues/78)) ([9ff8c7e](https://github.com/KonnorRogers/mrujs/commit/9ff8c7ec3d1037acfa91d5be7482683083850883))

## [0.3.0-beta.29](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.28...v0.3.0-beta.29) (2021-07-16)


### Bug Fixes

* querySelectors for Turbo ([#75](https://github.com/KonnorRogers/mrujs/issues/75)) ([06c6d28](https://github.com/KonnorRogers/mrujs/commit/06c6d280f1de4cadd15dbc4c31b41ad283d1b374))

## [0.3.0-beta.28](https://github.com/KonnorRogers/mrujs/compare/v0.3.1-beta.0...v0.3.0-beta.28) (2021-07-16)

### Features

Add a initialize and observerCallback hook

## [0.3.0-beta.27](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.26...v0.3.0-beta.27) (2021-07-07)


### Features

* Add support for Turbo ([#65](https://github.com/KonnorRogers/mrujs/issues/65)) ([dd0b9ee](https://github.com/KonnorRogers/mrujs/commit/dd0b9eefa9b90f130428e36a659bfa7e1229ebc8))


### Bug Fixes

* event listeners now attach properly when attributes change ([#66](https://github.com/KonnorRogers/mrujs/issues/66)) ([39632a2](https://github.com/KonnorRogers/mrujs/commit/39632a20d6b0274623367c47220ee1cac8e62a00))
* json matching ([6ca5116](https://github.com/KonnorRogers/mrujs/commit/6ca51161ba7788344839b8ba6778224bccf0795d))

## [0.3.0-beta.26](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.25...v0.3.0-beta.26) (2021-07-03)


### Features

* **cablecar:** allow custom default MimeTypes ([#62](https://github.com/KonnorRogers/mrujs/issues/62)) ([606330e](https://github.com/KonnorRogers/mrujs/commit/606330e435a277d9d09f459e5ef51fe2cbdcb260))

# [0.3.0-beta.23](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.22...v0.3.0-beta.23) (2021-07-03)


### Features

* cable-car integration ([cb93691](https://github.com/KonnorRogers/mrujs/commit/cb93691b6cda09606ff91ed94383da455fbfd8ab))



# [0.3.0-beta.21](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.20...v0.3.0-beta.21) (2021-07-01)


### Bug Fixes

* addedNodesObserver properly observes attributes now ([#57](https://github.com/KonnorRogers/mrujs/issues/57)) ([bb52891](https://github.com/KonnorRogers/mrujs/commit/bb52891ec689c7197282099648f84c215089e100))



# [0.3.0-beta.21](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.20...v0.3.0-beta.21) (2021-07-01)


### Bug Fixes

* addedNodesObserver properly observes attributes now ([#57](https://github.com/KonnorRogers/mrujs/issues/57)) ([bb52891](https://github.com/KonnorRogers/mrujs/commit/bb52891ec689c7197282099648f84c215089e100))



# [0.3.0-beta.19](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.20...v0.3.0-beta.19) (2021-06-30)

### Features

* PLUGINS!!

# [0.3.0-beta.18](https://github.com/KonnorRogers/mrujs/compare/v0.3.0...v0.3.0-beta.18) (2021-06-30)

### Features

* Custom MimeType registering

### Fixes

* isJson checks on FetchResponse are now more inclusive.

# [0.3.0-beta.17](https://github.com/KonnorRogers/mrujs/compare/v0.3.0...v0.3.0-beta.17) (2021-06-27)


### Features

* custom query selectors ([#51](https://github.com/KonnorRogers/mrujs/issues/51)) ([17468c6](https://github.com/KonnorRogers/mrujs/commit/17468c6a089534892c7b724b46c8416399972daa))

### Fixes

* data-confirm event ordering on mutation observers
* confirm ordering on elements ([0324b54](https://github.com/KonnorRogers/mrujs/commit/0324b54ff02d64882b4fa4d6ab073089d7ff7bc3))

# [0.3.0-beta.16](https://github.com/KonnorRogers/mrujs/compare/v0.3.0...v0.3.0-beta.16) (2021-06-24)


### Features

* custom query selectors ([#51](https://github.com/KonnorRogers/mrujs/issues/51)) ([17468c6](https://github.com/KonnorRogers/mrujs/commit/17468c6a089534892c7b724b46c8416399972daa))


### Reverts

* Revert "chore(release): 0.3.0" ([dacf18e](https://github.com/KonnorRogers/mrujs/commit/dacf18e432f37d54e89831a07114c68534319b7e))



# [0.3.0-beta.15](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.12...v0.3.0-beta.15) (2021-06-17)

## [0.3.0-beta.14](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.12...v0.3.0-beta.14) (2021-06-13)


### Features

* Add checks for json responses. ([#44](https://github.com/KonnorRogers/mrujs/issues/44)) ([fe1ca93](https://github.com/KonnorRogers/mrujs/commit/fe1ca9367a6568130367945cd24f1c99480ae110))


### Bug Fixes

* data disable button handling ([#46](https://github.com/KonnorRogers/mrujs/issues/46)) ([7d12614](https://github.com/KonnorRogers/mrujs/commit/7d126144713759a3c08765463eec5e5f52b8b5f7))

# [0.3.0-beta.14](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.12...v0.3.0-beta.14) (2021-06-13)

### Bug Fixes

* Disabling of buttons now works as originally intended.


# [0.3.0-beta.11](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.9...v0.3.0-beta.11) (2021-06-12)


### Bug Fixes

* data-remote link submissions ([#37](https://github.com/KonnorRogers/mrujs/issues/37)) ([33698c1](https://github.com/KonnorRogers/mrujs/commit/33698c1b3dd31d9388a65a7cf726419e146653b8))



# [0.3.0-beta.10](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.9...v0.3.0-beta.10) (2021-06-11)


### Bug Fixes

* data-remote link submissions ([#37](https://github.com/KonnorRogers/mrujs/issues/37)) ([33698c1](https://github.com/KonnorRogers/mrujs/commit/33698c1b3dd31d9388a65a7cf726419e146653b8))



# [0.3.0-beta.8](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.7...v0.3.0-beta.8) (2021-06-10)



# [0.3.0-beta.8](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.7...v0.3.0-beta.8) (2021-06-09)



# [0.3.0-beta.2](https://github.com/KonnorRogers/mrujs/compare/v0.3.0-beta.1...v0.3.0-beta.2) (2021-06-08)

### Fixes

* Fix raising errors on forms that don't redirect on success.

# [0.3.0-beta.1](https://github.com/KonnorRogers/mrujs/compare/v0.2.1...v0.3.0-beta.1) (2021-06-08)

### Features

* refactor fetch ([#32](https://github.com/KonnorRogers/mrujs/issues/32)) ([d69c1f0](https://github.com/KonnorRogers/mrujs/commit/d69c1f0708e24439a58257c91d2ad719752bd686))



# [0.2.0](https://github.com/KonnorRogers/mrujs/compare/v0.1.2...v0.2.0) (2021-06-05)

### Deprecation Warning

* `data-response="json"` has been changed to `data-type="json"` to align
with UJS.

### Bug Fixes

* linting issue ([26a4524](https://github.com/KonnorRogers/mrujs/commit/26a45246a6651a57b9b0fa7a5e52e27178a16d0d))

### Features

* integrate morphdom ([#19](https://github.com/KonnorRogers/mrujs/issues/19)) ([e102fee](https://github.com/KonnorRogers/mrujs/commit/e102feed6ae2830ac9b40efcd7fd26f395f47c6b))

## [0.1.2](https://github.com/KonnorRogers/mrujs/compare/v0.1.1...v0.1.2) (2021-05-28)


### Bug Fixes

* dont fire turbolinks if not redirected ([d4d04dd](https://github.com/KonnorRogers/mrujs/commit/d4d04dd7d167ba3a77a78c7ed3074aa0aff154df))



## [0.1.1](https://github.com/KonnorRogers/mrujs/compare/v0.1.0...v0.1.1) (2021-05-28)



# [0.1.0](https://github.com/KonnorRogers/mrujs/compare/v0.1.0-beta.16...v0.1.0) (2021-05-27)



# [0.1.0-beta.14](https://github.com/KonnorRogers/mrujs/compare/v0.1.0-beta.13...v0.1.0-beta.14) (2021-05-23)



# [0.1.0-beta.13](https://github.com/KonnorRogers/mrujs/compare/v0.1.0-beta.11...v0.1.0-beta.13) (2021-05-23)



# [0.1.0-beta.11](https://github.com/KonnorRogers/mrujs/compare/v0.1.0-beta.10...v0.1.0-beta.11) (2021-05-23)



# [0.1.0-beta.10](https://github.com/KonnorRogers/mrujs/compare/v0.1.0-beta.9...v0.1.0-beta.10) (2021-05-23)


### Features

* create turbolinks adapter ([#14](https://github.com/KonnorRogers/mrujs/issues/14)) ([b7d02d4](https://github.com/KonnorRogers/mrujs/commit/b7d02d425d81f71ad3d0957d1b6a605a11823fab))



# [0.1.0-beta.9](https://github.com/KonnorRogers/mrujs/compare/v0.1.0-beta.8...v0.1.0-beta.9) (2021-05-17)



# [0.1.0-beta.8](https://github.com/KonnorRogers/mrujs/compare/v0.1.0-beta.7...v0.1.0-beta.8) (2021-05-17)



# [0.1.0-beta.7](https://github.com/KonnorRogers/mrujs/compare/v0.1.0-beta.6...v0.1.0-beta.7) (2021-05-10)



# [0.1.0-beta.6](https://github.com/KonnorRogers/mrujs/compare/v0.1.0-beta.5...v0.1.0-beta.6) (2021-05-09)



# [0.1.0-beta.5](https://github.com/KonnorRogers/mrujs/compare/v0.1.0-beta.4...v0.1.0-beta.5) (2021-05-09)



# [0.1.0-beta.4](https://github.com/KonnorRogers/mrujs/compare/v0.1.0-beta.3...v0.1.0-beta.4) (2021-05-08)



# [0.1.0-beta.3](https://github.com/KonnorRogers/mrujs/compare/v0.1.0-beta.2...v0.1.0-beta.3) (2021-05-08)


### Features

* add stopImmediatePropagation to method ([19da4f7](https://github.com/KonnorRogers/mrujs/commit/19da4f7404c05f3eeaf589a08927323d3fc003df))



# [0.1.0-beta.2](https://github.com/KonnorRogers/mrujs/compare/v0.0.6...v0.1.0-beta.2) (2021-05-08)


### Features

* add `data-method` support ([#12](https://github.com/KonnorRogers/mrujs/issues/12)) ([d02feeb](https://github.com/KonnorRogers/mrujs/commit/d02feeba0b04bfe8c899165601669f1eb60b4793))
* create a rubygem for mrujs ([#9](https://github.com/KonnorRogers/mrujs/issues/9)) ([18a57f1](https://github.com/KonnorRogers/mrujs/commit/18a57f1126169ff953d05e363460779c465b1ccf))



## [0.0.6](https://github.com/KonnorRogers/mrujs/compare/v0.0.5...v0.0.6) (2021-05-03)



## [0.0.5](https://github.com/KonnorRogers/mrujs/compare/v0.0.2...v0.0.5) (2021-05-03)



## 0.0.2 (2021-05-01)
