
import React from 'react';

const DocsView: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-12 animate-fadeIn pb-20">
      <header>
        <h2 className="text-4xl font-black text-slate-900">Project Documentation</h2>
        <p className="mt-4 text-xl text-slate-500">Full stack architecture and technical specification for Web-Based User Feedback Analytics.</p>
      </header>

      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800 border-l-4 border-indigo-600 pl-4">1. Tech Stack Justification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200">
            <h4 className="font-bold text-indigo-600 mb-2">Frontend</h4>
            <ul className="text-sm text-slate-600 space-y-2">
              <li><strong>React 18+</strong>: Modular component-based architecture.</li>
              <li><strong>TypeScript</strong>: Type safety for feedback entities.</li>
              <li><strong>Tailwind CSS</strong>: High-performance styling utility.</li>
              <li><strong>Recharts</strong>: Declarative data visualization.</li>
            </ul>
          </div>
          <div className="p-6 bg-slate-900 rounded-3xl text-white">
            <h4 className="font-bold text-indigo-400 mb-2">AI & Intelligence</h4>
            <ul className="text-sm text-slate-400 space-y-2">
              <li><strong>Gemini 3 Flash</strong>: Ultra-fast NLP for sentiment.</li>
              <li><strong>Structured JSON Output</strong>: Ensuring schema consistency.</li>
              <li><strong>Thought Process</strong>: Leveraging reasoning for global recommendations.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800 border-l-4 border-indigo-600 pl-4">2. Database Schema (ERD Concept)</h3>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left">Entity</th>
                <th className="px-4 py-2 text-left">Property</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="px-4 py-3 font-bold">Feedback</td><td className="px-4 py-3">id</td><td className="px-4 py-3">UUID</td><td className="px-4 py-3">Primary Key</td></tr>
              <tr><td className="px-4 py-3 font-bold">Feedback</td><td className="px-4 py-3">userId</td><td className="px-4 py-3">String</td><td className="px-4 py-3">Foreign Key Reference</td></tr>
              <tr><td className="px-4 py-3 font-bold">Feedback</td><td className="px-4 py-3">comment</td><td className="px-4 py-3">Text</td><td className="px-4 py-3">User Input</td></tr>
              <tr><td className="px-4 py-3 font-bold">Feedback</td><td className="px-4 py-3">sentiment</td><td className="px-4 py-3">Enum</td><td className="px-4 py-3">AI Calculated</td></tr>
              <tr><td className="px-4 py-3 font-bold">Feedback</td><td className="px-4 py-3">category</td><td className="px-4 py-3">String</td><td className="px-4 py-3">Feature, Bug, etc.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800 border-l-4 border-indigo-600 pl-4">3. GitHub Workflow</h3>
        <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl font-mono text-sm space-y-4">
          <p className="text-indigo-600 font-bold"># Recommended Branching Strategy</p>
          <div className="space-y-1 pl-4 border-l-2 border-slate-200">
            <p>main - Production ready code</p>
            <p>develop - Staging for integration</p>
            <p>feat/* - Feature specific development</p>
            <p>fix/* - Hotfixes and bug patches</p>
          </div>
          <p className="text-slate-500 mt-4">CI/CD: Automatic deployments via Vercel on push to Main.</p>
        </div>
      </section>

      <div className="p-8 bg-indigo-600 rounded-3xl text-white flex items-center justify-between">
        <div>
          <h4 className="text-xl font-bold">Final Viva Ready</h4>
          <p className="text-indigo-100">Phases 1, 2, and 3 are fully implemented in this SPA.</p>
        </div>
        <div className="hidden md:block">
           <svg className="w-16 h-16 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
        </div>
      </div>
    </div>
  );
};

export default DocsView;
