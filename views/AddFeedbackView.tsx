
import React, { useState, useEffect } from 'react';
import { Feedback, User } from '../types';
import { CATEGORIES } from '../constants';
import { analyzeSentiment } from '../geminiService';

interface AddFeedbackViewProps {
  onAdd: (f: Feedback) => void;
  onViewList: () => void;
  isAdmin: boolean;
  user: User;
}

const AddFeedbackView: React.FC<AddFeedbackViewProps> = ({ onAdd, onViewList, isAdmin, user }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    userName: user.name || user.email.split('@')[0],
    userEmail: user.email,
    rating: 5,
    comment: '',
    category: 'General' as Feedback['category']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const analysis = await analyzeSentiment(formData.comment);

      const newFeedback: Feedback = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        sentiment: analysis.sentiment,
        aiSummary: analysis.summary,
        createdAt: new Date().toISOString()
      };

      onAdd(newFeedback);
      setSuccess(true);
      setFormData({
        ...formData,
        rating: 5,
        comment: '',
        category: 'General'
      });
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn space-y-4">
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between animate-pulse shadow-sm">
          <div className="flex items-center space-x-3 text-emerald-800">
            <div className="bg-emerald-100 p-1 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <span className="font-semibold">Feedback submitted successfully!</span>
          </div>
          {isAdmin && (
            <button onClick={onViewList} className="text-indigo-600 hover:text-indigo-700 text-sm font-bold bg-white px-4 py-1.5 rounded-xl border border-indigo-50 shadow-sm transition-all">
              View List
            </button>
          )}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold">Post New Feedback</h2>
            <p className="text-slate-400 mt-1">Hello, {user.email}! Share your thoughts with us.</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Display Name</label>
              <input 
                required
                type="text"
                placeholder="Type your name..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white"
                value={formData.userName}
                onChange={e => setFormData({...formData, userName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400">Email (Logged In)</label>
              <input 
                disabled
                type="email"
                className="w-full px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed"
                value={formData.userEmail}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Category</label>
              <select 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white text-slate-900"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Feedback['category']})}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Rating (1-5)</label>
              <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({...formData, rating: num})}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${formData.rating === num ? 'bg-white shadow-sm text-indigo-600 border border-indigo-100' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Comments</label>
            <textarea 
              required
              rows={4}
              placeholder="What's on your mind? Our AI will analyze your sentiment..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white"
              value={formData.comment}
              onChange={e => setFormData({...formData, comment: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.01] active:scale-[0.98]
              ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'}
            `}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing...</span>
              </div>
            ) : 'Submit Feedback'}
          </button>
        </form>
      </div>
      
      {!isAdmin && (
        <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[2rem] text-center">
          <p className="text-sm text-indigo-800 font-medium">Thank you for helping us improve. Standard accounts can only submit feedback.</p>
        </div>
      )}
    </div>
  );
};

export default AddFeedbackView;
