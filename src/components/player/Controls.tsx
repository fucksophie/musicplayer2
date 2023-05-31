import { useState, useEffect, useRef, useCallback } from 'react';
import {
  faBackwardStep,
  faBackward,
  faPause,
  faPlay,
  faForward,
  faForwardStep,
  faShuffle,
  faRepeat,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Controls({
  audioRef,
  progressBarRef,
  duration,
  setTimeProgress,
  tracks,
  trackIndex,
  setTrackIndex,
  setCurrentTrack,
  handleNext,
  repeating,
  setRepeating,
  shuffle,
  setIsPlaying,
  isPlaying,
}: {
  audioRef: { current: any };
  progressBarRef: { current: any };
  isPlaying: boolean;
  setIsPlaying: any;
  duration: number;
  setTimeProgress: any;
  tracks: any[];
  trackIndex: number;
  setTrackIndex: any;
  setCurrentTrack: any;
  handleNext: any;
  setRepeating: any;
  repeating: boolean;
  shuffle: any;
}) {
  const [volume, setVolume] = useState(60);
  // eslint-disable-next-line no-unused-vars
  const [muteVolume] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying((prev: boolean) => !prev);
  };

  const playAnimationRef = useRef<number>();

  const repeat = useCallback(() => {
    const { currentTime } = audioRef.current;
    setTimeProgress(currentTime);
    progressBarRef.current.value = currentTime;
    progressBarRef.current.style.setProperty(
      '--range-progress',
      `${(progressBarRef.current.value / duration) * 100}%`
    );
    playAnimationRef.current = requestAnimationFrame(repeat);
  }, [audioRef, duration, progressBarRef, setTimeProgress]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

    playAnimationRef.current = requestAnimationFrame(repeat);
  }, [audioRef, isPlaying, repeat]);

  const skipForward = () => {
    audioRef.current.currentTime += 15;
  };

  const skipBackward = () => {
    audioRef.current.currentTime -= 15;
  };

  const handlePrevious = () => {
    if (trackIndex === 0) {
      const lastTrackIndex = tracks.length - 1;
      setTrackIndex(lastTrackIndex);
      setCurrentTrack(tracks[lastTrackIndex]);
    } else {
      setTrackIndex((prev: number) => prev - 1);
      setCurrentTrack(tracks[trackIndex - 1]);
    }
  };

  useEffect(() => {
    if (audioRef) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef, muteVolume]);

  return (
    <>
      <div className="h-full p-1">
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={faBackwardStep}
            className="fa-2x text-white mx-2"
            onClick={handlePrevious}
          />
          <FontAwesomeIcon
            icon={faBackward}
            className="fa-2x text-white mx-2"
            onClick={skipBackward}
          />
          <FontAwesomeIcon
            icon={isPlaying ? faPause : faPlay}
            className="fa-3x text-white mx-2"
            onClick={togglePlayPause}
          />
          <FontAwesomeIcon
            icon={faForward}
            className="fa-2x text-white mx-2"
            onClick={skipForward}
          />
          <FontAwesomeIcon
            icon={faForwardStep}
            className="fa-2x text-white mx-2"
            onClick={handleNext}
          />
        </div>
        <div>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(+e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center p-1 h-full">
        <FontAwesomeIcon
          icon={faRepeat}
          className={`${
            repeating ? 'text-green-400' : 'text-red-400'
          } fa-xl grow`}
          onClick={() => setRepeating((state: boolean) => !state)}
        />
        <FontAwesomeIcon
          icon={faShuffle}
          className="fa-xl text-white grow"
          onClick={() => shuffle()}
        />
      </div>
    </>
  );
}

export default Controls;
