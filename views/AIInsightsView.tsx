
import React, { useState, useEffect, useRef } from 'react';
import { Feedback, User } from '../types';
import { generateGlobalInsights, sendChatQuery } from '../geminiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface AIInsightsViewProps {
  feedbacks: Feedback[];
  user: User;
}

const AIInsightsView: React.FC<AIInsightsViewProps> = ({ feedbacks, user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<{ topThemes: string[], recommendations: string[] } | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'ai', text: `Hello! I am your AI Feedback Assistant. Ask me anything about ${user.role === 'admin' ? 'global' : 'your'} user responses.` }
  ]);
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const analysisTriggered = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isAdmin = user.role === 'admin';
  const relevantFeedbacks = isAdmin 
    ? feedbacks 
    : feedbacks.filter(f => f.userEmail === user.email);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const triggerAnalysis = async () => {
    if (relevantFeedbacks.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateGlobalInsights(relevantFeedbacks);
      setInsights(result);
    } catch (err: any) {
      console.error("Insight Generation Error:", err);
      const status = err.status || err.statusCode;
      const msg = err.message || "Unknown error";
      
      if (status === 401 || status === 403) {
        setError(`Authentication Failed (${status}): Check if your API Key is correctly set.`);
      } else if (status === 429) {
        setError("Rate Limit Exceeded: Please wait a minute and try again.");
      } else {
        setError(`AI Service Error: ${msg}. Verify your connectivity.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isTyping) return;

    const userMsg = query;
    setQuery('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await sendChatQuery(relevantFeedbacks, userMsg, []);
      setChatHistory(prev => [...prev, { role: 'ai', text: response || "I'm sorry, I couldn't generate a response." }]);
    } catch (err: any) {
      const status = err.status || err.statusCode;
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        text: status === 429 
          ? "Rate limit reached. Please wait a bit." 
          : `Technical hiccup (${status || 'Network Error'}). Please try again.` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (!analysisTriggered.current && relevantFeedbacks.length > 0) {
      analysisTriggered.current = true;
      triggerAnalysis();
    }
  }, [relevantFeedbacks.length]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            {isAdmin ? 'Intelligent Insights' : 'Personal Intelligence'}
          </h2>
          <p className="mt-2 text-slate-500">
            {isAdmin ? 'Global analysis and interactive data assistant.' : 'AI-driven analysis of your submission history.'}
          </p>
        </div>
        {relevantFeedbacks.length > 0 && (
          <button 
            onClick={triggerAnalysis}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-lg shadow-indigo-100"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Analyzing...</span>
              </div>
            ) : <span>Refresh Insights</span>}
          </button>
        )}
      </header>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="font-medium">{error}</span>
          </div>
          <button onClick={triggerAnalysis} className="flex-shrink-0 font-bold underline hover:no-underline px-4 py-2 bg-white rounded-xl border border-rose-100 shadow-sm active:scale-95 transition-all">Try Again</button>
        </div>
      )}

      {relevantFeedbacks.length === 0 ? (
        <div className="p-20 bg-white border border-dashed border-slate-200 rounded-[3rem] text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Not enough data</h3>
          <p className="text-slate-500 mb-2">Submit at least one feedback entry to unlock AI-powered insights.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-64 bg-slate-100 animate-pulse rounded-3xl border border-slate-200"></div>
                <div className="h-64 bg-slate-100 animate-pulse rounded-3xl border border-slate-200"></div>
              </div>
            ) : insights ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">#</span>
                    {isAdmin ? 'Global Themes' : 'Your Patterns'}
                  </h3>
                  <ul className="space-y-3">
                    {insights.topThemes.map((theme, i) => (
                      <li key={i} className="text-sm p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium">
                        {theme}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <span className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">!</span>
                    {isAdmin ? 'Action Plan' : 'AI Advice'}
                  </h3>
                  <ul className="space-y-3">
                    {insights.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-slate-300 leading-relaxed pl-4 border-l border-indigo-500/30 italic">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-64 bg-white rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                <p className="font-medium">{error ? 'Analysis Failed' : 'Ready for Analysis'}</p>
                <button onClick={triggerAnalysis} className="mt-4 text-xs font-bold text-indigo-600 uppercase tracking-widest hover:underline">Start Now</button>
              </div>
            )}

            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-start space-x-4">
              <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h4 className="text-indigo-900 font-bold mb-1">
                  {isAdmin ? 'Stability Mode Active' : 'Personal Insights Active'}
                </h4>
                <p className="text-indigo-700 text-sm leading-relaxed">
                  {isAdmin 
                    ? 'Global trends focus on the most recent entries to maintain stability.'
                    : 'These insights are calculated specifically from your feedback history to help you see patterns in your responses.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col h-[600px] overflow-hidden sticky top-8">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="font-bold text-slate-800">AI Feedback Assistant</h3>
              </div>
              <button onClick={() => setChatHistory([{ role: 'ai', text: 'History cleared. How can I help?' }])} className="text-[10px] text-slate-400 uppercase tracking-widest font-bold hover:text-slate-600">Clear</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}
                  `}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 rounded-tl-none flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChatSubmit} className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <button 
                  type="submit"
                  disabled={!query.trim() || isTyping}
                  className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsightsView;
