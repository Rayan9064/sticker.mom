import { useState, useEffect, useMemo } from 'react';
import { Product, ItemFormData } from '@/lib/supabase';
import { ProductsService } from '@/services/productsService';
import { Button } from '@/components/admin/ui/button';
import { ItemsTable } from './ItemsTable';
import { ItemFilters } from './ItemFilters';
import { ItemFormModal } from './ItemFormModal';
import { Plus, Package, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ItemsDashboard() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStockStatus, setSelectedStockStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const { toast } = useToast();

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const products = await ProductsService.getAll();
      setItems(products);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get all unique categories
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    items.forEach((item) => {
      if (item.category) categories.add(item.category);
    });
    return Array.from(categories).sort();
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStockStatus = selectedStockStatus === 'all' ||
        (selectedStockStatus === 'in-stock' && item.inStock) ||
        (selectedStockStatus === 'out-of-stock' && !item.inStock);

      const matchesCategory =
        selectedCategory === 'all' ||
        item.category === selectedCategory;

      return matchesSearch && matchesStockStatus && matchesCategory;
    });
  }, [items, searchTerm, selectedStockStatus, selectedCategory]);

  const handleCreateItem = () => {
    setEditingItem(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditItem = (item: Product) => {
    setEditingItem(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await ProductsService.delete(itemId);
      setItems(items.filter((item) => item.id !== itemId));
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitItem = async (data: ItemFormData) => {
    try {
      if (modalMode === 'create') {
        const newProduct = await ProductsService.create(data);
        setItems([newProduct, ...items]);
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      } else if (editingItem) {
        const updatedProduct = await ProductsService.update(editingItem.id, data);
        setItems(
          items.map((item) =>
            item.id === editingItem.id ? updatedProduct : item
          )
        );
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      }

      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStockStatus('all');
    setSelectedCategory('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your store inventory and product catalog
          </p>
        </div>
        <Button
          onClick={handleCreateItem}
          className="bg-gray-900 hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Package className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-600">Total Items</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : items.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-600">In Stock</span>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : items.filter((item) => item.inStock).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-600">Out of Stock</span>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : items.filter((item) => !item.inStock).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-600">Categories</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : availableCategories.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <ItemFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStockStatus={selectedStockStatus}
        onStockStatusChange={setSelectedStockStatus}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        availableCategories={availableCategories}
        onReset={handleResetFilters}
      />

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredItems.length} of {items.length} items
        </p>
      </div>

      {/* Table */}
      <ItemsTable
        items={filteredItems}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
      />

      {/* Modal */}
      <ItemFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitItem}
        item={editingItem}
        mode={modalMode}
      />
    </div>
  );
}