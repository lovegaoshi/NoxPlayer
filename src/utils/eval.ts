export default async (code: string): Promise<string> => {
  return new Promise((resolve) => {
    const listener = (event: MessageEvent) => {
      window.removeEventListener('message', listener);
      resolve(JSON.stringify(event.data));
    };
    window.addEventListener('message', listener);
    const iframe = document.getElementById('sandbox');
    // @ts-expect-error contentWindow indeed exists
    iframe?.contentWindow.postMessage(code, '*');
  });
};
