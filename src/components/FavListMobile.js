import React, {
  forwardRef,
  useEffect,
  useState,
  useCallback,
  memo,
  useContext,
} from 'react';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import { useSwipeable } from 'react-swipeable';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useConfirm } from 'material-ui-confirm';
import MenuIcon from '@mui/icons-material/Menu';

import Search from './FavList/Search';
import { CRUDBtn, outerLayerBtn, DiskIcon } from './FavList/FavList';
import { skinPreset } from '../styles/skin';
import PlayerSettingsButton from './setting/PlayerSetttingsButton';
import rgba2rgb from '../utils/rgba2rgb';
import HelpPanelButton from './buttons/HelpPanelButton';
import useFavList from '../hooks/useFavList';
import TimerButton from './buttons/TimerButton';
import { StorageManagerCtx } from '../contexts/StorageManagerContext';
import { AddFavDialog, NewFavDialog } from './dialogs/AddFavDialog';
import { ScrollBar } from '../styles/styles';
import Fav from './Fav/FavMobile';

const { colorTheme } = skinPreset;
const modifiedBackgroundPalette = colorTheme.palette;

try {
  modifiedBackgroundPalette.components.MuiPaper.styleOverrides.root.backgroundColor =
    rgba2rgb(colorTheme.PCBackgroundColor);
} catch (e) {
  console.warn(e);
}

const theme = createTheme(modifiedBackgroundPalette);

const Transition = forwardRef((props, ref) => {
  return <Slide direction='left' ref={ref} {...props} />;
});

const TransitionRight = forwardRef((props, ref) => {
  return <Slide direction='right' ref={ref} {...props} />;
});

const CRUDIcon = {
  ':hover': {
    cursor: 'pointer',
  },
  width: '30px',
  height: '30px',
  paddingTop: '12px',
  paddingBottom: '12px',
  color: colorTheme.playListIconColor,
};

const AddFavIcon = {
  ':hover': {
    cursor: 'pointer',
  },
  width: '24px',
  color: colorTheme.playListIconColor,
};

