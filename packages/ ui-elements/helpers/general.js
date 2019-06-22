export const calculateUploading = (size, onProgress, timeout = 200) => {
  let timer;
  let progress;

  let x = 0;
  const k = size / (1024 * 1024) * 3;
  const calcProgress = function (x) {
    return 0.98 - Math.exp(-1 * (x / k));
  };

  const startCalculate = () => {
    timer = setInterval(() => {
      // time counter in seconds (should be same with setInterval delay)
      x += timeout / 1000;
      progress = calcProgress(x) * 100;
      onProgress(progress);
    }, timeout);
  };
  const stopCalculate = (toFinish, callback) => {
    clearInterval(timer);
    progress = 0;
    if (toFinish) {
      onProgress(100);
      setTimeout(() => {
        onProgress(null);
        if (typeof callback === 'function') {
          callback();
        }
      }, timeout);
    }
  };

  return {
    startCalculate,
    stopCalculate,
  };
};
