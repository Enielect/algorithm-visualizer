// Breadth-first search, written as a generator.
//
// This is the reference implementation for every other algorithm you add.
// Notice what's NOT here: no React, no colors, no DOM, no timers. It is
// ordinary BFS over an adjacency list that happens to `yield` instead of
// silently mutating state.
//
// graph shape: { nodes: [{ id }], edges: [{ id, source, target }] }

export function* bfs(graph, startId) {
  const adjacency = buildAdjacency(graph);

  const visited = new Set([startId]);
  const queue = [startId];

  yield {
    type: "enqueue",
    nodeId: startId,
    label: `Start at ${startId} - enqueue`,
    meta: { queue: [...queue] },
  };

  while (queue.length > 0) {
    const current = queue.shift();

    yield {
      type: "visit-node",
      nodeId: current,
      label: `Visit ${current}`,
      meta: { queue: [...queue] },
    };

    const neighbors = adjacency.get(current) ?? [];
    for (const { neighborId, edgeId } of neighbors) {
      yield {
        type: "examine-edge",
        edgeId,
        nodeId: current,
        label: `Look at edge ${current} -> ${neighborId}`,
      };

      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);

        yield {
          type: "enqueue",
          nodeId: neighborId,
          edgeId,
          label: `Enqueue ${neighborId} via ${current} -> ${neighborId}`,
          meta: { queue: [...queue] },
        };
      }
    }
  }

  yield {
    type: "done",
    label: "BFS complete - all reachable nodes visited",
  };
}

function buildAdjacency(graph) {
  const adjacency = new Map();
  for (const node of graph.nodes) adjacency.set(node.id, []);

  for (const edge of graph.edges) {
    adjacency.get(edge.source)?.push({ neighborId: edge.target, edgeId: edge.id });
    // Treat the sample graph as undirected. Directed algorithms (e.g. a
    // future topological sort) should skip this second push.
    adjacency.get(edge.target)?.push({ neighborId: edge.source, edgeId: edge.id });
  }

  return adjacency;
}
