export const saveItem = (key: string, val: object | string) =>
  chrome.storage.local.set({ [key]: val });

/**
 * wrapper for chrome.storage.local.get. return the
 * local stored objects given a key.
 * @param {string} key
 * @returns
 */
export const getItem = (
  key: string,
  defaultVal: unknown = undefined,
): Promise<any> => {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key] === undefined ? defaultVal : result[key]);
    });
  });
};

export const removeItem = (key: string) => chrome.storage.local.remove(key);

export const saveSecure = saveItem;

export const getSecure = getItem;
