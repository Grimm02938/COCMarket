from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Request
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
import stripe
import firebase_admin
from firebase_admin import credentials, auth

# --- Basic Configuration ---
load_dotenv()
ROOT_DIR = Path(__file__).parent


# --- Logging Configuration ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# --- Firebase Admin SDK Initialization ---
try:
    cred_path = ROOT_DIR / 'firebase-service-account.json'
    if firebase_admin._apps:
        logger.warning("Firebase app already initialized.")
    elif cred_path.exists():
        cred = credentials.Certificate(str(cred_path))
        firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized successfully.")
    else:
        logger.warning("Firebase service account key not found. Social login will not work.")
except Exception as e:
    logger.error(f"Failed to initialize Firebase Admin SDK: {e}")


# --- Stripe Configuration ---
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")
logger.info("Stripe configured.")

# --- MongoDB Connection ---
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
print(f"--- DEBUG: Trying to use MONGO_URL: {mongo_url} ---")  # DEBUG LINE

try:
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'cocmarket')]
    logger.info("MongoDB connection configured successfully")
except Exception as e:
    logger.error(f"MongoDB connection error: {e}")
    logger.warning("Continuing with server setup, database operations will fail until connection is fixed")

# --- Utility functions for authentication ---
def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return f"{salt}:{pwd_hash.hex()}"

def verify_password(password: str, hashed: str) -> bool:
    try:
        salt, pwd_hash = hashed.split(':')
        check_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return pwd_hash == check_hash.hex()
    except ValueError:
        return False

def generate_session_token() -> str:
    return secrets.token_urlsafe(32)

# --- App and Router Setup ---
app = FastAPI(title="CocMarket Gaming Marketplace API")
api_router = APIRouter(prefix="/api")

# ... (le reste du fichier reste inchangé) ...
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
    images: List[str] = []
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

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    password_hash: Optional[str] = None
    location: LocationRegion
    avatar: Optional[str] = None
    trust_score: float = 5.0
    total_sales: int = 0
    total_purchases: int = 0
    member_since: datetime = Field(default_factory=datetime.utcnow)
    is_verified: bool = False
    badges: List[str] = []
    display_name: Optional[str] = None
    bio: Optional[str] = None
    location_display: Optional[str] = None
    contact_info: Optional[Dict[str, Any]] = {}
    seller_stats: Optional[Dict[str, Any]] = {}
    is_online: bool = False
    last_seen: Optional[datetime] = None
    auth_provider: str = "email"

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    location: LocationRegion = LocationRegion.FR

class UserLogin(BaseModel):
    email: str
    password: str
    
class SocialLogin(BaseModel):
    token: str # Firebase ID token from the client

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
    
class StripeCheckoutRequest(BaseModel):
    product_id: str
    quantity: int = 1
    success_url: str
    cancel_url: str

