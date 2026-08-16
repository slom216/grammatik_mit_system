/**
 * True on a touch-primary device.
 *
 * Native HTML5 drag-and-drop never fires from a touch, so anything that
 * advertises dragging — the `draggable` attribute, a grip handle, `cursor:
 * grab` — is a dead affordance on a phone. The tap paths beside it are the real
 * ones there, so the drag ones are withdrawn rather than left to be discovered
 * as broken.
 */
export function isCoarsePointer(): boolean {
  return window.matchMedia('(pointer: coarse)').matches;
}
