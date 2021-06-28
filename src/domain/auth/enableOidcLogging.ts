import Oidc from 'oidc-client';

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  Oidc.Log.logger = console;
}
