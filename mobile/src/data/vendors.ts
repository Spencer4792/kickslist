import { Vendor } from '../types';

export const vendors: Vendor[] = [
  { id: 'nike', name: 'Nike', trustRating: 5.0, reviewCount: 890000, color: '#111111', url: 'https://nike.com', type: 'retail', description: 'Official Nike Store', isActive: true },
  { id: 'footlocker', name: 'Foot Locker', trustRating: 4.5, reviewCount: 320000, color: '#d41a1f', url: 'https://footlocker.com', type: 'retail', description: 'Footwear Retail Chain', isActive: true },
  { id: 'finishline', name: 'Finish Line', trustRating: 4.5, reviewCount: 185000, color: '#0057b8', url: 'https://finishline.com', type: 'retail', description: 'Athletic Footwear Retailer', isActive: true },
  { id: 'champssports', name: 'Champs Sports', trustRating: 4.3, reviewCount: 145000, color: '#00529b', url: 'https://champssports.com', type: 'retail', description: 'Sports Footwear Retailer', isActive: true },
  { id: 'jdsports', name: 'JD Sports', trustRating: 4.4, reviewCount: 210000, color: '#000000', url: 'https://jdsports.com', type: 'retail', description: 'UK-Based Sports Retailer', isActive: true },
  { id: 'dickssporting', name: "Dick's Sporting", trustRating: 4.3, reviewCount: 275000, color: '#006341', url: 'https://dickssportinggoods.com', type: 'retail', description: 'Sporting Goods Retailer', isActive: true },
  { id: 'stockx', name: 'StockX', trustRating: 4.5, reviewCount: 125000, color: '#08a05c', url: 'https://stockx.com', type: 'resale', description: 'Stock Market for Sneakers', isActive: true },
  { id: 'goat', name: 'GOAT', trustRating: 4.5, reviewCount: 98000, color: '#7c3aed', url: 'https://goat.com', type: 'resale', description: 'Sneaker Marketplace', isActive: true },
  { id: 'ebay', name: 'eBay', trustRating: 4.0, reviewCount: 250000, color: '#e53238', url: 'https://ebay.com', type: 'resale', description: 'Online Marketplace', isActive: true },
  { id: 'flightclub', name: 'Flight Club', trustRating: 5.0, reviewCount: 45000, color: '#ff6b00', url: 'https://flightclub.com', type: 'resale', description: 'Premium Sneaker Consignment', isActive: true },
];

export function getVendorById(id: string): Vendor | undefined {
  return vendors.find(v => v.id === id);
}

export function getRetailVendors(): Vendor[] {
  return vendors.filter(v => v.type === 'retail');
}

export function getResaleVendors(): Vendor[] {
  return vendors.filter(v => v.type === 'resale');
}
