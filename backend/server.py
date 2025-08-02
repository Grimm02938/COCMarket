from fastapi import FastAPI, APIRouter, HTTPException, Query, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
from enum import Enum
import hashlib
import secrets


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
# Database collections
collections = ["products", "users", "reviews", "price_history", "market_stats", "sessions"]

# Utility functions for authentication
def hash_password(password: str) -> str:
    """Hash password with salt"""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return f"{salt}:{pwd_hash.hex()}"

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    try:
        salt, pwd_hash = hashed.split(':')
        check_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return pwd_hash == check_hash.hex()
    except:
        return False

def generate_session_token() -> str:
    """Generate a secure session token"""
    return secrets.token_urlsafe(32)

# Create the main app without a prefix
app = FastAPI(title="CocMarket Gaming Marketplace API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class ProductCategory(str, Enum):
    ACCOUNTS = "accounts"
    ITEMS = "items"
    CHARACTERS = "characters"
    SKINS = "skins"
    CURRENCY = "currency"
    BOOSTING = "boosting"

class ProductCondition(str, Enum):
    NEW = "new"
    EXCELLENT = "excellent"
    GOOD = "good"
    FAIR = "fair"

class LocationRegion(str, Enum):
    FR = "fr"
    EU = "eu"
    NA = "na"
    ASIA = "asia"
    OTHER = "other"

# Gaming Product Models
class GameProduct(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: ProductCategory
    game_name: str
    price: float
    original_price: Optional[float] = None
    condition: ProductCondition = ProductCondition.EXCELLENT
    location: LocationRegion
    seller_id: str
    images: List[str] = []  # Base64 encoded images
    is_featured: bool = False
    is_available: bool = True
    level: Optional[int] = None
    rank: Optional[str] = None
    stats: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    view_count: int = 0
    favorite_count: int = 0

class GameProductCreate(BaseModel):
    title: str
    description: str
    category: ProductCategory
    game_name: str
    price: float
    original_price: Optional[float] = None
    condition: ProductCondition = ProductCondition.EXCELLENT
    location: LocationRegion
    seller_id: str
    images: List[str] = []
    level: Optional[int] = None
    rank: Optional[str] = None
    stats: Dict[str, Any] = {}

class GameProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    condition: Optional[ProductCondition] = None
    is_available: Optional[bool] = None
    stats: Optional[Dict[str, Any]] = None

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    password_hash: str  # For storing hashed password
    location: LocationRegion
    avatar: Optional[str] = None  # Base64 encoded
    trust_score: float = 5.0
    total_sales: int = 0
    total_purchases: int = 0
    member_since: datetime = Field(default_factory=datetime.utcnow)
    is_verified: bool = False
    badges: List[str] = []
    # Enhanced seller profile fields
    display_name: Optional[str] = None
    bio: Optional[str] = None
    location_display: Optional[str] = None
    contact_info: Optional[Dict[str, Any]] = {}
    seller_stats: Optional[Dict[str, Any]] = {}
    is_online: bool = False
    last_seen: Optional[datetime] = None

class UserCreate(BaseModel):
    username: str
    email: str
    password: str  # Added password field
    location: LocationRegion = LocationRegion.FRANCE
    avatar: Optional[str] = None
    display_name: Optional[str] = None
    bio: Optional[str] = None
    location_display: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    display_name: Optional[str] = None
    bio: Optional[str] = None
    location_display: Optional[str] = None
    avatar: Optional[str] = None
    location: Optional[LocationRegion] = None

# Session Models
class UserSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    token: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
    is_active: bool = True

class AuthResponse(BaseModel):
    user: User
    token: str
    expires_at: datetime

async def get_current_user(token: str = None) -> User:
    """Get current user from session token"""
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")
    
    # Find active session
    session = await db.sessions.find_one({
        "token": token, 
        "is_active": True,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    # Get user
    user = await db.users.find_one({"id": session["user_id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return User(**user)

# Review Models
class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    reviewer_id: str
    reviewer_username: str
    rating: int  # 1-5 stars
    comment: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_verified_purchase: bool = False

class ReviewCreate(BaseModel):
    product_id: str
    reviewer_id: str
    reviewer_username: str
    rating: int
    comment: str
    is_verified_purchase: bool = False

# Market Data Models
class PriceHistory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    price: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class MarketStats(BaseModel):
    total_products: int
    total_sales: int
    average_price: float
    trending_games: List[str]
    featured_products: List[GameProduct]

# Legacy models for compatibility
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Basic routes
@api_router.get("/")
async def root():
    return {"message": "CocMarket Gaming Marketplace API", "version": "1.0.0"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Gaming Product Endpoints
@api_router.post("/products", response_model=GameProduct)
async def create_product(product: GameProductCreate):
    product_dict = product.dict()
    product_obj = GameProduct(**product_dict)
    await db.products.insert_one(product_obj.dict())
    return product_obj

@api_router.get("/products", response_model=List[GameProduct])
async def get_products(
    category: Optional[ProductCategory] = None,
    game_name: Optional[str] = None,
    location: Optional[LocationRegion] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    condition: Optional[ProductCondition] = None,
    search: Optional[str] = None,
    featured_only: bool = False,
    skip: int = 0,
    limit: int = 20
):
    filters = {"is_available": True}
    
    if category:
        filters["category"] = category
    if game_name:
        filters["game_name"] = {"$regex": game_name, "$options": "i"}
    if location:
        filters["location"] = location
    if min_price is not None:
        filters["price"] = {"$gte": min_price}
    if max_price is not None:
        if "price" in filters:
            filters["price"]["$lte"] = max_price
        else:
            filters["price"] = {"$lte": max_price}
    if condition:
        filters["condition"] = condition
    if search:
        filters["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"game_name": {"$regex": search, "$options": "i"}}
        ]
    if featured_only:
        filters["is_featured"] = True
    
    products = await db.products.find(filters).skip(skip).limit(limit).sort("created_at", -1).to_list(None)
    return [GameProduct(**product) for product in products]

@api_router.get("/products/{product_id}", response_model=GameProduct)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Increment view count
    await db.products.update_one(
        {"id": product_id},
        {"$inc": {"view_count": 1}, "$set": {"updated_at": datetime.utcnow()}}
    )
    
    return GameProduct(**product)

@api_router.put("/products/{product_id}", response_model=GameProduct)
async def update_product(product_id: str, product_update: GameProductUpdate):
    update_data = {k: v for k, v in product_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.products.update_one({"id": product_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = await db.products.find_one({"id": product_id})
    return GameProduct(**updated_product)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# Categories and Games
@api_router.get("/categories")
async def get_categories():
    return [{"value": cat.value, "label": cat.value.title()} for cat in ProductCategory]

@api_router.get("/games")
async def get_popular_games():
    pipeline = [
        {"$group": {"_id": "$game_name", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 20}
    ]
    games = await db.products.aggregate(pipeline).to_list(None)
    return [{"name": game["_id"], "product_count": game["count"]} for game in games]

# Authentication Endpoints
@api_router.post("/auth/register", response_model=AuthResponse)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_username = await db.users.find_one({"username": user_data.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create user with hashed password
    user_dict = user_data.dict()
    password = user_dict.pop("password")
    user_dict["password_hash"] = hash_password(password)
    
    user_obj = User(**user_dict)
    await db.users.insert_one(user_obj.dict())
    
    # Create session
    token = generate_session_token()
    expires_at = datetime.utcnow().replace(microsecond=0) + timedelta(days=30)  # 30 day session
    
    session = UserSession(
        user_id=user_obj.id,
        token=token,
        expires_at=expires_at
    )
    await db.sessions.insert_one(session.dict())
    
    # Return user without password_hash
    user_dict = user_obj.dict()
    user_dict.pop("password_hash", None)
    safe_user = User(**user_dict, password_hash="***")  # Hidden in response
    
    return AuthResponse(
        user=safe_user,
        token=token,
        expires_at=expires_at
    )

@api_router.post("/auth/login", response_model=AuthResponse)
async def login_user(login_data: UserLogin):
    """Login user with email and password"""
    user = await db.users.find_one({"email": login_data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Deactivate old sessions
    await db.sessions.update_many(
        {"user_id": user["id"], "is_active": True},
        {"$set": {"is_active": False}}
    )
    
    # Create new session
    token = generate_session_token()
    expires_at = datetime.utcnow().replace(microsecond=0) + timedelta(days=30)  # 30 day session
    
    session = UserSession(
        user_id=user["id"],
        token=token,
        expires_at=expires_at
    )
    await db.sessions.insert_one(session.dict())
    
    # Return user without password_hash
    user.pop("password_hash", None)
    safe_user = User(**user, password_hash="***")  # Hidden in response
    
    return AuthResponse(
        user=safe_user,
        token=token,
        expires_at=expires_at
    )

@api_router.post("/auth/logout")
async def logout_user(token: str):
    """Logout user by deactivating session"""
    await db.sessions.update_one(
        {"token": token},
        {"$set": {"is_active": False}}
    )
    return {"message": "Successfully logged out"}

@api_router.get("/auth/me", response_model=User)
async def get_current_user_profile(token: str):
    """Get current user profile"""
    user = await get_current_user(token)
    # Remove password_hash from response
    user_dict = user.dict()
    user_dict["password_hash"] = "***"  # Hidden
    return User(**user_dict)

@api_router.put("/auth/profile", response_model=User)
async def update_user_profile(token: str, user_update: UserUpdate):
    """Update current user profile"""
    current_user = await get_current_user(token)
    
    # Prepare update data
    update_data = {}
    for field, value in user_update.dict(exclude_unset=True).items():
        if value is not None:
            update_data[field] = value
    
    if update_data:
        # Check if username is being updated and is unique
        if "username" in update_data:
            existing = await db.users.find_one({
                "username": update_data["username"],
                "id": {"$ne": current_user.id}
            })
            if existing:
                raise HTTPException(status_code=400, detail="Username already taken")
        
        # Check if email is being updated and is unique
        if "email" in update_data:
            existing = await db.users.find_one({
                "email": update_data["email"],
                "id": {"$ne": current_user.id}
            })
            if existing:
                raise HTTPException(status_code=400, detail="Email already registered")
        
        await db.users.update_one(
            {"id": current_user.id},
            {"$set": update_data}
        )
    
    # Return updated user
    updated_user = await db.users.find_one({"id": current_user.id})
    updated_user.pop("password_hash", None)
    return User(**updated_user, password_hash="***")

@api_router.get("/sellers/{user_id}/profile")
async def get_seller_profile(user_id: str):
    """Get seller profile with stats and products"""
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Seller not found")
    
    # Get seller products count
    products_count = await db.products.count_documents({"seller_id": user_id, "is_available": True})
    
    # Get average rating from reviews
    pipeline = [
        {"$lookup": {
            "from": "reviews",
            "localField": "id",
            "foreignField": "product_id",
            "as": "reviews"
        }},
        {"$match": {"seller_id": user_id}},
        {"$unwind": {"path": "$reviews", "preserveNullAndEmptyArrays": True}},
        {"$group": {
            "_id": None,
            "avg_rating": {"$avg": "$reviews.rating"},
            "total_reviews": {"$sum": 1}
        }}
    ]
    
    rating_result = await db.products.aggregate(pipeline).to_list(None)
    avg_rating = rating_result[0]["avg_rating"] if rating_result and rating_result[0]["avg_rating"] else 0
    total_reviews = rating_result[0]["total_reviews"] if rating_result else 0
    
    seller_profile = User(**user)
    
    return {
        "seller": seller_profile.dict(),
        "stats": {
            "products_count": products_count,
            "average_rating": round(avg_rating, 1) if avg_rating else 0,
            "total_reviews": total_reviews
        }
    }

@api_router.get("/sellers/{user_id}/products")
async def get_seller_products(user_id: str, skip: int = 0, limit: int = 20):
    """Get products by seller"""
    products = await db.products.find(
        {"seller_id": user_id, "is_available": True}
    ).skip(skip).limit(limit).sort("created_at", -1).to_list(None)
    
    return [GameProduct(**product) for product in products]

# Review Endpoints
@api_router.post("/reviews", response_model=Review)
async def create_review(review: ReviewCreate):
    review_dict = review.dict()
    review_obj = Review(**review_dict)
    await db.reviews.insert_one(review_obj.dict())
    return review_obj

@api_router.get("/products/{product_id}/reviews", response_model=List[Review])
async def get_product_reviews(product_id: str):
    reviews = await db.reviews.find({"product_id": product_id}).sort("created_at", -1).to_list(None)
    return [Review(**review) for review in reviews]

@api_router.get("/products/{product_id}/reviews/stats")
async def get_product_review_stats(product_id: str):
    pipeline = [
        {"$match": {"product_id": product_id}},
        {"$group": {
            "_id": None,
            "average_rating": {"$avg": "$rating"},
            "total_reviews": {"$sum": 1},
            "rating_breakdown": {
                "$push": "$rating"
            }
        }}
    ]
    
    result = await db.reviews.aggregate(pipeline).to_list(None)
    if not result:
        return {"average_rating": 0, "total_reviews": 0, "rating_breakdown": {}}
    
    stats = result[0]
    breakdown = {}
    for rating in stats["rating_breakdown"]:
        breakdown[str(rating)] = breakdown.get(str(rating), 0) + 1
    
    return {
        "average_rating": round(stats["average_rating"], 1) if stats["average_rating"] else 0,
        "total_reviews": stats["total_reviews"],
        "rating_breakdown": breakdown
    }

# Market Data Endpoints
@api_router.post("/products/{product_id}/price-history")
async def add_price_history(product_id: str, price: float):
    price_history = PriceHistory(product_id=product_id, price=price)
    await db.price_history.insert_one(price_history.dict())
    return {"message": "Price history added"}

@api_router.get("/products/{product_id}/price-history")
async def get_price_history(product_id: str):
    history = await db.price_history.find({"product_id": product_id}).sort("timestamp", -1).limit(30).to_list(None)
    return [PriceHistory(**item) for item in history]

@api_router.get("/market-stats", response_model=MarketStats)
async def get_market_stats():
    total_products = await db.products.count_documents({"is_available": True})
    
    # Get trending games
    pipeline = [
        {"$match": {"is_available": True}},
        {"$group": {"_id": "$game_name", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    trending_games_result = await db.products.aggregate(pipeline).to_list(None)
    trending_games = [game["_id"] for game in trending_games_result]
    
    # Get featured products
    featured_products = await db.products.find({"is_featured": True, "is_available": True}).limit(4).to_list(None)
    featured_products_obj = [GameProduct(**product) for product in featured_products]
    
    # Calculate average price
    pipeline = [
        {"$match": {"is_available": True}},
        {"$group": {"_id": None, "average_price": {"$avg": "$price"}}}
    ]
    avg_price_result = await db.products.aggregate(pipeline).to_list(None)
    average_price = avg_price_result[0]["average_price"] if avg_price_result else 0
    
    return MarketStats(
        total_products=total_products,
        total_sales=0,  # To be implemented with order system
        average_price=round(average_price, 2),
        trending_games=trending_games,
        featured_products=featured_products_obj
    )

# Sample Data Initialization
@api_router.post("/init-sample-data")
async def init_sample_data():
    """Initialize the database with sample gaming products"""
    
    # Clear existing data
    await db.products.delete_many({})
    await db.users.delete_many({})
    await db.reviews.delete_many({})
    
    # Sample users
    sample_users = [
        User(
            username="ProGamer_FR",
            email="progamer@example.com",
            location=LocationRegion.FR,
            display_name="ProGamer_FR",
            bio="Joueur professionnel depuis 5 ans. Spécialisé dans les jeux de stratégie et les FPS. Transactions sécurisées et livraison rapide garantie.",
            location_display="France",
            trust_score=4.8,
            total_sales=15,
            is_verified=True,
            badges=["Top Seller", "Verified", "Pro Gamer"],
            is_online=True,
            contact_info={"discord": "ProGamer#1234", "telegram": "@progamer_fr"}
        ),
        User(
            username="EliteTrader",
            email="elite@example.com", 
            location=LocationRegion.EU,
            display_name="Elite Trader",
            bio="Trader expérimenté avec plus de 100 transactions réussies. Expertise en comptes premium et objets rares.",
            location_display="Europe",
            trust_score=4.9,
            total_sales=32,
            is_verified=True,
            badges=["Elite", "Power Seller"],
            is_online=False,
            contact_info={"discord": "EliteTrader#5678"}
        ),
        User(
            username="GameMaster",
            email="master@example.com",
            location=LocationRegion.FR,
            display_name="Game Master",
            bio="Nouveau vendeur passionné. Prix compétitifs et service client de qualité.",
            location_display="Paris, France",
            trust_score=4.7,
            total_sales=8,
            is_verified=False,
            badges=["New Seller"],
            is_online=True,
            contact_info={"email": "master@example.com"}
        )
    ]
    
    for user in sample_users:
        await db.users.insert_one(user.dict())
    
    # Sample products
    sample_products = [
        GameProduct(
            title="Compte Fortnite Rare - Skins Exclusifs",
            description="Compte Fortnite avec plus de 50 skins rares incluant Renegade Raider, Black Knight et autres skins exclusifs. Compte niveau 200+ avec de nombreux emotes et gliders rares.",
            category=ProductCategory.ACCOUNTS,
            game_name="Fortnite",
            price=299.99,
            original_price=399.99,
            condition=ProductCondition.EXCELLENT,
            location=LocationRegion.FR,
            seller_id=sample_users[0].id,
            is_featured=True,
            level=200,
            stats={"skins": 50, "emotes": 30, "gliders": 15, "season_played": 15}
        ),
        GameProduct(
            title="Épée Légendaire +15 Enchantée",
            description="Épée légendaire forgée avec des matériaux rares. Enchantements: Feu +10, Critique +25%, Durabilité infinie. Parfait pour raids de haut niveau.",
            category=ProductCategory.ITEMS,
            game_name="World of Warcraft",
            price=149.99,
            condition=ProductCondition.NEW,
            location=LocationRegion.FR,
            seller_id=sample_users[1].id,
            is_featured=True,
            stats={"damage": 450, "enchantments": 3, "rarity": "Legendary"}
        ),
        GameProduct(
            title="Personnage Paladin Niveau 80",
            description="Personnage Paladin complètement équipé, niveau 80 avec équipement raid complet. Montures rares incluses. Guilde prestigieuse.",
            category=ProductCategory.CHARACTERS,
            game_name="World of Warcraft",
            price=199.99,
            condition=ProductCondition.EXCELLENT,
            location=LocationRegion.EU,
            seller_id=sample_users[1].id,
            level=80,
            rank="Diamond",
            stats={"ilvl": 280, "mounts": 15, "achievements": 8500}
        ),
        GameProduct(
            title="Skin AK-47 Dragon Lore FN",
            description="Skin légendaire AK-47 Dragon Lore en condition Factory New. Float exceptionnel. Investissement sûr pour collectionneurs.",
            category=ProductCategory.SKINS,
            game_name="CS:GO",
            price=899.99,
            condition=ProductCondition.NEW,
            location=LocationRegion.FR,
            seller_id=sample_users[0].id,
            is_featured=True,
            stats={"float": 0.003, "condition": "Factory New", "stickers": 0}
        ),
        GameProduct(
            title="10,000 V-Bucks Fortnite",
            description="Pack de V-Bucks pour Fortnite, livraison immédiate sur votre compte. Méthode 100% sécurisée et légale.",
            category=ProductCategory.CURRENCY,
            game_name="Fortnite",
            price=79.99,
            condition=ProductCondition.NEW,
            location=LocationRegion.FR,
            seller_id=sample_users[2].id,
            stats={"amount": 10000, "bonus": 1500}
        ),
        GameProduct(
            title="Boosting Rang Diamond - League of Legends",
            description="Service de boosting professionnel de votre rang actuel vers Diamond. Booster expérimenté, discrétion garantie.",
            category=ProductCategory.BOOSTING,
            game_name="League of Legends",
            price=59.99,
            condition=ProductCondition.NEW,
            location=LocationRegion.FR,
            seller_id=sample_users[0].id,
            stats={"from_rank": "Gold", "to_rank": "Diamond", "estimated_days": 7}
        )
    ]
    
    for product in sample_products:
        await db.products.insert_one(product.dict())
    
    # Sample reviews
    sample_reviews = [
        Review(
            product_id=sample_products[0].id,
            reviewer_id=sample_users[1].id,
            reviewer_username=sample_users[1].username,
            rating=5,
            comment="Excellent compte, exactement comme décrit ! Transaction rapide et sécurisée.",
            is_verified_purchase=True
        ),
        Review(
            product_id=sample_products[1].id,
            reviewer_id=sample_users[0].id,
            reviewer_username=sample_users[0].username,
            rating=5,
            comment="Épée magnifique, enchantements parfaits. Vendeur très professionnel !",
            is_verified_purchase=True
        ),
        Review(
            product_id=sample_products[0].id,
            reviewer_id=sample_users[2].id,
            reviewer_username=sample_users[2].username,
            rating=4,
            comment="Très bon compte, quelques skins en moins que prévu mais globalement satisfait.",
            is_verified_purchase=True
        )
    ]
    
    for review in sample_reviews:
        await db.reviews.insert_one(review.dict())
    
    return {"message": "Sample data initialized successfully", "products": len(sample_products), "users": len(sample_users), "reviews": len(sample_reviews)}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
