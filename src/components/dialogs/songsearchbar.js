import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';

export default React.forwardRef(({ requestSearch }, ref) => {
  return (
    <TextField
      id="outlined-basic"
      color="secondary"
      size="small"
      placeholder="歌单内搜索歌曲"
      inputRef={ref}
      onChange={requestSearch}
      autoComplete="off"
      type="search"
    />
  );
});
