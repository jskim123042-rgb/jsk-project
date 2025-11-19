import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, Instagram, Facebook, Twitter, ChevronRight, LogIn, User as UserIcon, LogOut } from 'lucide-react';
import { Product, CartItem, Category, User } from './types';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { AIChat } from './components/AIChat';
import { AuthModal } from './components/AuthModal';

// Mock Data
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "베이직 오버핏 코튼 셔츠",
    price: 45000,
    category: Category.CLOTHING,
    image: "https://picsum.photos/id/1059/400/400",
    description: "편안한 착용감과 세련된 실루엣을 자랑하는 고밀도 코튼 셔츠입니다. 사계절 내내 활용 가능한 필수 아이템입니다.",
    tags: ["셔츠", "오버핏", "데일리룩"]
  },
  {
    id: 2,
    name: "노이즈 캔슬링 헤드폰 Pro",
    price: 289000,
    category: Category.ELECTRONICS,
    image: "https://picsum.photos/id/3/400/400",
    description: "압도적인 몰입감을 선사하는 프리미엄 무선 헤드폰. 40시간 연속 재생과 급속 충전을 지원합니다.",
    tags: ["음향기기", "헤드폰", "테크"]
  },
  {
    id: 3,
    name: "미니멀 가죽 크로스백",
    price: 125000,
    category: Category.ACCESSORIES,
    image: "https://picsum.photos/id/1080/400/400",
    description: "천연 소가죽으로 제작된 미니멀한 디자인의 크로스백. 어떤 스타일에도 자연스럽게 어울립니다.",
    tags: ["가방", "가죽", "패션"]
  },
  {
    id: 4,
    name: "모던 세라믹 화병 세트",
    price: 68000,
    category: Category.HOME,
    image: "https://picsum.photos/id/225/400/400",
    description: "공간의 분위기를 바꿔주는 유니크한 쉐입의 세라믹 화병입니다. 꽃 없이 오브제로 두어도 아름답습니다.",
    tags: ["인테리어", "소품", "화병"]
  },
  {
    id: 5,
    name: "빈티지 워싱 데님 자켓",
    price: 89000,
    category: Category.CLOTHING,
    image: "https://picsum.photos/id/1069/400/400",
    description: "자연스러운 워싱과 탄탄한 데님 소재가 돋보이는 자켓. 클래식한 디자인으로 유행을 타지 않습니다.",
    tags: ["자켓", "데님", "아우터"]
  },
  {
    id: 6,
    name: "스마트 워치 시리즈 5",
    price: 350000,
    category: Category.ELECTRONICS,
    image: "https://picsum.photos/id/119/400/400",
    description: "건강 관리부터 알림 확인까지. 당신의 일상을 스마트하게 관리해주는 최고의 파트너.",
    tags: ["시계", "스마트워치", "운동"]
  },
  {
    id: 7,
    name: "실버 체인 레이어드 목걸이",
    price: 32000,
    category: Category.ACCESSORIES,
    image: "https://picsum.photos/id/1062/400/400",
    description: "두 가지 굵기의 체인이 레이어드된 감각적인 디자인. 심플한 룩에 포인트가 되어줍니다.",
    tags: ["주얼리", "목걸이", "실버"]
  },
  {
    id: 8,
    name: "소프트 터치 무드등",
    price: 42000,
    category: Category.HOME,
    image: "https://picsum.photos/id/20/400/400",
    description: "따뜻한 빛으로 아늑한 침실을 만들어주는 무드등. 터치로 밝기 조절이 가능합니다.",
    tags: ["조명", "인테리어", "침실"]
  }
];

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | '전체'>(Category.ALL);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Filter Products
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
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
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
        setUser(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Menu className="h-6 w-6 text-gray-500 md:hidden cursor-pointer" />
              <a href="#" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Lumina.
              </a>
            </div>

            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-96">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="검색어를 입력하세요..." 
                className="bg-transparent border-none focus:ring-0 w-full ml-2 text-sm text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag className="h-6 w-6 text-gray-600 hover:text-indigo-600 transition-colors" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
              
              {/* Auth Button */}
              {user ? (
                <div 
                    className="flex items-center gap-2 pl-4 border-l border-gray-200 cursor-pointer group relative"
                    onClick={handleLogout}
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-gray-500">환영합니다</p>
                        <p className="text-sm font-bold text-gray-900 leading-none">{user.name}님</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
                        {user.name[0]}
                    </div>
                    <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                             <LogOut size={12} /> 로그아웃
                        </div>
                    </div>
                </div>
              ) : (
                <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-indigo-600 transition-all shadow-sm hover:shadow-md"
                >
                    <LogIn size={16} />
                    <span className="hidden sm:inline">로그인/가입</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
            <img src="https://picsum.photos/id/6/1600/600" alt="Hero Background" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
            당신의 라이프스타일을 위한<br/>
            <span className="text-indigo-400">모든 영감</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-300 mb-8 max-w-2xl">
            Lumina Market은 단순한 쇼핑을 넘어 새로운 라이프스타일을 제안합니다.
            AI 큐레이션을 통해 당신에게 딱 맞는 아이템을 발견하세요.
          </p>
          <button 
            onClick={() => {
                const element = document.getElementById('products-section');
                element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-indigo-50 transition-colors inline-flex items-center gap-2"
          >
            쇼핑 시작하기 <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main id="products-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 scrollbar-hide">
          {[Category.ALL, Category.CLOTHING, Category.ELECTRONICS, Category.HOME, Category.ACCESSORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            <div className="col-span-full text-center py-20 text-gray-500">
                <p className="text-xl">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Lumina Market</h2>
              <p className="text-sm text-gray-500">
                © 2024 Lumina Market. All rights reserved.<br/>
                Seoul, Korea
              </p>
            </div>
            <div className="flex gap-6 text-gray-400">
              <Instagram className="hover:text-indigo-600 cursor-pointer transition-colors" />
              <Facebook className="hover:text-indigo-600 cursor-pointer transition-colors" />
              <Twitter className="hover:text-indigo-600 cursor-pointer transition-colors" />
            </div>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
            <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
                <div className="w-full md:w-1/2 aspect-square bg-gray-100">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                         <div>
                            <span className="text-sm text-indigo-600 font-bold tracking-wide uppercase">{selectedProduct.category}</span>
                            <h2 className="text-2xl font-bold text-gray-900 mt-1">{selectedProduct.name}</h2>
                         </div>
                         <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-600">
                             <span className="sr-only">Close</span>
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                         </button>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">
                        {selectedProduct.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                        {selectedProduct.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">#{tag}</span>
                        ))}
                    </div>

                    <div className="mt-auto">
                        <div className="flex items-end gap-2 mb-4">
                             <span className="text-3xl font-bold text-gray-900">₩{selectedProduct.price.toLocaleString()}</span>
                        </div>
                        <button 
                            onClick={() => {
                                addToCart(selectedProduct);
                                setSelectedProduct(null);
                            }}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                        >
                            장바구니 담기
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;