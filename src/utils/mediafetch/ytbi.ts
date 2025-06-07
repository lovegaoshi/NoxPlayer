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
