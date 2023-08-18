import { login } from './utils/login';
import { tunnistamoUserAccesses } from './api/userTunnistamo';
import {
  route,
} from './pages/godchildrenProfilePage';

fixture`Api access feature`
  .page(route())
  .beforeEach(async (t) => {
    await login(t);
  });


test('Ensure tunnistamo user has accesses', async (t) => {
  await tunnistamoUserAccesses(t);
});
