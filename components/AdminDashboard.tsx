
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';
import { Product, Category } from '../types';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
    } else {
      setEditingProduct({
        id: Date.now(), // Simple ID generation
        category: Category.CLOTHING,
        tags: [],
        image: 'https://picsum.photos/400/600'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.price) return;

    const productData = editingProduct as Product;
    
    // Check if it's an update or create
    const exists = products.find(p => p.id === productData.id);
    
    if (exists) {
      onUpdateProduct(productData);
    } else {
      onAddProduct(productData);
    }
    setIsModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would handle file upload. 
    // For now, we just use the URL input text.
    setEditingProduct({...editingProduct, image: e.target.value});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-10 border-b border-black pb-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-500">상품 목록 및 재고 관리</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-black text-white px-6 py-3 flex items-center gap-2 hover:bg-gray-800 transition-colors font-medium"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500">
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-gray-100 flex-shrink-0 overflow-hidden">
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium text-gray-600">
                    {product.category}
                  </span>
                </td>
                <td className="p-4 font-medium">
                  ₩{product.price.toLocaleString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(product)}
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                       onClick={() => {
                           if(window.confirm('정말 삭제하시겠습니까?')) onDeleteProduct(product.id);
                       }}
                       className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-serif font-bold">
                {editingProduct.id && products.find(p => p.id === editingProduct.id) ? 'Edit Product' : 'New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Product Name</label>
                  <input 
                    type="text" 
                    required
                    value={editingProduct.name || ''}
                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors"
                    placeholder="ex) Classic White Shirt"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Price (KRW)</label>
                  <input 
                    type="number" 
                    required
                    value={editingProduct.price || ''}
                    onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors"
                    placeholder="ex) 45000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Category</label>
                <select 
                  value={editingProduct.category || Category.CLOTHING}
                  onChange={e => setEditingProduct({...editingProduct, category: e.target.value as Category})}
                  className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent"
                >
                  {Object.values(Category).filter(c => c !== Category.ALL).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Image URL</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={editingProduct.image || ''}
                        onChange={handleImageChange}
                        className="flex-1 border-b border-gray-300 py-2 focus:border-black outline-none transition-colors"
                        placeholder="https://..."
                    />
                    <div className="w-12 h-12 bg-gray-100 flex-shrink-0 border border-gray-200">
                        {editingProduct.image && (
                            <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" />
                        )}
                    </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Description</label>
                <textarea 
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="w-full border border-gray-300 p-3 h-32 resize-none focus:border-black outline-none transition-colors"
                  placeholder="Describe the product detail..."
                />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Tags (comma separated)</label>
                 <input 
                    type="text" 
                    value={editingProduct.tags?.join(', ') || ''}
                    onChange={e => setEditingProduct({...editingProduct, tags: e.target.value.split(',').map(t => t.trim())})}
                    className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors"
                    placeholder="summer, new, sale"
                  />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-black text-white py-4 font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
