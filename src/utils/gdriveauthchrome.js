let authUrl = 'https://accounts.google.com/o/oauth2/auth?';
const clientId = process.env.CHROMEAPP_CLIENT_ID; // must be Web Application type
// https://stackoverflow.com/questions/40411493/can-chrome-identity-launchwebauthflow-be-used-to-authenticate-against-google-api
export default () => {
  console.debug(chrome.identity.getRedirectURL());
  const authParams = {
    clientId,
    redirect_uri: chrome.identity.getRedirectURL(),
    response_type: 'token',
    scope: 'https://www.googleapis.com/auth/drive.appdata',
    login_hint: 'goodhentai@gmail.com', // fake or non-existent won't work
  };
  const url = new URLSearchParams(Object.entries(authParams));
  url.toString();
  authUrl += url;
  chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, (responseUrl) => {
    console.log(responseUrl);
  });
};

// https://stackoverflow.com/questions/65625854/how-to-integrate-gapi-in-chrome-extensions-manifest-v3
