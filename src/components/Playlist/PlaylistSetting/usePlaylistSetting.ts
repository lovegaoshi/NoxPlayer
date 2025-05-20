import usePlaylistSetting from '@APM/hooks/usePlaylistSetting';
import useApp from '@stores/useApp';
import { NoxRepeatModeToRJKM } from '@utils/RJKMUtils';

export default (playlist: NoxMedia.Playlist) => {
  const usedPlaylistSetting = usePlaylistSetting(playlist);
  const RJKMref = useApp((state) => state.RJKMref);

  const saveSetting = (
    setting: Partial<NoxMedia.Playlist> = {},
    callback: (val: NoxMedia.Playlist) => void = () => undefined,
  ) => {
    usedPlaylistSetting.saveSetting(setting, callback);
    /**
     * 
  order: 'order',
  orderLoop: 'orderLoop',
  singleLoop: 'singleLoop',
  shufflePlay: 'shufflePlay',
     */
    // @ts-expect-error RJKM type doesnt have updatePlayMode, but it does exist
    RJKMref?.updatePlayMode(
      // @ts-expect-error updatePlaymode catches null anyways
      NoxRepeatModeToRJKM[usedPlaylistSetting.repeatMode],
    );
  };

  return {
    ...usedPlaylistSetting,
    saveSetting,
  };
};
