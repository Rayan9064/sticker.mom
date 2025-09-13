import { Item } from '@/types/item';

export const mockItems: Item[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.',
    price: 299.99,
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=300'
    ],
    tags: ['electronics', 'headphones', 'wireless', 'premium'],
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable ergonomic office chair designed for long work sessions. Adjustable height and lumbar support.',
    price: 449.00,
    images: [
      'https://images.pexels.com/photos/6966522/pexels-photo-6966522.jpeg?auto=compress&cs=tinysrgb&w=300'
    ],
    tags: ['furniture', 'office', 'ergonomic', 'comfort'],
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking watch with heart rate monitoring, GPS, and smartphone connectivity.',
    price: 199.99,
    images: [
      'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=300'
    ],
    tags: ['wearables', 'fitness', 'smart', 'health'],
    status: 'draft',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '4',
    name: 'Minimalist Desk Lamp',
    description: 'Modern minimalist desk lamp with adjustable brightness and USB charging port.',
    price: 89.99,
    images: [
      'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=300'
    ],
    tags: ['lighting', 'desk', 'minimalist', 'modern'],
    status: 'active',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '5',
    name: 'Organic Cotton T-Shirt',
    description: 'Soft organic cotton t-shirt available in multiple colors. Sustainable and comfortable.',
    price: 24.99,
    images: [
      'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=300'
    ],
    tags: ['clothing', 'organic', 'cotton', 'sustainable'],
    status: 'archived',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14')
  }
];