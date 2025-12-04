# 🚀 Vercel Deployment Setup Guide

## Setting Up Environment Variables on Vercel

Your application is deployed on Vercel through GitHub integration. To fix the API key error, you need to add the environment variable in Vercel's dashboard.

### Step-by-Step Instructions:

#### 1. Access Vercel Dashboard
- Go to: https://vercel.com/
- Sign in with your account
- Find your project (AI4Designers or chartyaka-remix)
- Click on the project to open it

#### 2. Navigate to Environment Variables
- Click on **"Settings"** tab (top navigation bar)
- Click on **"Environment Variables"** in the left sidebar

#### 3. Add Your OpenAI API Key
Click the **"Add New"** button and enter:

**Key (Name):**
```
NEXT_PUBLIC_AI_API_KEY
```

**Value:**
```
sk-proj-[your-full-api-key-from-openai]
```

**Environments:**
- ✅ Production
- ✅ Preview  
- ✅ Development

Then click **"Save"**

#### 4. Redeploy Your Application

After adding the environment variable, you need to trigger a new deployment:

**Option A: Redeploy from Vercel Dashboard**
1. Go to the **"Deployments"** tab
2. Click on the most recent deployment
3. Click the **three dots menu** (⋯)
4. Click **"Redeploy"**
5. Confirm the redeployment

**Option B: Push to GitHub (Automatic)**
1. Make any small change to your code
2. Commit and push to GitHub
3. Vercel will automatically deploy the new version

**Option C: Use the deployment we just pushed**
- The documentation files we just pushed will trigger a new deployment
- Wait a few minutes for Vercel to build and deploy
- The new deployment will include the environment variable

#### 5. Verify It Works
1. Wait for the deployment to complete (usually 1-2 minutes)
2. Visit your Vercel URL (e.g., https://your-app.vercel.app)
3. Try entering data and generating charts
4. You should no longer see the API key error!

---

## Important Notes

### ⚠️ Security
- **NEVER** commit your `.env.local` file to GitHub
- The `.env.local` file is only for local development
- Always add sensitive keys through Vercel's dashboard

### 🔄 When to Redeploy
You need to redeploy after:
- Adding new environment variables
- Changing existing environment variables
- The app won't pick up env changes until redeployed

### 📝 Environment Variable Format
- Variable name: `NEXT_PUBLIC_AI_API_KEY` (exactly as shown)
- No quotes around the value
- No spaces before or after the equals sign
- Must start with `NEXT_PUBLIC_` to be accessible in client-side code

---

## Troubleshooting

**Still seeing API key error after adding env variable?**
- Make sure you redeployed after adding the variable
- Check the variable name is exactly: `NEXT_PUBLIC_AI_API_KEY`
- Verify the API key is correct (starts with `sk-proj-` or `sk-`)
- Check all three environments are selected (Production, Preview, Development)

**How to check if env variable is set?**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. You should see `NEXT_PUBLIC_AI_API_KEY` listed
3. The value will be hidden (shows as `•••••••`)

**Need to update the API key?**
1. Go to Environment Variables in Vercel
2. Click the three dots next to the variable
3. Click "Edit"
4. Update the value
5. Save and redeploy

---

## Your Deployment Workflow

```
1. Edit code locally
2. Commit changes: git add . && git commit -m "message"
3. Push to GitHub: git push
4. Vercel automatically deploys
5. Visit your live site!
```

Environment variables are managed separately in Vercel dashboard and persist across deployments.
