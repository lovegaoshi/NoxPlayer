export const cacheWrapper = (
  _identifier: string,
  getURL: () => Promise<string>,
) => getURL();

export default { noxMediaCache: { deleteSongCache: (v: any) => v } };
