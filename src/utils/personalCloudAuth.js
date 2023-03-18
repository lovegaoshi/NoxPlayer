/**
 * to set up a personal cloud, make the following API available:
 * 
 * /download/{userid/authentication}: used to retrieve backed up json objects.
 * /upload: used to backup json objects. this method sends 3 keys:
 * 1. userid -> an identifier (username from your bilibili account) 
 * 2. json_obj -> the actual player setting
 * 3. secret_key -> this app's secret key.
 * for your personal cloud, set an if that restricts only your userid is accepted.
 * check out the fastAPI docker I set up to your router/NAS/VPS to get started.
 * 
 */
import { getPlayerSettingKey } from '../objects/Storage';

/**
 * a simple personal cloud built with fastAPI. uses the current bili user
 * as "authentication." returns the currently logged in bilibili username.
 * @returns dict.
 */
export const getBiliUser = async () => {
  try {
    let val = await fetch('https://api.bilibili.com/nav');
    let res = await val.json();
    return res.data;
  } catch (e) {
    console.error('failed to get bilibili login info. returning an empty dict instead.');
    return { uname: "" };
  }
}

/**
 * a simple personal cloud built with fastAPI. uses the current bili user
 * as "authentication." returns the currently logged in bilibili username.
 * @returns string
 */
const getBiliUserKey = async () => await getBiliUser().uname;

/**
 * wraps up find noxplayer setting and download in one function;
 * returns the JSON object of settting or null if not found.
 * @returns playerSetting object, or null
 * @param {string} cloudAddress web address for your personal cloud.
 */
export const noxRestore = async (cloudAddress = getPlayerSettingKey('personalCloudIP')) => {
  try {
    let res = await fetch(
      await cloudAddress + 'download/' + await getBiliUserKey()
    );
    if (res.status === 200) {
      return await (res).json();
    }
  } catch {
  } 
  return null;
  

}

/**
 * wraps up upload noxplayer setting. returns the response
 * if successful.
 * @param {Object} content 
 * @param {string} cloudAddress web address for your personal cloud.
 * @returns 
 */
export const noxBackup = async (content, cloudAddress = getPlayerSettingKey('personalCloudIP')) => {
  try {
    return await fetch(
      await cloudAddress + 'upload',
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userid: await getBiliUserKey(),
          json_obj: content,
          secret_key: process.env.PERSONAL_CLOUD_SECRET
        }),
      }
    );
  } catch {
    return {status: "fetch failed."};
  }
  
}
