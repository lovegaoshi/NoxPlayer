/* eslint-disable no-shadow */
import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { PLAYLIST_ENUMS } from '@enums/Playlist';
import useApp from '@stores/useApp';
import { UsePlaylistP } from '../hooks/usePlaylistPaginated';
import RandomGIFIcon from './RandomGIF';
import FavSettingsButtons from '../PlaylistSetting/PlaylistSettingsButton';
import SongSearchBar from './SongSearchbar';
import PlaylistSelectButton from './PlaylistSelectButton';

interface Props {
  playlist: NoxMedia.Playlist;
  playlistPaginated: UsePlaylistP;
}
export default function FavHeader({ playlist, playlistPaginated }: Props) {
  const { page, primePageToCurrentPlaying, handleSearch, searchBarRef } =
    playlistPaginated;
  const { colorTheme, gifs } = useApp((state) => state.playerStyle);

  return (
    <Box sx={styles.box}>
      <Grid container spacing={2} sx={styles.gridContainer}>
        <Grid item xs={5} sx={styles.gridPlaylistTitle} overflow='hidden'>
          <Typography
            variant='h6'
            sx={[
              {
                color: colorTheme.playlistCaptionColor,
              },
              styles.text,
            ]}
          >
            {playlist.title}
          </Typography>
        </Grid>
        <Grid item xs={2} sx={styles.gridGIF}>
          <RandomGIFIcon
            gifs={gifs}
            playlist={playlist.id + page.toString()}
            onClickCallback={primePageToCurrentPlaying}
          />
        </Grid>
        <Grid item xs={5} sx={styles.gridPlaylistSetting}>
          <PlaylistSelectButton usePlaylist={playlistPaginated} />
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

const styles = {
  box: { flexGrow: 1, maxHeight: '80px', paddingBottom: '8px' },
  gridPlaylistTitle: {
    textAlign: 'left',
    padding: '0px',
    paddingLeft: '12px',
    paddingTop: '12px',
  },
  gridContainer: { padding: '10px' },
  text: {
    whiteSpace: 'nowrap',
    fontSize: '2rem',
  },
  gridGIF: { textAlign: 'center', padding: '0px' },
  gridPlaylistSetting: { textAlign: 'right', padding: '10px' },
};
