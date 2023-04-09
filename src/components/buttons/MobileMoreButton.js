import React, { useState, useContext } from "react";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { AddFavDialog } from "../dialogs/AddFavDialog";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import StorageManagerCtx from '../../popup/App';
import { searchSongOnWeb, searchSongOnBili } from '../menus/Favmenu';

export default ({ song }) => {

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const StorageManager = useContext(StorageManagerCtx);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment >
            <Tooltip title="帮助">
                <IconButton 
                    size='large'
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <MoreHorizIcon />
                </IconButton>
            </Tooltip>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => {setOpenAddDialog(true); handleClose();}}>将歌送往歌单……</MenuItem>
                <MenuItem onClick={handleClose}>console.log</MenuItem>
                <MenuItem onClick={() => {searchSongOnWeb(song); handleClose();}}>在网上搜索这首歌</MenuItem>
                <MenuItem onClick={() => {searchSongOnBili(song); handleClose();}}>在b站搜索这首歌</MenuItem>
                <MenuItem onClick={handleClose}>在所有歌单中删除这首歌</MenuItem>
            </Menu>
            <AddFavDialog
                id="song-menu-add-fav"
                openState={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                favLists={StorageManager.latestFavLists.map(v => v.info)}
                song={song}
                isMobile={true}
            />
        </React.Fragment >
    )
}