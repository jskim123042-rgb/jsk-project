export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  tags: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
}

export interface User {
  name: string;
  email: string;
}

export enum Category {
  ALL = '전체',
  CLOTHING = '의류',
  ELECTRONICS = '전자제품',
  HOME = '홈/리빙',
  ACCESSORIES = '액세서리'
}