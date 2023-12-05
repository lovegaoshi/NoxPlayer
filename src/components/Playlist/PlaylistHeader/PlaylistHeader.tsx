/* eslint-disable no-shadow */
import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { PLAYLIST_ENUMS } from '@enums/Playlist';
import { UsePlaylistP } from '../hooks/usePlaylistPaginated';
import { skinPreset } from '../../../styles/skin';
import RandomGIFIcon from './RandomGIF';
import FavSettingsButtons from '../PlaylistSetting/PlaylistSettingsButton';
import SongSearchBar from '../../dialogs/SongSearchbar';

const { colorTheme } = skinPreset;

interface Props {
  playlist: NoxMedia.Playlist;
  playlistPaginated: UsePlaylistP;
}
export default function FavHeader({ playlist, playlistPaginated }: Props) {
  const { page, primePageToCurrentPlaying, handleSearch, searchBarRef } =
    playlistPaginated;

  return (
    <Box
      sx={{ flexGrow: 1, maxHeight: '80px' }}
      style={{ paddingBottom: '8px' }}
    >
      <Grid container spacing={2} style={{ padding: '10px' }}>
        <Grid
          item
          xs={5}
          style={{
            textAlign: 'left',
            padding: '0px',
            paddingLeft: '12px',
            paddingTop: '12px',
          }}
          overflow='hidden'
        >
          <Typography
            variant='h6'
            style={{
              color: colorTheme.playlistCaptionColor,
              whiteSpace: 'nowrap',
              fontSize: '2rem',
            }}
          >
            {playlist.title}
          </Typography>
        </Grid>
        <Grid item xs={2} style={{ textAlign: 'center', padding: '0px' }}>
          <RandomGIFIcon
            gifs={skinPreset.gifs}
            playlist={playlist.id + page.toString()}
            onClickCallback={primePageToCurrentPlaying}
          />
        </Grid>
        <Grid item xs={5} style={{ textAlign: 'right', padding: '10px' }}>
          {playlist.type === PLAYLIST_ENUMS.TYPE_TYPICA_PLAYLIST && (
            <FavSettingsButtons
              playlist={playlist}
              usePlaylist={playlistPaginated}
            />
          )}
          <SongSearchBar handleSearch={handleSearch} ref={searchBarRef} />
        </Grid>
      </Grid>
    </Box>
  );
}

export const songText = {
  fontSize: 16,
  minWidth: 0,
  overflow: 'hidden',
  paddingBottom: '4px',
  paddingTop: '4px',
};
