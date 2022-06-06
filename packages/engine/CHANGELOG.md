# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.0](https://github.com/sumanmaity112/pairing-matrix/compare/pairing-matrix-engine@0.4.0...pairing-matrix-engine@1.0.0) (2022-06-06)


### Features

* Consider all co-authors when generating pairing matrix ([6134cec](https://github.com/sumanmaity112/pairing-matrix/commit/6134ceca10015f36d946a29c9331fef1c47abadc))
* Consider commits across all branches when generating matrix ([4642508](https://github.com/sumanmaity112/pairing-matrix/commit/4642508c2e1a4f76e9580063bc0ed6fd78821015))
* Escape special characters presents in address prefix ([a13efbe](https://github.com/sumanmaity112/pairing-matrix/commit/a13efbead8d802e2049df2ae82fa63f956c42729))
* Introduce API to suggest pairs based on commit information ([8bcfa9e](https://github.com/sumanmaity112/pairing-matrix/commit/8bcfa9ede9768d4abd0008efa37d7890a16608b0))


### Bug Fixes

* Always convert email address to lower case to avoid duplicate authors ([69ad244](https://github.com/sumanmaity112/pairing-matrix/commit/69ad244cc1ef4203bb5189968e3087ecc6f79441))
* Use UTC timezone while extracting reference using days aggregation ([04b525b](https://github.com/sumanmaity112/pairing-matrix/commit/04b525bde524189c021e95301b3bf34bc7cb28e3))



## [0.4.0](https://github.com/sumanmaity112/pairing-matrix/compare/pairing-matrix-engine@0.3.0...pairing-matrix-engine@0.4.0) (2022-05-23)


### ⚠ BREAKING CHANGES

* By default aggregate by days instead of issue
* Rename aggregate by date to aggregate by days

### Features

* Allow user to configure card reference number prefix ([6be07ba](https://github.com/sumanmaity112/pairing-matrix/commit/6be07bae80115d049a7fff850e00c33bcfbc1fe8))
* By default aggregate by days instead of issue ([e2b6674](https://github.com/sumanmaity112/pairing-matrix/commit/e2b6674e983cea9d45a4178f1e98c49c6cc84588))
* Rename aggregate by date to aggregate by days ([d262eea](https://github.com/sumanmaity112/pairing-matrix/commit/d262eeae154bc05c5a7896fa758297f038924fee))


### Bug Fixes

* Provide better logs ([3f8ddcc](https://github.com/sumanmaity112/pairing-matrix/commit/3f8ddcc58c365ee91cbcfaaca999ff1d66103b43))



## [0.3.0](https://github.com/sumanmaity112/pairing-matrix/compare/pairing-matrix-engine@0.2.0...pairing-matrix-engine@0.3.0) (2022-04-30)


### Features

* Introduce pair aggregation by date ([1afad3d](https://github.com/sumanmaity112/pairing-matrix/commit/1afad3d3027500ff413f43f1a27932c50aef20d8))



## 0.2.0 (2022-04-04)


### Features

* Create pairing matrix using github commits ([474223b](https://github.com/sumanmaity112/pairing-matrix/commit/474223b993b1aef498277137ef9e633af5372d4a))
