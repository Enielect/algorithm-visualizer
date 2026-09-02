// A small fixed graph with hand-picked layout positions, so the renderer
// doesn't need a layout algorithm yet. Swap this out later for something
// generated (force-directed, grid, etc) without touching anything else.

export const sampleGraph = {
  nodes: [
    { id: "A", x: 340, y: 60 },
    { id: "B", x: 180, y: 160 },
    { id: "C", x: 500, y: 160 },
    { id: "D", x: 100, y: 280 },
    { id: "E", x: 260, y: 280 },
    { id: "F", x: 420, y: 280 },
    { id: "G", x: 580, y: 280 },
  ],
  edges: [
    { id: "A-B", source: "A", target: "B" },
    { id: "A-C", source: "A", target: "C" },
    { id: "B-D", source: "B", target: "D" },
    { id: "B-E", source: "B", target: "E" },
    { id: "C-F", source: "C", target: "F" },
    { id: "C-G", source: "C", target: "G" },
    { id: "E-F", source: "E", target: "F" },
  ],
};

export const START_NODE = "A";
