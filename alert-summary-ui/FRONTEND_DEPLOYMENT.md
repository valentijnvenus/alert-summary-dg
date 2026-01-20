# 🚀 Frontend Deployment Guide

## 📦 **What You Have**

I've created a complete Next.js frontend with these files:

```
farmer-chat-ui/
├── package.json             ✅ Dependencies
├── next.config.js           ✅ Next.js config
├── tsconfig.json            ✅ TypeScript config
├── tailwind.config.js       ✅ Styling config
├── postcss.config.js        ✅ CSS processing
├── .env.local.example       ✅ Environment template
└── src/app/
    ├── layout.tsx           ✅ Root layout
    ├── page.tsx             ✅ Main page (chat interface)
    └── globals.css          ✅ Global styles
```

---

## 🎯 **Option 1: Deploy to Vercel (EASIEST - 5 minutes)**

### **Step 1: Create GitHub Repo**

```bash
# In your local machine
mkdir farmer-chat-ui
cd farmer-chat-ui

# Copy all the files I created into this folder
# (package.json, next.config.js, tsconfig.json, etc.)

# Create src/app folder and copy layout.tsx, page.tsx, globals.css

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
gh repo create farmer-chat-ui --public --source=. --remote=origin --push
# OR manually create repo on github.com and push
```

### **Step 2: Deploy to Vercel**

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"New Project"**
4. Select your `farmer-chat-ui` repository
5. In **"Environment Variables"**, add:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://aakashdg-alert-summary-fc-backend.hf.space`
6. Click **"Deploy"**

**Done! Your frontend will be live at:**
```
https://farmer-chat-ui-your-username.vercel.app
```

---

## 🎯 **Option 2: Run Locally (For Testing)**

### **Step 1: Setup**

```bash
# Create project folder
mkdir farmer-chat-ui
cd farmer-chat-ui

# Copy all files into this folder

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=https://aakashdg-alert-summary-fc-backend.hf.space" > .env.local

# Install dependencies
npm install
```

### **Step 2: Run Development Server**

```bash
npm run dev
```

**Open:** http://localhost:3000

---

## 🎯 **Option 3: Deploy to Hugging Face Spaces**

### **Step 1: Build Static Site**

```bash
# Add export config to next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: 'https://aakashdg-alert-summary-fc-backend.hf.space'
  }
}
module.exports = nextConfig

# Build
npm run build
```

This creates `out/` folder with static HTML/CSS/JS.

### **Step 2: Create HF Space**

1. Go to https://huggingface.co/new-space
2. Name: `farmer-chat-ui`
3. SDK: **Static**
4. Create Space

### **Step 3: Upload Files**

Upload contents of `out/` folder to the Space.

---

## 📁 **File Mapping (Where to Copy Each File)**

```
YOUR LOCAL FOLDER:                    FILE I CREATED:
farmer-chat-ui/
├── package.json                  ← package.json
├── next.config.js                ← next.config.js
├── tsconfig.json                 ← tsconfig.json  
├── tailwind.config.js            ← tailwind.config.js
├── postcss.config.js             ← postcss.config.js
├── .env.local                    ← Create from env.local.example
├── .gitignore                    ← Create (see below)
└── src/
    └── app/
        ├── layout.tsx            ← app-layout.tsx
        ├── page.tsx              ← app-page.tsx
        └── globals.css           ← app-globals.css
```

---

## 📝 **.gitignore File**

Create `.gitignore`:
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

---

## ✅ **Verification Checklist**

After deployment:

- [ ] Frontend loads without errors
- [ ] Can type in query input
- [ ] Example buttons work
- [ ] Submit button triggers query
- [ ] Backend response displays correctly
- [ ] MCP server status shows
- [ ] PDF export button works
- [ ] No console errors

---

## 🧪 **Test Your Deployment**

### **1. Test Homepage**

Visit your deployed URL. Should see:
- Green header with "🌾 Farmer.Chat"
- Query input box
- Example query buttons

### **2. Test Query**

Type: "What is the weather like?"

Click "🔍 Ask"

Should see:
- Loading spinner (3-5 seconds)
- Farmer advice appears
- MCP pipeline details show
- Server status indicators (green checkmarks)

### **3. Test PDF Export**

After getting a response, click "📄 Export PDF"

Should download a PDF file with the query and advice.

---

## 🎨 **UI Preview**

```
┌─────────────────────────────────────────────────────────┐
│ 🌾 Farmer.Chat                                          
│ AI-Powered Agricultural Intelligence                    │
├─────────────────────────────────────────────────────────┤
│                                                         
│ Ask a question about farming in Bangalore:              │
│ ┌─────────────────────────────────────────┐  🔍 Ask     
│ │ Should I plant rice today?              │             │
│ └─────────────────────────────────────────┘             │
│                                                         │
│ Try these examples:                                     │
│ [What is the weather like?] [Should I plant rice?]      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ 📊 Farmer Advice                         📄 Export PDF   
│                                                         │
│ Current weather in Bangalore is 28°C...                 │
│ Soil moisture is at 35th percentile...                  │
│ Recommendation: Wait 2 days for expected rain.          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ 🔧 MCP Pipeline Details                               
│                                                         │
│ Intent: planting_decision                               │
│ Execution Time: 3.5s                                    │
│                                                         │
│ MCP Servers Used:                                       │
│ ✅ weather  ✅ soil_properties  ✅ water                 │
│                                                         │
│ Status: 3/3 servers successful                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🆘 **Common Issues**

### **Issue: "Module not found" errors**

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Issue: Tailwind styles not loading**

**Solution:**
Check `globals.css` has:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### **Issue: "Failed to connect to backend"**

**Solution:**
1. Check `.env.local` has correct backend URL
2. Test backend directly: `https://aakashdg-alert-summary-fc-backend.hf.space/api/health`
3. Check browser console for CORS errors

---

## 🎉 **You're Ready!**

**Recommended: Deploy to Vercel** (fastest and easiest)

Total time: 10-15 minutes from start to live deployment

---

**Need help? Check:**
- Vercel docs: https://vercel.com/docs
- Next.js docs: https://nextjs.org/docs
- Backend logs: Your HF Space Logs tab
