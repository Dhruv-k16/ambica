from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import time
import cloudinary
import cloudinary.utils
import asyncio
import resend
from fastapi.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

# Resend configuration
resend.api_key = os.getenv("RESEND_API_KEY")

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", 24))

# Security
security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Pydantic Models
class AdminCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
    email: str
    name: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminResponse

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    location: str
    event_type: str
    category: str
    images: List[str] = []
    description: str
    date: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class EventCreate(BaseModel):
    title: str
    location: str
    event_type: str
    category: str
    images: List[str] = []
    description: str
    date: str

class EventUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    event_type: Optional[str] = None
    category: Optional[str] = None
    images: Optional[List[str]] = None
    description: Optional[str] = None
    date: Optional[str] = None

class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    service_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    image_url: str
    icon: Optional[str] = None

class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    icon: Optional[str] = None

class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    enquiry_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: EmailStr
    event_type: str
    event_date: str
    location: str
    message: str
    status: str = "new"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class EnquiryCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    event_type: str
    event_date: str
    location: str
    message: str

class EnquiryStatusUpdate(BaseModel):
    status: str

class Content(BaseModel):
    model_config = ConfigDict(extra="ignore")
    section_name: str
    content: dict

class ContentUpdate(BaseModel):
    content: dict

class CloudinarySignatureResponse(BaseModel):
    signature: str
    timestamp: int
    cloud_name: str
    api_key: str
    folder: str
    resource_type: str

# Helper Functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
        
        admin = await db.admins.find_one({"email": email}, {"_id": 0})
        if admin is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin not found")
        
        return admin
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

async def send_email_notification(recipient_email: str, subject: str, html_content: str):
    """Send email notification using Resend"""
    sender_email = os.getenv("SENDER_EMAIL", "onboarding@resend.dev")
    params = {
        "from": sender_email,
        "to": [recipient_email],
        "subject": subject,
        "html": html_content
    }
    
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to {recipient_email}: {email.get('id')}")
        return email
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")

