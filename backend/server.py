from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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
    location: LocationRegion
    avatar: Optional[str] = None  # Base64 encoded
    trust_score: float = 5.0
    total_sales: int = 0
    total_purchases: int = 0
    member_since: datetime = Field(default_factory=datetime.utcnow)
    is_verified: bool = False
    badges: List[str] = []

class UserCreate(BaseModel):
    username: str
    email: str
    location: LocationRegion
    avatar: Optional[str] = None

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
