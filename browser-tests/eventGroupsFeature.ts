import { godchildrenProfilePage, route } from './pages/godchildrenProfilePage';
import { childrenProfilePage } from './pages/childrenProfilePage';
import { eventGroupPage } from './pages/eventGroupPage';
import { eventPage } from './pages/eventPage';
import { login } from './utils/login';

fixture`Event groups feature`.page(route()).beforeEach(async (t) => {
  await login(t);
});

test('As a user I can use event groups to find events', async (t) => {
  // Select first child
  await t.click(godchildrenProfilePage.child(/Hertta Citron/));

  if (process.env['REVIEW'] == '') {
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
    await t
      .expect(eventPage.title.textContent)
      .eql('Test event in browser group');
  }
});
