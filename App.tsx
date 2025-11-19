
import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, Instagram, Facebook, Twitter, ChevronRight, LogIn, User as UserIcon, LogOut, Shield, X } from 'lucide-react';
import { Product, CartItem, Category, User } from './types';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { AIChat } from './components/AIChat';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "베이직 오버핏 코튼 셔츠",
    price: 45000,
    category: Category.CLOTHING,
    image: "https://picsum.photos/id/1059/400/600",
    description: "편안한 착용감과 세련된 실루엣을 자랑하는 고밀도 코튼 셔츠입니다. 사계절 내내 활용 가능한 필수 아이템입니다.",
    tags: ["셔츠", "오버핏", "데일리룩"]
  },
  {
    id: 2,
    name: "노이즈 캔슬링 헤드폰 Pro",
    price: 289000,
    category: Category.ELECTRONICS,
    image: "https://picsum.photos/id/3/400/600",
    description: "압도적인 몰입감을 선사하는 프리미엄 무선 헤드폰. 40시간 연속 재생과 급속 충전을 지원합니다.",
    tags: ["음향기기", "헤드폰", "테크"]
  },
  {
    id: 3,
    name: "미니멀 가죽 크로스백",
    price: 125000,
    category: Category.ACCESSORIES,
    image: "https://picsum.photos/id/1080/400/600",
    description: "천연 소가죽으로 제작된 미니멀한 디자인의 크로스백. 어떤 스타일에도 자연스럽게 어울립니다.",
    tags: ["가방", "가죽", "패션"]
  },
  {
    id: 4,
    name: "모던 세라믹 화병 세트",
    price: 68000,
    category: Category.HOME,
    image: "https://picsum.photos/id/225/400/600",
    description: "공간의 분위기를 바꿔주는 유니크한 쉐입의 세라믹 화병입니다. 꽃 없이 오브제로 두어도 아름답습니다.",
    tags: ["인테리어", "소품", "화병"]
  },
  {
    id: 5,
    name: "빈티지 워싱 데님 자켓",
    price: 89000,
    category: Category.CLOTHING,
    image: "https://picsum.photos/id/1069/400/600",
    description: "자연스러운 워싱과 탄탄한 데님 소재가 돋보이는 자켓. 클래식한 디자인으로 유행을 타지 않습니다.",
    tags: ["자켓", "데님", "아우터"]
  },
  {
    id: 6,
    name: "스마트 워치 시리즈 5",
    price: 350000,
    category: Category.ELECTRONICS,
    image: "https://picsum.photos/id/119/400/600",
    description: "건강 관리부터 알림 확인까지. 당신의 일상을 스마트하게 관리해주는 최고의 파트너.",
    tags: ["시계", "스마트워치", "운동"]
  },
  {
    id: 7,
    name: "실버 체인 레이어드 목걸이",
    price: 32000,
    category: Category.ACCESSORIES,
    image: "https://picsum.photos/id/1062/400/600",
    description: "두 가지 굵기의 체인이 레이어드된 감각적인 디자인. 심플한 룩에 포인트가 되어줍니다.",
    tags: ["주얼리", "목걸이", "실버"]
  },
  {
    id: 8,
    name: "소프트 터치 무드등",
    price: 42000,
    category: Category.HOME,
    image: "https://picsum.photos/id/20/400/600",
    description: "따뜻한 빛으로 아늑한 침실을 만들어주는 무드등. 터치로 밝기 조절이 가능합니다.",
    tags: ["조명", "인테리어", "침실"]
  }
];

