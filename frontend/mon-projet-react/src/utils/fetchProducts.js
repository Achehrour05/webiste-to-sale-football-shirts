// utils/fetchProducts.js
export const fetchAndFormatProducts = async (url, imagePathField = 'path') => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data.map(p => ({
        ...p,
        img: `http://localhost:3000${p[imagePathField]}`,
      }));
    } catch (err) {
      console.error(`Fetch error from ${url}:`, err);
      return [];
    }
  };
  