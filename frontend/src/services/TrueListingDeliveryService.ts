import { mockListings } from '../data/mockData';

//fetch listings
export function fetchListings() {
  return Promise.resolve(mockListings);
}