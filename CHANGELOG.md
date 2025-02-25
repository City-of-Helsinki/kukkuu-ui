<!-- DOCTOC SKIP -->

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

## [3.11.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.10.0...kukkuu-ui-v3.11.0) (2025-02-25)


### Features

* Hardcode CMS languages for faster language rendering in header ([1fc343d](https://github.com/City-of-Helsinki/kukkuu-ui/commit/1fc343df1fb06ac1c03a3083548973430cc09c3f))
* Use apollo client local storage cache persister ([c1569f5](https://github.com/City-of-Helsinki/kukkuu-ui/commit/c1569f5e1749a0a29e0849e44785966cc01db6cb))
* Use react-router Link in scope of RHHC ([4635583](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4635583038b38dcd80faac90b09e2559c2556ab0))


### Bug Fixes

* **csp:** Allow cms images ([2806516](https://github.com/City-of-Helsinki/kukkuu-ui/commit/2806516d1e4278a51d8a92ef385a8d29b1565cec))
* **hotreload:** Use eslint-plugin-react-refresh, refactor code to comply ([8cd5d25](https://github.com/City-of-Helsinki/kukkuu-ui/commit/8cd5d25b014b23b0d535bd4fb46b349dc61b6514))
* **sonarcloud:** Conditional render in JSX with {!!x && x}, not {x && x} ([36ce44f](https://github.com/City-of-Helsinki/kukkuu-ui/commit/36ce44f77d68558ee42321bb19aaa44978115e26))
* **sonarcloud:** Fix removeSurroundingSlashes regex & test it works ([143851c](https://github.com/City-of-Helsinki/kukkuu-ui/commit/143851c7daff51ba7916d5e0c097590fdcb167f3))
* **sonarcloud:** Show toast error when onClick navigation promise fails ([4a2ff2f](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4a2ff2f533dc2caa719163b5114115a16e017586))

## [3.10.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.9.0...kukkuu-ui-v3.10.0) (2025-02-06)

### Features

- Add csp meta-tag ([cd13607](https://github.com/City-of-Helsinki/kukkuu-ui/commit/cd13607c02a3a83aaa06e781500946d5ec1d771c))
- Upgrade to Vite 6 & typescript 5.7, move icons & images to /public ([5ce9bec](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5ce9bec62b793b49fa8d2383e510225f4d5537dd))
- Use polling in docker development to enable hot reload ([913a425](https://github.com/City-of-Helsinki/kukkuu-ui/commit/913a42542ce37c5433f16fc4db0cdda942891009))

### Bug Fixes

- "yarn generate:graphql" by using CMS for notification query ([f4caed1](https://github.com/City-of-Helsinki/kukkuu-ui/commit/f4caed1638c8274596e79a64db8e99d761742d0c))
- Add digiaiiris.com to csp ([46fcf7a](https://github.com/City-of-Helsinki/kukkuu-ui/commit/46fcf7a33e15708f6a0c4c6d8099263378a8813a))
- Browser tests in CI/CD pipeline by fixing polling interval/timeout ([10e65f0](https://github.com/City-of-Helsinki/kukkuu-ui/commit/10e65f046d44d93980c9d100b30a3625d9af845b))
- Browser tests, use existing project year 2020 as child's birthyear ([f7b6778](https://github.com/City-of-Helsinki/kukkuu-ui/commit/f7b6778b66e479f17666b5ecdaff83dd16c32309))
- **config:** Admin ui url ([f7acbba](https://github.com/City-of-Helsinki/kukkuu-ui/commit/f7acbba7802f8daf6ae2ea14033354de3d41056d))
- Consistency between pre-commit & non-pre-commit linting ([0d997dd](https://github.com/City-of-Helsinki/kukkuu-ui/commit/0d997dd0482f90266327634a2fd5cd8e9ab1b0c5))
- Dart Sass @import/global built-in function deprecation warnings ([bef6e02](https://github.com/City-of-Helsinki/kukkuu-ui/commit/bef6e02520237982c534bbe4663f756c39f6d2a3))
- Dependabot issue [#140](https://github.com/City-of-Helsinki/kukkuu-ui/issues/140) i.e. cookie &lt;0.7.0 security vulnerability ([0d5dc6b](https://github.com/City-of-Helsinki/kukkuu-ui/commit/0d5dc6b194432474223e5ddfb63c78f27b6aed86))
- Deprecation warning, change react-transition-group → react-toastify ([1b50099](https://github.com/City-of-Helsinki/kukkuu-ui/commit/1b50099fc725464687d5b9543663c4d6251ed048))
- Docker-compose.yml VITE_CMS_URI by //graphql → /graphql ([def2137](https://github.com/City-of-Helsinki/kukkuu-ui/commit/def21377fcb1d38f23600dbe482f521aee0b7a81))
- End time fallback value in zero duration should be the start time ([8ca4a2d](https://github.com/City-of-Helsinki/kukkuu-ui/commit/8ca4a2d2d4e2f02eaf13b44fb609f88d3d394371))
- Hero English description, living in Helsinki rather than born in ([464f084](https://github.com/City-of-Helsinki/kukkuu-ui/commit/464f084f22896352766b9c48c15056ad04e989ca))
- Husky pre-commit run vitest related with lint-staged ([d4f052a](https://github.com/City-of-Helsinki/kukkuu-ui/commit/d4f052a7a9db6bff7c713a2c40d4563e9b573967))
- Lint-staged should use format:code with max-warnings flag ([e05edfe](https://github.com/City-of-Helsinki/kukkuu-ui/commit/e05edfe2bdf7c5023a2108fbe660adf577904b2e))
- **localdev:** Add localhost:_, 127.0.0.1:_ to CSP connect-src ([a374913](https://github.com/City-of-Helsinki/kukkuu-ui/commit/a3749136fa530f7e3a134c747b28bac497e9cb79))
- Mobile navigation ([74c6a9c](https://github.com/City-of-Helsinki/kukkuu-ui/commit/74c6a9c0efa0e3bf667628fc0a4e6de92d95b8d7))
- Mock warning in EditProfileModal.test.tsx by adding mock ([9d3d168](https://github.com/City-of-Helsinki/kukkuu-ui/commit/9d3d168768e413db4ecb37887ee565e532a56682))
- Most warnings in Layout.test.tsx by matching apollo & MSW mocks ([c35da36](https://github.com/City-of-Helsinki/kukkuu-ui/commit/c35da3636969346491c4536855a4af32ff80394d))
- Remove "resolutions" from package.json, update related packages ([af147bb](https://github.com/City-of-Helsinki/kukkuu-ui/commit/af147bb401634f3a447a17b2a4441b97e46dbb5f))
- Sass nested rule deprecation warnings by moving CSS parts ([ac2529e](https://github.com/City-of-Helsinki/kukkuu-ui/commit/ac2529e50de1438184c94285aac7b589e5cf63e8))
- Show "can't enrol" notification also with external ticket systems ([b6710fa](https://github.com/City-of-Helsinki/kukkuu-ui/commit/b6710fa5b78d3f2d7b7ffefa80a033ada942e056))
- Show "can't enrol" notification in EventRedirect component ([60ff390](https://github.com/City-of-Helsinki/kukkuu-ui/commit/60ff390adfde44491b20cb816e08136ffae529a1))
- Some warnings in RegistrationForm.test.tsx ([e04fb68](https://github.com/City-of-Helsinki/kukkuu-ui/commit/e04fb6845c012a3fa8fc0b33cb2cfd521f40348b))
- **time-utils:** Fix all dates and times to Helsinki timezone ([fa344c8](https://github.com/City-of-Helsinki/kukkuu-ui/commit/fa344c879b7391656f122809b901839493f61718))
- Warning in AddNewChildFormModal.test.tsx by using Modal appElement ([f3b0df6](https://github.com/City-of-Helsinki/kukkuu-ui/commit/f3b0df6c6fa38058150526af306b67498d753cbf))
- Warning in EventOccurrence.test.tsx by not spreading `key` property ([47748b9](https://github.com/City-of-Helsinki/kukkuu-ui/commit/47748b9ba6ac33d3d70794b72d6a95efabcd13f6))
- Warnings in Enrol.test.tsx by fixing mocks ([a492e1f](https://github.com/City-of-Helsinki/kukkuu-ui/commit/a492e1fb1dd6b7247664bf88b085439a673b5a4b))
- Warnings in EventIsEnrolled.test.tsx by matching mocks ([e50a856](https://github.com/City-of-Helsinki/kukkuu-ui/commit/e50a85692f7e41d038769c90bfa9104f88f5f2a7))
- Warnings in EventOccurrenceList.test.tsx by using unique IDs ([53757c2](https://github.com/City-of-Helsinki/kukkuu-ui/commit/53757c28a0bb4b6594f2fce05cad4d4e1a7336d2))
- Warnings in ProfileEvents.test.tsx by fixing mocks ([adc875a](https://github.com/City-of-Helsinki/kukkuu-ui/commit/adc875a77af6c36bf5309f94a1fcea927896e0c9))
- Warnings in ProfileEventsList.test.tsx by fixing mocks ([1c608bc](https://github.com/City-of-Helsinki/kukkuu-ui/commit/1c608bcd54e2be314902f508709917912a24005d))

## [3.9.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.8.1...kukkuu-ui-v3.9.0) (2024-11-26)

### Features

- Fix checking if event has any free passwords ([5c42e47](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5c42e47d5d883a15351a44f5ee015fcc218c2a0f))

### Bug Fixes

- "yarn lint" & "yarn typecheck" errors and warnings ([5a8ff91](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5a8ff91217366f9fe894d817482ee4a2d7aa7a9b))
- Env mode improvements ([b17fb64](https://github.com/City-of-Helsinki/kukkuu-ui/commit/b17fb64d810c68fd1c294c8c23b06ced0e07e053))
- Env mode improvements ([45250c5](https://github.com/City-of-Helsinki/kukkuu-ui/commit/45250c5d7a03d0b29578dfed02a495fea9a6d2a5))
- Hds 3.11 upgrade ([9f21c7a](https://github.com/City-of-Helsinki/kukkuu-ui/commit/9f21c7af3babc0d7f748c5043fba6d332f8f4e94))
- Remove console log ([45250c5](https://github.com/City-of-Helsinki/kukkuu-ui/commit/45250c5d7a03d0b29578dfed02a495fea9a6d2a5))

## [3.8.1](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.8.0...kukkuu-ui-v3.8.1) (2024-11-11)

### Bug Fixes

- .env\* files by removing trailing comments that don't work ([08ecc9d](https://github.com/City-of-Helsinki/kukkuu-ui/commit/08ecc9dc72ecfcce21efe74344e83d40ab150af7))
- Languages Українська → Українська мова, Davvisámi → Davvisámegiella ([4eb28fb](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4eb28fbe27e286a2af004cab5f48350f0e8e2598))

## [3.8.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.7.0...kukkuu-ui-v3.8.0) (2024-10-31)

### Features

- Add canonical URL as meta property to the Head ([4483f28](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4483f284cc9016ce33454b6940d04f147612551e))
- Add North Sámi & Ukrainian language PDFs to front page ([dca9c68](https://github.com/City-of-Helsinki/kukkuu-ui/commit/dca9c68319670eca3f326aa0c10ade284dcffd13))
- Add Tixly external ticket system ([7a1de36](https://github.com/City-of-Helsinki/kukkuu-ui/commit/7a1de36ee26beed0cdff6100f7844f3b238048ed))
- Docker compose ([f4f3bb7](https://github.com/City-of-Helsinki/kukkuu-ui/commit/f4f3bb7c22a593b180f529fa04c02410568be755))
- Logout idle user after timeout ([#591](https://github.com/City-of-Helsinki/kukkuu-ui/issues/591)) ([759c997](https://github.com/City-of-Helsinki/kukkuu-ui/commit/759c99723d856efdadf4c408e6f7c564069bd143))

### Bug Fixes

- Emove prefilled birthyear ([#587](https://github.com/City-of-Helsinki/kukkuu-ui/issues/587)) ([4110a64](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4110a644abe59f31f9308aa9b36ad8f3c7e98c7f))
- GenerateTestJwt should use configurated audience by default ([6faa4d8](https://github.com/City-of-Helsinki/kukkuu-ui/commit/6faa4d857bfc42f5c3ba5546dee11bdd87e92441))
- Helsinki profile url env var name ([381c7a3](https://github.com/City-of-Helsinki/kukkuu-ui/commit/381c7a31716d98eea68bdd1a7bc4c87e232dc271))
- Improve PageMeta's Helmet-rendering to include canonical and alternative urls ([0cff0ec](https://github.com/City-of-Helsinki/kukkuu-ui/commit/0cff0ec94c62a67a947729d882a1741c6e6db276))
- Linter ([4c4dda4](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4c4dda4764b210b0759f2e981a059519403b2635))
- Login improvements with hki profile link ([#585](https://github.com/City-of-Helsinki/kukkuu-ui/issues/585)) ([5a5d5b9](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5a5d5b9fa08bb8195afca66dbe3fa16365b80a6d))
- Matomo configuration ([b56cb3e](https://github.com/City-of-Helsinki/kukkuu-ui/commit/b56cb3e8a1ba8e80a534677c25025ee2b40590df))
- Matomo vards to dockerfile ([2c68bc4](https://github.com/City-of-Helsinki/kukkuu-ui/commit/2c68bc4aa2e098d5eb610a1f73a42a1a8566b3cd))
- Navigation render without data fetched ([#590](https://github.com/City-of-Helsinki/kukkuu-ui/issues/590)) ([2aeb7c9](https://github.com/City-of-Helsinki/kukkuu-ui/commit/2aeb7c92e667db6b241114ee32341cfc3d042d28))
- New matomo configuration ([abd41c9](https://github.com/City-of-Helsinki/kukkuu-ui/commit/abd41c9804c057d80b03e90db23023a1507ceb99))
- Page meta of the CMS pages ([13e85b8](https://github.com/City-of-Helsinki/kukkuu-ui/commit/13e85b85d32fcac65198ee7019848b709aecb973))
- Remove needless ngingx rules ([1246de6](https://github.com/City-of-Helsinki/kukkuu-ui/commit/1246de6261aca1711322a906d179fe40123e00e1))
- Upgrade apollo client to fix navigation issues ([2623e5a](https://github.com/City-of-Helsinki/kukkuu-ui/commit/2623e5ae7b11272a7314c76b585cbafc63804728))

## [3.7.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.6.0...kukkuu-ui-v3.7.0) (2024-09-19)

### Features

- Add Sointi Jazz Orchestra logo to the partners' logos ([e0cb139](https://github.com/City-of-Helsinki/kukkuu-ui/commit/e0cb1395d3efaa00ee63f1e13a83caa8fea25afc))

### Bug Fixes

- "Kultuurin" typo with "Kulttuurin" ([4523b98](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4523b980c04977b2991b06a954110c34c1ed179e))

## [3.6.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.5.0...kukkuu-ui-v3.6.0) (2024-09-03)

### Features

- Use new staging CMS url https://kukkuu.app-staging.hkih.hion.dev/ ([23301cb](https://github.com/City-of-Helsinki/kukkuu-ui/commit/23301cb63bbec91c4634906ea0e0b035afb7defa))

### Bug Fixes

- Browser tests ([a1baa74](https://github.com/City-of-Helsinki/kukkuu-ui/commit/a1baa74e436767045f48b0f9ec3db3ea5aad2229))
- Update graphql schema ([7cd0428](https://github.com/City-of-Helsinki/kukkuu-ui/commit/7cd0428693477a1f0bf9a125a510c50310ba0303))

## [3.5.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.4.0...kukkuu-ui-v3.5.0) (2024-07-05)

### Features

- Add required \* and explanation text to Modal & RegistrationForm ([eb985a0](https://github.com/City-of-Helsinki/kukkuu-ui/commit/eb985a0da33f34e5f9f2061ccde4c075486b27f3))

### Bug Fixes

- Make child name optional in child form ([d782481](https://github.com/City-of-Helsinki/kukkuu-ui/commit/d782481a58320348b63037bcdf3ae591ea6d756c))
- Not eligible component external link ([ecbeff9](https://github.com/City-of-Helsinki/kukkuu-ui/commit/ecbeff91a760627f50d6187169a67ee897ddaf96))

## [3.4.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.3.0...kukkuu-ui-v3.4.0) (2024-06-12)

### Features

- Make RegistrationForm's hasAcceptedCommunication checkbox opt-out ([463d33e](https://github.com/City-of-Helsinki/kukkuu-ui/commit/463d33eb0ced35a6ae997c80b7b25e0abd2b8b3f))

### Bug Fixes

- Static routes and footer links ([#571](https://github.com/City-of-Helsinki/kukkuu-ui/issues/571)) ([45994a1](https://github.com/City-of-Helsinki/kukkuu-ui/commit/45994a109058e120e1109e22449fbeddd75bc69e))

## [3.3.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.2.0...kukkuu-ui-v3.3.0) (2024-06-05)

### Features

- Renamed "has accepted marketing" to "has accepted communication" ([87d873d](https://github.com/City-of-Helsinki/kukkuu-ui/commit/87d873d8a620d18e7befdbb0fbfe7bf1ef7f492c))
- Use authorization flow and HDS login handler ([e055eac](https://github.com/City-of-Helsinki/kukkuu-ui/commit/e055eac5d38838225a0de02ac2d50cbd25a96319))

### Bug Fixes

- Add color to hero background when image not given ([d41afb8](https://github.com/City-of-Helsinki/kukkuu-ui/commit/d41afb806aafd6771be11a9f942618d5224c177f))
- Add unauthorized translations ([2d7041f](https://github.com/City-of-Helsinki/kukkuu-ui/commit/2d7041f917a2d1b5a44207dd70e2849414a548a7))
- Body margin removed ([#561](https://github.com/City-of-Helsinki/kukkuu-ui/issues/561)) ([4954c82](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4954c82d31f8eea262826d0a6c6b1d24e9e68778))
- Child enrolment count should update when enrolled or unenrolled ([75e9e5e](https://github.com/City-of-Helsinki/kukkuu-ui/commit/75e9e5e83722f2d34668c450ec605ec8cdc586f1))
- Children list should update from CRUD-operations ([c4a2a36](https://github.com/City-of-Helsinki/kukkuu-ui/commit/c4a2a36b20477916af115f4e98298536c7e4bb18))
- Clear profile from redux when not authenticated ([882604f](https://github.com/City-of-Helsinki/kukkuu-ui/commit/882604f5a5912936ae29cf93aa7474d30dcb88bc))
- Disable editing email field in registration form ([b5df22f](https://github.com/City-of-Helsinki/kukkuu-ui/commit/b5df22fdf451724ddec26f7975aa857cf5f803d8))
- Header and footer (partial) menu localized routing ([#564](https://github.com/City-of-Helsinki/kukkuu-ui/issues/564)) ([e111749](https://github.com/City-of-Helsinki/kukkuu-ui/commit/e111749a83f87b51cf069be55c9efd42c91bea2c))
- Locale route navigate should use the location hash ([1dd7c92](https://github.com/City-of-Helsinki/kukkuu-ui/commit/1dd7c92f5eab6e62dd27a8ec2c7fdcf5cbb4d4a8))
- Md editor and preview force light theme ([#568](https://github.com/City-of-Helsinki/kukkuu-ui/issues/568)) ([c6f94d6](https://github.com/City-of-Helsinki/kukkuu-ui/commit/c6f94d6930a8444a5548e3f761eb8338ac49000b))
- Mobile view should show the back button ([8ec445e](https://github.com/City-of-Helsinki/kukkuu-ui/commit/8ec445e0da056bbee2bfaf98c1bd245e75a54d84))
- Profile fetcher is fully called even in error situations ([7ae9c02](https://github.com/City-of-Helsinki/kukkuu-ui/commit/7ae9c02e175cd26e80dd1b4f63c12c4bb4176fe7))
- Profile page redirects to home when no registrated user ([2951df6](https://github.com/City-of-Helsinki/kukkuu-ui/commit/2951df671902776255d904acf1c2eb58045539a8))
- Profile provider should not reload when tokens are renewed ([012ee06](https://github.com/City-of-Helsinki/kukkuu-ui/commit/012ee069f2845fcaff0a5f87c5d8c5fa85738f76))
- Registration before authentication flow ([5ed3149](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5ed314999edbe865ea4f8e23bfedef57f8a89cda))
- Remove profile from redux persistor ([ea20d8e](https://github.com/City-of-Helsinki/kukkuu-ui/commit/ea20d8e0a5f9766caf0d759d027231e6626e2567))
- Token renewal reloaded page when user had no profile ([6e88a0c](https://github.com/City-of-Helsinki/kukkuu-ui/commit/6e88a0cf4e36b66f4688067b51a5d24d869c1b92))

## [3.2.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.1.1...kukkuu-ui-v3.2.0) (2024-03-27)

### Features

- Add "has accepted marketing" -field to the edit my profile form ([613129b](https://github.com/City-of-Helsinki/kukkuu-ui/commit/613129b5fc8c62aa13395b044f64ab08d09054a8))
- Add a manage subscriptions route to manage marketing subscriptions ([d884053](https://github.com/City-of-Helsinki/kukkuu-ui/commit/d8840536348111d2ea3bfd0952752456e6039164))
- Add the "has accepted marketing checkbox to registration form ([5b1e99b](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5b1e99b0370ba38c51d3b8473188502124229c94))

### Bug Fixes

- Add missing page not found handler for pages under profile-path ([950c669](https://github.com/City-of-Helsinki/kukkuu-ui/commit/950c669b485589e4b5a223896ac3afefb9911703))
- **auth:** Add unauthorized-route for users without login information ([0a8d024](https://github.com/City-of-Helsinki/kukkuu-ui/commit/0a8d024ec3a621f7338ed367e83fba8d03bd382f))
- Kids events search links ([#543](https://github.com/City-of-Helsinki/kukkuu-ui/issues/543)) ([c31d251](https://github.com/City-of-Helsinki/kukkuu-ui/commit/c31d251ed93868ef895f9e21f990c6c5b9a9bbab))
- Show a toast of successfull edit of "my profile" form ([4661e76](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4661e763d49fe9d7f3538001cfee602fde64cd43))
- Verification checkbox of the home preliminary form ([90f19fa](https://github.com/City-of-Helsinki/kukkuu-ui/commit/90f19fa45b8009ab8764044e56997e54282e0cca))

## [3.1.1](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.1.0...kukkuu-ui-v3.1.1) (2024-03-14)

### Bug Fixes

- Correct a compound word ([c3d17dd](https://github.com/City-of-Helsinki/kukkuu-ui/commit/c3d17dd05c74606ce4b4d37781e6ebcce156e098))
- Logos and translations ([#539](https://github.com/City-of-Helsinki/kukkuu-ui/issues/539)) ([7bbc71c](https://github.com/City-of-Helsinki/kukkuu-ui/commit/7bbc71c222f913f86fe3f309e516e87a48ebd99d))
- Text correction on the frontpage ([56f87f5](https://github.com/City-of-Helsinki/kukkuu-ui/commit/56f87f566b66e53457d408e656a4f9ccc6884b32))

## [3.1.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v3.0.0...kukkuu-ui-v3.1.0) (2024-02-29)

### Features

- Send the email update verification token to the new email ([2aea1e2](https://github.com/City-of-Helsinki/kukkuu-ui/commit/2aea1e28f740838a795a939b120b6e9e83ab510a))
- Update my email form ([2244c21](https://github.com/City-of-Helsinki/kukkuu-ui/commit/2244c21ed3a9723ef08ef22caa3252c754c7ef06))
- Verification tokens for an email update ([f9bcdd4](https://github.com/City-of-Helsinki/kukkuu-ui/commit/f9bcdd4cac845eeabf0b8b8a8fbb44191976088d))

### Bug Fixes

- Enrollements count ([#534](https://github.com/City-of-Helsinki/kukkuu-ui/issues/534)) ([8f51b96](https://github.com/City-of-Helsinki/kukkuu-ui/commit/8f51b967e18549a80d32a09820b6fba121ae470f))
- Graphql codegen generated 2 types with same name ([836d9a8](https://github.com/City-of-Helsinki/kukkuu-ui/commit/836d9a8f9e2f0c0e0350359b06c5c700895452d0))
- Helper text in the formik text input component ([9088549](https://github.com/City-of-Helsinki/kukkuu-ui/commit/9088549363ccbcb8cb90d309c04c7ab9946a103b))
- Invite link and notification ([#529](https://github.com/City-of-Helsinki/kukkuu-ui/issues/529)) ([1ca21b5](https://github.com/City-of-Helsinki/kukkuu-ui/commit/1ca21b578a7baf3783af55e6c318b590b300986b))
- Languages focus on load removed ([#527](https://github.com/City-of-Helsinki/kukkuu-ui/issues/527)) ([ac4e5b5](https://github.com/City-of-Helsinki/kukkuu-ui/commit/ac4e5b540e10e4c6e46341de441aca02e6f877c0))
- Removed console log ([#530](https://github.com/City-of-Helsinki/kukkuu-ui/issues/530)) ([d9ff08b](https://github.com/City-of-Helsinki/kukkuu-ui/commit/d9ff08b0fe82e58e277e50e1b6b71a6031a180a7))

## [3.0.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v2.1.1...kukkuu-ui-v3.0.0) (2024-02-01)

### Features

- Children has only 1 name field and birthyear instead of date ([ac5c9ae](https://github.com/City-of-Helsinki/kukkuu-ui/commit/ac5c9ae97a9d3da19dd0bacc29ca2e82bc294403))
- Convert to HDS v3 breakpoints & container widths, not all ([101ca43](https://github.com/City-of-Helsinki/kukkuu-ui/commit/101ca43438413cf7c41e1f6fc2af0219621e2bb7))
- Make UserNavigation use HDS v3 ([fe16447](https://github.com/City-of-Helsinki/kukkuu-ui/commit/fe16447c504ba7d08ad778fb9a9676447ca8e251))
- Use HDS v3 Footer component for footer ([dee4964](https://github.com/City-of-Helsinki/kukkuu-ui/commit/dee4964440155af5932525a1b81a14599ad03bbd))
- Use HDS v3.3.0 release's HDS Favicon kit, remove old favicons ([9c21a58](https://github.com/City-of-Helsinki/kukkuu-ui/commit/9c21a58a45cc013b05c00c15341f232f10f5e847))

### Bug Fixes

- **cookies:** Set cookie domain to hostname (e.g. kummilapset.hel.fi) ([e432eee](https://github.com/City-of-Helsinki/kukkuu-ui/commit/e432eee3d8a657b3a623d223671e9569706f0315))
- Fix delete child button's underline style ([5e93cb0](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5e93cb08b330bc04764a0173a59b0a77092b6b17))
- **header:** Make user dropdown items look more like before HDS v3 ([fa3950c](https://github.com/City-of-Helsinki/kukkuu-ui/commit/fa3950c28b37a51a4c7a42141906dccfe4777a9b))
- Hide header action bar items' labels on mobile (i.e. below small) ([d8377d1](https://github.com/City-of-Helsinki/kukkuu-ui/commit/d8377d15f862a8a2d963372f29be5f75eb401fb2))
- Remove "as unknown as" type unsafe cast, fix useRHHCConfig ([63edab8](https://github.com/City-of-Helsinki/kukkuu-ui/commit/63edab87940c454b5a329955b4ec13361e2417c2))
- Remove unused icons, replace similar icons with HDS v3 icons ([21337d5](https://github.com/City-of-Helsinki/kukkuu-ui/commit/21337d531fbeaee26ab33ede5120e8be74760dfa))
- Running generate:graphql, replace REACT_APP_API_URI -&gt; VITE_API_URI ([4448a65](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4448a65ad9d507f3f33af30ed1a203d648e2de68))
- Update Helsinki partner logo URLs ([5dc58be](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5dc58bedb12dddcf573f312daee4c029207eb89a))
- Update snapshots & fix tests ([5bd0c3e](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5bd0c3ecb8edff1f2061be47385651a4879727fb))
- Update UI to match API child name & birthyear changes (KK-1023) ([#523](https://github.com/City-of-Helsinki/kukkuu-ui/issues/523)) ([22182fe](https://github.com/City-of-Helsinki/kukkuu-ui/commit/22182fe3991057eb6ced9ca8e21521cd1152498d))
- Upgrade to HDS v3.4 & RHHC using it, fix clicking header's buttons ([d1502f1](https://github.com/City-of-Helsinki/kukkuu-ui/commit/d1502f1ec2619d96aa7a1d22a66e4ba9df10e6b4))
- Use official SVG JAES logos from jaes.fi ([591b949](https://github.com/City-of-Helsinki/kukkuu-ui/commit/591b949437adfae801a8828ad75ee25157476686))

### Miscellaneous Chores

- Release 3.0.0 ([91f932f](https://github.com/City-of-Helsinki/kukkuu-ui/commit/91f932fabbea5869e758d9832736e17301622116))

## [2.1.1](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v2.1.0...kukkuu-ui-v2.1.1) (2024-01-05)

### Bug Fixes

- Registration form preferred language type ([0323203](https://github.com/City-of-Helsinki/kukkuu-ui/commit/03232035ad0b978c132ff74b6103e58d07ab42ed))

## [2.1.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v2.0.1...kukkuu-ui-v2.1.0) (2023-12-22)

### Features

- Show "No free ticket system passwords" error & labels ([145e369](https://github.com/City-of-Helsinki/kukkuu-ui/commit/145e3696159fdef2f8ddb27fd52785f70d3ffaaa))

### Bug Fixes

- Fix "yarn generate:graphql" by using graphql-codegen ([4ea1fea](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4ea1fea06e1b34b7825bcfa65036a60db78a27d6))
- Set correct background color behind hero image's lower grey part ([7deecab](https://github.com/City-of-Helsinki/kukkuu-ui/commit/7deecab2b1f16888cddd978aa11a4aeffded56a9))
- Use https instead of http in partner links, fix security warning ([aedceab](https://github.com/City-of-Helsinki/kukkuu-ui/commit/aedceab504a3c79c892c652980a0c14eea4a0d5e))

## [2.0.1](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v2.0.0...kukkuu-ui-v2.0.1) (2023-12-11)

### Bug Fixes

- Front page info links to brochure pdf's ([f429f17](https://github.com/City-of-Helsinki/kukkuu-ui/commit/f429f1786b66f4921b3dfc93e7b6a5af310d66f7))

## [2.0.0](https://github.com/City-of-Helsinki/kukkuu-ui/compare/kukkuu-ui-v1.14.1...kukkuu-ui-v2.0.0) (2023-10-30)

### ⚠ BREAKING CHANGES

- **vite:** replace the CRA with the Vite
- **router:** migrate to router provider
- migrate to react-router v6

### Features

- Cookie consent ([#497](https://github.com/City-of-Helsinki/kukkuu-ui/issues/497)) ([b346a42](https://github.com/City-of-Helsinki/kukkuu-ui/commit/b346a42af4caacf557ae4609722c2d7ae4d535b9))
- Cookie consent page ([#503](https://github.com/City-of-Helsinki/kukkuu-ui/issues/503)) ([1f6f496](https://github.com/City-of-Helsinki/kukkuu-ui/commit/1f6f496e4fde4fd353bf6e82675dfe0b99baad0a))
- **vite:** Replace the CRA with the Vite ([8c130a1](https://github.com/City-of-Helsinki/kukkuu-ui/commit/8c130a12fc59069ffa7b5c6861b82fc9eb1ccf37))

### Bug Fixes

- **cms:** Headless cms page route ([bf9d7b6](https://github.com/City-of-Helsinki/kukkuu-ui/commit/bf9d7b6855f700ca1acc6773e6f1cfe7356c573f))
- **dockerfile:** Development environment launching ([4c67fdd](https://github.com/City-of-Helsinki/kukkuu-ui/commit/4c67fdd557b64563dafe94e70827c2c6458e232c))
- Enrol page cancel url ([9354e58](https://github.com/City-of-Helsinki/kukkuu-ui/commit/9354e5868cc4adcf277fb66181af46ff0e56b6b7))
- Formik dropdown component in mobile view mode ([b5807ba](https://github.com/City-of-Helsinki/kukkuu-ui/commit/b5807ba14a1ecd3216cf37237243eb6acdaeaada))
- Language sync ([e8efc16](https://github.com/City-of-Helsinki/kukkuu-ui/commit/e8efc1641044f51eeb9633d4355c5d67a3aac7bc))
- Linter warnings ([f057331](https://github.com/City-of-Helsinki/kukkuu-ui/commit/f0573313ccb4c5297fec9b9345ec55d1b3a3b2df))
- Linter warnings and errors ([5993199](https://github.com/City-of-Helsinki/kukkuu-ui/commit/5993199ca5f5a4baed33da6a40a8273dce629084))
- Navigation confirm prompt ([be7857e](https://github.com/City-of-Helsinki/kukkuu-ui/commit/be7857e3982b6e479194ebf187fb272d107660f0))
- **navigation:** Language change ([e40d304](https://github.com/City-of-Helsinki/kukkuu-ui/commit/e40d3046d031da5b110eef496288d5a6368e45d3))
- **routes:** React-router can have only route-components as children ([c95f86a](https://github.com/City-of-Helsinki/kukkuu-ui/commit/c95f86a202b2ebcad78b3273219bc3678224b38d))
- Sass-path needs to be absolute in the latest version of sass ([ccf4efa](https://github.com/City-of-Helsinki/kukkuu-ui/commit/ccf4efa5081787df0e5209a7730eb92aae01a6d1))
- **vite:** Linter issues ([a38596a](https://github.com/City-of-Helsinki/kukkuu-ui/commit/a38596aba2977c4ac0a778f5257182d7379b6857))

### Code Refactoring

- Migrate to react-router v6 ([0d08dd1](https://github.com/City-of-Helsinki/kukkuu-ui/commit/0d08dd18e45d06d6c2826ec3de0b5869a5d148c9))
- **router:** Migrate to router provider ([42e8db0](https://github.com/City-of-Helsinki/kukkuu-ui/commit/42e8db0e4f0d85412a8c307b55dc4f1ea578444b))

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
