# Change Log

# 1.13.1

### Updated

- [#481](https://github.com/City-of-Helsinki/kukkuu-ui/pull/481) Update and sync the translations (from the spreadsheet).

# 1.13.0

### Added

- [#470](https://github.com/City-of-Helsinki/kukkuu-ui/pull/470) Add Lippupiste ticket system

# 1.12.0

### Added

- [#466](https://github.com/City-of-Helsinki/kukkuu-ui/pull/466) Support embedded videos in CMS pages. The feature is provided by a new version of React-Helsinki-Headless-Cms -library.

# 1.11.0

### Added

- [#461](https://github.com/City-of-Helsinki/kukkuu-ui/pull/461) Show localized language names in parentheses on main page

# 1.10.2

### Fixed

- [#460](https://github.com/City-of-Helsinki/kukkuu-ui/pull/460) Fix the URL locale handling

# 1.10.1

### Fixed

- [#458](https://github.com/City-of-Helsinki/kukkuu-ui/pull/458) Fix registration page redirect when profile exists

# 1.10.0

### Added

- [#445](https://github.com/City-of-Helsinki/kukkuu-ui/pull/445) Add enrolled Ticketmaster event page

### Changed

- [#443](https://github.com/City-of-Helsinki/kukkuu-ui/pull/443) [#451](https://github.com/City-of-Helsinki/kukkuu-ui/pull/451) Update Azure-pipeline configurations
- [#446](https://github.com/City-of-Helsinki/kukkuu-ui/pull/446) Implement new Ticketmaster password acquring flow
- [#449](https://github.com/City-of-Helsinki/kukkuu-ui/pull/449) Update Ticketmaster texts and translations

### Removed

- [#448](https://github.com/City-of-Helsinki/kukkuu-ui/pull/448) Remove occurrences from unenrolled Ticketmaster event page

# 1.9.3

### Changed

- [#450](https://github.com/City-of-Helsinki/kukkuu-ui/pull/450) Hide enrolment limit

# 1.9.2

### Added

- [#439](https://github.com/City-of-Helsinki/kukkuu-ui/pull/439) Browser tests with github login

### Changed

- [#436](https://github.com/City-of-Helsinki/kukkuu-ui/pull/436) Update rhhc and change link props + updated/refactored default configuration
- [#437](https://github.com/City-of-Helsinki/kukkuu-ui/pull/437) Replace Hurjaruuth's logo with a new one

# 1.9.1

### Fixed

- [#426](https://github.com/City-of-Helsinki/kukkuu-ui/pull/426) Remove unnecessary colon
- [#429](https://github.com/City-of-Helsinki/kukkuu-ui/pull/429) Fix login when using some other language than Finnish

# 1.9.0

### Added

- [#409](https://github.com/City-of-Helsinki/kukkuu-ui/pull/409) The venue address under the venue name
- [#411](https://github.com/City-of-Helsinki/kukkuu-ui/pull/411) The amount of the enrolment are limited by the values set in project. The full program can always be seen
- [#413](https://github.com/City-of-Helsinki/kukkuu-ui/pull/413) Support for defining menu and pages in the CMS
- [#419](https://github.com/City-of-Helsinki/kukkuu-ui/pull/419) Show notifications from the CMS
- [#422](https://github.com/City-of-Helsinki/kukkuu-ui/pull/422) Don't show new event label if child can't enrol into upcoming events.
- [#423](https://github.com/City-of-Helsinki/kukkuu-ui/pull/423) Use new upcomingWithOngoing filter

### Fixed

- [#414](https://github.com/City-of-Helsinki/kukkuu-ui/pull/414) Inaccessible modal content when it overflowed container

### Changed

- Show new event label only when child has upcoming events they cane enrol into

# 1.8.0

### Changed

- [#402](https://github.com/City-of-Helsinki/kukkuu-ui/pull/402) Azure-pipeline configurations
- [#407](https://github.com/City-of-Helsinki/kukkuu-ui/pull/407) Update QR-code content to have a link to the Admin-UI's ticket validation endpoint

### Changed

- Only support the amount of enrolments that's defined for the project
- List upcoming events and event groups even if the child has enrolled in them

# 1.7.0

### Changed

- [#398](https://github.com/City-of-Helsinki/kukkuu-ui/pull/398) Disallow API requests until user is authenticated
- [#398](https://github.com/City-of-Helsinki/kukkuu-ui/pull/398) Use new error codes when checking auth errors

### Fixed

- [#396](https://github.com/City-of-Helsinki/kukkuu-ui/pull/396) Occurrence refetching failing when occurrence did not have an event group

Also [dependencies are updated to the newest possible versions](https://github.com/City-of-Helsinki/kukkuu-ui/pull/397).

# 1.6.9

### Fixed

- [#391](https://github.com/City-of-Helsinki/kukkuu-ui/pull/391) Fixed left arrow buttons

### Removed

- [#392](https://github.com/City-of-Helsinki/kukkuu-ui/pull/392) Removed Ticketmaster notice from past events

# 1.6.8

### Fixed

- [#388](https://github.com/City-of-Helsinki/kukkuu-ui/pull/388) Render newlines in event groups descriptions

# 1.6.7

### Fixed

- [#386](https://github.com/City-of-Helsinki/kukkuu-ui/pull/386) Fix profile refetching after unenrol mutation

# 1.6.6

### Fixed

- [#384](https://github.com/City-of-Helsinki/kukkuu-ui/pull/384) Prevent users from accessing event group reservations when they are already enrolled

# 1.6.5

### Removed

- [#376](https://github.com/City-of-Helsinki/kukkuu-ui/pull/376) Removed corona info

# 1.6.4

### Fixed

- [#370](https://github.com/City-of-Helsinki/kukkuu-ui/pull/370) Fix broken authentication: Users accessing the www prefixed address of the production version of the service will now be redirected to the service address without the www prefix

# 1.6.3

### Added

- [#365](https://github.com/City-of-Helsinki/kukkuu-ui/pull/365) Coronavirus notice to the front page

### Changed

- [#367](https://github.com/City-of-Helsinki/kukkuu-ui/pull/367) Tanssintalo logo

# 1.6.2

### Added

- [#361](https://github.com/City-of-Helsinki/kukkuu-ui/pull/361) Links into partner logos

### Changed

- [#349](https://github.com/City-of-Helsinki/kukkuu-ui/pull/349) Into using a translation sheet that is managed by executive office
- [#350](https://github.com/City-of-Helsinki/kukkuu-ui/pull/350) Adjusted some translations
- [#360](https://github.com/City-of-Helsinki/kukkuu-ui/pull/360) Service description to allow for children born after 2020

### Fixed

- [#354](https://github.com/City-of-Helsinki/kukkuu-ui/pull/354) [Accessibility] Use same text content for screen readers and visual users in child list
- [#357](https://github.com/City-of-Helsinki/kukkuu-ui/pull/357) [Accessibility] Announce title on page changes
- [#356](https://github.com/City-of-Helsinki/kukkuu-ui/pull/356) [Accessibility] Incorrect tab order in occurrence list table
- [#358](https://github.com/City-of-Helsinki/kukkuu-ui/pull/358) Missing Finnish translation
- [#359](https://github.com/City-of-Helsinki/kukkuu-ui/pull/359) [Accessibility] Add contrast to checkbox input tick icon

# 1.6.1

### Changed

- [#341](https://github.com/City-of-Helsinki/kukkuu-ui/pull/341) Use GitHub flow instead of GitFlow

### Fixed

- [#345](https://github.com/City-of-Helsinki/kukkuu-ui/pull/345) Privacy policy link

# 1.6.0

### Added

- [#330](https://github.com/City-of-Helsinki/kukkuu-ui/pull/330) Support for event groups
- [#332](https://github.com/City-of-Helsinki/kukkuu-ui/pull/332) Logo of Kaapeli to the home page

# 1.5.1

### Added

- [#318](https://github.com/City-of-Helsinki/kukkuu-ui/pull/318) More context information to "No matching state found" error
- [#326](https://github.com/City-of-Helsinki/kukkuu-ui/pull/326) Temporary link for giving feedback

### Changed

- [#319](https://github.com/City-of-Helsinki/kukkuu-ui/pull/319) Hide clear all button from languages spoken at home
- [#325](https://github.com/City-of-Helsinki/kukkuu-ui/pull/325) Child forms are no longer validate with browser validation
- [#328](https://github.com/City-of-Helsinki/kukkuu-ui/pull/328) Use GitHub actions instead of Travis

### Fixed

- [#320](https://github.com/City-of-Helsinki/kukkuu-ui/pull/320) Missing ResizeObserver throwing an error on some platforms
- [#324](https://github.com/City-of-Helsinki/kukkuu-ui/pull/324) Profile link being visible on home page when user was not authenticated
- [#329](https://github.com/City-of-Helsinki/kukkuu-ui/pull/329) Broken error styles for some forms
- [#329](https://github.com/City-of-Helsinki/kukkuu-ui/pull/329) Overflowing time picker in event details view
- [#329](https://github.com/City-of-Helsinki/kukkuu-ui/pull/329) Occurrence info visual glitch in occurrence detail page

# 1.5.0

### Added

- [#302](https://github.com/City-of-Helsinki/kukkuu-ui/pull/302) Error handling for child already enrolled error
- [#305](https://github.com/City-of-Helsinki/kukkuu-ui/pull/305) Logo of Finnish National Gallery to the home page
- [#303](https://github.com/City-of-Helsinki/kukkuu-ui/pull/303) Option to subscribe to places once they become available
- [#312](https://github.com/City-of-Helsinki/kukkuu-ui/pull/312) Languages spoken at home field into the interface

### Changed

- [#299](https://github.com/City-of-Helsinki/kukkuu-ui/pull/299) Show no other button than log out for logged in unregistered users
- [#301](https://github.com/City-of-Helsinki/kukkuu-ui/pull/301) Update accessibility statement
- [#304](https://github.com/City-of-Helsinki/kukkuu-ui/pull/304) Show events as upcoming events also for a while after they have started
- [#313](https://github.com/City-of-Helsinki/kukkuu-ui/pull/313) No longer display an error when a user subscribes to notifications for an occurrence they have already subscribed to, instead refresh the page to fetch current most data
- [#313](https://github.com/City-of-Helsinki/kukkuu-ui/pull/313) Display a more specific error message when a user subscribes to notification for an occurrence which has available capacity

### Fixed

- [#299](https://github.com/City-of-Helsinki/kukkuu-ui/pull/299) Redirect to registration for users who don't have a profile yet
- [#307](https://github.com/City-of-Helsinki/kukkuu-ui/pull/307) Postal code validation
- [#308](https://github.com/City-of-Helsinki/kukkuu-ui/pull/308) Crashes on iPhones with iOS version older than 11.3
- [#309](https://github.com/City-of-Helsinki/kukkuu-ui/pull/309) Can not read property year of undefined error
- [#314](https://github.com/City-of-Helsinki/kukkuu-ui/pull/314) User being asked child's birthday twice while registering
- [#315](https://github.com/City-of-Helsinki/kukkuu-ui/pull/315) Back to event selection button not working when accessing the enrolment confirmation page through an invitation link

# 1.4.0

### Fixed

- Child list not showing changes without a refresh

### Changed

- [#289](https://github.com/City-of-Helsinki/kukkuu-ui/pull/289) Event invitation card to only have one link on mobile
- [#289](https://github.com/City-of-Helsinki/kukkuu-ui/pull/289) Event invitation card to list button as its last element

### Fixed

- [#293](https://github.com/City-of-Helsinki/kukkuu-ui/pull/293) Registration form final approval text
- [#291](https://github.com/City-of-Helsinki/kukkuu-ui/pull/291) Provide better accessible name for profile menu
- [#290](https://github.com/City-of-Helsinki/kukkuu-ui/pull/290) Mobile layout for event enrollment
- [#294](https://github.com/City-of-Helsinki/kukkuu-ui/pull/294) Profile view missing children on mobile

# 1.3.1

### Added

- [#285](https://github.com/City-of-Helsinki/kukkuu-ui/pull/285) When users access a child's information that is not attached to their account, they are redirected into a view that asks them to authenticate again

### Changed

- [#284](https://github.com/City-of-Helsinki/kukkuu-ui/pull/284) Use three letter week day abbreviations in English and Swedish

### Fixed

- [#284](https://github.com/City-of-Helsinki/kukkuu-ui/pull/284) Use the same date and time format everywhere with leading zeros removed

# 1.3.0

### Added

- [#279](https://github.com/City-of-Helsinki/kukkuu-ui/pull/279) Enable event participants CHILD_AND_1_OR_2_GUARDIANS choice

### Changed

- [#273](https://github.com/City-of-Helsinki/kukkuu-ui/pull/273) Refactor from our custom form components to HDS
- [#280](https://github.com/City-of-Helsinki/kukkuu-ui/pull/280) Make modal background semi-transparent grey

### Fixed

- [#277](https://github.com/City-of-Helsinki/kukkuu-ui/pull/277) Use Finnish time format
- [#278](https://github.com/City-of-Helsinki/kukkuu-ui/pull/278) Allow also LF as a line break in text content coming from API
- [#281](https://github.com/City-of-Helsinki/kukkuu-ui/pull/281) Fix a TypeScript error on profile page

# 1.2.1

### Fixed

- [#270](https://github.com/City-of-Helsinki/kukkuu-ui/pull/270) Update links to rekisteriseloste/description of the file

# 1.2.0

### Changed

Most notable changes:

- [#267](https://github.com/City-of-Helsinki/kukkuu-ui/pull/267) Improve usability by updating UI texts
- [#264](https://github.com/City-of-Helsinki/kukkuu-ui/pull/264) Add a title to brochure download link with the language translated
- [#266](https://github.com/City-of-Helsinki/kukkuu-ui/pull/266) Refactor the last local colour variables and add koros from HDS

See full list at https://github.com/City-of-Helsinki/kukkuu-ui/milestone/10?closed=1

# 1.1.1

### Known issues

If a user clicks the link in the invitation email after they have signed up, the event page looks like the sign up page. It should just show
information about the event.

### Changed

- [#256](https://github.com/City-of-Helsinki/kukkuu-ui/pull/256) Users can also change the email address when signing up
- [#257](https://github.com/City-of-Helsinki/kukkuu-ui/pull/257) Fix missing focus outline after upgrading HDS

# 1.1.0

Some notable changes:

- Users can now edit their email address
- Accessibility is improved by adding alt texts for icons that convey meaning ([#247](https://github.com/City-of-Helsinki/kukkuu-ui/pull/247) )
- Usability improvement on number fields: Hide confusing arrows

See https://github.com/City-of-Helsinki/kukkuu-ui/milestone/8?closed=1 for the full list of changes and fixes

### Changed

# 1.0.0

### Changed

Some notable changes:

- It should now be possble to sign up for events
- Users should now stay logged in as long as the browser tab is open
- Show a video on the front page
- Add pdf files with information about the project in many languages
- Support for Culture Kids projects coming after 2020
- Use Helsingfors logo in Swedish
- Upgrade all dependencies to their latest version
- Usability improvements with usage of the back button

See https://github.com/City-of-Helsinki/kukkuu-ui/milestone/7?closed=1 for all fixes

# 1.0.0-rc1

See https://github.com/City-of-Helsinki/kukkuu-ui/milestone/6?closed=1

### Fixed

- [#182](https://github.com/City-of-Helsinki/kukkuu-ui/pull/182) Display guardian name and child name same with user's input.
- [#181](https://github.com/City-of-Helsinki/kukkuu-ui/pull/181/) Ensure that login page is in user's chosen language.
- [#175](https://github.com/City-of-Helsinki/kukkuu-ui/pull/175/) Update CRA, node-sass and apollo to latest, fix dependency security warning.

# 0.2.0

### Added

- [#151](https://github.com/City-of-Helsinki/kukkuu-ui/pull/151) Enhance authentication flow, reduce token fetched on every
- [#159](https://github.com/City-of-Helsinki/kukkuu-ui/pull/159) Add child edit information button
- [#160](https://github.com/City-of-Helsinki/kukkuu-ui/pull/160) Edit profile modal & mutation
- [#161](https://github.com/City-of-Helsinki/kukkuu-ui/pull/161) Add edit child modal
- [#162](https://github.com/City-of-Helsinki/kukkuu-ui/pull/162) Add modal and mutation to edit guardian's information
- [#163](https://github.com/City-of-Helsinki/kukkuu-ui/pull/163) Add edit and delete child mutation
- [#167](https://github.com/City-of-Helsinki/kukkuu-ui/pull/167) Add delete prompt when user try to delete child from edit child modal.

### Changed

- [#172](https://github.com/City-of-Helsinki/kukkuu-ui/pull/172) Adjustments for small screens and modal fixes
- [#170](https://github.com/City-of-Helsinki/kukkuu-ui/pull/170) Change the MFA logo
- [#169](https://github.com/City-of-Helsinki/kukkuu-ui/pull/169) Improve analytics
- [#166](https://github.com/City-of-Helsinki/kukkuu-ui/pull/166) Add max-width for pages with text in them, fix footer links
- [#165](https://github.com/City-of-Helsinki/kukkuu-ui/pull/165) Profile adjustments: Use adult icon and smaller header
- [#164](https://github.com/City-of-Helsinki/kukkuu-ui/pull/164) Add Dot and remove Oodi as partners, shrink svg icons
- [#151](https://github.com/City-of-Helsinki/kukkuu-ui/pull/151) Enhance authentication flow, reduce token fetched on every route changes.

### Fixed

- [#158](https://github.com/City-of-Helsinki/kukkuu-ui/pull/158) Add production NODE_ENV to Travis CI to equivalent with Docker infra build
- [#151](https://github.com/City-of-Helsinki/kukkuu-ui/pull/151) Enhance authentication flow, reduce token fetched on every route changes.

## [3.5.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.4.0...kukkuu-ui-v3.5.0) (2024-07-05)


### Features

* Add required * and explanation text to Modal & RegistrationForm ([eb985a0](https://github.com/City-of-Helsinki/kukkuu-ui/commit/eb985a0da33f34e5f9f2061ccde4c075486b27f3))


### Bug Fixes

* Make child name optional in child form ([d782481](https://github.com/City-of-Helsinki/kukkuu-ui/commit/d782481a58320348b63037bcdf3ae591ea6d756c))
* Not eligible component external link ([ecbeff9](https://github.com/City-of-Helsinki/kukkuu-ui/commit/ecbeff91a760627f50d6187169a67ee897ddaf96))

## [3.4.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.3.0...kukkuu-ui-v3.4.0) (2024-06-12)


### Features

* Make RegistrationForm's hasAcceptedCommunication checkbox opt-out ([463d33e](https://github.com/City-of-Helsinki/kukkuu-ui/commit/463d33eb0ced35a6ae997c80b7b25e0abd2b8b3f))


### Bug Fixes

* Static routes and footer links ([#571](https://github.com/City-of-Helsinki/kukkuu-ui/issues/571)) ([45994a1](https://github.com/City-of-Helsinki/kukkuu-ui/commit/45994a109058e120e1109e22449fbeddd75bc69e))

## [3.3.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.2.0...kukkuu-ui-v3.3.0) (2024-06-05)


### Features

* Renamed "has accepted marketing" to "has accepted communication" ([87d873d](https://github.com/City-of-Helsinki/kukkuu-ui/commit/87d873d8a620d18e7befdbb0fbfe7bf1ef7f492c))
* Use authorization flow and HDS login handler ([e055eac](https://github.com/City-of-Helsinki/kukkuu-ui/commit/e055eac5d38838225a0de02ac2d50cbd25a96319))


### Bug Fixes

* Add color to hero background when image not given ([d41afb8](https://github.com/City-of-Helsinki/kukkuu-ui/commit/d41afb806aafd6771be11a9f942618d5224c177f))
* Add unauthorized translations ([2d7041f](https://github.com/City-of-Helsinki/kukkuu-ui/commit/2d7041f917a2d1b5a44207dd70e2849414a548a7))
* Body margin removed ([#561](https://github.com/City-of-Helsinki/kukkuu-ui/issues/561)) ([4954c82](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4954c82d31f8eea262826d0a6c6b1d24e9e68778))
* Child enrolment count should update when enrolled or unenrolled ([75e9e5e](https://github.com/City-of-Helsinki/kukkuu-ui/commit/75e9e5e83722f2d34668c450ec605ec8cdc586f1))
* Children list should update from CRUD-operations ([c4a2a36](https://github.com/City-of-Helsinki/kukkuu-ui/commit/c4a2a36b20477916af115f4e98298536c7e4bb18))
* Clear profile from redux when not authenticated ([882604f](https://github.com/City-of-Helsinki/kukkuu-ui/commit/882604f5a5912936ae29cf93aa7474d30dcb88bc))
* Disable editing email field in registration form ([b5df22f](https://github.com/City-of-Helsinki/kukkuu-ui/commit/b5df22fdf451724ddec26f7975aa857cf5f803d8))
* Header and footer (partial) menu localized routing ([#564](https://github.com/City-of-Helsinki/kukkuu-ui/issues/564)) ([e111749](https://github.com/City-of-Helsinki/kukkuu-ui/commit/e111749a83f87b51cf069be55c9efd42c91bea2c))
* Locale route navigate should use the location hash ([1dd7c92](https://github.com/City-of-Helsinki/kukkuu-ui/commit/1dd7c92f5eab6e62dd27a8ec2c7fdcf5cbb4d4a8))
* Md editor and preview force light theme ([#568](https://github.com/City-of-Helsinki/kukkuu-ui/issues/568)) ([c6f94d6](https://github.com/City-of-Helsinki/kukkuu-ui/commit/c6f94d6930a8444a5548e3f761eb8338ac49000b))
* Mobile view should show the back button ([8ec445e](https://github.com/City-of-Helsinki/kukkuu-ui/commit/8ec445e0da056bbee2bfaf98c1bd245e75a54d84))
* Profile fetcher is fully called even in error situations ([7ae9c02](https://github.com/City-of-Helsinki/kukkuu-ui/commit/7ae9c02e175cd26e80dd1b4f63c12c4bb4176fe7))
* Profile page redirects to home when no registrated user ([2951df6](https://github.com/City-of-Helsinki/kukkuu-ui/commit/2951df671902776255d904acf1c2eb58045539a8))
* Profile provider should not reload when tokens are renewed ([012ee06](https://github.com/City-of-Helsinki/kukkuu-ui/commit/012ee069f2845fcaff0a5f87c5d8c5fa85738f76))
* Registration before authentication flow ([5ed3149](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5ed314999edbe865ea4f8e23bfedef57f8a89cda))
* Remove profile from redux persistor ([ea20d8e](https://github.com/City-of-Helsinki/kukkuu-ui/commit/ea20d8e0a5f9766caf0d759d027231e6626e2567))
* Token renewal reloaded page when user had no profile ([6e88a0c](https://github.com/City-of-Helsinki/kukkuu-ui/commit/6e88a0cf4e36b66f4688067b51a5d24d869c1b92))

## [3.2.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.1.1...kukkuu-ui-v3.2.0) (2024-03-27)


### Features

* Add "has accepted marketing" -field to the edit my profile form ([613129b](https://github.com/City-of-Helsinki/kukkuu-ui/commit/613129b5fc8c62aa13395b044f64ab08d09054a8))
* Add a manage subscriptions route to manage marketing subscriptions ([d884053](https://github.com/City-of-Helsinki/kukkuu-ui/commit/d8840536348111d2ea3bfd0952752456e6039164))
* Add the "has accepted marketing checkbox to registration form ([5b1e99b](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5b1e99b0370ba38c51d3b8473188502124229c94))


### Bug Fixes

* Add missing page not found handler for pages under profile-path ([950c669](https://github.com/City-of-Helsinki/kukkuu-ui/commit/950c669b485589e4b5a223896ac3afefb9911703))
* **auth:** Add unauthorized-route for users without login information ([0a8d024](https://github.com/City-of-Helsinki/kukkuu-ui/commit/0a8d024ec3a621f7338ed367e83fba8d03bd382f))
* Kids events search links ([#543](https://github.com/City-of-Helsinki/kukkuu-ui/issues/543)) ([c31d251](https://github.com/City-of-Helsinki/kukkuu-ui/commit/c31d251ed93868ef895f9e21f990c6c5b9a9bbab))
* Show a toast of successfull edit of "my profile" form ([4661e76](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4661e763d49fe9d7f3538001cfee602fde64cd43))
* Verification checkbox of the home preliminary form ([90f19fa](https://github.com/City-of-Helsinki/kukkuu-ui/commit/90f19fa45b8009ab8764044e56997e54282e0cca))

## [3.1.1](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.1.0...kukkuu-ui-v3.1.1) (2024-03-14)


### Bug Fixes

* Correct a compound word ([c3d17dd](https://github.com/City-of-Helsinki/kukkuu-ui/commit/c3d17dd05c74606ce4b4d37781e6ebcce156e098))
* Logos and translations ([#539](https://github.com/City-of-Helsinki/kukkuu-ui/issues/539)) ([7bbc71c](https://github.com/City-of-Helsinki/kukkuu-ui/commit/7bbc71c222f913f86fe3f309e516e87a48ebd99d))
* Text correction on the frontpage ([56f87f5](https://github.com/City-of-Helsinki/kukkuu-ui/commit/56f87f566b66e53457d408e656a4f9ccc6884b32))

## [3.1.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.0.0...kukkuu-ui-v3.1.0) (2024-02-29)


### Features

* Send the email update verification token to the new email ([2aea1e2](https://github.com/City-of-Helsinki/kukkuu-ui/commit/2aea1e28f740838a795a939b120b6e9e83ab510a))
* Update my email form ([2244c21](https://github.com/City-of-Helsinki/kukkuu-ui/commit/2244c21ed3a9723ef08ef22caa3252c754c7ef06))
* Verification tokens for an email update ([f9bcdd4](https://github.com/City-of-Helsinki/kukkuu-ui/commit/f9bcdd4cac845eeabf0b8b8a8fbb44191976088d))


### Bug Fixes

* Enrollements count ([#534](https://github.com/City-of-Helsinki/kukkuu-ui/issues/534)) ([8f51b96](https://github.com/City-of-Helsinki/kukkuu-ui/commit/8f51b967e18549a80d32a09820b6fba121ae470f))
* Graphql codegen generated 2 types with same name ([836d9a8](https://github.com/City-of-Helsinki/kukkuu-ui/commit/836d9a8f9e2f0c0e0350359b06c5c700895452d0))
* Helper text in the formik text input component ([9088549](https://github.com/City-of-Helsinki/kukkuu-ui/commit/9088549363ccbcb8cb90d309c04c7ab9946a103b))
* Invite link and notification ([#529](https://github.com/City-of-Helsinki/kukkuu-ui/issues/529)) ([1ca21b5](https://github.com/City-of-Helsinki/kukkuu-ui/commit/1ca21b578a7baf3783af55e6c318b590b300986b))
* Languages focus on load removed ([#527](https://github.com/City-of-Helsinki/kukkuu-ui/issues/527)) ([ac4e5b5](https://github.com/City-of-Helsinki/kukkuu-ui/commit/ac4e5b540e10e4c6e46341de441aca02e6f877c0))
* Removed console log ([#530](https://github.com/City-of-Helsinki/kukkuu-ui/issues/530)) ([d9ff08b](https://github.com/City-of-Helsinki/kukkuu-ui/commit/d9ff08b0fe82e58e277e50e1b6b71a6031a180a7))

## [3.0.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v2.1.1...kukkuu-ui-v3.0.0) (2024-02-01)


### Features

* Children has only 1 name field and birthyear instead of date ([ac5c9ae](https://github.com/City-of-Helsinki/kukkuu-ui/commit/ac5c9ae97a9d3da19dd0bacc29ca2e82bc294403))
* Convert to HDS v3 breakpoints & container widths, not all ([101ca43](https://github.com/City-of-Helsinki/kukkuu-ui/commit/101ca43438413cf7c41e1f6fc2af0219621e2bb7))
* Make UserNavigation use HDS v3 ([fe16447](https://github.com/City-of-Helsinki/kukkuu-ui/commit/fe16447c504ba7d08ad778fb9a9676447ca8e251))
* Use HDS v3 Footer component for footer ([dee4964](https://github.com/City-of-Helsinki/kukkuu-ui/commit/dee4964440155af5932525a1b81a14599ad03bbd))
* Use HDS v3.3.0 release's HDS Favicon kit, remove old favicons ([9c21a58](https://github.com/City-of-Helsinki/kukkuu-ui/commit/9c21a58a45cc013b05c00c15341f232f10f5e847))


### Bug Fixes

* **cookies:** Set cookie domain to hostname (e.g. kummilapset.hel.fi) ([e432eee](https://github.com/City-of-Helsinki/kukkuu-ui/commit/e432eee3d8a657b3a623d223671e9569706f0315))
* Fix delete child button's underline style ([5e93cb0](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5e93cb08b330bc04764a0173a59b0a77092b6b17))
* **header:** Make user dropdown items look more like before HDS v3 ([fa3950c](https://github.com/City-of-Helsinki/kukkuu-ui/commit/fa3950c28b37a51a4c7a42141906dccfe4777a9b))
* Hide header action bar items' labels on mobile (i.e. below small) ([d8377d1](https://github.com/City-of-Helsinki/kukkuu-ui/commit/d8377d15f862a8a2d963372f29be5f75eb401fb2))
* Remove "as unknown as" type unsafe cast, fix useRHHCConfig ([63edab8](https://github.com/City-of-Helsinki/kukkuu-ui/commit/63edab87940c454b5a329955b4ec13361e2417c2))
* Remove unused icons, replace similar icons with HDS v3 icons ([21337d5](https://github.com/City-of-Helsinki/kukkuu-ui/commit/21337d531fbeaee26ab33ede5120e8be74760dfa))
* Running generate:graphql, replace REACT_APP_API_URI -&gt; VITE_API_URI ([4448a65](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4448a65ad9d507f3f33af30ed1a203d648e2de68))
* Update Helsinki partner logo URLs ([5dc58be](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5dc58bedb12dddcf573f312daee4c029207eb89a))
* Update snapshots & fix tests ([5bd0c3e](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5bd0c3ecb8edff1f2061be47385651a4879727fb))
* Update UI to match API child name & birthyear changes (KK-1023) ([#523](https://github.com/City-of-Helsinki/kukkuu-ui/issues/523)) ([22182fe](https://github.com/City-of-Helsinki/kukkuu-ui/commit/22182fe3991057eb6ced9ca8e21521cd1152498d))
* Upgrade to HDS v3.4 & RHHC using it, fix clicking header's buttons ([d1502f1](https://github.com/City-of-Helsinki/kukkuu-ui/commit/d1502f1ec2619d96aa7a1d22a66e4ba9df10e6b4))
* Use official SVG JAES logos from jaes.fi ([591b949](https://github.com/City-of-Helsinki/kukkuu-ui/commit/591b949437adfae801a8828ad75ee25157476686))


### Miscellaneous Chores

* Release 3.0.0 ([91f932f](https://github.com/City-of-Helsinki/kukkuu-ui/commit/91f932fabbea5869e758d9832736e17301622116))

## [2.1.1](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v2.1.0...kukkuu-ui-v2.1.1) (2024-01-05)


### Bug Fixes

* Registration form preferred language type ([0323203](https://github.com/City-of-Helsinki/kukkuu-ui/commit/03232035ad0b978c132ff74b6103e58d07ab42ed))

## [2.1.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v2.0.1...kukkuu-ui-v2.1.0) (2023-12-22)


### Features

* Show "No free ticket system passwords" error & labels ([145e369](https://github.com/City-of-Helsinki/kukkuu-ui/commit/145e3696159fdef2f8ddb27fd52785f70d3ffaaa))


### Bug Fixes

* Fix "yarn generate:graphql" by using graphql-codegen ([4ea1fea](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4ea1fea06e1b34b7825bcfa65036a60db78a27d6))
* Set correct background color behind hero image's lower grey part ([7deecab](https://github.com/City-of-Helsinki/kukkuu-ui/commit/7deecab2b1f16888cddd978aa11a4aeffded56a9))
* Use https instead of http in partner links, fix security warning ([aedceab](https://github.com/City-of-Helsinki/kukkuu-ui/commit/aedceab504a3c79c892c652980a0c14eea4a0d5e))

## [2.0.1](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v2.0.0...kukkuu-ui-v2.0.1) (2023-12-11)


### Bug Fixes

* Front page info links to brochure pdf's ([f429f17](https://github.com/City-of-Helsinki/kukkuu-ui/commit/f429f1786b66f4921b3dfc93e7b6a5af310d66f7))

## [2.0.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v1.14.1...kukkuu-ui-v2.0.0) (2023-10-30)


### ⚠ BREAKING CHANGES

* **vite:** replace the CRA with the Vite
* **router:** migrate to router provider
* migrate to react-router v6

### Features

* Cookie consent ([#497](https://github.com/City-of-Helsinki/kukkuu-ui/issues/497)) ([b346a42](https://github.com/City-of-Helsinki/kukkuu-ui/commit/b346a42af4caacf557ae4609722c2d7ae4d535b9))
* Cookie consent page ([#503](https://github.com/City-of-Helsinki/kukkuu-ui/issues/503)) ([1f6f496](https://github.com/City-of-Helsinki/kukkuu-ui/commit/1f6f496e4fde4fd353bf6e82675dfe0b99baad0a))
* **vite:** Replace the CRA with the Vite ([8c130a1](https://github.com/City-of-Helsinki/kukkuu-ui/commit/8c130a12fc59069ffa7b5c6861b82fc9eb1ccf37))


### Bug Fixes

* **cms:** Headless cms page route ([bf9d7b6](https://github.com/City-of-Helsinki/kukkuu-ui/commit/bf9d7b6855f700ca1acc6773e6f1cfe7356c573f))
* **dockerfile:** Development environment launching ([4c67fdd](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4c67fdd557b64563dafe94e70827c2c6458e232c))
* Enrol page cancel url ([9354e58](https://github.com/City-of-Helsinki/kukkuu-ui/commit/9354e5868cc4adcf277fb66181af46ff0e56b6b7))
* Formik dropdown component in mobile view mode ([b5807ba](https://github.com/City-of-Helsinki/kukkuu-ui/commit/b5807ba14a1ecd3216cf37237243eb6acdaeaada))
* Language sync ([e8efc16](https://github.com/City-of-Helsinki/kukkuu-ui/commit/e8efc1641044f51eeb9633d4355c5d67a3aac7bc))
* Linter warnings ([f057331](https://github.com/City-of-Helsinki/kukkuu-ui/commit/f0573313ccb4c5297fec9b9345ec55d1b3a3b2df))
* Linter warnings and errors ([5993199](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5993199ca5f5a4baed33da6a40a8273dce629084))
* Navigation confirm prompt ([be7857e](https://github.com/City-of-Helsinki/kukkuu-ui/commit/be7857e3982b6e479194ebf187fb272d107660f0))
* **navigation:** Language change ([e40d304](https://github.com/City-of-Helsinki/kukkuu-ui/commit/e40d3046d031da5b110eef496288d5a6368e45d3))
* **routes:** React-router can have only route-components as children ([c95f86a](https://github.com/City-of-Helsinki/kukkuu-ui/commit/c95f86a202b2ebcad78b3273219bc3678224b38d))
* Sass-path needs to be absolute in the latest version of sass ([ccf4efa](https://github.com/City-of-Helsinki/kukkuu-ui/commit/ccf4efa5081787df0e5209a7730eb92aae01a6d1))
* **vite:** Linter issues ([a38596a](https://github.com/City-of-Helsinki/kukkuu-ui/commit/a38596aba2977c4ac0a778f5257182d7379b6857))


### Code Refactoring

* Migrate to react-router v6 ([0d08dd1](https://github.com/City-of-Helsinki/kukkuu-ui/commit/0d08dd18e45d06d6c2826ec3de0b5869a5d148c9))
* **router:** Migrate to router provider ([42e8db0](https://github.com/City-of-Helsinki/kukkuu-ui/commit/42e8db0e4f0d85412a8c307b55dc4f1ea578444b))

## [1.14.1](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v1.14.0...kukkuu-ui-v1.14.1) (2023-08-31)

### Bug Fixes

- **dockerfile:** Add VITE_ADMIN_TICKET_VALIDATION_URL argument ([7642b17](https://github.com/City-of-Helsinki/kukkuu-ui/commit/7642b17eeae2226df085b29774b26b32789a65e4))

## [1.14.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v1.13.1...kukkuu-ui-v1.14.0) (2023-08-31)

### Features

- **logos:** Add Tiedemuseo Liekki & update Hotelli- ja ravintolamuseo ([4d4bfee](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4d4bfeea410419598b14643d7e13445df79484d2))

### Bug Fixes

- Dockerfile base on ubi image DEVOPS-560 ([#486](https://github.com/City-of-Helsinki/kukkuu-ui/issues/486)) ([d9b119b](https://github.com/City-of-Helsinki/kukkuu-ui/commit/d9b119be6ef8a64c18aeed3a2b593222de11fbea))

## 0.1.2 (February 6th, 2020)

Special thanks to [@hugovk](https://github.com/hugovk) for the first contributions from outside our team!

### Added

- [#154](https://github.com/City-of-Helsinki/kukkuu-ui/pull/154) Add usage analytics (Matomo)

### Changed

- [#153](https://github.com/City-of-Helsinki/kukkuu-ui/pull/153) Use fully qualified url for og:image and twitter:image
- [#145](https://github.com/City-of-Helsinki/kukkuu-ui/pull/145) Sudo is no longer required in Travis
- [#150](https://github.com/City-of-Helsinki/kukkuu-ui/pull/150) Submit button should always be clickable
- [#143](https://github.com/City-of-Helsinki/kukkuu-ui/pull/143) Simplify and improve English translation

### Fixed

- [#139](https://github.com/City-of-Helsinki/kukkuu-ui/pull/139) Prevent horizontal scrolling/overflow on mobile
- [#154](https://github.com/City-of-Helsinki/kukkuu-ui/pull/154) Accessibility issue with dropdown menu

## 0.1.1 (January 29th, 2020)

### Changed

- [#135](https://github.com/City-of-Helsinki/kukkuu-ui/pull/135) Reduce download size by running logo pngs through TinyPNG
- [#137](https://github.com/City-of-Helsinki/kukkuu-ui/pull/137) Ensure that users with profile cannot register again

## 0.1.0 (January 29th, 2020)

- Initial public release
- Users can sign their children up for the service
