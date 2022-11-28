import React, { useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import { getRandomNumberExclude } from '../styles/skins/utils';

export default ({ gifs, favList }) => {
    const [randomGIFSrc, setRandomGIFSrc] = useState(getRandomNumberExclude(gifs.length, -1));

    useEffect(() => {
        setRandomGIFSrc(getRandomNumberExclude(gifs.length, randomGIFSrc));
    }, [favList])

    return (
        <IconButton 
            onClick={() => setRandomGIFSrc(getRandomNumberExclude(gifs.length, randomGIFSrc))} 
            sx={{ marginTop: -1, "&:hover": { backgroundColor: 'transparent' } }}
        >
            <img style={{ width: '66px', height: '66px' }}
                src={gifs[randomGIFSrc]}></img>
        </IconButton>
    )
}