# --- Authentication Dependency ---
async def get_current_user(token: str = Header(None, alias="Authorization")):
    if not token:
        raise HTTPException(status_code=401, detail="Authentication token required")
    
    if token.startswith("Bearer "):
        token = token[7:]
    
    session = await db.sessions.find_one({"token": token, "is_active": True})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    if session["expires_at"] < datetime.utcnow():
        await db.sessions.update_one({"_id": session["_id"]}, {"$set": {"is_active": False}})
        raise HTTPException(status_code=401, detail="Token expired")
    
    user = await db.users.find_one({"id": session["user_id"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    user.pop("password_hash", None)
    return User(**user)

@api_router.post("/auth/register", response_model=AuthResponse)
async def register_user(user_data: UserCreate):
    logger.info(f"📝 New user registration attempt for email: {user_data.email}")
    
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        logger.warning(f"❌ Email already registered: {user_data.email}")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_username = await db.users.find_one({"username": user_data.username})
    if existing_username:
        logger.warning(f"❌ Username already taken: {user_data.username}")
        raise HTTPException(status_code=400, detail="Username already taken")
    
    user_dict = user_data.dict()
    password = user_dict.pop("password")
    user_dict["password_hash"] = hash_password(password)
    logger.info(f"🔐 Password hashed for: {user_data.username}")
    
    user_obj = User(**user_dict)
    
    try:
        await db.users.insert_one(user_obj.dict())
        logger.info(f"✅ User '{user_data.username}' created successfully in DB.")
    except Exception as e:
        logger.error(f"❌ DB insertion error: {e}")
        raise HTTPException(status_code=500, detail="Database error during user creation")
    
    token = generate_session_token()
    expires_at = datetime.utcnow().replace(microsecond=0) + timedelta(days=30)
    
    session = UserSession(user_id=user_obj.id, token=token, expires_at=expires_at)
    await db.sessions.insert_one(session.dict())
    
    user_dict = user_obj.dict()
    user_dict.pop("password_hash", None)
    safe_user = User(**user_dict, password_hash="***")
    
    logger.info(f"🎉 Registration successful for: {user_data.username}")
    return AuthResponse(user=safe_user, token=token, expires_at=expires_at)

@api_router.post("/auth/login", response_model=AuthResponse)
async def login_user(login_data: UserLogin):
    logger.info(f"🔑 Login attempt for: {login_data.email}")
    user = await db.users.find_one({"email": login_data.email})
    if not user or not user.get("password_hash"):
        logger.warning(f"❌ User not found or is social login user: {login_data.email}")
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(login_data.password, user["password_hash"]):
        logger.warning(f"❌ Incorrect password for: {login_data.email}")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    await db.sessions.update_many({"user_id": user["id"], "is_active": True}, {"$set": {"is_active": False}})
    
    token = generate_session_token()
    expires_at = datetime.utcnow().replace(microsecond=0) + timedelta(days=30)
    
    session = UserSession(user_id=user["id"], token=token, expires_at=expires_at)
    await db.sessions.insert_one(session.dict())

    user.pop("password_hash", None)
    safe_user = User(**user, password_hash="***")
    
    logger.info(f"🎉 Login successful for: {user['username']}")
    return AuthResponse(user=safe_user, token=token, expires_at=expires_at)

@api_router.post("/auth/social-login", response_model=AuthResponse)
async def social_login(social_data: SocialLogin):
    try:
        decoded_token = auth.verify_id_token(social_data.token)
        email = decoded_token.get('email')
        name = decoded_token.get('name', email.split('@')[0])
        provider = decoded_token.get('firebase', {}).get('sign_in_provider', 'unknown')

        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by social provider.")
            
        logger.info(f"Social login attempt for email: {email} via provider: {provider}")
        user = await db.users.find_one({"email": email})

        if not user:
            logger.info(f"User with email {email} not found. Creating a new user.")
            base_username = name.replace(" ", "").lower()
            username = base_username
            counter = 1
            while await db.users.find_one({"username": username}):
                username = f"{base_username}{counter}"
                counter += 1

            new_user_data = {
                "username": username, "email": email, "display_name": name,
                "location": LocationRegion.FR, "auth_provider": provider, "is_verified": True
            }
            user_obj = User(**new_user_data)
            await db.users.insert_one(user_obj.dict())
            user = await db.users.find_one({"email": email})
            logger.info(f"New user created via social login: {username}")
        else:
            logger.info(f"User with email {email} found. Logging in.")

        await db.sessions.update_many({"user_id": user["id"], "is_active": True}, {"$set": {"is_active": False}})
        
        token = generate_session_token()
        expires_at = datetime.utcnow().replace(microsecond=0) + timedelta(days=30)
        
        session = UserSession(user_id=user["id"], token=token, expires_at=expires_at)
        await db.sessions.insert_one(session.dict())

        user.pop("password_hash", None)
        safe_user = User(**user, password_hash="***")
        
        return AuthResponse(user=safe_user, token=token, expires_at=expires_at)

    except auth.InvalidIdTokenError as e:
        logger.error(f"Invalid Firebase ID token: {e}")
        raise HTTPException(status_code=401, detail="Invalid social login token.")
    except Exception as e:
        logger.error(f"An error occurred during social login: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred during social login.")

@api_router.get("/auth/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current authenticated user information"""
    return current_user

@api_router.post("/auth/logout")
async def logout_user(token: str = Header(None, alias="Authorization")):
    """Logout user by invalidating the session token"""
    if not token:
        raise HTTPException(status_code=401, detail="Authentication token required")
    
    if token.startswith("Bearer "):
        token = token[7:]
    
    # Invalidate the session
    result = await db.sessions.update_one(
        {"token": token, "is_active": True}, 
        {"$set": {"is_active": False}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return {"message": "Successfully logged out"}

# --- Products Endpoints ---
@api_router.get("/products")
async def get_products(
    category: Optional[ProductCategory] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    location: Optional[LocationRegion] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 20
):
    """Get products with filtering options"""
    skip = (page - 1) * limit
    filter_query = {"is_available": True}
    
    if category:
        filter_query["category"] = category
    if min_price is not None:
        filter_query["price"] = {"$gte": min_price}
    if max_price is not None:
        if "price" in filter_query:
            filter_query["price"]["$lte"] = max_price
        else:
            filter_query["price"] = {"$lte": max_price}
    if location:
        filter_query["location"] = location
    if search:
        filter_query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"game_name": {"$regex": search, "$options": "i"}}
        ]
    
    products = await db.products.find(filter_query).skip(skip).limit(limit).to_list(length=limit)
    total = await db.products.count_documents(filter_query)
    
    return {
        "products": products,
        "total": total,
        "page": page,
        "limit": limit,
        "has_more": skip + limit < total
    }

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    """Get a specific product by ID"""
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Increment view count
    await db.products.update_one(
        {"id": product_id}, 
        {"$inc": {"view_count": 1}}
    )
    
    return product

@api_router.post("/products", response_model=GameProduct)
async def create_product(
    product_data: GameProductCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new product listing"""
    # Ensure the user is creating their own listing
    if product_data.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot create listing for another user")
    
    product = GameProduct(**product_data.dict())
    await db.products.insert_one(product.dict())
    
    return product

@api_router.put("/products/{product_id}")
async def update_product(
    product_id: str,
    product_update: GameProductUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a product listing"""
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product["seller_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot update another user's listing")
    
    update_data = {k: v for k, v in product_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.products.update_one(
        {"id": product_id}, 
        {"$set": update_data}
    )
    
    updated_product = await db.products.find_one({"id": product_id})
    return updated_product

@api_router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a product listing"""
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product["seller_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot delete another user's listing")
    
    await db.products.delete_one({"id": product_id})
    return {"message": "Product deleted successfully"}

# --- Stripe Payment Endpoints ---
@api_router.post("/stripe/create-checkout-session")
async def create_checkout_session(
    checkout_request: StripeCheckoutRequest,
    current_user: User = Depends(get_current_user)
):
    """Create a Stripe checkout session for a product"""
    # Get the product
    product = await db.products.find_one({"id": checkout_request.product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if not product["is_available"]:
        raise HTTPException(status_code=400, detail="Product is no longer available")
    
    try:
        # Create Stripe checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {
                        'name': product['title'],
                        'description': product['description'][:500],  # Stripe limit
                    },
                    'unit_amount': int(product['price'] * 100),  # Convert to cents
                },
                'quantity': checkout_request.quantity,
            }],
            mode='payment',
            success_url=checkout_request.success_url + f"?session_id={{CHECKOUT_SESSION_ID}}&product_id={product['id']}",
            cancel_url=checkout_request.cancel_url,
            metadata={
                'product_id': product['id'],
                'buyer_id': current_user.id,
                'seller_id': product['seller_id']
            }
        )
        
        return {"checkout_url": session.url, "session_id": session.id}
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=400, detail=f"Payment error: {str(e)}")

@api_router.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Handle successful payment
        await handle_successful_payment(session)
    
    return {"status": "success"}

async def handle_successful_payment(session):
    """Handle successful payment processing"""
    product_id = session['metadata']['product_id']
    buyer_id = session['metadata']['buyer_id']
    seller_id = session['metadata']['seller_id']
    
    # Mark product as sold
    await db.products.update_one(
        {"id": product_id},
        {"$set": {"is_available": False}}
    )
    
    # Update user stats
    await db.users.update_one(
        {"id": seller_id},
        {"$inc": {"total_sales": 1}}
    )
    
    await db.users.update_one(
        {"id": buyer_id},
        {"$inc": {"total_purchases": 1}}
    )
    
    # You can add email notification logic here
    logger.info(f"Payment completed for product {product_id}, buyer: {buyer_id}, seller: {seller_id}")

# --- Categories and Games Endpoints ---
@api_router.get("/categories")
async def get_categories():
    """Get all available product categories"""
    return [{"value": cat.value, "label": cat.value.title()} for cat in ProductCategory]

@api_router.get("/games")
async def get_popular_games():
    """Get popular games based on product listings"""
    pipeline = [
        {"$group": {"_id": "$game_name", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 20}
    ]
    
    result = await db.products.aggregate(pipeline).to_list(length=20)
    return [{"name": item["_id"], "listings_count": item["count"]} for item in result]

# --- Sample Data Endpoint (for development/testing) ---
@api_router.post("/init-sample-data")
async def initialize_sample_data():
    """Initialize sample data for development/testing"""
    try:
        # Check if data already exists
        existing_products = await db.products.count_documents({})
        if existing_products > 0:
            return {"message": "Sample data already exists", "products_count": existing_products}
        
        # Sample products
        sample_products = [
            {
                "id": str(uuid.uuid4()),
                "title": "Compte Fortnite niveau 150 avec skin rare",
                "description": "Compte Fortnite avec de nombreux skins rares, niveau 150, plus de 200 victoires royales",
                "category": ProductCategory.ACCOUNTS,
                "game_name": "Fortnite",
                "price": 45.99,
                "original_price": 60.00,
                "condition": ProductCondition.EXCELLENT,
                "location": LocationRegion.FR,
                "seller_id": "sample_seller_1",
                "images": [],
                "is_featured": True,
                "is_available": True,
                "level": 150,
                "stats": {"wins": 200, "kills": 1500},
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "view_count": 0
            },
            {
                "id": str(uuid.uuid4()),
                "title": "V-Bucks Fortnite - 2800 V-Bucks",
                "description": "2800 V-Bucks pour Fortnite, livraison immédiate",
                "category": ProductCategory.CURRENCY,
                "game_name": "Fortnite",
                "price": 19.99,
                "condition": ProductCondition.NEW,
                "location": LocationRegion.FR,
                "seller_id": "sample_seller_2",
                "images": [],
                "is_featured": False,
                "is_available": True,
                "stats": {"amount": 2800},
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "view_count": 0
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Skin CS:GO AK-47 Redline",
                "description": "Skin AK-47 Redline Field-Tested, très bon état",
                "category": ProductCategory.SKINS,
                "game_name": "CS:GO",
                "price": 25.50,
                "condition": ProductCondition.GOOD,
                "location": LocationRegion.EU,
                "seller_id": "sample_seller_1",
                "images": [],
                "is_featured": False,
                "is_available": True,
                "stats": {"wear": "Field-Tested", "float": 0.15},
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "view_count": 0
            }
        ]
        
        # Sample users
        sample_users = [
            {
                "id": "sample_seller_1",
                "username": "GamerPro123",
                "email": "gamer@example.com",
                "location": LocationRegion.FR,
                "trust_score": 4.8,
                "total_sales": 15,
                "total_purchases": 3,
                "member_since": datetime.utcnow() - timedelta(days=90),
                "is_verified": True,
                "badges": ["Vendeur fiable", "Réponse rapide"],
                "display_name": "GamerPro123",
                "bio": "Vendeur de comptes gaming depuis 2 ans",
                "is_online": True,
                "auth_provider": "email"
            },
            {
                "id": "sample_seller_2",
                "username": "SkinDealer",
                "email": "dealer@example.com",
                "location": LocationRegion.FR,
                "trust_score": 4.5,
                "total_sales": 8,
                "total_purchases": 12,
                "member_since": datetime.utcnow() - timedelta(days=45),
                "is_verified": True,
                "badges": ["Nouveau vendeur"],
                "display_name": "Skin Dealer",
                "bio": "Spécialisé dans les skins CS:GO",
                "is_online": False,
                "last_seen": datetime.utcnow() - timedelta(hours=2),
                "auth_provider": "email"
            }
        ]
        
        # Insert sample data
        await db.products.insert_many(sample_products)
        await db.users.insert_many(sample_users)
        
        return {
            "message": "Sample data initialized successfully",
            "products_created": len(sample_products),
            "users_created": len(sample_users)
        }
        
    except Exception as e:
        logger.error(f"Error initializing sample data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to initialize sample data: {str(e)}")

app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
