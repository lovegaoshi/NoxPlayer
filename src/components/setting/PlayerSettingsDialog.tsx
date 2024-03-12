/* eslint-disable react/no-array-index-key */
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import SettingsIcon from '@mui/icons-material/Settings';
import BuildIcon from '@mui/icons-material/Build';
import { useStore } from 'zustand';

import playerSettingStore from '@APM/stores/playerSettingStore';
import SETTING_TAB from './enums';
import ToolboxTab from './ToolboxTab';
import SettingTab from './SettingTab';

interface Props {
  onClose: Function;
  openState: boolean;
  settings: NoxStorage.PlayerSettingDict;
}
export default function SettingsDialog({ onClose, openState }: Props) {
  const playerSettings = useStore(
    playerSettingStore,
    (state) => state.playerSetting,
  );
  const [tabValue, setTabValue] = React.useState('1');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleClose = () => onClose(playerSettings);

  return (
    <Dialog open={openState} onClose={handleClose}>
      <DialogTitle>播放器设置</DialogTitle>
      <DialogContent>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={handleTabChange}
              aria-label='lab API tabs example'
            >
              <Tab
                icon={<SettingsIcon />}
                label='设置'
                value={SETTING_TAB.GENERAL}
              />
              <Tab
                icon={<BuildIcon />}
                label='工具箱'
                value={SETTING_TAB.TOOLBOX}
              />
            </TabList>
          </Box>
          <SettingTab />
          <ToolboxTab />
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>好的</Button>
      </DialogActions>
    </Dialog>
  );
}
