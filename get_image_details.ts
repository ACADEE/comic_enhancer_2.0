export const getImageDetails = (file: File): Promise<{ base64: string, aspectRatio: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const targetRatio = img.width / img.height;
        const allowedRatios = [
          '1:1', '3:2', '2:3', '4:3', '3:4', '5:4', '4:5', '16:9', '9:16', '2:1', '1:2', '3:1', '1:3', '21:9', '9:21'
        ];
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
        resolve({ base64, aspectRatio: closest });
      };
      img.onerror = (error) => reject(error);
      img.src = base64;
    };
    reader.onerror = (error) => reject(error);
  });
};
