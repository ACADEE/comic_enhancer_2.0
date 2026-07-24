const allowedRatios = [
  '1:1', '3:2', '2:3', '4:3', '3:4', '5:4', '4:5', '16:9', '9:16', '2:1', '1:2', '3:1', '1:3', '21:9', '9:21'
];
function getClosestAspectRatio(width: number, height: number): string {
  const targetRatio = width / height;
  let closest = '1:1';
  let minDiff = Infinity;
  for (const ratio of allowedRatios) {
    const [w, h] = ratio.split(':').map(Number);
    const r = w / h;
    const diff = Math.abs(targetRatio - r);
    if (diff < minDiff) {
      minDiff = diff;
      closest = ratio;
    }
  }
  return closest;
}
console.log(getClosestAspectRatio(1920, 1080));
console.log(getClosestAspectRatio(800, 1200));
