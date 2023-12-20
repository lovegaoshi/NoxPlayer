import React from 'react';
import TextField from '@mui/material/TextField';

interface Props {
  handleSearch: (v: string) => void;
}
export default React.forwardRef(({ handleSearch }: Props, ref) => {
  return (
    <TextField
      id='outlined-basic'
      color='secondary'
      size='small'
      placeholder='歌单内搜索歌曲'
      inputRef={ref}
      onChange={(e) => handleSearch(e.target.value)}
      autoComplete='off'
      type='search'
    />
  );
});
