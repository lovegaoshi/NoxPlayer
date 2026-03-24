/*
  From BGUtils

  MIT License

  Copyright (c) 2024 LuanRT

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as Constants from '../bgutils/Constants';

type FetchFunction = typeof fetch;
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36(KHTML, like Gecko)';

const evaluate = async (
  body: string,
  argNames: string[] = [],
  argValues: any[] = [],
): Promise<string> => {
  return new Promise((resolve) => {
    const listener = (event: MessageEvent) => {
      window.removeEventListener('message', listener);
      resolve(event.data.result);
    };
    window.addEventListener('message', listener);
    const iframe = document.getElementById('sandboxPOT');
    // @ts-expect-error contentWindow indeed exists
    iframe?.contentWindow.postMessage(
      { type: 'sandboxEvaluate', body, argNames, argValues },
      '*',
    );
  });
};

function extractFnBodyAndArgs(funcStr: string): {
  body: string;
  argNames: string[];
} {
  const body = funcStr.substring(
    funcStr.indexOf('{') + 1,
    funcStr.lastIndexOf('}'),
  );
  const argNames = funcStr
    .substring(funcStr.indexOf('(') + 1, funcStr.indexOf(')'))
    .split(',')
    .map((arg) => arg.trim());
  return { body, argNames };
}

export class BGUtils {
  static base64ToU8(base64: string): Uint8Array {
    const base64urlToBase64Map: { [key: string]: string } = {
      '-': '+',
      _: '/',
      '.': '=',
    };

    let base64Mod: string;

    if (/[-_.]/g.test(base64)) {
      base64Mod = base64.replace(
        /[-_.]/g,
        (match) => base64urlToBase64Map[match],
      );
    } else {
      base64Mod = base64;
    }

    base64Mod = atob(base64Mod);

    const result = new Uint8Array(
      [...base64Mod].map((char) => char.charCodeAt(0)),
    );

    return result;
  }

  static u8ToBase64(u8: Uint8Array, base64url = false): string {
    const result = btoa(String.fromCharCode(...u8));

    if (base64url) {
      return result.replace(/\+/g, '-').replace(/\//g, '_');
    }

    return result;
  }

  static async createChallenge(
    fetcher: FetchFunction,
    requestToken: string,
    interpreterHash: string | null,
    apiKey: string,
  ): Promise<any> {
    const payload = [requestToken];

    if (interpreterHash) {
      payload.push(interpreterHash);
    }

    const response = await fetcher(
      Constants.URLS.YT_IT_BASE + Constants.URLS.YT_IT_CREATE,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json+protobuf',
          'User-Agent': USER_AGENT,
          'x-goog-api-key': apiKey,
          'x-user-agent': 'grpc-web-javascript/0.1',
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const challenge = await response.json();

    if (challenge.length > 1 && challenge[1]) {
      const parsedChallenge = BGUtils.parseChallenge(challenge[1]);
      if (parsedChallenge) {
        return parsedChallenge;
      }
    }
  }

  static b64ToBuf(b64: string): string {
    const buffer = BGUtils.base64ToU8(b64);
    if (!buffer.length) {
      return '';
    }

    return new TextDecoder().decode(buffer.map((b) => b + 97));
  }

  static stringToB64(str: string): string {
    let buffer = new TextEncoder().encode(str);
    buffer = buffer.map((b) => b - 97);
    return BGUtils.u8ToBase64(buffer);
  }

  static parseChallenge(challenge: string): any {
    const str = BGUtils.b64ToBuf(challenge);
    if (str.length) {
      const [messageId, script, , interpreterHash, challenge, globalName] =
        JSON.parse(str);
      return {
        script,
        interpreterHash,
        globalName,
        challenge,
        messageId,
      };
    }
  }

  static generateColdStartToken(
    identifier: string,
    clientState?: number,
  ): string {
    const encodedIdentifier = new TextEncoder().encode(identifier);

    if (encodedIdentifier.length > 118)
      throw new Error('Content binding is too long.');

    const timestamp = Math.floor(Date.now() / 1000);
    const randomKeys = [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    ];

    // NOTE: The "0" value before the client state is supposed to be someVal & 0xFF.
    // It is always 0 though, so I didn't bother investigating further.
    const header = randomKeys.concat(
      [0, clientState ?? 1],
      [
        (timestamp >> 24) & 0xff,
        (timestamp >> 16) & 0xff,
        (timestamp >> 8) & 0xff,
        timestamp & 0xff,
      ],
    );

    const packet = new Uint8Array(2 + header.length + encodedIdentifier.length);

    packet[0] = 34;
    packet[1] = header.length + encodedIdentifier.length;

    packet.set(header, 2);
    packet.set(encodedIdentifier, 2 + header.length);

    const payload = packet.subarray(2);

    const keyLength = randomKeys.length;

    for (let i = keyLength; i < payload.length; i++) {
      payload[i] ^= payload[i % keyLength];
    }

    return this.u8ToBase64(packet, true);
  }
}

function getFn1(): any {
  const fn1 =
    '(n){return(async()=>{const r=window[n.globalName];if(!r)throw new Error("V not found");const o={fn1:null,fn2:null,fn3:null,fn4:null};if(!r.a)throw new Error("Init failed");try{await r.a(n.challenge,(function(n,r,t,f){o.fn1=n,o.fn2=r,o.fn3=t,o.fn4=f}),!0,void 0,((...n)=>{}))}catch(n){throw new Error("Failed to load")}if(!o.fn1)throw new Error("fn1 unavailable.");let t=null;const f=[];if(await o.fn1((n=>{t=n}),[,,f]),!t)throw new Error("[BG]: No response");if(!f.length)throw new Error("No ppf");return window.ppf=f,t})()}';
  return extractFnBodyAndArgs(fn1);
}

function getFn2(): any {
  const fn2 =
    'a(n,r){const t=window.ppf[0];if(!t)throw new Error("PP:Undefined");return(async()=>{function e(n,r=!1){const t=btoa(String.fromCharCode(...n));return r?t.replace(/\\+/g,"-").replace(/\\//g,"_"):t}const o=await t(function(n){const r=/[-_.]/g,t={"-":"+",_:"/",".":"="};let e;return e=r.test(n)?n.replace(r,(function(n){return t[n]})):n,e=atob(e),new Uint8Array([...e].map((n=>n.charCodeAt(0))))}(n));if("function"!=typeof o)throw new Error("PP:failed");const c=[];for(const n of r){const r=await o((new TextEncoder).encode(n));if(!r)throw new Error("YNJ:Undefined");if(!(r instanceof Uint8Array))throw new Error("ODM:Invalid");c.push(e(r,!0))}return c})()}';
  return extractFnBodyAndArgs(fn2.toString());
}

export async function getPot(
  fetcher: FetchFunction = fetch,
  identifiers: string | string[],
  requestToken?: string,
  apiKey?: string,
): Promise<any> {
  if (!requestToken) {
    requestToken = Constants.URLS.API.KEY2;
  }

  if (!apiKey) {
    apiKey = Constants.URLS.API.KEY;
  }

  identifiers = Array.isArray(identifiers) ? identifiers : [identifiers];

  let pot: any = null;
  let ttl: any = null;
  let refresh: any = null;
  const result = [];
  try {
    const challenge = await BGUtils.createChallenge(
      fetcher,
      requestToken,
      null,
      apiKey,
    );

    if (!challenge) {
      throw new Error('C is incorrect');
    }

    if (!challenge.script) {
      throw new Error('CS is bad');
    }

    const script = challenge.script.find((sc: any) => sc !== null);
    if (!script) {
      throw new Error('CS is null');
    }

    await evaluate(script, [], []);
    const fn1 = getFn1();
    const response = await evaluate(fn1.body, fn1.argNames, [challenge]);
    const payload = [requestToken, response];
    const response2 = await fetcher(
      Constants.URLS.YT_IT_BASE + Constants.URLS.YT_IT_GEN,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json+protobuf',
          'x-goog-api-key': apiKey,
          'x-user-agent': 'grpc-web-javascript/0.1',
          'User-Agent': USER_AGENT,
          Accept: '*/*',
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response2.ok) {
      throw new Error('It failed');
    }

    const tokenData = await response2.json();

    if (!tokenData.length || !tokenData[0]) {
      throw new Error('It none');
    }

    const it = tokenData[0];
    ttl = tokenData[1];
    refresh = tokenData[2];
    const fn2 = getFn2();
    pot = await evaluate(fn2.body, fn2.argNames, [it, identifiers]);

    for (let i = 0; i < pot.length; i++) {
      result.push({
        id: identifiers[i],
        pot: pot[i],
      });
    }
  } catch (err) {
    throw err;
  }
  return { result, requestToken, ttl, refresh };
}

export const getPoT = async (videoId: string) => {
  try {
    return await getPot(fetch, videoId);
  } catch (e) {
    console.error(e);
    console.error('[PoT] Failed to get PoT');
    return undefined;
  }
};
