
export const timestampToSeconds = (timestamp: string) => {
  const timeArray = timestamp.split(':').map(parseFloat);
  let seconds = 0;
  if (timeArray.length === 1) {
    // check if both hours and minutes components are missing
    seconds = timeArray[0]; // the timestamp only contains seconds
  } else if (timeArray.length === 2) {
    // check if hours component is missing
    seconds = timeArray[0] * 60 + timeArray[1]; // calculate seconds from minutes and seconds
  } else if (timeArray.length === 3) {
    seconds = timeArray[0] * 3600 + timeArray[1] * 60 + timeArray[2]; // calculate total seconds
  }
  return seconds;
};