export default function PlaybackControls({
  cursor,
  totalSteps,
  isPlaying,
  atStart,
  atEnd,
  currentStepLabel,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSeek,
}) {
  return (
    <div className="playback">
      <div className="playback__row">
        <button onClick={onReset} title="Reset to start">
          ⟲
        </button>
        <button onClick={onStepBackward} disabled={atStart} title="Previous step">
          ◀
        </button>
        <button onClick={isPlaying ? onPause : onPlay} className="playback__play">
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={onStepForward} disabled={atEnd} title="Next step">
          ▶
        </button>
        <span className="playback__counter">
          {cursor + 1} / {totalSteps}
        </span>
      </div>

      <input
        type="range"
        className="playback__scrub"
        min={0}
        max={Math.max(totalSteps - 1, 0)}
        value={cursor}
        onChange={(e) => onSeek(Number(e.target.value))}
      />

      <p className="playback__label">{currentStepLabel}</p>
    </div>
  );
}
