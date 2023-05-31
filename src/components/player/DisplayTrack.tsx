import { useState, useEffect } from 'react';
import Subsonic from '../../lib/subsonic';

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

const subsonic = new Subsonic(
  localStorage.http,
  localStorage.username,
  localStorage.password
);
function DisplayTrack({
  currentTrack,
  audioRef,
  setDuration,
  progressBarRef,
  handleEnded,
  handleStarted,
  isPlaying,
  loadNewAudio,
}: {
  currentTrack: any;
  audioRef: { current: any };
  setDuration: any;
  progressBarRef: { current: any };
  handleEnded: any;
  handleStarted: any;
  isPlaying: boolean,
  loadNewAudio: any;
}) {
  const [coverArt, setCoverArt] = useState('');
  const [url, setUrl] = useState('');

  const onLoadedMetadata = () => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
    progressBarRef.current.max = seconds;
  };

  useEffect(() => {
    async function getData() {
      if (!currentTrack.id) return;
      const blob = await subsonic.getCoverArt(currentTrack.albumId);
      const blobber = await blobToBase64(blob);
      if (blobber.includes('application/json;base64')) {
        setCoverArt("");
      } else {
        setCoverArt(blobber);
      }
    }

    getData();
    setUrl(subsonic.getStreamUrl(currentTrack.id));

  }, [currentTrack]);

  return (
    <>
      <div className="hidden bg-[#00000020] md:block p-1 w-[300px]">
        <div className="absolute bottom-20 right-0 bg-[#00000040] p-1 rounded-t-lg w-[300px]">
          <h1 className="w-full text-center text-white">
            {currentTrack.album}
          </h1>
          {coverArt ? <img src={coverArt} alt="cover art" /> : undefined}
        </div>
        <div className="text-white w-[300px]">
          <h1>{currentTrack.artist}</h1>
          <h1>{currentTrack.title}</h1>
        </div>
      </div>
      <audio
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleEnded}
        onPlay={handleStarted}
      >
        <source src={url} />
        <track kind="captions" />
      </audio>
    </>
  );
}
export default DisplayTrack;
