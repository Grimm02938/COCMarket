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

# User Endpoints
@api_router.post("/users", response_model=User)
async def create_user(user: UserCreate):
    user_dict = user.dict()
    user_obj = User(**user_dict)
    await db.users.insert_one(user_obj.dict())
    return user_obj

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

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
