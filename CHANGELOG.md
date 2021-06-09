# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2021-06-10

### Added

- ReadMe.md
- License based on MIT License
- Add `localhost` to Django Production `ALLOW_HOSTS` list
- Add username field to jwt token and get username by parse token
- `GameConsumer` check event permission
- React.js Frontend Project
- Docker-compose dev/prod/ci settings
- additional text to guide user to signup/login page

### Changed

- Fix django account can't delete because of `outstanding token` delete permission
- Fix Game page title room name `undefined`
- Fix bystander can view one of player handcards
- Adjust docker-compose dev/prod/ci settings
- Fix frontend `access_token` not exist error handling
- Fix frontend `GameSwitch`  & ` AccountSwitch` not handle 404
- Adjust footer to stick on bottom
- Adjust GamePlaying Page layout
- Change django time-zone and language
- Unify card name and so on

### Removed

- Frontend Code console log for debug
- Backend Code unused comment

## [1.0.0] - 2021-05-28
### Added
- Finished Saboteur Game Website
- Django Backend Project
- React.js Frontend Project
- Docker-compose dev/prod/ci settings
