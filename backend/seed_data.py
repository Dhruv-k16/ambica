"""
Seed initial data for Ambica Wedding Decor website
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_database():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Create admin user
    admin_exists = await db.admins.find_one({"email": "admin@ambicadecor.com"})
    if not admin_exists:
        admin = {
            "email": "admin@ambicadecor.com",
            "password": pwd_context.hash("Admin@123"),
            "name": "Ambica Admin",
            "created_at": "2025-01-01T00:00:00Z"
        }
        await db.admins.insert_one(admin)
        print("✓ Admin user created: admin@ambicadecor.com / Admin@123")
    else:
        print("✓ Admin user already exists")
    
    # Create services
    services_count = await db.services.count_documents({})
    if services_count == 0:
        services = [
            {
                "service_id": "service-1",
                "title": "Wedding Décor",
                "description": "Complete wedding decoration services with traditional and modern designs. We create magical moments with floral arrangements, lighting, and elegant setups that reflect your unique love story.",
                "image_url": "https://images.unsplash.com/photo-1710498689566-868b93f934c4",
                "icon": "heart"
            },
            {
                "service_id": "service-2",
                "title": "Reception & Stage Setup",
                "description": "Grand reception stages with royal ambiance and sophisticated décor. From majestic backdrops to stunning centerpieces, we design spaces that leave lasting impressions.",
                "image_url": "https://images.unsplash.com/photo-1669225445162-beaaa330dc90",
                "icon": "users"
            },
            {
                "service_id": "service-3",
                "title": "Mandap & Floral Decoration",
                "description": "Traditional mandap designs adorned with fresh flowers and elegant draping. We blend cultural heritage with contemporary aesthetics for your sacred ceremonies.",
                "image_url": "https://images.unsplash.com/photo-1746044159252-ed0ccafd7b46",
                "icon": "flower"
            },
            {
                "service_id": "service-4",
                "title": "Engagement, Haldi & Mehendi",
                "description": "Vibrant and colorful setups for pre-wedding ceremonies. We create joyful atmospheres with marigold décor, traditional seating, and Instagram-worthy backdrops.",
                "image_url": "https://images.unsplash.com/photo-1710983165044-0cc32d1aab4b",
                "icon": "sparkles"
            },
            {
                "service_id": "service-5",
                "title": "Corporate & Private Events",
                "description": "Professional event decoration for corporate gatherings, anniversaries, and celebrations. Sophisticated designs that align with your brand and occasion.",
                "image_url": "https://images.unsplash.com/photo-1768508951405-10e83c4a2872",
                "icon": "briefcase"
            }
        ]
        await db.services.insert_many(services)
        print("✓ Services created")
    else:
        print("✓ Services already exist")
    
    # Create homepage content
    homepage_exists = await db.content.find_one({"section_name": "homepage"})
    if not homepage_exists:
        homepage = {
            "section_name": "homepage",
            "content": {
                "hero_title": "Ambica Wedding Decor & Planner",
                "tagline": "Crafting Timeless Elegance for Every Special Occasion",
                "hero_subtitle": "Serving across Gujarat & Rajasthan",
                "intro_heading": "Creating Unforgettable Memories",
                "intro_text": "With years of experience and a passion for perfection, Ambica Wedding Decor & Planner transforms your special occasions into magical celebrations. From intimate gatherings to grand weddings, we bring your vision to life with creativity, elegance, and attention to detail.",
                "cta_primary": "Enquire Now",
                "cta_secondary": "View Our Work"
            }
        }
        await db.content.insert_one(homepage)
        print("✓ Homepage content created")
    else:
        print("✓ Homepage content already exists")
    
    # Create about content
    about_exists = await db.content.find_one({"section_name": "about"})
    if not about_exists:
        about = {
            "section_name": "about",
            "content": {
                "title": "Our Story",
                "subtitle": "A Family Tradition of Excellence",
                "paragraphs": [
                    "Ambica Wedding Decor & Planner is a family-run business rooted in the rich cultural traditions of Gujarat and Rajasthan. What started as a passion for creating beautiful celebrations has grown into a trusted name in event decoration across the region.",
                    "We believe in blending traditional elegance with modern design aesthetics. Every event we undertake is treated with the same care and attention as if it were our own family celebration. Our team brings together years of experience, creative innovation, and a deep understanding of cultural nuances.",
                    "From the vibrant colors of Gujarati weddings to the royal grandeur of Rajasthani celebrations, we specialize in creating atmospheres that reflect your heritage, personality, and dreams. Your special day deserves nothing less than perfection, and that's exactly what we deliver."
                ],
                "values": [
                    {
                        "title": "Tradition Meets Innovation",
                        "description": "Honoring cultural heritage while embracing modern design"
                    },
                    {
                        "title": "Attention to Detail",
                        "description": "Every element carefully curated for perfection"
                    },
                    {
                        "title": "Personalized Service",
                        "description": "Your vision, our expertise, unforgettable results"
                    }
                ]
            }
        }
        await db.content.insert_one(about)
        print("✓ About content created")
    else:
        print("✓ About content already exists")
    
    # Create sample events
    events_count = await db.events.count_documents({})
    if events_count == 0:
        events = [
            {
                "event_id": "event-1",
                "title": "Royal Rajasthani Wedding",
                "location": "Udaipur, Rajasthan",
                "event_type": "Wedding",
                "category": "Wedding",
                "images": [
                    "https://images.unsplash.com/photo-1746044159252-ed0ccafd7b46",
                    "https://images.unsplash.com/photo-1710498689566-868b93f934c4"
                ],
                "description": "A grand royal wedding with traditional Rajasthani décor, featuring intricate mandap designs and luxurious floral arrangements.",
                "date": "2024-12-15",
                "created_at": "2024-12-01T00:00:00Z"
            },
            {
                "event_id": "event-2",
                "title": "Elegant Reception Setup",
                "location": "Ahmedabad, Gujarat",
                "event_type": "Reception",
                "category": "Reception",
                "images": [
                    "https://images.unsplash.com/photo-1669225445162-beaaa330dc90"
                ],
                "description": "Modern and sophisticated reception decoration with stunning stage setup and ambient lighting.",
                "date": "2024-11-20",
                "created_at": "2024-11-10T00:00:00Z"
            }
        ]
        await db.events.insert_many(events)
        print("✓ Sample events created")
    else:
        print("✓ Events already exist")
    
    client.close()
    print("\n✅ Database seeded successfully!")
    print("\nAdmin Login Credentials:")
    print("Email: admin@ambicadecor.com")
    print("Password: Admin@123")

if __name__ == "__main__":
    asyncio.run(seed_database())
