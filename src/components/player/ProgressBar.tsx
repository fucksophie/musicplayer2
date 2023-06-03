function ProgressBar({
  progressBarRef,
  audioRef,
  timeProgress,
  duration,
}: {
  progressBarRef: { current: any };
  audioRef: { current: any };
  timeProgress: number;
  duration: number;
}) {
  const handleProgressChange = () => {
    audioRef.current.currentTime = progressBarRef.current.value;
  };

  const formatTime = (time: number) => {
    if (time && !Number.isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return '00:00';
  };

  return (
    <div className="w-full flex align-center grow pr-1 items-center">
      <span className="text-inputColor pr-1">{formatTime(timeProgress)}</span>
      <input
        type="range"
        ref={progressBarRef}
        defaultValue="0"
        className="w-full"
        onChange={handleProgressChange}
      />
      <span className="text-inputColor pl-1">{formatTime(duration)}</span>
    </div>
  );
}

export default ProgressBar;
