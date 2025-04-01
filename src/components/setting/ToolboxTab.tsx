import React from 'react';
import Button from '@mui/material/Button';
import TabPanel from '@mui/lab/TabPanel';
import BuildIcon from '@mui/icons-material/Build';

import TimerButton from './tabButtons/TimerButton';
import PlayerResetButton from './tabButtons/PlayerResetButton';
import SETTING_TAB from './enums';

export default function ToolboxTab() {
  return (
    <TabPanel value={SETTING_TAB.TOOLBOX}>
      <TimerButton AddFavIcon={undefined} btnType='regular' />
      <PlayerResetButton />
      <Button startIcon={<BuildIcon />}>placeholder</Button>
      <br />
      <Button startIcon={<BuildIcon />}>placeholder</Button>
      <Button startIcon={<BuildIcon />}>placeholder</Button>
      <Button startIcon={<BuildIcon />}>placeholder</Button>
    </TabPanel>
  );
}
