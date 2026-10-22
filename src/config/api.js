export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

/**
 * Generates reliable image and asset URLs across local and Vercel production deployments.
 * Automatically sanitizes hardcoded development/localhost URLs and paths.
 */
export const getUploadUrl = (filename) => {
  if (!filename) return `${API_BASE_URL}/uploads/default.png`;

  // If string contains legacy development localhost URLs, strip and rewrite to production API
  if (filename.includes("localhost:5000/uploads/")) {
    const clean = filename.split("localhost:5000/uploads/")[1];
    return `${API_BASE_URL}/uploads/${clean}`;
  }

  // Persistent Cloudinary, S3, or trusted HTTPS origins
  if (
    (filename.startsWith("http://") || filename.startsWith("https://")) &&
    !filename.includes("localhost")
  ) {
    return filename;
  }

  // Data URLs (e.g. Base64 previews)
  if (filename.startsWith("data:image/")) {
    return filename;
  }

  // Relative upload filenames
  const cleanName = filename.replace(/^\/+/, "").replace(/^uploads\//, "");
  return `${API_BASE_URL}/uploads/${cleanName}`;
};

export default API_BASE_URL;
