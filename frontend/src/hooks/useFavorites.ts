import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    const stored = localStorage.getItem('favoriteIds');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoriteIds', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (id: number) => {
    setFavoriteIds(prev => {
      const updated = prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id];
      console.log('Toggled favorite:', id, 'Now:', updated);
      return updated;
    });
  };

  return { favoriteIds, toggleFavorite };
}