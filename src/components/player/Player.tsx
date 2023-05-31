/* eslint-disable no-console */
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import DisplayTrack from './DisplayTrack';
import Subsonic from '../../lib/subsonic';
import { updateNowPlaying, scrobble } from '../../lib/LastFM';

const subsonic = new Subsonic(
  localStorage.http,
  localStorage.username,
  localStorage.password
);

function AudioPlayer({
  tracks,
  trackForced,
  shuffle,
}: {
  tracks: any[];
  trackForced: string;
  shuffle: any;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const [trackIndex, setTrackIndex] = useState(0);

  const [currentTrack, setCurrentTrack] = useState(tracks[trackIndex] || {});
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [previousForced, setPreviousForced] = useState(trackForced || '');

  const [repeating, setRepeating] = useState(false);

  // reference
  const audioRef = useRef<HTMLAudioElement>();
  const progressBarRef = useRef();

  function loadNewAudio() {
    setTimeout(async () => {
      if(!audioRef.current) return;

      await audioRef.current.load();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }, 500)
  }

  if (previousForced !== trackForced) {
    const index = tracks.findIndex((z) => z.id === trackForced);
    setTrackIndex(index);
    setCurrentTrack(tracks[index]);
    setPreviousForced(trackForced);
    loadNewAudio();
  }

  const handleNext = () => {
    if(!audioRef.current) return;

    if (!repeating) {
      if (trackIndex >= tracks.length - 1) {
        setTrackIndex(0);
        setCurrentTrack(tracks[0]);
      } else {
        setTrackIndex((prev) => prev + 1);
        setCurrentTrack(tracks[trackIndex + 1]);
      }
      loadNewAudio();
    } else {
      audioRef.current.currentTime = 0;
      
      audioRef.current.play();
    }
  };

  const handleEnded = async () => {
    if(!audioRef.current) return;
    if (
      audioRef.current.played.length > 1 &&
      (localStorage.serverScrobbling === 'true' ||
        localStorage.lastfmScrobbling === 'true')
    ) {
      toast.error('Song was not scrobbled.');
      handleNext();
      return;
    }
    if (localStorage.serverScrobbling === 'true') {
      console.log(
        'Server scrobbling is enabled. Not scrobbling through Last.FM',
        currentTrack
      );
      subsonic.scrobble(currentTrack.id);
    } else if (
      localStorage.lastfmSession &&
      localStorage.lastfmScrobbling === 'true'
    ) {
      console.log(
        'Last.FM scrobbling session is valid, and scrobbling has been enabled.',
        currentTrack
      );
      await scrobble(
        [
          {
            album: currentTrack.album,
            track: currentTrack.title,
            artist: currentTrack.artist,
            timestamp: Date.now() / 1000,
            albumArtist: currentTrack.artist,
          },
        ],
        localStorage.lastfmSession
      );
    }
    handleNext();
  };

  const handleStarted = async () => {
    if (
      localStorage.lastfmSession &&
      localStorage.lastfmScrobbling === 'true'
    ) {
      console.log('Sending new Last.FM NowPlaying -', currentTrack);
      await updateNowPlaying(
        currentTrack.title,
        currentTrack.artist,
        currentTrack.album,
        currentTrack.duration,
        localStorage.lastfmSession
      );
    } else {
      console.log(
        'LastFM session or scrobblingStatus is disabled.',
        localStorage.lastfmSession,
        localStorage.lastfmScrobbling
      );
    }
  };

  return (
    <div className="left-0 bottom-0 absolute dark:border-zinc-500 bg-slate-500 dark:bg-zinc-600 flex h-20 w-full relative">
      <Controls
        {...{
          audioRef,
          progressBarRef,
          duration,
          setTimeProgress,
          currentTrack,
          tracks,
          trackIndex,
          setTrackIndex,
          setCurrentTrack,
          handleNext,
          setRepeating,
          repeating,
          shuffle,
          isPlaying,
          setIsPlaying,
        }}
      />
      <ProgressBar {...{ progressBarRef, audioRef, timeProgress, duration }} />
      <DisplayTrack
        {...{
          handleStarted,
          currentTrack,
          audioRef,
          setDuration,
          progressBarRef,
          handleEnded,
          isPlaying,
          loadNewAudio
        }}
      />
    </div>
  );
}
export default AudioPlayer;
