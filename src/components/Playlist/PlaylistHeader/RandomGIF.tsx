import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';

const getRandomNumberExclude = (randRange: number, exclude = -1) => {
  if (exclude > 0) {
    const val = Math.floor(Math.random() * (randRange - 1)) >> 0;
    if (val === exclude) {
      return randRange - 1;
    }
    return val;
  }
  return Math.floor(Math.random() * randRange) >> 0;
};

interface RandomGIFProps {
  gifs: string[];
  playlist: string;
  onClickCallback: () => void;
}

/**
 * returns a button that shows a random gif from the input array. when clicked, change the gif into another one.
 * @param {array} gifs a list of gifs.
 * @param {array} playlist an identifier/signal that changes the gif.
 * @param {function} onClickCallback extra onclick function when button is clicked.
 */
export default function RandomGIFButton({
  gifs,
  playlist,
  onClickCallback = () => {},
}: RandomGIFProps) {
  const [randomGIFSrc, setRandomGIFSrc] = useState(
    getRandomNumberExclude(gifs.length, -1),
  );

  useEffect(() => {
    setRandomGIFSrc(getRandomNumberExclude(gifs.length, randomGIFSrc));
  }, [playlist]);

  return (
    <IconButton
      onClick={() => {
        setRandomGIFSrc(getRandomNumberExclude(gifs.length, randomGIFSrc));
        onClickCallback();
      }}
      sx={{ marginTop: -1, '&:hover': { backgroundColor: 'transparent' } }}
    >
      <img
        style={{ width: '72px', height: '72px' }}
        src={gifs[randomGIFSrc]}
        alt=''
      />
    </IconButton>
  );
}
