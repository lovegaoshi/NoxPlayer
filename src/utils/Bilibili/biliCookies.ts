/**
 * get a cookie using chrome.cookies.get.
 * @param {string} domain url of the cookie, eg bilibili.com
 * @param {string} name name of the cookie, eg SESSIONDATA
 * @returns
 */
export const getCookie = async (domain: string, name: string) => {
  return chrome.cookies.get({ url: domain, name });
};
export const getBiliJct = () =>
  getCookie('https://www.bilibili.com', 'bili_jct');
