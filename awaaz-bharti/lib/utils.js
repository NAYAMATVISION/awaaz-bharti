export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/fallback.jpg';
  
  // If it's already a full URL (starts with http)
  if (imagePath.startsWith('http')) {
    // Replace 127.0.0.1 with localhost to avoid Next.js SSR private IP issues
    return imagePath.replace('127.0.0.1', 'localhost');
  }
  
  // If it's a relative path (starts with /uploads or uploads), prefix with backend URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${baseUrl}${cleanPath}`;
};
