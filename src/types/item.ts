export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  tags: string[];
  status: 'active' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemFormData {
  name: string;
  description: string;
  price: number;
  images: string[];
  tags: string[];
  status: 'active' | 'draft' | 'archived';
}