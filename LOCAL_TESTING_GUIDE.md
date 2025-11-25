# 🔧 Quick Reference: Local vs Production Testing

## 📍 Current Setup

- **Backend (Local)**: http://localhost:5001
- **Frontend (Local)**: http://localhost:5173
- **Backend (Production)**: https://jobmatch-api-production.up.railway.app
- **Frontend (Production)**: [Your Vercel URL]

---

## 🧪 Test Local (Development)

### Bước 1: Đảm bảo file `.env` dùng localhost

```bash
# File: .env
VITE_API_URL=http://localhost:5001/api
```

### Bước 2: Chạy Backend

```bash
cd /Users/yennhinguyenduc/projects/JobMatch-BE
npm run dev
```

✅ Backend chạy tại: http://localhost:5001

### Bước 3: Chạy Frontend

```bash
cd /Users/yennhinguyenduc/projects/ITPM
npm run dev
```

✅ Frontend chạy tại: http://localhost:5173

### Bước 4: Test

- Mở browser: http://localhost:5173
- Scroll xuống "Company List"
- Click "View Company" button
- Kiểm tra Developer Tools (F12) → Console & Network tab

---

## 🚀 Deploy to Production

### Bước 1: Cập nhật `.env` cho production

```bash
# File: .env
VITE_API_URL=https://jobmatch-api-production.up.railway.app/api
```

### Bước 2: Build

```bash
cd /Users/yennhinguyenduc/projects/ITPM
npm run build
```

### Bước 3: Preview production build (optional)

```bash
npm run preview
```

### Bước 4: Deploy

```bash
# Vercel
git add .
git commit -m "Add company details view"
git push origin main
```

---

## ⚡ Quick Commands

### Switch to Local Testing

```bash
cd /Users/yennhinguyenduc/projects/ITPM
cp .env.local .env
npm run dev
```

### Switch to Production

```bash
cd /Users/yennhinguyenduc/projects/ITPM
cp .env.production .env
npm run build
```

### Kill all node processes (if ports are busy)

```bash
pkill -f node
```

### Check what's running on port

```bash
lsof -i :5001  # Backend
lsof -i :5173  # Frontend
```

---

## 🐛 Troubleshooting

### Network Error khi test local

**Nguyên nhân**: Frontend đang gọi production API thay vì localhost

**Giải pháp**:

1. Check file `.env`:
   ```bash
   cat .env
   ```
2. Đảm bảo có dòng:
   ```
   VITE_API_URL=http://localhost:5001/api
   ```
3. Restart frontend:
   ```bash
   pkill -f vite
   npm run dev
   ```

### Port already in use

```bash
# Kill process on specific port
lsof -ti:5173 | xargs kill -9  # Frontend
lsof -ti:5001 | xargs kill -9  # Backend
```

### Environment variables không update

- Vite chỉ load `.env` khi start
- Phải restart dev server sau khi thay đổi `.env`
- Clear browser cache nếu cần

---

## ✅ Testing Checklist

### Local Testing

- [ ] Backend chạy tại localhost:5001
- [ ] Frontend chạy tại localhost:5173
- [ ] `.env` có `VITE_API_URL=http://localhost:5001/api`
- [ ] Console không có CORS errors
- [ ] Network tab show requests to localhost:5001
- [ ] Company details page load thành công

### Production Deploy

- [ ] `.env` có production API URL
- [ ] `npm run build` thành công
- [ ] No build errors
- [ ] Push to GitHub
- [ ] Vercel deploy thành công
- [ ] Test trên production URL

---

## 📝 Notes

- **LUÔN LUÔN** test local trước khi deploy
- Commit `.env.example` nhưng KHÔNG commit `.env`
- `.env.local` và `.env.production` để backup
- Dùng `.gitignore` để ignore sensitive files
