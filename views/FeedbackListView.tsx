
import React, { useState } from 'react';
import { Feedback } from '../types';
import { Icons as UI } from '../constants';

interface FeedbackListViewProps {
  feedbacks: Feedback[];
  onDelete: (id: string) => void;
  onRespond: (id: string, response: string) => void;
}

const FeedbackListView: React.FC<FeedbackListViewProps> = ({ feedbacks, onDelete, onRespond }) => {
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [replyText, setReplyText] = useState('');

  const filtered = feedbacks.filter(f => {
    const matchesSearch = f.userName.toLowerCase().includes(filter.toLowerCase()) || 
                          f.comment.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (f: Feedback) => {
    setSelectedFeedback(f);
    setReplyText(f.response || '');
  };

  const handleSaveResponse = () => {
    if (selectedFeedback) {
      onRespond(selectedFeedback.id, replyText);
      setSelectedFeedback(null);
      setReplyText('');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Submissions</h2>
          <p className="text-slate-500">Managing {filtered.length} responses</p>
        </div>
        <div className="flex items-center space-x-3">
           <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
           >
             <option value="All">All Categories</option>
             <option value="Feature Request">Feature Request</option>
             <option value="Bug Report">Bug Report</option>
             <option value="UI/UX">UI/UX</option>
             <option value="Performance">Performance</option>
             <option value="General">General</option>
           </select>
           <input 
            type="text" 
            placeholder="Search feedback..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
           />
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Feedback</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sentiment</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {filtered.map((feedback) => (
              <tr key={feedback.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs mr-3">
                      {feedback.userName[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{feedback.userName}</div>
                      <div className="text-xs text-slate-500">{feedback.userEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600 line-clamp-1 max-w-xs">{feedback.comment}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {feedback.response ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Responded
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`flex items-center space-x-1.5 text-sm ${getSentimentColor(feedback.sentiment)}`}>
                    <div className={`w-2 h-2 rounded-full ${getSentimentBg(feedback.sentiment)}`}></div>
                    <span>{feedback.sentiment || 'Pending'}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button 
                    onClick={() => handleOpenModal(feedback)}
                    className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    View & Reply
                  </button>
                  <button 
                    onClick={() => onDelete(feedback.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <UI.Trash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-400 font-medium">No feedback found matches your search.</p>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Feedback Details</h3>
              <button onClick={() => setSelectedFeedback(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">User</p>
                  <p className="text-sm font-bold text-slate-900">{selectedFeedback.userName}</p>
                  <p className="text-xs text-slate-500">{selectedFeedback.userEmail}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category & Rating</p>
                  <p className="text-sm font-bold text-slate-900">{selectedFeedback.category}</p>
                  <p className="text-xs text-yellow-500">{'★'.repeat(selectedFeedback.rating)}{'☆'.repeat(5-selectedFeedback.rating)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">User Comment</p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 italic text-sm leading-relaxed">
                  "{selectedFeedback.comment}"
                </div>
              </div>

              {selectedFeedback.aiSummary && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Gemini AI Summary</p>
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-indigo-800 text-xs font-medium">
                    {selectedFeedback.aiSummary}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin Response</label>
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response to the user here..."
                  className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none h-32 text-sm text-slate-900 transition-all bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setSelectedFeedback(null)}
                className="px-6 py-2.5 text-slate-600 font-bold hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveResponse}
                className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
              >
                Save & Respond
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getCategoryStyles = (cat: string) => {
  switch (cat) {
    case 'Bug Report': return 'bg-red-100 text-red-600';
    case 'Feature Request': return 'bg-indigo-100 text-indigo-600';
    case 'UI/UX': return 'bg-purple-100 text-purple-600';
    case 'Performance': return 'bg-amber-100 text-amber-600';
    default: return 'bg-slate-100 text-slate-600';
  }
};

const getSentimentColor = (s?: string) => {
  if (s === 'Positive') return 'text-emerald-600 font-medium';
  if (s === 'Negative') return 'text-rose-600 font-medium';
  return 'text-slate-500';
};

const getSentimentBg = (s?: string) => {
  if (s === 'Positive') return 'bg-emerald-500';
  if (s === 'Negative') return 'bg-rose-500';
  return 'bg-slate-300';
};

export default FeedbackListView;
