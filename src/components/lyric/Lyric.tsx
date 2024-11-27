import React, { useEffect, useState, useCallback } from 'react';
import { Lrc } from 'react-lrc';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';

import { getName } from '@APM/utils/re';
import { useDebouncedValue } from '@APM/hooks';
import useApp from '@stores/useApp';
import useLyric from '@hooks/useLyric';
import LyricSearchBar from './LyricSearchBar';

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

function LrcView({ lyricOffset, lrc, className }: LrcViewProps) {
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
}

export default function Lyric(props: Props) {
  const { colorTheme, ScrollBar } = useApp((state) => state.playerStyle);
  const [songTitle, setSongTitle] = useState('');
  const debouncedSongTitle = useDebouncedValue(songTitle, 1000);

  const { currentAudio } = props;
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
      <Grid sx={mStyles.mainGrid} size={6}>
        <Grid container spacing={0} sx={mStyles.subGrid}>
          <Grid sx={mStyles.lrcImgGrid} size={12}>
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
          <Grid sx={mStyles.lrcInputGrid} size={12} container spacing={1}>
            <Grid size={3}>
              <TextField
                sx={mStyles.lrcOffsetGrid}
                type='number'
                inputProps={mStyles.lrcOffsetInput}
                variant='outlined'
                label='歌词补偿(毫秒)'
                value={usedLyric.currentTimeOffset}
                onChange={onLrcOffsetChange}
              />
            </Grid>
            <Grid size='grow'>
              <TextField
                sx={mStyles.lrcSearchGrid}
                variant='outlined'
                label='歌词搜索'
                placeholder={songTitle}
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
              />
            </Grid>
            <Grid sx={mStyles.lrcSearchBarGrid} size={12}>
              <LyricSearchBar
                currentAudio={currentAudio}
                usedLyric={usedLyric}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid style={mStyles.lrcGrid} size={6}>
        <LrcView
          className={className}
          lrc={usedLyric.lrc}
          lyricOffset={usedLyric.currentTimeOffset}
        />
      </Grid>
    </Grid>
  );
}

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
    paddingTop: '12px',
    align: 'center',
    paddingLeft: '2px',
    overflow: 'hidden',
    width: '500px',
  },
  lrcOffsetGrid: {
    align: 'right',
    paddingRight: '2px',
  },
  lrcOffsetInput: { step: '500' },
  lrcSearchGrid: {
    width: '-webkit-fill-available',
  },
  lrcSearchBarGrid: {
    align: 'center',
    paddingTop: '8px',
    paddingLeft: '2px',
  },
  lrcGrid: {
    paddingBottom: 10,
    overflow: 'auto',
    maxHeight: 'calc(100% - 130px)',
  },
  lrc: { maxHeight: '100%', paddingRight: '80px' },
};
