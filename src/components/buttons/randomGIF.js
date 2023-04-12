import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { getRandomNumberExclude } from '../../styles/skins/utils';

/**
 * returns a button that shows a random gif from the input array. when clicked, change the gif into another one.
 * @param {array} gifs a list of gifs.
 * @param {array} favList an identifier/signal that changes the gif.
 * @param {function} onClickCallback extra onclick function when button is clicked.
 */
export default ({ gifs, favList, onClickCallback = () => {} }) => {
  const [randomGIFSrc, setRandomGIFSrc] = useState(getRandomNumberExclude(gifs.length, -1));

  useEffect(() => {
    setRandomGIFSrc(getRandomNumberExclude(gifs.length, randomGIFSrc));
  }, [favList]);

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
        alt=""
      />
    </IconButton>
  );
};
