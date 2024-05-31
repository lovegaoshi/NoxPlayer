export default {};

export enum MUSICFREE {
  aggregated = 'aggregated',
}

export const searcher: {
  [MUSICFREE.aggregated]: (v: string, i: MUSICFREE[]) => Promise<[]>;
} = {
  [MUSICFREE.aggregated]: async () => [],
};

export const resolver: {
  [k: string]: (v: NoxMedia.Song) => Promise<{ url: string }>;
} = {};
