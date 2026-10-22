export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

export const getUploadUrl = (filename) => {
  if (!filename) return `${API_BASE_URL}/uploads/default.png`;
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }
  return `${API_BASE_URL}/uploads/${filename}`;
};

export default API_BASE_URL;
