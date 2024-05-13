import {
  checkAuthentication,
  noxBackup,
  noxRestore,
} from '@APM/utils/sync/Github';
import { logger } from '@utils/Logger';
import GenericSyncButton, { GenericPropsR } from './GenericSyncButton';

let authToken = '';
const clientId = process.env.GITHUB_KEY;
const clientSecret = process.env.GITHUB_SECRET;
const redirectURI = chrome.identity.getRedirectURL();

export const getAuth = async (
  callback = (_v?: string) => checkAuthentication(authToken).then(console.log),
  errorHandling = logger.error,
) =>
  chrome.identity.launchWebAuthFlow(
    {
      url: `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&scope=repo,user,administration:write`,
      interactive: true,
    },
    async (responseUrl) => {
      if (responseUrl === undefined) {
        errorHandling('no response url returned. auth aborted by user.');
      } else {
        const authCode = new URL(responseUrl).searchParams.get('code');
        const res = await fetch(
          `https://github.com/login/oauth/access_token?code=${authCode}&client_id=${clientId}&redirect_uri=${redirectURI}&client_secret=${clientSecret}
        `,
          { method: 'POST' },
        );
        authToken = new URL(
          `https://foo.com/bar?${await res.text()}`,
        ).searchParams.get('access_token')!;
        callback(responseUrl);
      }
    },
  );

const login = async (
  callback: () => Promise<void> = async () => undefined,
  errorCallback = logger.error,
) => {
  try {
    if (!(await checkAuthentication())) {
      logger.debug('github token expired, need to log in');
      await getAuth(callback, errorCallback);
    } else {
      callback();
    }
    return true;
  } catch (e) {
    logger.warn('github fail');
    errorCallback(e);
    return false;
  }
};

const GiteeSyncButton = ({ restoreFromUint8Array, sx }: GenericPropsR) =>
  GenericSyncButton({
    restoreFromUint8Array,
    noxBackup: (v) => noxBackup(v, authToken),
    noxRestore: () => noxRestore(authToken),
    login,
    sx,
  });

export default GiteeSyncButton;
