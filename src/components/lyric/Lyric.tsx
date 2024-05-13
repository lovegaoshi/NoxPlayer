import React, { useEffect, useState, useCallback } from 'react';
import { Lrc } from 'react-lrc';
import TextField from '@mui/material/TextField';
import { withStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';

import { getName } from '@APM/utils/re';
import { useNoxSetting } from '@APM/stores/useApp';
import { useDebouncedValue } from '@APM/hooks';
import useApp from '@stores/useApp';
import LyricSearchBar from './LyricSearchBar';

const styles = () => ({
  inputOffset: {
    height: 40,
    width: 123,
  },
  inputLrc: {
    height: 40,
    width: 375,
  },
  inputSelect: {
    height: 40,
    width: 500,
  },
});

interface Props {
  currentAudio: NoxMedia.Song;
  currentTime: number;
}

interface LineRenderer {
  line: {
    startMillisecond: number;
    content: string;
  };
  index: number;
  active: boolean;
}

export default withStyles(styles)((props: Props) => {
  const setLyricMapping = useNoxSetting((state) => state.setLyricMapping);
  const { colorTheme, ScrollBar } = useApp((state) => state.playerStyle);
  const [lyricOffset, setLyricOffset] = useState(0);
  const [lyric, setLyric] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const debouncedSongTitle = useDebouncedValue(songTitle, 1000);

  // HACK: how to do this..?
  // @ts-ignore
  const { classes, currentTime, currentAudio } = props;
  const audioName = getName(currentAudio);

  useEffect(() => {
    // console.log('Lrc changed to %s', extractedName)
    // fetchLRC(audioName, setLyric, setSongTitle)
    setSongTitle(audioName);
  }, [audioName]);

  const onLrcOffsetChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const lyricOffset = Number(e.target.value);
    setLyricOffset(lyricOffset);
    setLyricMapping({
      songId: currentAudio.id,
      lyricOffset,
      lyric,
    });
  };

  const lineRenderer = useCallback(
    ({ line: { content }, active }: LineRenderer) => {
      // //console.log(content)
      return (
        <div
          style={{
            textAlign: 'center',
            color: active
              ? colorTheme.lyricActiveColor
              : colorTheme.lyricInactiveColor,
            padding: '6px 12px',
            fontSize: active ? '18px' : '15px',
            fontFamily: "Georgia,'Microsoft YaHei',simsun,serif",
          }}
        >
          {content}
        </div>
      );
    },
    [],
  );

  // //console.log(+currentTime * 1000 + +lyricOffset)
  const className = ScrollBar().root;

  return (
    <Grid container spacing={1} sx={mStyles.mainContainer}>
      <Grid sx={mStyles.mainGrid} item xs={6}>
        <Grid container spacing={0} sx={mStyles.subGrid}>
          <Grid sx={mStyles.lrcImgGrid} item xs={12}>
            <img
              id='LrcImg'
              alt=''
              src={currentAudio.cover}
              style={{
                maxWidth: '500px',
                boxShadow: colorTheme.lyricImgShadowStyle,
              }}
            />
          </Grid>
          <Grid sx={mStyles.lrcInputGrid} item xs={12} container spacing={0}>
            <TextField
              sx={mStyles.lrcOffsetGrid}
              type='number'
              variant='outlined'
              label='歌词补偿(毫秒)'
              InputProps={{
                className: classes.inputOffset,
              }}
              value={lyricOffset}
              onChange={onLrcOffsetChange}
            />
            <TextField
              variant='outlined'
              label='歌词搜索'
              InputProps={{
                className: classes.inputLrc,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={songTitle}
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
            />
          </Grid>

          <Grid sx={mStyles.lrcSearchBarGrid} item xs={12}>
            <LyricSearchBar
              searchKey={debouncedSongTitle}
              currentAudio={currentAudio}
              setLyricOffset={setLyricOffset}
              setLyric={setLyric}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid style={mStyles.lrcGrid} item xs={6}>
        <Lrc
          className={className}
          style={mStyles.lrc}
          lrc={lyric}
          lineRenderer={lineRenderer}
          currentMillisecond={+currentTime * 1000 + +lyricOffset} // Add offset value to adapt lrc time
          recoverAutoScrollInterval={5000}
        />
      </Grid>
    </Grid>
  );
});

const mStyles = {
  mainContainer: { maxHeight: '100vh', minHeight: '100vh', overflow: 'hidden' },
  mainGrid: {
    align: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    overflow: 'hidden',
    minHeight: 'calc(100% - 100px)',
  },
  subGrid: { maxHeight: '100vh', overflow: 'hidden', marginTop: '50px' },
  lrcImgGrid: {
    align: 'center',
    paddingTop: '8px',
    paddingLeft: '2px',
    overflow: 'hidden',
  },
  lrcInputGrid: {
    align: 'center',
    paddingTop: '8px',
    paddingLeft: '2px',
    overflow: 'hidden',
    width: '500px',
  },
  lrcOffsetGrid: {
    align: 'right',
    paddingTop: '8px',
    paddingRight: '2px',
    overflow: 'hidden',
  },
  lrcSearchGrid: {
    align: 'center',
    paddingTop: '8px',
    overflow: 'hidden',
    maxWidth: 'fit-content',
  },
  lrcSearchBarGrid: {
    align: 'center',
    paddingTop: '8px',
    paddingLeft: '2px',
    overflow: 'hidden',
  },
  lrcGrid: {
    paddingBottom: 10,
    overflow: 'auto',
    maxHeight: 'calc(100% - 130px)',
  },
  lrc: { maxHeight: '100%', paddingRight: '80px' },
};
