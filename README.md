# Algorithm visualizer - base system

## Run it

```
npm install
npm run dev
```

## How it's built

Five pieces, each with exactly one job:

```
src/algorithms/bfs.js        pure generator - runs the algorithm, yields steps
src/hooks/useStepHistory.js  drains the generator, owns cursor + playback timer
src/components/GraphCanvas.jsx    pure function of (graph, steps-so-far) -> SVG
src/components/PlaybackControls.jsx  transport buttons + scrub slider
src/App.jsx                  wires the three together
```

The rule that makes this extensible: **the algorithm never knows the UI
exists, and the UI never knows which algorithm is running.** The only
contract between them is the `Step` shape documented in
`src/algorithms/types.js`. Everything else - colors, animation speed,
scrubbing - is built on top of that array of steps and works identically
for any algorithm that produces it.

Draining the generator eagerly (all steps computed up front, in
`useStepHistory`) is what makes scrubbing backward free: moving the
cursor to index 12 is just reading `steps[12]`, never "undoing" anything.

## Adding a new algorithm

1. **Write the generator.** Copy `bfs.js` as a template. Same signature -
   `function* yourAlgo(graph, ...args)` - same rule: yield only at points
   worth animating, and never yield a reference to a live mutable
   structure (copy arrays/maps before yielding them in `meta`).
2. **Decide what step `type`s you need.** BFS only needed
   `visit-node` / `enqueue` / `examine-edge` / `done`. Dijkstra will also
   want something like `relax-edge` (tentative distance changed) and
   `finalize-node` (distance locked in). Add these as new string tags -
   no schema migration needed, `deriveVisualState` just switches on them.
3. **Extend `deriveVisualState` in `GraphCanvas.jsx`** (or, once you have
   2+ algorithms, split it into one function per algorithm and pass the
   right one in as a prop) to map your new step types to node/edge
   states. Add matching CSS classes in `index.css`.
4. **Swap the generator in `App.jsx`** - or, better, build an algorithm
   picker (see below) instead of hardcoding one.

## Where to go from here, roughly in order of payoff

- **Algorithm picker.** A dropdown/select in `App.jsx` that swaps which
  generator `useStepHistory` drains. This is the highest-leverage next
  step - it turns "a BFS demo" into "a visualizer" and forces you to
  keep the Step contract honest across algorithms.
- **DFS next**, reusing everything as-is - it's the same shape as BFS
  with a stack instead of a queue, good proof that the architecture
  generalizes before you tackle harder algorithms.
- **Dijkstra / A\*.** You'll need `meta.distance` on nodes and a way to
  show "tentative" vs "finalized" distance visually (a third node state,
  a small text label under each node). This is where the Step `meta`
  field starts earning its keep.
- **A step log side panel.** Render `history.steps` as a scrollable list,
  highlight the one at `cursor`, make each row clickable to `seek()`
  straight to it. Almost no new logic - it's the same `steps`/`cursor`
  you already have, just a second renderer.
- **Speed control.** `useStepHistory`'s second argument is already
  `speed` (steps/sec) - wire a slider in `PlaybackControls` to it.
- **Union-Find / Kruskal's.** Needs a second visual structure alongside
  the graph (the disjoint-set forest) - a good forcing function to
  prove `GraphCanvas` isn't the only renderer you'll ever need; you may
  want a second canvas component here rather than overloading this one.
- **Bigger/random graphs + auto-layout.** Right now node positions are
  hand-placed in `sampleGraph.js`. A force-directed layout (or even a
  simple grid/circular layout function) removes that limit.
- **TypeScript.** Once you have 3+ algorithms, the `Step` contract in
  `types.js` is worth turning into a real discriminated union - you'll
  get autocomplete on `meta` per step `type` and the compiler will catch
  a `GraphCanvas` case you forgot to handle.

## Design notes

Every step is derived state, not accumulated state - `GraphCanvas` refolds
`steps[0..cursor]` into node/edge classes on every render rather than
tracking them incrementally. For graphs this small it's cheap, and it
guarantees the visual is always exactly a pure function of the cursor
position, with nothing that can drift out of sync. If you later profile
this as a bottleneck on much larger graphs, memoizing the fold per-cursor
(or maintaining an incremental running state alongside the step array) is
the fix - but don't reach for it before you need it.
# algorithm-visualizer
