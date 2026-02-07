
import React, { useState, useEffect } from 'react';
import { Feedback, ViewType, User } from './types';
import { INITIAL_FEEDBACK, Icons } from './constants';
import DashboardView from './views/DashboardView';
import FeedbackListView from './views/FeedbackListView';
import AddFeedbackView from './views/AddFeedbackView';
import AIInsightsView from './views/AIInsightsView';
import DocsView from './views/DocsView';
import AuthView from './views/AuthView';
import MySubmissionsView from './views/MySubmissionsView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const savedFeedback = localStorage.getItem('sentilytics_feedback');
    if (savedFeedback) {
      setFeedbacks(JSON.parse(savedFeedback));
    } else {
      setFeedbacks(INITIAL_FEEDBACK);
    }

    const savedUser = localStorage.getItem('sentilytics_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.role !== 'admin') {
        setActiveView('add-feedback');
      }
    }
  }, []);

  useEffect(() => {
    if (feedbacks.length > 0) {
      localStorage.setItem('sentilytics_feedback', JSON.stringify(feedbacks));
    }
  }, [feedbacks]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('sentilytics_user', JSON.stringify(userData));
    if (userData.role === 'admin') {
      setActiveView('dashboard');
    } else {
      setActiveView('add-feedback');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sentilytics_user');
    setActiveView('dashboard');
  };

  const addFeedback = (feedback: Feedback) => {
    setFeedbacks(prev => [feedback, ...prev]);
  };

  const deleteFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  const respondToFeedback = (id: string, responseText: string) => {
    setFeedbacks(prev => prev.map(f => 
      f.id === id ? { ...f, response: responseText } : f
    ));
  };

  const isAdmin = user?.role === 'admin';

  if (!user) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">A</div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">AI Feedback</h1>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {isAdmin ? (
              <>
                <NavButton active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} label="Dashboard" icon={<Icons.Dashboard />} />
                <NavButton active={activeView === 'feedback-list'} onClick={() => setActiveView('feedback-list')} label="All Feedback" icon={<Icons.Feedback />} />
                <NavButton active={activeView === 'add-feedback'} onClick={() => setActiveView('add-feedback')} label="New Feedback" icon={<Icons.Plus />} />
                <NavButton active={activeView === 'ai-insights'} onClick={() => setActiveView('ai-insights')} label="AI Insights" icon={<Icons.Insights />} />
              </>
            ) : (
              <>
                <NavButton active={activeView === 'add-feedback'} onClick={() => setActiveView('add-feedback')} label="Submit Feedback" icon={<Icons.Plus />} />
                <NavButton active={activeView === 'ai-insights'} onClick={() => setActiveView('ai-insights')} label="Personal Insights" icon={<Icons.Insights />} />
                <NavButton active={activeView === 'my-submissions'} onClick={() => setActiveView('my-submissions')} label="My Responses" icon={<Icons.Feedback />} />
              </>
            )}
          </nav>

          <div className="p-4 border-t border-slate-50">
            <div className="p-5 bg-slate-900 rounded-[2rem] text-white space-y-4 shadow-xl">
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-indigo-400 flex items-center justify-center text-sm font-black uppercase">{user.email[0]}</div>
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{user.email}</p>
                    <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-black">{user.role}</p>
                 </div>
               </div>
               <button onClick={handleLogout} className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all active:scale-95 border border-white/5">Sign Out</button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 relative overflow-y-auto focus:outline-none bg-slate-50/50 p-6 lg:p-10">
        {activeView === 'dashboard' && isAdmin && <DashboardView feedbacks={feedbacks} />}
        {activeView === 'feedback-list' && isAdmin && <FeedbackListView feedbacks={feedbacks} onDelete={deleteFeedback} onRespond={respondToFeedback} />}
        {activeView === 'add-feedback' && <AddFeedbackView onAdd={addFeedback} onViewList={() => setActiveView('my-submissions')} isAdmin={isAdmin} user={user} />}
        {activeView === 'my-submissions' && !isAdmin && <MySubmissionsView feedbacks={feedbacks} user={user} />}
        {activeView === 'ai-insights' && <AIInsightsView feedbacks={feedbacks} user={user} />}
        {activeView === 'docs' && isAdmin && <DocsView />}
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, label, icon }: any) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-200 ${active ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100 scale-[1.02]' : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-800'}`}>
    <span className={active ? 'text-white' : 'text-slate-400'}>{icon}</span>
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

export default App;
