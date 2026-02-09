# Ambica Wedding Decor & Planner - Complete Source Code

## 🎉 Welcome

This is the complete source code for **Ambica Wedding Decor & Planner** website - a premium, full-stack web application with admin dashboard for managing a wedding decoration business.

---

## 📦 Project Structure

```
/app/
├── backend/                 # FastAPI Backend
│   ├── server.py           # Main API server
│   ├── seed_data.py        # Database seeding script
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend environment variables
│
├── frontend/               # React Frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── ui/       # Shadcn UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/        # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ServicesPage.jsx
│   │   │   ├── ShowcasePage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   └── admin/    # Admin pages
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ManageEvents.jsx
│   │   │       ├── ManageServices.jsx
│   │   │       ├── ViewEnquiries.jsx
│   │   │       ├── EditContent.jsx
│   │   │       └── ManageLocations.jsx
│   │   ├── lib/          # Utilities
│   │   │   ├── api.js
│   │   │   └── cloudinary.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json       # Node dependencies
│   ├── tailwind.config.js
│   └── .env              # Frontend environment variables
│
└── design_guidelines.json # Design system specifications
```

---

## 🚀 Technology Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Premium UI components
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client

### Backend
- **FastAPI** - Modern Python web framework
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Cloudinary** - Image storage
- **Resend** - Email notifications
- **JWT** - Authentication

### Database
- **MongoDB** - NoSQL database

---

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
- **MongoDB** (v5.0 or higher)
- **Yarn** package manager
- **pip** Python package manager

---

## 🛠️ Local Setup Instructions

### Step 1: Clone/Download the Code

Download the entire `/app` directory to your local machine.

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd /app/backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with the following content:
```

**Backend `.env` file:**
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="ambica_wedding_db"
CORS_ORIGINS="*"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
RESEND_API_KEY="your_resend_api_key"
ADMIN_EMAIL="your_admin_email@example.com"
SENDER_EMAIL="onboarding@resend.dev"
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_ALGORITHM="HS256"
JWT_EXPIRATION_HOURS=24
```

```bash
# Seed the database with initial data
python seed_data.py

# Run the backend server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Backend will be available at: `http://localhost:8001`

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd /app/frontend

# Install dependencies
yarn install

# Create .env file with the following content:
```

**Frontend `.env` file:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

```bash
# Run the frontend development server
yarn start
```

Frontend will be available at: `http://localhost:3000`

---

## 🔐 Default Admin Credentials

After running `seed_data.py`, use these credentials:

- **Email:** `admin@ambicadecor.com`
- **Password:** `Admin@123`

**⚠️ Important:** Change the password after first login!

---

## 🌐 Environment Variables Explained

### Backend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGO_URL` | MongoDB connection string | Yes | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | Yes | `ambica_wedding_db` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | Get from cloudinary.com |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | Get from cloudinary.com |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | Get from cloudinary.com |
| `RESEND_API_KEY` | Resend email API key | Yes | Get from resend.com |
| `ADMIN_EMAIL` | Email to receive enquiries | Yes | `your@email.com` |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | Any random secure string |

### Frontend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `REACT_APP_BACKEND_URL` | Backend API base URL | Yes | `http://localhost:8001` |

---

## 📸 Getting API Keys

### Cloudinary (Image Storage)
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy: Cloud Name, API Key, API Secret

### Resend (Email Notifications)
1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create and copy your API key

---

## 🎨 Design System

The website follows a **Royal Minimalism** design theme:

