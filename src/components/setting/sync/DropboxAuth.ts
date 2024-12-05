import { DropboxAuth, Dropbox as _Dropbox } from 'dropbox';

import {
  checkAuthentication,
  noxBackup,
  noxRestore,
} from '@APM/utils/sync/Dropbox';
import GenericSyncButton, { GenericPropsR } from './GenericSyncButton';

/**
 * dba is the dropboxauth agent that generates the login url
 * for chrome.identity.launchWebAuthFlow. set DROPBOX_KEY
 * and DROPBOX_SECRET from the created dropbox app in .env
 * to properly initialize dba.
 * make sure that dropbox's accepted URI also contains
 * chrome.identity.getRedirectURL().
 */
const dba = new DropboxAuth({
  clientId: process.env.DROPBOX_KEY,
  clientSecret: process.env.DROPBOX_SECRET,
});

/**
 * dbx is the dropbox API caller. I initialize it without
 * any access token; when a new token is retrieved via dba,
 * set dbx to a new Drobox object with the correct accesstoken.
 */
let dbx = new _Dropbox({
  accessToken: '',
});

/**
 * this method attempts to login dropbox. the accesstoken can be
 * further processed in the callback function as a part of the
 * returned url from chrome.identity.launchWebAuthFlow.
 * @param {function} callback function that process the returned url after oauth2.
 * @param {function} errorHandling
 */
const getAuth = async (
  callback: (v: string) => Promise<void> = () =>
    checkAuthentication(dbx).then(console.debug),
  errorHandling = console.error,
) =>
  chrome.identity.launchWebAuthFlow(
    {
      url: String(
        await dba.getAuthenticationUrl(chrome.identity.getRedirectURL()),
      ),
      interactive: true,
    },
    (responseUrl) => {
      if (responseUrl === undefined) {
        errorHandling('no response url returned. auth aborted by user.');
      } else {
        const urlHash = responseUrl.split('#')[1];
        const params = new URLSearchParams(urlHash);
        dbx = new _Dropbox({
          accessToken: params.get('access_token')!,
        });
        callback(responseUrl);
      }
    },
  );

const loginDropbox = async (
  callback: () => Promise<void> = async () => {},
  errorCallback = console.error,
) => {
  try {
    if (!(await checkAuthentication(dbx))) {
      console.debug('dropbox token expired, need to log in');
      await getAuth(callback, errorCallback);
    } else {
      callback();
    }
    return true;
  } catch (e) {
    errorCallback(e);
    return false;
  }
};

const DropboxSyncButton = ({ restoreFromUint8Array, sx }: GenericPropsR) =>
  GenericSyncButton({
    restoreFromUint8Array,
    noxBackup: (v) => noxBackup(dbx, v),
    noxRestore: () =>
      noxRestore(dbx, async (v) => new Uint8Array(await v.arrayBuffer())),
    login: loginDropbox,
    sx,
  });

export default DropboxSyncButton;
