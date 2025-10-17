import { ClientType, Innertube, Platform } from 'youtubei.js/web';
import { BuildScriptResult, VMPrimative } from 'youtubei.js/dist/src/types';

import { GHCacher } from '@APM/utils/fakeMMKV';
import evalCode from '../eval';

Platform.shim.eval = async (
  data: BuildScriptResult,
  env: Record<string, VMPrimative>,
) => {
  const properties = [];

  if (env.n) {
    properties.push(`n: exportedVars.nFunction("${env.n}")`);
  }

  if (env.sig) {
    properties.push(`sig: exportedVars.sigFunction("${env.sig}")`);
  }
  // HACK: sandboxed iframe cant access eg sessionStorage and throws and error
  // mapping globalThis. luckily this isnt really used
  // if broken ,check the executing code...
  const code = `${data.output.replace('const window = Object.assign({}, globalThis)', 'const window = {}')}\nreturn { ${properties.join(', ')} }`;
  const result = await evalCode(code);
  return JSON.parse(result);
};

const ytClient = Innertube.create({
  cache: new GHCacher(),
  retrieve_player: true,
  enable_session_cache: false,
  generate_session_locally: false,
  client_type: ClientType.WEB_EMBEDDED,
  fetch: async (input, init?: RequestInit) => {
    // Modify the request
    // and send it to the proxy

    // fetch the URL
    // @ts-expect-error their headers is actually a map
    init?.headers?.set('origin', 'https://www.youtube.com');
    return fetch(input, init);
  },
});

export default () => ytClient;

export const ytwebClient = () =>
  Innertube.create({
    retrieve_player: false,
    enable_session_cache: false,
    generate_session_locally: false,
    fetch: async (input, init?: RequestInit) => {
      // Modify the request
      // and send it to the proxy

      // fetch the URL

      return fetch(input, init);
    },
  });
