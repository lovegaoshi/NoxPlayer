function FavListHeader() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Typography
          variant='subtitle1'
          style={{
            color: colorTheme.myPlayListCaptionColor,
            paddingLeft: '8px',
            paddingTop: '12px',
          }}
        >
          我的歌单
        </Typography>
      </Grid>
      <Grid item xs={8} style={{ textAlign: 'right', paddingRight: '8px' }}>
        <Tooltip title='全歌单播放'>
          <IconButton size='large' onClick={shuffleAll}>
            <ShuffleIcon sx={AddFavIcon} />
          </IconButton>
        </Tooltip>
        <PlayerSettingsButton AddFavIcon={AddFavIcon} />
        <HelpPanelButton AddFavIcon={AddFavIcon} />
      </Grid>
    </Grid>
  );
}

export default FavListHeader;
