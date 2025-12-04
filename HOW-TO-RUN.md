# 🚀 How to Run Your Chartyaka Application

## First Time Setup (Do Once)

### 1. Install Node.js
- Download from: https://nodejs.org/
- Install the LTS version
- Restart your computer after installation

### 2. Install Dependencies
Open PowerShell in this folder and run:
```powershell
npm install
```

### 3. Configure API Key
Edit the `.env.local` file and add your OpenAI API key:
```
NEXT_PUBLIC_AI_API_KEY=sk-proj-your-actual-key-here
```

## Running the Application

### Start the Server
```powershell
npm run dev
```

### Open in Browser
Go to: http://localhost:3000

### Stop the Server
Press `Ctrl + C` in the terminal

## After Changing .env.local

If you change the API key in `.env.local`:
1. Stop the server (Ctrl + C)
2. Start it again (npm run dev)

## Troubleshooting

**"npm is not recognized"**
- Node.js is not installed or not in PATH
- Restart your computer after installing Node.js

**"Cannot find module"**
- Run `npm install` first

**API Key Error**
- Check `.env.local` has correct format (no quotes, no spaces)
- Restart the dev server after changing .env.local
- Make sure variable name is exactly: NEXT_PUBLIC_AI_API_KEY

## Project Structure
```
AI4Designers/
├── .env.local          ← Your API key goes here
├── app/                ← Main application code
├── components/         ← UI components
├── lib/                ← Utility functions (AI service)
└── package.json        ← Project configuration
```
