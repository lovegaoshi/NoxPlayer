export interface MFsdk {
  path: string;
  platform: string;
  version: string;
  author: string;
  srcUrl: string;
  supportedSearchType: string[];
  regexFetch: (v: { url: string }) => Promise<NoxNetwork.NoxRegexFetch>;
  resolveURL: (v: NoxMedia.Song) => Promise<NoxNetwork.ParsedNoxMediaURL>;
}
