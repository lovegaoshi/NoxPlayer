import {
  checkAuthentication,
  noxBackup,
  noxRestore,
} from '@APM/utils/sync/Gitee';
import { logger } from '@utils/Logger';
import GenericSyncButton, { GenericPropsR } from './GenericSyncButton';

let authToken = '';
const clientId = process.env.GITEE_KEY;
const clientSecret = process.env.GITEE_SECRET;
const redirectURI = chrome.identity.getRedirectURL();

export const getAuth = async (
  callback = (_v?: string) => checkAuthentication(authToken).then(console.log),
  errorHandling = logger.error,
) =>
  chrome.identity.launchWebAuthFlow(
    {
      url: `https://gitee.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&response_type=code`,
      interactive: true,
    },
    async (responseUrl) => {
      if (responseUrl === undefined) {
        errorHandling('no response url returned. auth aborted by user.');
      } else {
        const authCode = new URL(responseUrl).searchParams.get('code');
        const res = await fetch(
          `https://gitee.com/oauth/token?grant_type=authorization_code&code=${authCode}&client_id=${clientId}&redirect_uri=${redirectURI}&client_secret=${clientSecret}
        `,
          { method: 'POST' },
        );
        const json = await res.json();
        authToken = json.access_token;
        callback(responseUrl);
      }
    },
  );

const loginGitee = async (
  callback: () => Promise<void> = async () => undefined,
  errorCallback = logger.error,
) => {
  try {
    if (!(await checkAuthentication())) {
      logger.debug('gitee token expired, need to log in');
      await getAuth(callback, errorCallback);
    } else {
      callback();
    }
    return true;
  } catch (e) {
    logger.warn('gitee fail');
    errorCallback(e);
    return false;
  }
};

const GiteeSyncButton = ({ restoreFromUint8Array, sx }: GenericPropsR) =>
  GenericSyncButton({
    restoreFromUint8Array,
    noxBackup: (v) => noxBackup(v, authToken),
    noxRestore: () => noxRestore(authToken),
    login: loginGitee,
    sx,
  });

export default GiteeSyncButton;
