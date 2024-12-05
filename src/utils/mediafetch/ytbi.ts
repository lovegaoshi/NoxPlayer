import { ClientType, Innertube } from 'youtubei.js/web';

const ytClient = Innertube.create({
  retrieve_player: true,
  enable_session_cache: false,
  generate_session_locally: false,
  client_type: ClientType.IOS,
  fetch: async (input, init?: RequestInit) => {
    // Modify the request
    // and send it to the proxy

    // fetch the URL

    // @ts-expect-error
    return fetch(input, init);
  },
});

export default () => ytClient;

export const ytClientWeb: Promise<Innertube> = Innertube.create({
  retrieve_player: false,
  enable_session_cache: false,
  generate_session_locally: false,
  fetch: async (input, init?: RequestInit) => {
    // Modify the request
    // and send it to the proxy

    // fetch the URL

    // @ts-expect-error
    return fetch(input, init);
  },
});
