import { godchildrenProfilePage, route } from './pages/godchildrenProfilePage';
import { childrenProfilePage } from './pages/childrenProfilePage';
import { eventGroupPage } from './pages/eventGroupPage';
import { eventPage } from './pages/eventPage';
import {
  AuthServiceRequestInterceptor,
  KukkuuApiTestJwtBearerAuthorization,
} from './utils/jwt/mocks/testJWTAuthRequests';
import { browserTestUser } from './utils/jwt/users';
import { authorizedGuardian } from './userRoles';

fixture`Event groups feature`
  .requestHooks([
    // Use AuthServiceRequestInterceptor to mock Keycloak out.
    new AuthServiceRequestInterceptor(browserTestUser),
    // Use KukkuuApiTestJwtBearerAuthorization to add auth header to every API request.
    new KukkuuApiTestJwtBearerAuthorization(browserTestUser),
  ])
  .beforeEach(async (t) => {
    // Use authorizedGuardian guardian role to populate session storage
    await t.useRole(authorizedGuardian).navigateTo(route());
  });

// Skipepd because we cannot be sure that there is an event.
test.skip('As a user I can use event groups to find events', async (t) => {
  // Select first child
  await t.click(godchildrenProfilePage.child(/Hertta Citron/));

  // Expect to see event group invitations
  await t.expect(childrenProfilePage.selectEventGroupButtons.count).gt(0);

  // Select first event group
  await t.click(childrenProfilePage.selectEventGroupButtons.nth(0));

  // Check that title and events are listed
  await t.expect(eventGroupPage.title.exists).ok();
  await t.expect(eventGroupPage.selectEventButtons.count).gt(0);

  // Select first event
  await t.click(eventGroupPage.selectEventButtons.nth(0));

  // Expect its name to be a hardcoded value
  await t.expect(eventPage.title.textContent).contains('Test event');
});
