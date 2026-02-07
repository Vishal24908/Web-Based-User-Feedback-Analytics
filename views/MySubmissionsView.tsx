
import React from 'react';
import { Feedback, User } from '../types';

interface MySubmissionsViewProps {
  feedbacks: Feedback[];
  user: User;
}

const MySubmissionsView: React.FC<MySubmissionsViewProps> = ({ feedbacks, user }) => {
  const myFeedback = feedbacks.filter(f => f.userEmail === user.email);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-black text-slate-900">My Submissions</h2>
        <p className="text-slate-500 mt-2">Track the status of your feedback and see responses from our team.</p>
      </header>

      {myFeedback.length === 0 ? (
        <div className="p-20 bg-white border border-dashed border-slate-200 rounded-[3rem] text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No feedback yet</h3>
          <p className="text-slate-500 mb-8">You haven't submitted any feedback yet. Share your thoughts to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {myFeedback.map((f) => (
            <div key={f.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      f.sentiment === 'Positive' ? 'bg-emerald-100 text-emerald-700' :
                      f.sentiment === 'Negative' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {f.sentiment || 'Analyzing'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{f.comment}</h3>
                </div>
                <div className="flex-shrink-0">
                  {f.response ? (
                    <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-4 py-2 rounded-xl">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                      <span>Responded</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs bg-amber-50 px-4 py-2 rounded-xl">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                      <span>Pending Review</span>
                    </div>
                  )}
                </div>
              </div>

              {f.response && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Admin Response</p>
                  <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 relative">
                    <div className="absolute top-0 left-4 -mt-3">
                       <div className="bg-white border border-indigo-100 rounded-lg p-1 shadow-sm">
                         <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z"></path></svg>
                       </div>
                    </div>
                    <p className="text-indigo-900 text-sm italic font-medium">"{f.response}"</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubmissionsView;