- **Background:** Ivory (#FAF7F2)
- **Alternate Sections:** Warm Beige (#EFE6DA)
- **Headings:** Charcoal (#2B2B2B)
- **Body Text:** Muted Gray (#6B6B6B)
- **Primary Accent:** Logo Purple (HSL: 290° 67% 50%)
- **Typography:** Playfair Display (headings), Poppins (body)

---

## 🎯 Features

### Public Website
✅ Homepage with hero section and animations
✅ About Us page
✅ Services showcase (5 services)
✅ Portfolio/Showcase gallery with filters
✅ Contact form with email notifications
✅ Google Maps integration
✅ Fully responsive design
✅ Smooth animations

### Admin Dashboard
✅ Secure JWT authentication
✅ **Manage Events** - Add/Edit/Delete showcase events
✅ **Manage Services** - Update service descriptions and images
✅ **View Enquiries** - View and manage customer enquiries (New/Contacted/Closed status)
✅ **Edit Content** - Update homepage and about page text
✅ **Manage Locations** - Update business address, service areas, contact details
✅ Cloudinary image uploads
✅ Real-time content updates

---

## 📁 Database Collections

### `admins`
```json
{
  "email": "admin@ambicadecor.com",
  "password": "hashed_password",
  "name": "Ambica Admin",
  "created_at": "ISO date"
}
```

### `events`
```json
{
  "event_id": "uuid",
  "title": "Royal Rajasthani Wedding",
  "location": "Udaipur, Rajasthan",
  "event_type": "Wedding",
  "category": "Wedding",
  "images": ["url1", "url2"],
  "description": "Event description",
  "date": "2024-12-15",
  "created_at": "ISO date"
}
```

### `services`
```json
{
  "service_id": "uuid",
  "title": "Wedding Décor",
  "description": "Service description",
  "image_url": "cloudinary_url",
  "icon": "heart"
}
```

### `enquiries`
```json
{
  "enquiry_id": "uuid",
  "name": "Client Name",
  "phone": "+91 XXXXX XXXXX",
  "email": "client@email.com",
  "event_type": "Wedding",
  "event_date": "2025-06-15",
  "location": "Ahmedabad",
  "message": "Enquiry message",
  "status": "new",
  "created_at": "ISO date"
}
```

### `content`
```json
{
  "section_name": "homepage | about | location",
  "content": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

---

## 🚢 Deployment

The application is currently deployed on **Emergent Cloud (Kubernetes)**.

### Production URLs
- **Website:** https://ambicaweddings.preview.emergentagent.com
- **Admin:** https://ambicaweddings.preview.emergentagent.com/admin/login
- **API:** https://ambicaweddings.preview.emergentagent.com/api/

---

## 🌍 Custom Domain Setup

### Option 1: Using Emergent Cloud

Contact Emergent support to connect your custom domain:
1. Purchase a domain (e.g., ambicadecor.com)
2. Contact support@emergent.sh with your domain name
3. They will provide DNS configuration
4. Update DNS records at your domain registrar
5. SSL certificate will be automatically provisioned

### Option 2: Self-Hosting

If you deploy to your own server:

1. **Update Backend .env:**
```env
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

2. **Update Frontend .env:**
```env
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

3. **Configure DNS Records:**
```
A Record: @ → Your Server IP
A Record: www → Your Server IP
A Record: api → Your Server IP
```

4. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

5. **Nginx Configuration Example:**
```nginx
# Frontend
server {
    server_name yourdomain.com www.yourdomain.com;
    root /path/to/frontend/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend API
server {
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📦 Building for Production

### Frontend Build
```bash
cd /app/frontend
yarn build
```
This creates an optimized production build in `/app/frontend/build/`

### Backend Production
```bash
cd /app/backend
# Use gunicorn or uvicorn with multiple workers
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001
```

---

## 🐛 Troubleshooting

### Frontend Issues
- **Error: Module not found** → Run `yarn install`
- **API connection failed** → Check REACT_APP_BACKEND_URL in .env
- **Blank page** → Check browser console for errors

### Backend Issues
- **MongoDB connection error** → Ensure MongoDB is running
- **Import errors** → Activate virtual environment and run `pip install -r requirements.txt`
- **CORS errors** → Check CORS_ORIGINS in backend .env

### Image Upload Issues
- **Upload fails** → Verify Cloudinary credentials in .env
- **Images not displaying** → Check network tab for 403/404 errors

---

## 📝 Code Download Instructions

### Method 1: Download as ZIP (Recommended)

From your terminal or file manager:
```bash
# Create a ZIP archive
cd /app
zip -r ambica-wedding-source-code.zip . -x "*/node_modules/*" -x "*/__pycache__/*" -x "*/venv/*" -x "*/.git/*"
```

This creates `ambica-wedding-source-code.zip` containing all source files.

### Method 2: Git Repository

If you want to version control:
```bash
cd /app
git init
git add .
git commit -m "Initial commit: Ambica Wedding Decor website"

# Push to GitHub (create a private repo first)
git remote add origin https://github.com/yourusername/ambica-wedding.git
git branch -M main
git push -u origin main
```

---

## 🔧 Maintenance Guide

### Adding New Admin User
Run in Python shell:
```python
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import asyncio

async def add_admin():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["ambica_wedding_db"]
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    admin = {
        "email": "newemail@example.com",
        "password": pwd_context.hash("newpassword"),
        "name": "New Admin",
        "created_at": "2025-01-01T00:00:00Z"
    }
    await db.admins.insert_one(admin)
    print("Admin created!")

asyncio.run(add_admin())
```

### Updating Email Settings
Edit `/app/backend/.env`:
```env
ADMIN_EMAIL="new-admin@email.com"
RESEND_API_KEY="new_resend_key"
```
Restart backend server.

### Backing Up Database
```bash
# Export all data
mongodump --db ambica_wedding_db --out /backup/path

# Restore backup
mongorestore --db ambica_wedding_db /backup/path/ambica_wedding_db
```

---

## 📞 Support & Updates

### Making Code Changes

1. Update the code files
2. Test locally: `yarn start` (frontend) and `uvicorn server:app --reload` (backend)
3. Build for production: `yarn build`
4. Deploy updated files to server
5. Restart services

### Getting Help

- **Frontend Issues:** Check React documentation at reactjs.org
- **Backend Issues:** Check FastAPI docs at fastapi.tiangolo.com
- **Database Issues:** Check MongoDB docs at mongodb.com/docs
- **Deployment:** Contact hosting support or Emergent support

---

## 🎉 Congratulations!

You now have complete access to your website source code. You can:
- Modify design and content
- Add new features
- Deploy to any hosting platform
- Customize functionality
- Hire developers to extend it

**Remember to:**
- Keep .env files secure (never commit to GitHub)
- Backup database regularly
- Change default admin password
- Monitor email notifications
- Update dependencies periodically

---

## 📄 License

This code is proprietary and belongs to Ambica Wedding Decor & Planner. All rights reserved.

---

**Last Updated:** February 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
