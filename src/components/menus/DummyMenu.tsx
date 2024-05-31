/* eslint-disable */
// @ts-nocheck
// HACK: the menu type checks are just a giant mess
import React from 'react';
import { Menu, Item, useContextMenu } from 'react-contexify';
import TerminalIcon from '@mui/icons-material/Terminal';
import 'react-contexify/dist/ReactContexify.css';

const MENU_ID = 'favlistmenu';

/**
 * right-click context menu for dummy.
 * has menu items:
 * debug
 * @returns
 */
export default function App({ theme = 'light' }) {
  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  const handleItemClick = ({ props }) => {
    console.warn('method not implemented', props);
  };
  function displayMenu(e) {
    // put whatever custom logic you need
    // you can even decide to not display the Menu
    show({
      event: e,
    });
  }

  return (
    <div>
      <Menu id={MENU_ID} animation='slide' theme={theme}>
        <Item onClick={handleItemClick}>
          <TerminalIcon /> &nbsp; console.log
        </Item>
      </Menu>
    </div>
  );
}
