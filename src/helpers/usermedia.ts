export function hasGetUserMedia() {
  return !!(
    (navigator?.getUserMedia as Navigator) ||
    (navigator?.webkitGetUserMedia as Navigator) ||
    (navigator?.mozGetUserMedia as Navigator) ||
    (navigator?.msGetUserMedia as Navigator)
  );
}
