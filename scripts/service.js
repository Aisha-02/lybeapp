import TrackPlayer, { Event } from 'react-native-track-player';
import { navigate } from '../navigation/NavigationRef';

module.exports = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());

  TrackPlayer.addEventListener(Event.RemoteDuck, (e) => {
    if (e.paused) TrackPlayer.pause();
  });

  // This handles tapping the notification
  TrackPlayer.addEventListener(Event.PlaybackNotificationPressed, async () => {
    console.log('Notification tapped');
    const trackId = await TrackPlayer.getCurrentTrack();
    const track = await TrackPlayer.getTrack(trackId);
    if (track) {
      navigate('TrackDetails', { track });
    }
  });
};
