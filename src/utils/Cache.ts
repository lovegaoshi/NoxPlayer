export const cacheWrapper = (
  identifier: string,
  getURL: () => Promise<string>,
) => getURL();

export default {};
