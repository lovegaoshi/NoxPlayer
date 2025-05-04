import { useNoxSetting } from '@APM/stores/useApp';
import { increasePlaybackCount } from '@APM/utils/db/sqlStorage';

export default () => {
  const currentPlayingId = useNoxSetting((state) => state.currentPlayingId);

  const increasePlayback = async (id = currentPlayingId, count = -1) =>
    increasePlaybackCount(id, count);

  return {
    increasePlayback,
  };
};