export default memo(
  ({
    onSongListChange,
    onPlayOneFromFav,
    onPlayAllFromFav,
    onAddFavToList,
    showFavList,
    currentAudioID,
  }) => {
    const [favOpen, setFavOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const StorageManager = useContext(StorageManagerCtx);
    const confirm = useConfirm();
    const {
      favLists,
      setFavLists,
      searchList,
      setSearchList,
      favoriteList,
      selectedList,
      setSelectedList,
      setSongsStoredAsNewFav,
      openNewDialog,
      setOpenNewDialog,
      openAddDialog,
      actionFavId,
      actionFavSong,
      setSearchInputVal,

      updateSubscribeFavList,
      handleDeleteFromSearchList,
      onNewFav,
      handleDeleteFavClick,
      handleAddToFavClick,
      onAddFav,
      onDragEnd,
    } = useFavList();

    useEffect(() => {
      if (!selectedList) {
        setOpen(!open);
      } else {
        setFavOpen(!favOpen);
      }
    }, [showFavList]);

    // this is here because i have overcomplicated the dialog open logic by implementing
    // it as a state in player.js, but also a state here;
    // then for some reason when state is initialized as true but turned off because of the above logic (triggered when
    // a swipe action is executed (?), the music player part wont render; i have to do below
    // similar problem happened to lyricOverlay; I took out lyricOverlay's open state inside the component, but is having
    // trouble with this one. alas, this patch seems to work...
    useEffect(() => {
      setOpen(false);
    }, []);

    const handleClose = () => {
      if (selectedList) {
        setFavOpen(!favOpen);
      }
      setOpen(false);
    };

    const handleSearch = useCallback(
      (list) => {
        setSearchList(list);
        setSelectedList(list);
        setOpen(false);
        setFavOpen(true);
      },
      [searchList, selectedList],
    );

    const handlePlayListClick = (FavList) => {
      onPlayAllFromFav(FavList);
      handleClose();
    };

    const searchBarComponent = (playListIcon) => {
      return (
        <Search
          handleSearch={handleSearch}
          handleOpenFav={() => {
            setOpen(!open);
          }}
          playListIcon={playListIcon}
          handleSetSearchInputVal={setSearchInputVal}
        />
      );
    };

    const renderFavListItem = ({ v, i }) => {
      return (
        <React.Fragment key={i}>
          <ListItemButton disableRipple sx={outerLayerBtn}>
            <ListItemButton
              style={{ maxWidth: 'calc(100% - 136px)' }}
              onClick={() => {
                setOpen(false);
                setFavOpen(true);
                setSelectedList(v);
              }}
              id={v.info.id}
            >
              <ListItemIcon sx={DiskIcon}>
                <AlbumOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: '1.1em' }}
                primary={v.info.title}
              />
            </ListItemButton>
            <Box
              component='div'
              sx={CRUDBtn}
              align='right'
              style={{ width: '136px' }}
            >
              <Tooltip title='添加到收藏歌单'>
                <PlaylistAddIcon
                  sx={CRUDIcon}
                  onClick={() => handleAddToFavClick(v.info.id)}
                />
              </Tooltip>
              &nbsp;&nbsp;
              <Tooltip title='删除歌单'>
                <DeleteOutlineOutlinedIcon
                  sx={CRUDIcon}
                  onClick={() => handleDeleteFavClick(v.info.title, v.info.id)}
                />
              </Tooltip>
            </Box>
          </ListItemButton>
        </React.Fragment>
      );
    };

    const favListComponent = () => {
      return (
        <Box // Mid Grid -- SideBar
          className={ScrollBar().root}
          style={{
            overflow: 'auto',
            height: 'calc(100% - 52px)',
            paddingTop: '10px',
            lineHeight: '24px',
          }}
          sx={{ gridArea: 'sidebar' }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4} />
            <Grid
              item
              xs={8}
              style={{
                textAlign: 'right',
                paddingRight: '5px',
                paddingLeft: '6px',
              }}
            >
              <TimerButton AddFavIcon={AddFavIcon} />
              <PlayerSettingsButton AddFavIcon={AddFavIcon} />
              <HelpPanelButton AddFavIcon={AddFavIcon} />
            </Grid>
            <NewFavDialog
              id='NewFav'
              openState={openNewDialog}
              onClose={onNewFav}
            />
          </Grid>
          <Divider light />
          <List sx={{ width: '100%' }} component='nav'>
            <React.Fragment key={searchList.id}>
              <ListItemButton disableRipple sx={outerLayerBtn}>
                <ListItemButton
                  style={{ maxWidth: 'calc(100% - 136px)' }}
                  onClick={() => {
                    setOpen(false);
                    setFavOpen(true);
                    setSelectedList(searchList);
                  }}
                  id={searchList.info.id}
                >
                  <ListItemIcon sx={DiskIcon}>
                    <ManageSearchIcon />
                  </ListItemIcon>
                  <ListItemText
                    style={{ maxWidth: '50%' }}
                    primaryTypographyProps={{ fontSize: '1.1em' }}
                    primary={searchList.info.title}
                  />
                </ListItemButton>
                <Box
                  component='div'
                  sx={CRUDBtn}
                  align='right'
                  style={{ width: '136px' }}
                >
                  <Tooltip title='添加到收藏歌单'>
                    <PlaylistAddIcon
                      sx={CRUDIcon}
                      onClick={() => handleAddToFavClick(searchList.info.id)}
                    />
                  </Tooltip>
                  &nbsp;&nbsp;
                  <Tooltip title='新建为歌单'>
                    <FiberNewIcon
                      sx={CRUDIcon}
                      onClick={() => {
                        setSongsStoredAsNewFav(searchList.songList);
                        setOpenNewDialog(true);
                      }}
                    />
                  </Tooltip>
                </Box>
              </ListItemButton>
            </React.Fragment>

            {favLists && (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='droppable'>
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {favLists.map((item, index) => (
                        <Draggable
                          key={`item-${index}`}
                          draggableId={`item-${index}`}
                          index={index}
                        >
                          {(provided2, snapshot2) => (
                            <div
                              ref={provided2.innerRef}
                              {...provided2.draggableProps}
                              {...provided2.dragHandleProps}
                              style={{
                                background: snapshot2.isDragging
                                  ? colorTheme.clickHoldBackground
                                  : null,
                                ...provided2.draggableProps.style,
                              }}
                            >
                              {renderFavListItem({ v: item, i: index })}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </List>
        </Box>
      );
    };

    const favComponent = () => {
      return (
        <Box // Mid Grid -- Fav Detail
          style={{
            height: 'calc(100% - 86px)',
            maxHeight: 'calc(100% - 86px)',
            paddingLeft: '20px',
            overflow: 'auto',
          }}
          sx={{ gridArea: 'Lrc', padding: '0.2em' }}
        >
          {selectedList && (
            <Fav
              FavList={selectedList}
              onSongListChange={onSongListChange}
              onSongIndexChange={onPlayOneFromFav}
              handleDeleteFromSearchList={handleDeleteFromSearchList}
              handleAddToFavClick={handleAddToFavClick}
              onPlaylistTitleClick={() => handlePlayListClick(selectedList)}
              onRssUpdate={async (subscribeUrls) =>
                updateSubscribeFavList({
                  playlist: selectedList,
                  StorageManager,
                  setSelectedList,
                  subscribeUrls,
                })
              }
              currentAudioID={currentAudioID}
            />
          )}
        </Box>
      );
    };

    const FavListSwipeHandlers = useSwipeable({
      onSwipedRight: (eventData) => setOpen(false),
      swipeDuration: 250, // only swipes under 250ms will trigger callbacks
    });

    const FavSwipeHandlers = useSwipeable({
      onSwipedRight: (eventData) => {
        setOpen(false);
        setFavOpen(false);
      },
      onSwipedLeft: (eventData) => setOpen(true),
      swipeDuration: 250, // only swipes under 250ms will trigger callbacks
    });

    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            hideBackdrop
            TransitionComponent={Transition}
          >
            <div
              id='favListSwipePlane'
              {...FavListSwipeHandlers}
              style={{ height: '95%' }}
            >
              {searchBarComponent(<ArrowBackIcon fontSize='inherit' />)}
              {favListComponent()}
            </div>
          </Dialog>
          <Dialog
            fullScreen
            open={favOpen}
            onClose={handleClose}
            hideBackdrop
            TransitionComponent={Transition}
          >
            <div
              id='favSwipePlane'
              {...FavSwipeHandlers}
              style={{ height: '100%' }}
            >
              {searchBarComponent(<MenuIcon fontSize='inherit' />)}
              {favComponent()}
            </div>
          </Dialog>
        </ThemeProvider>
        {favLists && (
          <AddFavDialog
            id='AddFav'
            openState={openAddDialog}
            onClose={onAddFav}
            fromId={actionFavId}
            favLists={favLists.map((v) => v.info)}
            song={actionFavSong}
            isMobile
          />
        )}
      </React.Fragment>
    );
  },
);
