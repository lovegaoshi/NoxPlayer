/**
 * get a cookie using chrome.cookies.get.
 * @param {string} domain url of the cookie, eg bilibili.com
 * @param {string} name name of the cookie, eg SESSIONDATA
 * @returns
 */
export const getCookie = async (domain: string, name: string) =>
  chrome.cookies.get({ url: domain, name });

export const getBiliCookie = async (name = 'bili_jct') =>
  getCookie('https://www.bilibili.com', name);

export const getBiliJct = () => getBiliCookie('bili_jct');

export const getBiliSESS = () => getBiliCookie('SESSDATA');

export const cookieHeader = () => undefined;
