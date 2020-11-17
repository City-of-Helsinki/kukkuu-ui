# Change Log

# [Unreleased]

### Added

- More context information to "No matching state found" error

### Changed

- Hide clear all button from languages spoken at home

### Fixed

- Missing ResizeObserver throwing an error on some platforms

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
