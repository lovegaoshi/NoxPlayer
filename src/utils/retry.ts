/**
 * retry wrapper
 * @param functionPromise function that returns a promise.
 * @param maxRetry maximum retries, default 3
 * @param retryDelay retry delay in ms, default 3k
 * @returns functionPromise's return
 */
export default function functionPromiseRetry(
  functionPromise: Function,
  maxRetry: number = 3,
  retryDelay: number = 3000,
) {
  let retryCnt = 0;

  function delay(t: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, t);
    });
  }

  function run() {
    return functionPromise().catch((err: { statusText: any }) => {
      ++retryCnt;
      if (retryCnt > maxRetry) {
        console.error(
          'Max retries exceeded. There was an error!',
          err.statusText,
        );
        throw err;
      }
      console.error(`Retry #${retryCnt} after error`, err.statusText);
      // call ourselves again after a short delay to do the retry
      // add to the promise chain so still linked to the originally returned promise
      return delay(retryDelay).then(run);
    });
  }
  return run();
}
