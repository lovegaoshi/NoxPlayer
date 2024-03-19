import React, { useEffect, useState, useCallback } from 'react';
import { Lrc } from 'react-lrc';

import TextField from '@mui/material/TextField';
import { withStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';

import { useNoxSetting } from '@APM/stores/useApp';
import { useDebouncedValue } from '@APM/hooks';
import useApp from '@stores/useApp';
import LyricSearchBar from './LyricSearchBar';

const INTERVAL_OF_RECOVERING_AUTO_SCROLL_AFTER_USER_SCROLL = 5000;

const styles = (theme) => ({
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

export default withStyles(styles)((props) => {
  const setLyricMapping = useNoxSetting((state) => state.setLyricMapping);
  const { colorTheme, ScrollBar } = useApp((state) => state.playerStyle);
  const [lyricOffset, setLyricOffset] = useState(0);
  const [lyric, setLyric] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const debouncedSongTitle = useDebouncedValue(songTitle, 1000);

  const { classes, currentTime, audioName, audioId, audioCover } = props;

  useEffect(() => {
    // console.log('Lrc changed to %s', extractedName)
    // fetchLRC(audioName, setLyric, setSongTitle)
    setSongTitle(audioName);
  }, [audioName]);

  const onEnterPress = (e) => {
    // Enter clicked
    if (e.keyCode === 13) {
      setSongTitle(e.target.value);
    }
  };
  const onSongTitleChange = useCallback(
    (lrc) => {
      setLyric(lrc);
    },
    [audioName],
  );

  const onLrcOffsetChange = (e) => {
    setLyricOffset(e.target.value);
    setLyricMapping({
      songId: audioId,
      offset: e.target.value,
      lyric,
      lyricKey: 0,
    });
  };

  const lineRenderer = useCallback(
    ({ line: { startMillisecond, content }, index, active }) => {
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
  );

  function onCurrentLineChange({ line, index }) {
    return console.log(index, line);
  }
  // //console.log(+currentTime * 1000 + +lyricOffset)
  const className = ScrollBar().root;

  return (
    <Grid
      container
      spacing={1}
      sx={{ maxHeight: '100vh', minHeight: '100vh', overflow: 'hidden' }}
    >
      <Grid
        align='center'
        sx={{
          alignItems: 'center',
          paddingBottom: 10,
          overflow: 'hidden',
          minHeight: 'calc(100% - 100px)',
        }}
        item
        xs={6}
      >
        <Grid
          container
          spacing={0}
          sx={{ maxHeight: '100vh', overflow: 'hidden', marginTop: '50px' }}
        >
          <Grid
            align='center'
            sx={{ paddingTop: '8px', paddingLeft: '2px', overflow: 'hidden' }}
            item
            xs={12}
          >
            <img
              id='LrcImg'
              alt=''
              src={audioCover}
              style={{
                maxWidth: '500px',
                boxShadow: colorTheme.lyricImgShadowStyle,
              }}
            />
          </Grid>
          <Grid
            align='center'
            sx={{ paddingTop: '8px', paddingLeft: '2px', overflow: 'hidden' }}
            item
            xs={12}
          >
            <Grid
              container
              spacing={0}
              sx={{ maxHeight: '100vh', overflow: 'hidden', width: '500px' }}
            >
              <Grid
                align='right'
                sx={{
                  paddingTop: '8px',
                  paddingRight: '2px',
                  overflow: 'hidden',
                }}
                item
                xs={3}
              >
                <TextField
                  type='number'
                  variant='outlined'
                  label='歌词补偿(毫秒)'
                  InputProps={{
                    className: classes.inputOffset,
                    min: -9999,
                    max: 9999,
                  }}
                  value={lyricOffset}
                  onChange={onLrcOffsetChange}
                />
              </Grid>
              <Grid
                align='center'
                sx={{ paddingTop: '8px', overflow: 'hidden' }}
                style={{ maxWidth: 'fit-content' }}
                item
                xs={9}
              >
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
                  onKeyDown={onEnterPress}
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid
            align='center'
            sx={{ paddingTop: '8px', paddingLeft: '2px', overflow: 'hidden' }}
            item
            xs={12}
          >
            <LyricSearchBar
              SearchKey={debouncedSongTitle}
              songId={String(audioId)}
              setLyricOffset={setLyricOffset}
              setLyric={onSongTitleChange}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        style={{
          paddingBottom: 10,
          overflow: 'auto',
          maxHeight: 'calc(100% - 130px)',
        }}
        item
        xs={6}
      >
        <Lrc
          className={className}
          style={{ maxHeight: '100%', paddingRight: '80px' }}
          lrc={lyric}
          autoScroll
          lineRenderer={lineRenderer}
          currentMillisecond={+currentTime * 1000 + +lyricOffset} // Add offset value to adapt lrc time
          intervalOfRecoveringAutoScrollAfterUserScroll={
            INTERVAL_OF_RECOVERING_AUTO_SCROLL_AFTER_USER_SCROLL
          }
        />
      </Grid>
    </Grid>
  );
});