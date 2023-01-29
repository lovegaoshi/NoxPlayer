import { DropboxAuth, Dropbox as _Dropbox } from 'dropbox';
import _ from 'lodash';

const DEFAULT_FILE_NAME = 'nox.json';
const DEFAULT_FILE_PATH = '/' + DEFAULT_FILE_NAME;

let dba = new DropboxAuth({ 
  clientId: process.env.DROPBOX_KEY,
  clientSecret: process.env.DROPBOX_SECRET, 
});

let dbx = new _Dropbox({
    accessToken: ""
  })

export const getAuth = async (callback = () => checkAuthentication().then(console.log), errorHandling = console.error ) => {
    chrome.identity.launchWebAuthFlow({
        url: await dba.getAuthenticationUrl(chrome.identity.getRedirectURL()),
        interactive: true}, function(responseUrl) { 
          if (responseUrl === undefined) {
            errorHandling('no response url returned. auth aborted by user.');
          } else {
            const urlHash = responseUrl.split('#')[1];
            const params = new URLSearchParams(urlHash);
            dbx= new _Dropbox({
                accessToken: params.get('access_token')
              })
            callback(responseUrl);
          }
    });
}

// dbx.filesListFolder({path: ''}).then(data => console.log(data.result.entries))
const find = async (query = DEFAULT_FILE_NAME) => {
  let data = await dbx.filesSearchV2({
    query,
    options: {
      'order_by': "last_modified_time",
    }
  })
  try {
    return data.result.matches[0].metadata.metadata.path_display;
  }
  catch (e) {
    console.warn( `no ${query} found.`);
    return null;
  }
}
const upload = async (content, fpath = DEFAULT_FILE_PATH) => {
  return await dbx.filesUpload({
    path: fpath,
    mode: 'overwrite',
    contents: JSON.stringify(content),
  })
}
//upload({'new': 'content'}).then(console.log)

const download = async (fpath = DEFAULT_FILE_PATH) => {
  if (fpath === null) {
    return null;
  } 
  let blob = (await dbx.filesDownload({path: fpath})).result.fileBlob.text();
  return JSON.parse(await blob);
}

export const noxRestore = async () => {
  let noxFile = await find();
  return await download(noxFile);
}

export const noxBackup = async (content) => {
  return await upload(content);
}

const checkAuthentication = async () => {
  try {
    await dbx.usersGetCurrentAccount();
    return true;
  } catch (e) {
    return false;
  }
}

export const loginDropbox = async (callback = () => {}, errorCallback = console.error) => {
    try {
        if (!await checkAuthentication()) {
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
}

//uploadNox({'timestmap': new Date().toString()});
//downloadNox().then(console.log);
//authenticate().then(console.log)

