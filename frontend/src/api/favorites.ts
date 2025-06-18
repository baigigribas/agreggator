export interface Favorite {
  id: number;
  listing_id: number;
}

export async function getUserFavorites(userId: number): Promise<number[]> {
  const res = await fetch(`http://localhost:3001/api/users/${userId}/favorites`);
  if (!res.ok) throw new Error('Failed to fetch favorites');
  const favorites = await res.json();
  console.log("Fetched favorites:", favorites);
  return favorites;
}

export async function addFavorite(userId: number, listingId: number) {
  console.log("Adding favorite:", { userId, listingId });
  const res = await fetch('http://localhost:3001/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, listing_id: listingId }),
  });
  if (!res.ok) throw new Error('Failed to add favorite');
  return res.json();
}

export async function removeFavorite(favoriteId: number) {
  const res = await fetch(`http://localhost:3001/api/favorites/${favoriteId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to remove favorite');
  return res.json();
}