# 🚀 Step-by-Step Render Deployment (Separate Services)

## 📋 Deployment Order & Configuration

### **Step 1: Create PostgreSQL Database**
1. **Go to** [render.com](https://render.com) → **New +** → **PostgreSQL**
2. **Name:** `doctor-directories-db`
3. **Create** and copy the `DATABASE_URL`

### **Step 2: Deploy Backend (Node.js API)**
1. **New +** → **Web Service** → **Connect GitHub repo**
2. **Service Settings:**
   ```
   Name: doctor-directories-backend
   Runtime: Node
   Build Command: npm install && npx prisma generate
   Start Command: npm start
   ```

3. **Environment Variables:**
   ```env
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=postgresql://user:pass@host:5432/db  # From Step 1
   JWT_SECRET=your-secure-jwt-secret-here
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   CLIENT_URL=https://doctor-directories-frontend.onrender.com
   ```

4. **Deploy** and note the backend URL

### **Step 3: Deploy Frontend (React App)**
1. **New +** → **Static Site** → **Connect GitHub repo**
2. **Service Settings:**
   ```
   Name: doctor-directories-frontend
   Build Command: npm run build
   Publish Directory: client/dist
   ```

3. **Environment Variables:**
   ```env
   REACT_APP_API_URL=https://doctor-directories-backend.onrender.com
   ```

4. **Deploy** and note the frontend URL

### **Step 4: Update Backend Configuration**
1. **Update CLIENT_URL** in backend service to your frontend URL
2. **Redeploy** backend if needed

## 🔗 Service Dependencies

```
Frontend (Static Site)
    ↓ API calls
Backend (Web Service)
    ↓ Database queries
Database (PostgreSQL)
```

## 🌐 Final URLs

After deployment, you'll have:
- **Frontend:** `https://doctor-directories-frontend.onrender.com`
- **Backend:** `https://doctor-directories-backend.onrender.com`
- **Database:** Auto-connected via DATABASE_URL

## ✅ Benefits of Separate Deployment

### **🚀 Performance**
- **Global CDN** for frontend (faster loading worldwide)
- **Independent scaling** (frontend and backend scale separately)
- **Static asset optimization** (images, CSS, JS served from CDN)

### **🔧 Development**
- **Independent deployments** (update frontend without touching backend)
- **Better resource allocation** (each service optimized for its role)
- **Easier debugging** (logs separated by service)

### **💰 Cost Efficiency**
- **Free tier** for both services
- **Pay only for what you use**
- **Scale services independently**

## 🆚 Alternative: Single Service Deployment

If you prefer simplicity, you could deploy as one service:

### **Single Service Option:**
1. **Create one Web Service** in Render
2. **Build Command:** `npm run build`
3. **Start Command:** `npm start`
4. **All in one container**

**But separate services are recommended for production!**

## 📊 Production Architecture

```
🌍 Users → 🌐 Frontend (CDN)
                     ↓ API calls
                🔧 Backend (Node.js)
                     ↓ Database queries
                💾 PostgreSQL Database
```

This architecture provides:
- ✅ **High availability**
- ✅ **Global performance**
- ✅ **Scalable infrastructure**
- ✅ **Professional deployment**

**Ready to deploy your separate services to Render! 🚀**
