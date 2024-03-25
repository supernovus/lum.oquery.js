# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2024-03-25
### Added
- `oq.find()` alias to `oq()` main function.
- `oq.Query` alias to `oq` for use as a class constructor.
- A new `test/instance.js` test set for using a class instance.
### Changed
- Overhauled the docblock documentation.
  - Use modern `jsdoc` syntax.
  - Use the `oq.find()` alias to document main function.
  - Use the `oq.Query` alias to document the usage as a class.
- Completely overhauled how the tests are implemented.
  - Extracted a common dataset for the tests.
  - Added a class for common tests.
  - Renamed `test/basics.js` to `test/functions.js` for consistency.

## [1.0.1] - 2023-02-03
### Changed
- Bumped dependencies to newer versions.
- Using `lumtest.js` for `npm test` action.

## [1.0.0] - 2022-08-30
### Added
- Initial release.

[Unreleased]: https://github.com/supernovus/lum.oquery.js/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/supernovus/lum.oquery.js/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/supernovus/lum.oquery.js/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/supernovus/lum.oquery.js/releases/tag/v1.0.0
