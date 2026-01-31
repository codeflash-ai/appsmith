const SIZES = ["Bytes", "KB", "MB", "GB", "TB"];
const LOG_1024 = Math.log(1024);

export const formatBytes = (bytes: string | number) => {
  if (!bytes) return;

  const value = typeof bytes === "string" ? parseInt(bytes) : bytes;

  if (value === 0) return "0 bytes";

  // Use bit shifting to find the magnitude (faster than logarithms for small values)
  let i = 0;
  let temp = value;
  while (temp >= 1024 && i < 4) {
    temp /= 1024;
    i++;
  }

  if (i === 0) return `${bytes} ${SIZES[i]}`;

  return `${(value / Math.pow(1024, i)).toFixed(1)} ${SIZES[i]}`;
};
