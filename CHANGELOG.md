# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.42.4] - 2025-08-09

### Fixed

- Fixed issue where `clientUploads: true` was not working when `disablePayloadAccessControl: true` was enabled

## [3.42.3] - 2025-06-13

### Fixed

- **CRITICAL**: Fixed redirect handler logic bug where thumbnails didn't work when `clientUploads: true` was enabled
- Redirect handler now properly works regardless of `clientUploads` setting when `disablePayloadAccessControl: true`

### Added

- Automatic code formatting on commit using Husky pre-commit hooks
- Ensures consistent code style across all contributions

## [3.42.1] - 2025-06-13

### Added

- Cache-Control header support for uploaded files via `cacheControl` configuration option
- Cache-Control headers are applied to both server-side and client-side uploads

## [3.42.0] - 2025-06-13

### Changed

- **BREAKING**: Versioning strategy now matches Payload CMS versions for clearer compatibility
- Updated peer dependencies to reflect minimum supported Payload version
- Version bumped from 1.0.3 to 3.42.0 to align with Payload CMS v3.42.0

### Fixed

- **BREAKING**: Fixed incorrect region mapping in URLs - now uses correct Hetzner endpoints (e.g., `nbg1.your-objectstorage.com`) instead of AWS regions (e.g., `eu-central-1`)
- Fixed "File not found on disk" error when `disablePayloadAccessControl: true` - now properly redirects to direct Hetzner URLs
- Fixed thumbnail URLs to use direct Hetzner URLs when `disablePayloadAccessControl: true`
- Improved file serving logic to prevent fallback to local disk when access control is disabled

## [1.0.3] - 2025-05-11

### Changed

- Update to latest versions

## [1.0.2] - 2025-04-06

### Fixed

- Fix URL
- Version bump

## [1.0.1] - 2025-04-05

### Changed

- Public access

## [1.0.0] - 2025-04-05

### Added

- Initial commit
- Initial stable release
- Support for Hetzner Object Storage with Payload CMS
- Client-side upload capabilities
- Full compatibility with Payload's access control
- Support for custom prefixes per collection
- Built on AWS SDK for S3-compatible API

### Features

- Store media files in Hetzner Object Storage
- Support for all three Hetzner regions (fsn1, nbg1, hel1)
- Image resizing support through Payload
- Configurable ACL settings
- Optional bypass of Payload access control for direct URLs
