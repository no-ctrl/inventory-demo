export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  images?: ProductImage[];
}

export interface ProductImage {
  id: number;
  filename: string;
  url: string;
  uploadedAt: string;
} 