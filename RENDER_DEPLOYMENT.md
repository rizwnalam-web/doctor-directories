# 🚀 Render Deployment Guide - Doctor Directories

## 📋 Step-by-Step Deployment to Render

### **Step 1: Prepare Your Repository**
1. **Upload to GitHub** (if not already):
   - Create a new repository on GitHub
   - Push your code: `git push origin main`

2. **Verify Build Works**:
   ```bash
   npm run build
   ```

---

### **Step 2: Deploy Backend to Render**

1. **Go to** [render.com](https://render.com) and **Sign Up/Login**

2. **Create New Service**:
   - Click **"New +"** → **"Web Service"**
   - **Connect** your GitHub repository

3. **Configure Backend Service**:
   ```
   Name: doctor-directories-backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables** (CRITICAL):
   ```env
   NODE_ENV=production
   PORT=5000

   # Database (Render PostgreSQL)
   DATABASE_URL=postgresql://username:password@host:5432/database

   # JWT Secret (generate a strong secret)
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   EMAIL_FROM=Doctor Directories <noreply@yourdomain.com>

   # Frontend URL (will be your Render app URL)
   CLIENT_URL=https://doctor-directories-frontend.onrender.com
   ```

5. **Deploy Backend**:
   - Click **"Create Web Service"**
   - Wait for deployment (3-5 minutes)

6. **Note Backend URL**:
   - Render will provide: `https://doctor-directories-backend.onrender.com`

---

### **Step 3: Set Up Database**

1. **Create PostgreSQL Database**:
   - In Render Dashboard: **"New +"** → **"PostgreSQL"**
   - Name: `doctor-directories-db`

2. **Run Database Migrations**:
   ```bash
   # Connect to your database and run:
   npx prisma generate
   npx prisma migrate deploy
   ```

3. **Update Backend DATABASE_URL**:
   - Use the database URL from Render dashboard
   - Update in your backend service environment variables

---

### **Step 4: Deploy Frontend to Render**

1. **Create New Service**:
   - **"New +"** → **"Static Site"**
   - Connect your GitHub repository

2. **Configure Frontend Service**:
   ```
   Name: doctor-directories-frontend
   Runtime: Node
   Build Command: npm run build
   Publish Directory: client/dist
   ```

3. **Add Environment Variables**:
   ```env
   # API Base URL (your backend URL)
   REACT_APP_API_URL=https://doctor-directories-backend.onrender.com
   ```

4. **Deploy Frontend**:
   - Click **"Create Static Site"**
   - Wait for deployment (2-3 minutes)

5. **Note Frontend URL**:
   - Render will provide: `https://doctor-directories-frontend.onrender.com`

---

### **Step 5: Update Backend Configuration**

1. **Update CLIENT_URL** in backend:
   ```env
   CLIENT_URL=https://doctor-directories-frontend.onrender.com
   ```

2. **Redeploy Backend** if needed

---

### **Step 6: Test Your Deployment**

1. **Open Frontend URL** in browser
2. **Test Registration** - Create a doctor account
3. **Test Password Reset** - Use forgot password feature
4. **Test Mobile View** - Check responsiveness
5. **Verify Database** - Check if data persists

---

## 🔧 Environment Variables Template

### **Backend Service Variables** (doctor-directories-backend):
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-32-character-secret-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Doctor Directories <noreply@yourdomain.com>
CLIENT_URL=https://doctor-directories-frontend.onrender.com
```

### **Frontend Variables** (doctor-directories-frontend):
```env
REACT_APP_API_URL=https://doctor-directories-backend.onrender.com
```

---

## 🌐 Custom Domain (Optional)

1. **Purchase Domain** from Namecheap, GoDaddy, etc.
2. **Add to Render**:
   - Dashboard → Service Settings → Custom Domains
   - Follow Render's domain setup guide

---

## 📊 Production Features Available

✅ **Global CDN** - Fast loading worldwide
✅ **SSL Certificate** - Free HTTPS
✅ **Database Included** - PostgreSQL with free tier
✅ **Auto-scaling** - Handles traffic spikes
✅ **Git Integration** - Automatic deployments
✅ **Environment Management** - Secure variable storage

---

## 🚨 Important Notes

### **Free Tier Limitations:**
- **512MB RAM** per service
- **Database sleeps** after inactivity (wakes up quickly)
- **Build time limits** - may need optimization for larger apps

### **Performance Optimization:**
- Frontend is static (built once)
- Backend handles API calls
- Database queries are optimized

### **Cost Management:**
- **Free tier** covers basic usage
- **Paid plans** start at $7/month for more resources

---

## 🆘 Troubleshooting

### **Build Fails:**
- Check Node.js version (use 18)
- Verify all dependencies installed
- Check environment variables

### **Database Issues:**
- Ensure DATABASE_URL is correct
- Run migrations after database creation
- Check database is not sleeping

### **Email Problems:**
- Verify Gmail app password
- Check email credentials
- Test with different email provider

---

## 🎯 Next Steps After Deployment

1. ✅ **Set up custom domain** (optional)
2. ✅ **Configure email settings** for password resets
3. ✅ **Add Google Analytics** for user insights
4. ✅ **Set up error monitoring** (Sentry, LogRocket)
5. ✅ **Plan feature updates** and improvements

**Your application is now ready for global deployment on Render! 🌍**

The combination of React frontend + Node.js backend + PostgreSQL database provides a robust, scalable platform that can handle users worldwide!
