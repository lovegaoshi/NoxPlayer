import React, { useEffect, useState, useCallback } from 'react';
import { Lrc } from 'react-lrc';
import TextField from '@mui/material/TextField';
import { withStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';

import { getName } from '@APM/utils/re';
import { useDebouncedValue } from '@APM/hooks';
import useApp from '@stores/useApp';
import LyricSearchBar from './LyricSearchBar';
import useLyric from '@hooks/useLyric';

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
  currentAudio: NoxMediaChrome.RJKMAudio;
}

interface LineRenderer {
  line: {
    startMillisecond: number;
    content: string;
  };
  index: number;
  active: boolean;
}

interface LrcViewProps {
  lyricOffset: number;
  lrc: string;
  className: string;
}

const LrcView = ({ lyricOffset, lrc, className }: LrcViewProps) => {
  const currentProgress = useApp((state) => state.currentProgress);
  const { colorTheme } = useApp((state) => state.playerStyle);

  const lineRenderer = useCallback(
    ({ line: { content }, active }: LineRenderer) => {
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

  return (
    <Lrc
      className={className}
      style={mStyles.lrc}
      lrc={lrc}
      lineRenderer={lineRenderer}
      currentMillisecond={+currentProgress * 1000 + +lyricOffset} // Add offset value to adapt lrc time
      recoverAutoScrollInterval={5000}
    />
  );
};

export default withStyles(styles)((props: Props) => {
  const { colorTheme, ScrollBar } = useApp((state) => state.playerStyle);
  const [songTitle, setSongTitle] = useState('');
  const debouncedSongTitle = useDebouncedValue(songTitle, 1000);

  // HACK: how to do this..?
  // @ts-ignore
  const { classes, currentAudio } = props;
  const audioName = getName(currentAudio);
  const usedLyric = useLyric(currentAudio);

  useEffect(() => {
    // fetchLRC(audioName, setLyric, setSongTitle)
    setSongTitle(audioName);
  }, [audioName]);

  useEffect(() => {
    if (debouncedSongTitle.length > 0) {
      usedLyric.fetchAndSetLyricOptions(debouncedSongTitle);
    }
  }, [debouncedSongTitle]);

  const onLrcOffsetChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => usedLyric.onLrcOffsetChange(Number(e.target.value));

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
              value={usedLyric.currentTimeOffset}
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
            <LyricSearchBar currentAudio={currentAudio} usedLyric={usedLyric} />
          </Grid>
        </Grid>
      </Grid>
      <Grid style={mStyles.lrcGrid} item xs={6}>
        <LrcView
          className={className}
          lrc={usedLyric.lrc}
          lyricOffset={usedLyric.currentTimeOffset}
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
