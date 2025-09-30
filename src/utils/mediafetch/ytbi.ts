import { ClientType, Innertube } from 'youtubei.js/web';
import { GHCacher } from '@APM/utils/fakeMMKV';

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
