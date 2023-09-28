import moment from 'moment';
// FIXME: Moment with Vite not working properly.
// See: https://github.com/moment/moment/issues/5926
// "Hi, moment is working fine, with vite. Unfortunately moment.locale() is not working..."
// "...Instead of import 'moment/locale/cs', use import 'moment/dist/locale/cs'..."
import 'moment/dist/locale/fi';
import 'moment/dist/locale/sv';

export type Locale = 'fi' | 'sv' | 'en';

function setLocale(locale: Locale) {
  moment.locale(locale);
}

export default setLocale;