type ViewMode = 'store' | 'admin';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<Category | '전체'>(Category.ALL);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('store');

  // Filter Products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === Category.ALL || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.tags.some(tag => tag.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Auth Logic
  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthModalOpen(false);
    if (userData.isAdmin) {
      setViewMode('admin');
    }
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
        setUser(null);
        setViewMode('store');
    }
  };

  // Product Management Logic (Admin)
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Menu className="h-6 w-6 text-gray-900 md:hidden cursor-pointer" />
                <a 
                  href="#" 
                  onClick={(e) => {
                      e.preventDefault();
                      setViewMode('store');
                  }}
                  className="text-2xl font-serif font-bold tracking-tighter text-gray-900"
                >
                  Lumina.
                </a>
              </div>
              
              <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-500">
                {user?.isAdmin && (
                    <button 
                        onClick={() => setViewMode(viewMode === 'admin' ? 'store' : 'admin')}
                        className={`transition-colors flex items-center gap-1 ${viewMode === 'admin' ? 'text-black font-bold' : 'hover:text-black'}`}
                    >
                        <Shield size={14} />
                        ADMIN
                    </button>
                )}
                <a href="#" onClick={() => setViewMode('store')} className={`transition-colors ${viewMode === 'store' ? 'text-black' : 'hover:text-black'}`}>SHOP</a>
                <a href="#" className="hover:text-black transition-colors">COLLECTIONS</a>
                <a href="#" className="hover:text-black transition-colors">ABOUT</a>
              </div>
            </div>

            {viewMode === 'store' && (
                <div className="hidden md:flex items-center bg-gray-50 rounded-none px-4 py-2 w-80 border-b border-transparent focus-within:border-black transition-colors">
                <Search size={16} className="text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search for items..." 
                    className="bg-transparent border-none focus:ring-0 w-full ml-2 text-sm text-gray-900 placeholder-gray-400 font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
            )}

            <div className="flex items-center gap-5">
              {viewMode === 'store' && (
                <div className="relative cursor-pointer group" onClick={() => setIsCartOpen(true)}>
                    <ShoppingBag className="h-5 w-5 text-gray-900 group-hover:scale-110 transition-transform duration-300" />
                    {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {cart.length}
                    </span>
                    )}
                </div>
              )}
              
              {/* Auth Button */}
              {user ? (
                <div 
                    className="flex items-center gap-3 pl-5 border-l border-gray-200 cursor-pointer group relative"
                >
                    <div className="text-right hidden sm:block" onClick={handleLogout}>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{user.isAdmin ? 'Administrator' : 'Welcome'}</p>
                        <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                        {user.name[0]}
                    </div>
                </div>
              ) : (
                <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-1"
                >
                    <LogIn size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {viewMode === 'admin' && user?.isAdmin ? (
          <AdminDashboard 
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
      ) : (
        <>
        {/* Hero Section */}
        <div className="relative bg-gray-50 h-[600px] w-full overflow-hidden">
            <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" alt="Fashion Hero" className="w-full h-full object-cover grayscale opacity-90" />
            </div>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <div className="max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold tracking-widest uppercase mb-4">New Collection 2024</span>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
                Timeless <br/>
                <span className="italic font-light">Elegance.</span>
                </h1>
                <p className="text-lg text-gray-100 mb-8 max-w-md font-light leading-relaxed drop-shadow-md">
                Discover our curated selection of minimalist essentials designed for the modern lifestyle.
                </p>
                <button 
                onClick={() => {
                    const element = document.getElementById('products-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white text-black font-bold hover:bg-black hover:text-white transition-all duration-300 inline-flex items-center gap-2 shadow-xl"
                >
                EXPLORE NOW
                </button>
            </div>
            </div>
        </div>

        {/* Main Content */}
        <main id="products-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold mb-2">Curated Picks</h2>
                    <p className="text-gray-500 font-light">엄선된 프리미엄 컬렉션을 만나보세요.</p>
                </div>
                
                {/* Categories */}
                <div className="flex overflow-x-auto pb-2 gap-8 scrollbar-hide border-b border-gray-100 w-full md:w-auto">
                {[Category.ALL, Category.CLOTHING, Category.ELECTRONICS, Category.HOME, Category.ACCESSORIES].map((cat) => (
                    <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`pb-2 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all relative ${
                        selectedCategory === cat 
                        ? 'text-black' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    >
                    {cat}
                    {selectedCategory === cat && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></span>
                    )}
                    </button>
                ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    onOpenModal={setSelectedProduct}
                    onAddToCart={addToCart}
                />
                ))
            ) : (
                <div className="col-span-full text-center py-32 text-gray-400 font-light">
                    <p className="text-xl">No products found.</p>
                </div>
            )}
            </div>
        </main>
        </>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-2xl font-serif font-bold mb-6">Lumina.</h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
                We curate the finest items for your lifestyle. 
                Quality, minimalism, and sustainability are at the core of our philosophy.
              </p>
              <div className="flex gap-6 text-gray-400">
                <Instagram size={20} className="hover:text-white cursor-pointer transition-colors" />
                <Facebook size={20} className="hover:text-white cursor-pointer transition-colors" />
                <Twitter size={20} className="hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Shop</h3>
                <ul className="space-y-4 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
                </ul>
            </div>

            <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Support</h3>
                <ul className="space-y-4 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              © 2024 Lumina Market. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Components */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />

      <AIChat />
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
            <div className="bg-white w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="w-full md:w-1/2 h-[400px] md:h-[600px] bg-gray-100">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 p-10 flex flex-col relative">
                     <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
                        <X size={24} />
                     </button>

                     <div className="mb-auto">
                        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2 block">{selectedProduct.category}</span>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">{selectedProduct.name}</h2>
                        <div className="text-2xl font-light text-gray-900 mb-8">₩{selectedProduct.price.toLocaleString()}</div>
                        
                        <p className="text-gray-600 leading-relaxed mb-8 font-light">
                            {selectedProduct.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {selectedProduct.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 border border-gray-200 text-gray-500 text-xs uppercase tracking-wider">#{tag}</span>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={() => {
                            addToCart(selectedProduct);
                            setSelectedProduct(null);
                        }}
                        className="w-full py-4 bg-black text-white font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        ADD TO CART
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;
