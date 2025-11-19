
import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(true); // Default to Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simple validation
    if (!email || !password || (isSignUp && !name)) {
      setError('모든 필드를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
        setError('비밀번호는 6자 이상이어야 합니다.');
        setIsLoading(false);
        return;
    }

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Admin Check logic (Hardcoded for demo)
      if (!isSignUp && email === 'admin@lumina.com' && password === '123456') {
        onLogin({
          name: 'Administrator',
          email: email,
          isAdmin: true
        });
      } else {
        // Normal user login
        onLogin({
          name: isSignUp ? name : email.split('@')[0],
          email: email,
          isAdmin: false
        });
      }
      
      // Reset form
      setEmail('');
      setPassword('');
      setName('');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-black p-8 flex flex-col justify-end relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">
            {isSignUp ? 'Join Lumina.' : 'Welcome Back.'}
          </h2>
          <p className="text-gray-400 text-sm font-light">
            {isSignUp ? '당신의 감각적인 쇼핑 여정을 시작하세요.' : '계정에 로그인하여 쇼핑을 계속하세요.'}
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Name</label>
                <div className="relative border-b border-gray-200 focus-within:border-black transition-colors">
                  <UserIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-transparent border-none focus:ring-0 outline-none placeholder-gray-300"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Email</label>
              <div className="relative border-b border-gray-200 focus-within:border-black transition-colors">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-transparent border-none focus:ring-0 outline-none placeholder-gray-300"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Password</label>
              <div className="relative border-b border-gray-200 focus-within:border-black transition-colors">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-transparent border-none focus:ring-0 outline-none placeholder-gray-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-black text-white font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group mt-8"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isSignUp ? 'SIGN UP' : 'LOG IN'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
                onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                }}
                className="text-sm text-gray-500 hover:text-black transition-colors underline decoration-1 underline-offset-4"
            >
                {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
