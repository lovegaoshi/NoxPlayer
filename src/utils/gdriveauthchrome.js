
var auth_url = 'https://accounts.google.com/o/oauth2/auth?';
var client_id = process.env.CHROMEAPP_CLIENT_ID;  // must be Web Application type
// https://stackoverflow.com/questions/40411493/can-chrome-identity-launchwebauthflow-be-used-to-authenticate-against-google-api
export const auth = () => {
    console.debug(chrome.identity.getRedirectURL());
    var auth_params = {
        client_id: client_id,
        redirect_uri: chrome.identity.getRedirectURL(),
        response_type: 'token',
        scope: 'https://www.googleapis.com/auth/drive.appdata',
        login_hint: 'goodhentai@gmail.com' // fake or non-existent won't work
    };
    const url = new URLSearchParams(Object.entries(auth_params));
    url.toString();
    auth_url += url;
    chrome.identity.launchWebAuthFlow({url: auth_url, interactive: true}, function(responseUrl) { 
        console.log(responseUrl);
    });
}

// https://stackoverflow.com/questions/65625854/how-to-integrate-gapi-in-chrome-extensions-manifest-v3