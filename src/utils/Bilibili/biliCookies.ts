/**
 * get a cookie using chrome.cookies.get.
 * @param {string} domain url of the cookie, eg bilibili.com
 * @param {string} name name of the cookie, eg SESSIONDATA
 * @returns
 */
export const getCookie = async (domain: string, name: string) =>
  chrome.cookies.get({ url: domain, name });

export const getBiliCookie = async (name = BILICOOKIES.bilijct) =>
  getCookie('https://www.bilibili.com', name);

export const getBiliJct = () => getBiliCookie(BILICOOKIES.bilijct);

export const getBiliSESS = () => getBiliCookie(BILICOOKIES.SESSDATA);

export const cookieHeader = () => undefined;

export enum BILICOOKIES {
  SESSDATA = 'SESSDATA',
  bilijct = 'bili_jct',
}
