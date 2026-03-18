export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price?: number;
}

export interface Order {
  id?: string;
  buyerId?: string;
  sellerId?: string; // Opcional na criação, o backend descobre
  items: OrderItem[];
  totalValue?: number;
  status?: string;
}
