-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  category TEXT DEFAULT 'general',
  inStock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read products" ON products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update products" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete products" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_instock ON products(inStock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Insert some sample data
INSERT INTO products (name, price, images, description, category, inStock) VALUES
('Custom Sticker Pack', 15.99, ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'], 'Pack of 10 custom designed stickers', 'stickers', true),
('Vinyl Decals', 8.99, ARRAY['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400'], 'High-quality vinyl decals for any surface', 'decals', true),
('Laptop Stickers', 12.99, ARRAY['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'], 'Weather-resistant laptop stickers', 'stickers', true),
('Wall Art Set', 24.99, ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'], 'Beautiful wall art stickers', 'wall-art', false);