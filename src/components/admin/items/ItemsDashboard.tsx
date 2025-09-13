import { useState, useMemo } from 'react';
import { Item, ItemFormData } from '@/types/item';
import { mockItems } from '@/data/mockItems';
import { Button } from '@/components/admin/ui/button';
import { ItemsTable } from './ItemsTable';
import { ItemFilters } from './ItemFilters';
import { ItemFormModal } from './ItemFormModal';
import { Plus, Package } from 'lucide-react';

export function ItemsDashboard() {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Get all unique tags
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    items.forEach((item) => {
      item.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => item.tags.includes(tag));

      return matchesSearch && matchesStatus && matchesTags;
    });
  }, [items, searchTerm, selectedStatus, selectedTags]);

  const handleCreateItem = () => {
    setEditingItem(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter((item) => item.id !== itemId));
    }
  };

  const handleSubmitItem = (data: ItemFormData) => {
    if (modalMode === 'create') {
      const newItem: Item = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setItems([newItem, ...items]);
    } else if (editingItem) {
      setItems(
        items.map((item) =>
          item.id === editingItem.id
            ? { ...item, ...data, updatedAt: new Date() }
            : item
        )
      );
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedTags([]);
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
          <p className="text-2xl font-bold text-gray-900 mt-1">{items.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-600">Active</span>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {items.filter((item) => item.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-600">Draft</span>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {items.filter((item) => item.status === 'draft').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-600">Archived</span>
          <p className="text-2xl font-bold text-gray-600 mt-1">
            {items.filter((item) => item.status === 'archived').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <ItemFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        availableTags={availableTags}
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