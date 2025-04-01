export default (process = console.log) => {
  const upload = document.createElement('input');
  upload.type = 'file';
  document.body.appendChild(upload);

  upload.addEventListener('change', handleFiles, false);
  function handleFiles() {
    const fileReader = new FileReader();
    fileReader.onload = function onload() {
      if (fileReader.result === null) return;
      if (
        typeof fileReader.result === 'string' ||
        fileReader.result instanceof String
      ) {
        console.error('[Sync] fileReader.result is a string; will not import');
        return;
      }
      process(fileReader.result);
    };
    if (upload.files === null || upload.files[0] === undefined) return;
    fileReader.readAsArrayBuffer(upload.files[0]);
  }
  upload.click();
};
