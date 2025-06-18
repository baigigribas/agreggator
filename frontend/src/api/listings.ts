export async function getAllListings() {
  const res = await fetch('http://localhost:3001/api/listings');
  if (!res.ok) throw new Error('Failed to fetch listings');
  return res.json();
}

export async function getListingById(id: string) {
  const res = await fetch(`http://localhost:3001/api/listings/${id}`);
  if (!res.ok) throw new Error('Failed to fetch listing');
  return res.json();
}

export async function getImagesByListingId(id: string) {
  const res = await fetch(`http://localhost:3001/api/listings/${id}/images`);
  if (!res.ok) throw new Error('Failed to fetch listing images');
  return res.json();
}