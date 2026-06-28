# 🚀 Deploying to Render Guide

Follow these steps to deploy this Next.js stock analysis application to [Render](https://render.com) as a Web Service.

---

## Prerequisites
1. **GitHub Account**: Make sure your project is pushed to a repository on GitHub (private or public).
2. **Render Account**: Register for a free account at [render.com](https://render.com).

---

## Step-by-Step Instructions

### Step 1: Push code to GitHub
Make sure all your code is committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create a New Web Service on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click the **New +** button in the top right and select **Web Service**.
3. Connect your GitHub account and select your **investmentagent** repository from the list.

### Step 3: Configure Settings
Fill out the configuration form with the following details:

* **Name**: `investment-agent` (or any custom name)
* **Region**: Choose the one closest to you/your users (e.g., `Oregon (US West)` or `Frankfurt (EU Central)`)
* **Branch**: `main`
* **Runtime**: `Node`
* **Build Command**: `npm install && npm run build`
* **Start Command**: `npm run start`
* **Instance Type**: Select **Free** (or Starter if you want more RAM/faster loads)

### Step 4: Add Environment Variables
Next.js needs the API keys to execute the agents. 
1. Scroll down to the **Environment Variables** section on the same page (or go to the **Env Groups** / **Environment** tab on the left menu after creating).
2. Click **Add Environment Variable** and enter:
   
   | Key | Value |
   |-----|-------|
   | `GROQ_API_KEY` | *Your actual Groq API Key* |
   | `TAVILY_API_KEY` | *Your actual Tavily API Key* |
   | `NODE_VERSION` | `18.17.0` (or matching your local Node version) |

3. Click **Deploy Web Service** at the bottom of the page.

---

## 💡 Troubleshooting & Tips
* **Cold Starts**: Render's **Free tier** automatically puts Web Services to sleep after 15 minutes of inactivity. When someone visits the website after a long time, it can take 30-50 seconds to "spin up" and load the page.
* **Build Failures**: If the build fails because of ESLint warnings, you can bypass ESLint checks during build by adding `eslint: { ignoreDuringBuilds: true }` in `next.config.js`.
