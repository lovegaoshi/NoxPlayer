import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { useTranslation } from 'react-i18next';

import { NoxRepeatMode } from '@enums/RepeatMode';

interface Props {
  mode?: NoxRepeatMode;
  setMode: (v?: NoxRepeatMode) => void;
}

const nextPlaymode = (mode?: NoxRepeatMode) => {
  switch (mode) {
    case NoxRepeatMode.Repeat:
      return NoxRepeatMode.RepeatTrack;
    case NoxRepeatMode.RepeatTrack:
      return undefined;
    case NoxRepeatMode.Shuffle:
      return NoxRepeatMode.Repeat;
    default:
      return NoxRepeatMode.Shuffle;
  }
};

function RepeatModeIcon({ mode }: { mode?: NoxRepeatMode }) {
  switch (mode) {
    case NoxRepeatMode.Repeat:
      return <RepeatIcon />;
    case NoxRepeatMode.RepeatTrack:
      return <RepeatOneIcon />;
    case NoxRepeatMode.Shuffle:
      return <ShuffleIcon />;
    default:
      return <QuestionMarkIcon />;
  }
}

export default function PlaymodeButton({ mode, setMode }: Props) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        marginLeft: '-10px',
      }}
    >
      <Tooltip title='Playmode'>
        <IconButton size='medium' onClick={() => setMode(nextPlaymode(mode))}>
          <RepeatModeIcon mode={mode} />
        </IconButton>
      </Tooltip>
      <Typography sx={{ marginLeft: '2px' }}>
        {t('PlaylistSettingsDialog.repeatMode')}
      </Typography>
    </Box>
  );
}
