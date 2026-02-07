
import React, { useMemo } from 'react';
import { Feedback, Sentiment } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardViewProps {
  feedbacks: Feedback[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ feedbacks }) => {
  const stats = useMemo(() => {
    const total = feedbacks.length;
    const avgRating = total ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / total).toFixed(1) : 0;
    
    const sentimentCount: Record<Sentiment, number> = {
      Positive: feedbacks.filter(f => f.sentiment === 'Positive').length,
      Neutral: feedbacks.filter(f => f.sentiment === 'Neutral').length,
      Negative: feedbacks.filter(f => f.sentiment === 'Negative').length,
    };

    const categoryData = Object.entries(
      feedbacks.reduce((acc: Record<string, number>, f) => {
        acc[f.category] = (acc[f.category] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, count]) => ({ name, count }));

    return { total, avgRating, sentimentCount, categoryData };
  }, [feedbacks]);

  const pieData = [
    { name: 'Positive', value: stats.sentimentCount.Positive, color: '#10b981' },
    { name: 'Neutral', value: stats.sentimentCount.Neutral, color: '#6366f1' },
    { name: 'Negative', value: stats.sentimentCount.Negative, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-900">Analytics Overview</h2>
        <p className="mt-2 text-slate-500">Real-time performance and feedback metrics.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Responses" value={stats.total} subtitle="+12% from last week" />
        <StatCard title="Avg. Rating" value={`${stats.avgRating}/5`} subtitle="Based on all time" highlight />
        <StatCard title="Positive Vibe" value={`${Math.round((stats.sentimentCount.Positive / (stats.total || 1)) * 100)}%`} subtitle="Customer satisfaction" />
        <StatCard title="Top Category" value={stats.categoryData.sort((a,b) => b.count - a.count)[0]?.name || 'N/A'} subtitle="Most frequent topic" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Sentiment Mix */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Sentiment Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-sm font-medium text-slate-600">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Feedback by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, highlight = false }: any) => (
  <div className={`p-6 rounded-3xl border ${highlight ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-white border-slate-200 text-slate-900'} shadow-sm transition-transform hover:scale-[1.02] cursor-default`}>
    <p className={`text-sm font-medium ${highlight ? 'text-indigo-100' : 'text-slate-500'}`}>{title}</p>
    <h4 className="text-3xl font-bold mt-2">{value}</h4>
    <p className={`text-xs mt-2 ${highlight ? 'text-indigo-200' : 'text-green-500'}`}>{subtitle}</p>
  </div>
);

export default DashboardView;
