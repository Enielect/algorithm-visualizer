// GraphCanvas knows nothing about BFS, DFS, or Dijkstra. It only knows how
// to fold a list of generic steps into "which nodes/edges are in which
// visual state", then draw that. This is what keeps the renderer reusable
// across every algorithm you add later.

export default function GraphCanvas({ graph, steps, cursor }) {
  const visual = deriveVisualState(steps, cursor);

  return (
    <svg viewBox="0 0 640 360" className="graph-canvas" role="img" aria-label="Graph visualization">
      {graph.edges.map((edge) => {
        const source = graph.nodes.find((n) => n.id === edge.source);
        const target = graph.nodes.find((n) => n.id === edge.target);
        const state = visual.edgeState.get(edge.id) ?? "idle";
        return (
          <line
            key={edge.id}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            className={`edge edge--${state}`}
          />
        );
      })}

      {graph.nodes.map((node) => {
        const state = visual.nodeState.get(node.id) ?? "idle";
        return (
          <g key={node.id} className={`node node--${state}`}>
            <circle cx={node.x} cy={node.y} r={22} />
            <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central">
              {node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Folds every step from 0..cursor into a final node/edge state map.
// Re-derived on every render instead of tracked incrementally - the graphs
// here are small, and this keeps rendering a pure function with no
// hidden mutable state to get out of sync with the cursor.
function deriveVisualState(steps, cursor) {
  const nodeState = new Map();
  const edgeState = new Map();

  for (let i = 0; i <= cursor && i < steps.length; i++) {
    const step = steps[i];
    const isCurrent = i === cursor;

    if (step.nodeId) {
      if (step.type === "visit-node") {
        nodeState.set(step.nodeId, isCurrent ? "current" : "visited");
      } else if (step.type === "enqueue" && !nodeState.has(step.nodeId)) {
        nodeState.set(step.nodeId, "frontier");
      }
    }

    if (step.edgeId) {
      if (step.type === "examine-edge") {
        edgeState.set(step.edgeId, isCurrent ? "current" : "examined");
      } else if (step.type === "enqueue" && edgeState.get(step.edgeId) !== "examined") {
        edgeState.set(step.edgeId, "used");
      }
    }
  }

  return { nodeState, edgeState };
}
