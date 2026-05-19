export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/fallback.jpg';

  // Already a full URL (Cloudinary, external, or legacy localhost)
  if (imagePath.startsWith('http')) return imagePath;

  // Relative path — prefix with backend URL (legacy local uploads fallback)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};
