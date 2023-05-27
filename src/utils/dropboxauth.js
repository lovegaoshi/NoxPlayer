import { DropboxAuth, Dropbox as _Dropbox } from 'dropbox';

const DEFAULT_FILE_NAME = 'nox.noxBackup';
const DEFAULT_FILE_PATH = `/${DEFAULT_FILE_NAME}`;

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
export const getAuth = async (
  callback = () => checkAuthentication().then(console.log),
  errorHandling = console.error,
) => {
  chrome.identity.launchWebAuthFlow(
    {
      url: await dba.getAuthenticationUrl(chrome.identity.getRedirectURL()),
      interactive: true,
    },
    (responseUrl) => {
      if (responseUrl === undefined) {
        errorHandling('no response url returned. auth aborted by user.');
      } else {
        const urlHash = responseUrl.split('#')[1];
        const params = new URLSearchParams(urlHash);
        dbx = new _Dropbox({
          accessToken: params.get('access_token'),
        });
        callback(responseUrl);
      }
    },
  );
};

/**
 * lists the noxplayer setting in dropbox.
 * returns either null if nothing is found, or the path_display of it
 * that can be used to retrieve content.
 * @param {string} query
 * @returns {string}
 */
const find = async (query = DEFAULT_FILE_NAME) => {
  const data = await dbx.filesSearchV2({
    query,
    options: {
      order_by: 'last_modified_time',
    },
  });
  try {
    return data.result.matches[0].metadata.metadata.path_display;
  } catch (e) {
    console.warn(`no ${query} found.`);
    return null;
  }
};

/**
 * upload the noxplayer setting file to dropbox, with the mode
 * overwrite. As a sync function there is no need to keep multiple
 * versions.
 * @param {Object} content
 * @param {string} fpath
 * @returns
 */
const upload = async (content, fpath = DEFAULT_FILE_PATH) => {
  return await dbx.filesUpload({
    path: fpath,
    mode: 'overwrite',
    contents: content,
  });
};
// upload({'new': 'content'}).then(console.log)

/**
 * download the noxplayer setting from dropbox.
 * returns the parsed JSON object or null if not found.
 * @param {string} fpath
 * @returns playerSetting object, or null
 */
const download = async (fpath = DEFAULT_FILE_PATH) => {
  if (fpath === null) {
    return null;
  }
  const downloadedFile = await dbx.filesDownload({ path: fpath });
  const blob = downloadedFile.result.fileBlob.arrayBuffer();
  return new Uint8Array(await blob);
};

/**
 * wraps up find noxplayer setting and download in one function;
 * returns the JSON object of settting or null if not found.
 * @returns playerSetting object, or null
 */
export const noxRestore = async () => {
  const noxFile = await find();
  return await download(noxFile);
};

/**
 * wraps up upload noxplayer setting. returns the response
 * if successful.
 * @param {Object} content
 * @returns
 */
export const noxBackup = async (content) => {
  return await upload(content);
};

const checkAuthentication = async () => {
  try {
    await dbx.usersGetCurrentAccount();
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if dropbox token is valid by performing a simple
 * userGetCurrentAccount API request. if fails, acquire the token
 * again via getAuth. afterwards, the callback function is chained.
 * put noxRestore/noxBackup as callback in this function to ensure
 * user is logged in via dropbox before these operations.
 * @param {function} callback
 * @param {function} errorCallback
 * @returns
 */
export const loginDropbox = async (
  callback = () => {},
  errorCallback = console.error,
) => {
  try {
    if (!(await checkAuthentication())) {
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

// uploadNox({'timestmap': new Date().toString()});
// downloadNox().then(console.log);
// authenticate().then(console.log)
