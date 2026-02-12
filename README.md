🚀 AI Feedback Hub

 AI Feedback Hub is a modern web application that allows users to submit feedback and receive AI-powered insights. Built using React + TypeScript + Vite, the platform leverages AI (Gemini API) to analyze           feedback and generate intelligent summaries and insights.

🌟 Features

    📝 Submit and manage feedback
    
    📊 Dashboard with feedback overview
    
    🤖 AI-generated insights using Gemini API
    
    🔐 Authentication view
    
    📂 View personal submissions
    
    📚 Documentation section
    
    🎨 Clean and responsive UI

🛠️ Tech Stack

    Frontend: React + TypeScript
    
    Build Tool: Vite
    
    AI Integration: Google Gemini API
    
    Styling: CSS / Custom Styling
    
    Project Structure: Component-based architecture

📁 Project Structure

ai-feedback-hub/
│
├── App.tsx

├── index.tsx

├── index.html

├── geminiService.ts

├── types.ts

├── constants.tsx

├── vite.config.ts

├── tsconfig.json

│
├── views/

│   ├── DashboardView.tsx

│   ├── FeedbackListView.tsx

│   ├── AddFeedbackView.tsx

│   ├── AIInsightsView.tsx

│   ├── DocsView.tsx

│   ├── AuthView.tsx

│   └── MySubmissionsView.tsx
│
└── .env.local


⚙️ Installation & Setup

1️⃣ Clone the repository
   git clone https://github.com/your-username/ai-feedback-hub.git
   cd ai-feedback-hub
   
2️⃣ Install dependencies
   npm install

3️⃣ Setup Environment Variables
   Create a .env.local file in the root directory and add:
   VITE_GEMINI_API_KEY=your_api_key_here

4️⃣ Run the development server
   npm run dev

The app will run at:
   http://localhost:5173