# Authentication Routes
@api_router.post("/auth/register", response_model=AdminResponse)
async def register_admin(admin_data: AdminCreate):
    """Register first admin only (disabled after one admin exists)"""

    # Check if any admin already exists
    existing_count = await db.admins.count_documents({})

    if existing_count > 0:
        raise HTTPException(
            status_code=403,
            detail="Admin registration is disabled"
        )

    hashed_password = hash_password(admin_data.password)

    admin_doc = {
        "email": admin_data.email,
        "password": hashed_password,
        "name": admin_data.name,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    await db.admins.insert_one(admin_doc)

    return AdminResponse(
        email=admin_data.email,
        name=admin_data.name
    )


@api_router.post("/auth/login", response_model=TokenResponse)
async def login_admin(login_data: AdminLogin):
    """Admin login"""
    admin = await db.admins.find_one({"email": login_data.email}, {"_id": 0})
    if not admin or not verify_password(login_data.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": admin["email"]})
    return TokenResponse(
        access_token=access_token,
        admin=AdminResponse(email=admin["email"], name=admin["name"])
    )

@api_router.get("/auth/me", response_model=AdminResponse)
async def get_current_admin_info(admin: dict = Depends(get_current_admin)):
    """Get current admin info"""
    return AdminResponse(email=admin["email"], name=admin["name"])

# Event Routes
@api_router.get("/events", response_model=List[Event])
async def get_events(category: Optional[str] = None):
    """Get all events with optional category filter"""
    query = {}
    if category:
        query["category"] = category
    
    events = await db.events.find(query, {"_id": 0}).to_list(1000)
    return events

@api_router.post("/events", response_model=Event)
async def create_event(event_data: EventCreate, admin: dict = Depends(get_current_admin)):
    """Create new event (admin only)"""
    event_obj = Event(**event_data.model_dump())
    doc = event_obj.model_dump()
    
    await db.events.insert_one(doc)
    return event_obj

@api_router.put("/events/{event_id}", response_model=Event)
async def update_event(event_id: str, event_data: EventUpdate, admin: dict = Depends(get_current_admin)):
    """Update event (admin only)"""
    event = await db.events.find_one({"event_id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = {k: v for k, v in event_data.model_dump().items() if v is not None}
    if update_data:
        await db.events.update_one({"event_id": event_id}, {"$set": update_data})
        event.update(update_data)
    
    return Event(**event)

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, admin: dict = Depends(get_current_admin)):
    """Delete event (admin only)"""
    result = await db.events.delete_one({"event_id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"message": "Event deleted successfully"}

# Service Routes
@api_router.get("/services", response_model=List[Service])
async def get_services():
    """Get all services"""
    services = await db.services.find({}, {"_id": 0}).to_list(100)
    return services

@api_router.put("/services/{service_id}", response_model=Service)
async def update_service(service_id: str, service_data: ServiceUpdate, admin: dict = Depends(get_current_admin)):
    """Update service (admin only)"""
    service = await db.services.find_one({"service_id": service_id}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    update_data = {k: v for k, v in service_data.model_dump().items() if v is not None}
    if update_data:
        await db.services.update_one({"service_id": service_id}, {"$set": update_data})
        service.update(update_data)
    
    return Service(**service)

# Enquiry Routes
@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(enquiry_data: EnquiryCreate):
    """Submit enquiry (public)"""
    enquiry_obj = Enquiry(**enquiry_data.model_dump())
    doc = enquiry_obj.model_dump()
    
    await db.enquiries.insert_one(doc)
    
    # Send email notification to admin
    admin_email = os.getenv("ADMIN_EMAIL")
    if admin_email:
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #C5A059;">New Enquiry Received - Ambica Wedding Decor</h2>
            <p><strong>Name:</strong> {enquiry_data.name}</p>
            <p><strong>Phone:</strong> {enquiry_data.phone}</p>
            <p><strong>Email:</strong> {enquiry_data.email}</p>
            <p><strong>Event Type:</strong> {enquiry_data.event_type}</p>
            <p><strong>Event Date:</strong> {enquiry_data.event_date}</p>
            <p><strong>Location:</strong> {enquiry_data.location}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #C5A059;">{enquiry_data.message}</p>
            <p style="margin-top: 30px; color: #888; font-size: 12px;">This is an automated notification from your website.</p>
        </body>
        </html>
        """
        await send_email_notification(
            admin_email,
            f"New Enquiry: {enquiry_data.event_type} - {enquiry_data.name}",
            html_content
        )
    
    return enquiry_obj

@api_router.get("/enquiries", response_model=List[Enquiry])
async def get_enquiries(admin: dict = Depends(get_current_admin)):
    """Get all enquiries (admin only)"""
    enquiries = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return enquiries

@api_router.patch("/enquiries/{enquiry_id}")
async def update_enquiry_status(enquiry_id: str, status_update: EnquiryStatusUpdate, admin: dict = Depends(get_current_admin)):
    """Update enquiry status (admin only)"""
    result = await db.enquiries.update_one(
        {"enquiry_id": enquiry_id},
        {"$set": {"status": status_update.status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    
    return {"message": "Enquiry status updated"}

# Content Routes
@api_router.get("/content/{section_name}")
async def get_content(section_name: str):
    """Get content for a section"""
    content = await db.content.find_one({"section_name": section_name}, {"_id": 0})
    if not content:
        return {"section_name": section_name, "content": {}}
    return content

@api_router.put("/content/{section_name}")
async def update_content(section_name: str, content_data: ContentUpdate, admin: dict = Depends(get_current_admin)):
    """Update content (admin only)"""
    await db.content.update_one(
        {"section_name": section_name},
        {"$set": {"content": content_data.content}},
        upsert=True
    )
    return {"section_name": section_name, "content": content_data.content}

# Cloudinary Routes
@api_router.get("/cloudinary/signature", response_model=CloudinarySignatureResponse)
async def generate_cloudinary_signature(
    resource_type: str = Query("image", regex="^(image|video)$"),
    folder: str = "ambica-wedding",
    admin: dict = Depends(get_current_admin)
):
    """Generate Cloudinary upload signature (admin only)"""
    timestamp = int(time.time())
    params = {
        "timestamp": timestamp,
        "folder": folder,
        
    }
    
    signature = cloudinary.utils.api_sign_request(
        params,
        os.getenv("CLOUDINARY_API_SECRET")
    )
    
    return CloudinarySignatureResponse(
        signature=signature,
        timestamp=timestamp,
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        folder=folder,
    )

# Settings Routes
@api_router.get("/settings/admin-email")
async def get_admin_email(admin: dict = Depends(get_current_admin)):
    """Get admin email for notifications"""
    return {"email": os.getenv("ADMIN_EMAIL")}

@api_router.put("/settings/admin-email")
async def update_admin_email(email_data: dict, admin: dict = Depends(get_current_admin)):
    """Update admin email (admin only)"""
    # In production, update .env file or use database
    return {"message": "Email updated", "email": email_data.get("email")}

# Root route
@api_router.get("/")
async def root():
    return {"message": "Ambica Wedding Decor API", "status": "active"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "https://ambica-sigma.vercel.app",
        "http://localhost:3000"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

@api_router.post("/services", response_model=Service)
async def create_service(service_data: Service, admin: dict = Depends(get_current_admin)):
    await db.services.insert_one(service_data.model_dump())
    return service_data
