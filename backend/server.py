from fastapi import FastAPI, APIRouter, HTTPException, Query, Depends, Header, Request
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
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

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
# IMPORTANT: Place your 'firebase-service-account.json' file in the 'backend/' directory.
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
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "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")
STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY", "pk_live_51RqyOwFsrP029t76six64eFyLCFMGmib98fSp9KnzT32IPv3FMH9FPmndf1OSTNcLPM8mVL4g1m4SsOvJBCTlUCL00eVIHsvge")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "whsec_...") # Replace with your actual webhook secret
logger.info("Stripe configured.")

# --- MongoDB Connection ---
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'cocmarket')]

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
    except:
        return False

def generate_session_token() -> str:
    return secrets.token_urlsafe(32)

# --- App and Router Setup ---
app = FastAPI(title="CocMarket Gaming Marketplace API")
api_router = APIRouter(prefix="/api")

# --- Enums and Models ---
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

# --- Authentication Endpoints ---
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
            user = await db.users.find_one({"email": email}) # Re-fetch user to get the full document
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

# --- Stripe Payment Endpoints ---
@api_router.post("/payments/create-checkout-session")
async def create_checkout_session(request: StripeCheckoutRequest):
    logger.info(f"Creating checkout session for product: {request.product_id}")
    product = await db.products.find_one({"id": request.product_id})
    if not product:
        logger.error(f"Product not found: {request.product_id}")
        raise HTTPException(status_code=404, detail="Product not found")

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': { 'name': product['title'] },
                    'unit_amount': int(product['price'] * 100),
                },
                'quantity': request.quantity,
            }],
            mode='payment',
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            metadata={'product_id': request.product_id}
        )
        logger.info(f"Checkout session created: {checkout_session.id}")
        return {"sessionId": checkout_session.id, "url": checkout_session.url}
    except Exception as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Stripe error: {str(e)}")

@api_router.post("/payments/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        product_id = session.get('metadata', {}).get('product_id')
        logger.info(f"Payment successful for product {product_id}")
        await db.products.update_one(
            {"id": product_id},
            {"$set": {"is_available": False, "sold_at": datetime.utcnow()}}
        )
    
    return {"status": "success"}

# --- Other Product and User Endpoints ---
@api_router.get("/products", response_model=List[GameProduct])
async def get_products(
    category: Optional[ProductCategory] = None, game_name: Optional[str] = None,
    min_price: Optional[float] = None, max_price: Optional[float] = None,
    search: Optional[str] = None, skip: int = 0, limit: int = 20
):
    filters = {"is_available": True}
    if category: filters["category"] = category
    if game_name: filters["game_name"] = {"$regex": game_name, "$options": "i"}
    if min_price is not None: filters["price"] = {"$gte": min_price}
    if max_price is not None:
        if "price" in filters: filters["price"]["$lte"] = max_price
        else: filters["price"] = {"$lte": max_price}
    if search:
        filters["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]
    
    products = await db.products.find(filters).skip(skip).limit(limit).sort("created_at", -1).to_list(None)
    return [GameProduct(**p) for p in products]

@api_router.get("/products/{product_id}", response_model=GameProduct)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    await db.products.update_one({"id": product_id}, {"$inc": {"view_count": 1}})
    return GameProduct(**product)


# --- App Initialization ---
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
