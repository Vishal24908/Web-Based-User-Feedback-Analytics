
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const ADMIN_EMAIL = 'vishalprakash70958@gmail.com';
  const ADMIN_PASS = 'Vishal@0700';

  const [registeredUsers, setRegisteredUsers] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem('sentilytics_registered_users');
    if (saved) setRegisteredUsers(JSON.parse(saved));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      onLogin({ email: ADMIN_EMAIL, role: 'admin' });
      return;
    }

    if (isLogin) {
      if (registeredUsers[email] === password) {
        onLogin({ email, role: 'user' });
      } else {
        setError('User not found or password incorrect. Please Register first.');
      }
    } else {
      if (email.includes('@') && password.length >= 6) {
        const updated = { ...registeredUsers, [email]: password };
        setRegisteredUsers(updated);
        localStorage.setItem('sentilytics_registered_users', JSON.stringify(updated));
        setError('Registration successful! Please login now.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
      } else {
        setError('Valid email and 6+ char password required.');
      }
    }
  };

  const selectGoogleAccount = (acc: { email: string, role: UserRole }) => {
    setIsGoogleLoading(true);
    setShowGooglePicker(false);
    setTimeout(() => {
      onLogin(acc);
      setIsGoogleLoading(false);
    }, 800);
  };

  return (
    <div className="w-screen h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-fadeIn flex flex-col items-center">
        {/* Strictly Centered Header Section */}
        <div className="flex flex-col items-center justify-center text-center mb-8 w-full">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2.2rem] flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-indigo-200/50 mb-6 transition-transform hover:scale-105 duration-300">
            A
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI Feedback</h2>
          <p className="text-slate-500 mt-2 font-medium text-lg max-w-xs leading-snug">
            The next generation of feedback intelligence.
          </p>
        </div>

        {/* Form Card centered on screen */}
        <div className="w-full bg-white p-8 rounded-[3.5rem] border border-slate-200/60 shadow-2xl shadow-slate-200/40 relative">
          <div className="flex p-1.5 bg-slate-100/80 rounded-2xl mb-8">
            <button 
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Login
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] ml-1">Email Address</label>
              <input 
                required 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none transition-all placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900" 
                placeholder="email@example.com" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] ml-1">Password</label>
              <input 
                required 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none transition-all placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900" 
                placeholder="••••••••" 
              />
            </div>
            {error && (
              <p className={`text-xs font-bold ml-1 px-3 py-2 rounded-lg bg-slate-50 ${error.includes('successful') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {error}
              </p>
            )}
            <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all transform active:scale-95 text-lg mt-2">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]"><span className="bg-white px-4 text-slate-400 font-bold">Or continue with</span></div>
          </div>

          <button onClick={() => setShowGooglePicker(true)} disabled={isGoogleLoading} className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center space-x-3 shadow-sm active:scale-95">
            {isGoogleLoading ? <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full" /> : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google Account</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showGooglePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden p-8 animate-scaleIn">
            <h3 className="text-2xl font-black text-slate-900 mb-6 text-center">Select Account</h3>
            <div className="space-y-3">
              <button onClick={() => selectGoogleAccount({ email: 'user.personal@gmail.com', role: 'user' })} className="w-full flex items-center p-5 rounded-3xl bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all group">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-4 text-xl">A</div>
                <div className="text-left"><p className="text-base font-bold text-slate-900">User Account</p><p className="text-xs text-slate-500 font-medium">user.personal@gmail.com</p></div>
              </button>
              <button onClick={() => { setShowGooglePicker(false); setIsLogin(false); }} className="w-full flex items-center p-5 rounded-3xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-slate-400 font-bold">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mr-4 text-2xl">+</div>
                <span className="text-sm">Use another account</span>
              </button>
            </div>
            <button onClick={() => setShowGooglePicker(false)} className="mt-8 w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthView;
