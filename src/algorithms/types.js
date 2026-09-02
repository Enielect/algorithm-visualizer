/**
 * This file has no runtime code. It exists to document the one contract
 * every algorithm in this project must follow: a "step".
 *
 * A step is a small, plain-object snapshot of "one meaningful thing that
 * just happened" inside an algorithm. Steps are the ONLY channel of
 * communication between algorithm logic and the UI. An algorithm never
 * calls setState, never imports React, never knows a UI exists.
 *
 * @typedef {Object} Step
 * @property {string} type
 *   A short tag describing what happened, e.g. "visit-node", "enqueue",
 *   "relax-edge", "mark-frontier", "done". The renderer switches on this.
 * @property {string} [nodeId]
 *   The node this step concerns, if any.
 * @property {string} [edgeId]
 *   The edge this step concerns, if any (format: "a->b").
 * @property {string} label
 *   A short human-readable description shown in the step log,
 *   e.g. "Visit node C" or "Enqueue neighbor D".
 * @property {Object} [meta]
 *   Anything algorithm-specific that doesn't fit the fields above
 *   (a running distance, a queue snapshot, a low-link value, etc).
 *   Keep this small - it gets stored once per step, for every step.
 *
 * Design rules for writing a new algorithm generator:
 *  1. The generator receives a plain graph object and a start node id.
 *     It must not receive React state, refs, or DOM nodes.
 *  2. Every `yield` should represent something worth ANIMATING, not
 *     every line of code. Looping to check neighbors is not a step;
 *     deciding to visit one of them is.
 *  3. Never yield the same mutable object twice. If you're tracking a
 *     running structure (visited set, distances map), yield a shallow
 *     copy of the relevant piece, not a reference to the live object -
 *     otherwise every step in history will show the FINAL state.
 */

export {};
