import { useCallback } from "react";
import { bfs } from "./algorithms/bfs.js";
import { sampleGraph, START_NODE } from "./graph/sampleGraph.js";
import { useStepHistory } from "./hooks/useStepHistory.js";
import GraphCanvas from "./components/GraphCanvas.jsx";
import PlaybackControls from "./components/PlaybackControls.jsx";

export default function App() {
  // Wrapping in useCallback so useStepHistory's useMemo doesn't re-drain
  // the generator on every render - only when the algorithm/graph changes.
  const runBfs = useCallback(() => bfs(sampleGraph, START_NODE), []);

  const history = useStepHistory(runBfs, 2);

  return (
    <div className="app">
      <header className="app__header">
        <h1>Algorithm visualizer</h1>
        <p>Breadth-first search, starting from node {START_NODE}</p>
      </header>

      <GraphCanvas graph={sampleGraph} steps={history.steps} cursor={history.cursor} />

      <PlaybackControls
        cursor={history.cursor}
        totalSteps={history.steps.length}
        isPlaying={history.isPlaying}
        atStart={history.atStart}
        atEnd={history.atEnd}
        currentStepLabel={history.currentStep?.label ?? ""}
        onPlay={history.play}
        onPause={history.pause}
        onStepForward={history.stepForward}
        onStepBackward={history.stepBackward}
        onReset={history.reset}
        onSeek={history.seek}
      />
    </div>
  );
}
