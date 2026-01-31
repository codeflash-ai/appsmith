const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
const LOG_1024 = Math.log(1024);

export const formatBytes = (bytes: string | number) => {
  if (!bytes) return;

  const value = typeof bytes === "string" ? parseInt(bytes) : bytes;

  if (value === 0) return "0 bytes";

  // Fast path for small values to avoid an expensive Math.log call
  if (value < 1024) return bytes + " " + sizes[0];

  const i = Math.floor(Math.log(value) / LOG_1024);

  if (i === 0) return bytes + " " + sizes[i];

  return (value / 1024 ** i).toFixed(1) + " " + sizes[i];
};
