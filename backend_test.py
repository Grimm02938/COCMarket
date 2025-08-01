#!/usr/bin/env python3
"""
CocMarket Gaming Marketplace Backend API Test Suite
Tests all gaming marketplace endpoints with realistic French gaming data
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, List, Any

# Backend URL from environment
BACKEND_URL = "https://57d436ed-489d-42b8-bd9f-599c28c0949b.preview.emergentagent.com/api"

class GameMarketplaceAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        self.sample_product_ids = []
        self.sample_user_ids = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        print()
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })
    
    def test_api_health(self):
        """Test basic API health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "CocMarket" in data["message"]:
                    self.log_test("API Health Check", True, f"API responding: {data['message']}")
                    return True
                else:
                    self.log_test("API Health Check", False, f"Unexpected response format: {data}")
                    return False
            else:
                self.log_test("API Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_init_sample_data(self):
        """Test sample data initialization"""
        try:
            response = self.session.post(f"{self.base_url}/init-sample-data")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "products" in data:
                    self.log_test("Sample Data Initialization", True, 
                                f"Initialized {data['products']} products, {data['users']} users, {data['reviews']} reviews")
                    return True
                else:
                    self.log_test("Sample Data Initialization", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Sample Data Initialization", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Sample Data Initialization", False, f"Error: {str(e)}")
            return False
    
    def test_get_products(self):
        """Test getting all products"""
        try:
            response = self.session.get(f"{self.base_url}/products")
            if response.status_code == 200:
                products = response.json()
                if isinstance(products, list) and len(products) > 0:
                    # Store some product IDs for later tests
                    self.sample_product_ids = [p["id"] for p in products[:3]]
                    
                    # Check if products have gaming-specific fields
                    first_product = products[0]
                    required_fields = ["id", "title", "category", "game_name", "price", "location"]
                    missing_fields = [field for field in required_fields if field not in first_product]
                    
                    if not missing_fields:
                        self.log_test("Get All Products", True, 
                                    f"Retrieved {len(products)} products with proper gaming fields")
                        return True
                    else:
                        self.log_test("Get All Products", False, f"Missing fields: {missing_fields}")
                        return False
                else:
                    self.log_test("Get All Products", False, "No products returned or invalid format")
                    return False
            else:
                self.log_test("Get All Products", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Get All Products", False, f"Error: {str(e)}")
            return False
    
    def test_product_filtering(self):
        """Test product filtering capabilities"""
        test_filters = [
            {"category": "accounts", "name": "Filter by Accounts Category"},
            {"category": "skins", "name": "Filter by Skins Category"},
            {"game_name": "Fortnite", "name": "Filter by Game Name"},
            {"location": "fr", "name": "Filter by French Location"},
            {"min_price": 100, "max_price": 300, "name": "Filter by Price Range"},
            {"search": "Fortnite", "name": "Search Functionality"},
            {"featured_only": True, "name": "Featured Products Only"}
        ]
        
        all_passed = True
        for filter_test in test_filters:
            try:
                test_name = filter_test.pop("name")
                response = self.session.get(f"{self.base_url}/products", params=filter_test)
                
                if response.status_code == 200:
                    products = response.json()
                    if isinstance(products, list):
                        self.log_test(test_name, True, f"Filter returned {len(products)} products")
                    else:
                        self.log_test(test_name, False, "Invalid response format")
                        all_passed = False
                else:
                    self.log_test(test_name, False, f"HTTP {response.status_code}")
                    all_passed = False
            except Exception as e:
                self.log_test(test_name, False, f"Error: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_get_single_product(self):
        """Test getting a single product by ID"""
        if not self.sample_product_ids:
            self.log_test("Get Single Product", False, "No product IDs available for testing")
            return False
        
        try:
            product_id = self.sample_product_ids[0]
            response = self.session.get(f"{self.base_url}/products/{product_id}")
            
            if response.status_code == 200:
                product = response.json()
                if "id" in product and product["id"] == product_id:
                    self.log_test("Get Single Product", True, 
                                f"Retrieved product: {product.get('title', 'Unknown')}")
                    return True
                else:
                    self.log_test("Get Single Product", False, "Product ID mismatch")
                    return False
            else:
                self.log_test("Get Single Product", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Get Single Product", False, f"Error: {str(e)}")
            return False
    
    def test_create_product(self):
        """Test creating a new gaming product"""
        new_product = {
            "title": "Test Skin CS:GO AWP Lightning Strike",
            "description": "Skin AWP Lightning Strike en excellent état pour test API",
            "category": "skins",
            "game_name": "CS:GO",
            "price": 45.99,
            "condition": "excellent",
            "location": "fr",
            "seller_id": "test-seller-123",
            "stats": {"float": 0.15, "condition": "Minimal Wear"}
        }
        
        try:
            response = self.session.post(f"{self.base_url}/products", json=new_product)
            
            if response.status_code == 200:
                created_product = response.json()
                if "id" in created_product and created_product["title"] == new_product["title"]:
                    self.sample_product_ids.append(created_product["id"])
                    self.log_test("Create Product", True, 
                                f"Created product: {created_product['title']}")
                    return True
                else:
                    self.log_test("Create Product", False, "Invalid response format")
                    return False
            else:
                self.log_test("Create Product", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Create Product", False, f"Error: {str(e)}")
            return False
    
    def test_categories_endpoint(self):
        """Test getting gaming categories"""
        try:
            response = self.session.get(f"{self.base_url}/categories")
            
            if response.status_code == 200:
                categories = response.json()
                expected_categories = ["accounts", "items", "characters", "skins", "currency", "boosting"]
                
                if isinstance(categories, list) and len(categories) > 0:
                    category_values = [cat.get("value") for cat in categories]
                    missing_categories = [cat for cat in expected_categories if cat not in category_values]
                    
                    if not missing_categories:
                        self.log_test("Get Categories", True, 
                                    f"All gaming categories present: {len(categories)} categories")
                        return True
                    else:
                        self.log_test("Get Categories", False, f"Missing categories: {missing_categories}")
                        return False
                else:
                    self.log_test("Get Categories", False, "Invalid categories format")
                    return False
            else:
                self.log_test("Get Categories", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Get Categories", False, f"Error: {str(e)}")
            return False
    
    def test_popular_games(self):
        """Test getting popular games"""
        try:
            response = self.session.get(f"{self.base_url}/games")
            
            if response.status_code == 200:
                games = response.json()
                if isinstance(games, list):
                    if len(games) > 0:
                        # Check if games have proper structure
                        first_game = games[0]
                        if "name" in first_game and "product_count" in first_game:
                            self.log_test("Get Popular Games", True, 
                                        f"Retrieved {len(games)} popular games")
                            return True
                        else:
                            self.log_test("Get Popular Games", False, "Invalid game structure")
                            return False
                    else:
                        self.log_test("Get Popular Games", True, "No games yet (empty database)")
                        return True
                else:
                    self.log_test("Get Popular Games", False, "Invalid response format")
                    return False
            else:
                self.log_test("Get Popular Games", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Get Popular Games", False, f"Error: {str(e)}")
            return False
    
    def test_product_reviews(self):
        """Test product review system"""
        if not self.sample_product_ids:
            self.log_test("Product Reviews", False, "No product IDs available for testing")
            return False
        
        try:
            product_id = self.sample_product_ids[0]
            
            # Test getting reviews
            response = self.session.get(f"{self.base_url}/products/{product_id}/reviews")
            
            if response.status_code == 200:
                reviews = response.json()
                if isinstance(reviews, list):
                    self.log_test("Get Product Reviews", True, 
                                f"Retrieved {len(reviews)} reviews for product")
                    
                    # Test review stats
                    stats_response = self.session.get(f"{self.base_url}/products/{product_id}/reviews/stats")
                    if stats_response.status_code == 200:
                        stats = stats_response.json()
                        if "average_rating" in stats and "total_reviews" in stats:
                            self.log_test("Get Review Stats", True, 
                                        f"Average rating: {stats['average_rating']}, Total: {stats['total_reviews']}")
                            return True
                        else:
                            self.log_test("Get Review Stats", False, "Invalid stats format")
                            return False
                    else:
                        self.log_test("Get Review Stats", False, f"HTTP {stats_response.status_code}")
                        return False
                else:
                    self.log_test("Get Product Reviews", False, "Invalid reviews format")
                    return False
            else:
                self.log_test("Get Product Reviews", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Product Reviews", False, f"Error: {str(e)}")
            return False
    
    def test_market_stats(self):
        """Test market statistics endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/market-stats")
            
            if response.status_code == 200:
                stats = response.json()
                required_fields = ["total_products", "total_sales", "average_price", "trending_games", "featured_products"]
                missing_fields = [field for field in required_fields if field not in stats]
                
                if not missing_fields:
                    self.log_test("Market Statistics", True, 
                                f"Total products: {stats['total_products']}, Avg price: {stats['average_price']}€")
                    return True
                else:
                    self.log_test("Market Statistics", False, f"Missing fields: {missing_fields}")
                    return False
            else:
                self.log_test("Market Statistics", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Market Statistics", False, f"Error: {str(e)}")
            return False
    
    def test_price_history(self):
        """Test price history functionality"""
        if not self.sample_product_ids:
            self.log_test("Price History", False, "No product IDs available for testing")
            return False
        
        try:
            product_id = self.sample_product_ids[0]
            
            # Test getting price history
            response = self.session.get(f"{self.base_url}/products/{product_id}/price-history")
            
            if response.status_code == 200:
                history = response.json()
                if isinstance(history, list):
                    self.log_test("Get Price History", True, 
                                f"Retrieved {len(history)} price history entries")
                    return True
                else:
                    self.log_test("Get Price History", False, "Invalid history format")
                    return False
            else:
                self.log_test("Get Price History", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Price History", False, f"Error: {str(e)}")
            return False
    
    def test_seller_profile_endpoints(self):
        """Test new seller profile functionality"""
        try:
            # First get users to test seller profiles
            response = self.session.get(f"{self.base_url}/products")
            if response.status_code != 200:
                self.log_test("Seller Profile Setup", False, "Could not get products to find seller IDs")
                return False
            
            products = response.json()
            if not products:
                self.log_test("Seller Profile Setup", False, "No products available for seller testing")
                return False
            
            # Get a seller ID from the first product
            seller_id = products[0]["seller_id"]
            self.sample_user_ids.append(seller_id)
            
            # Test GET /api/sellers/{user_id}/profile
            profile_response = self.session.get(f"{self.base_url}/sellers/{seller_id}/profile")
            
            if profile_response.status_code == 200:
                profile_data = profile_response.json()
                
                # Check if response has seller and stats
                if "seller" in profile_data and "stats" in profile_data:
                    seller = profile_data["seller"]
                    stats = profile_data["stats"]
                    
                    # Check enhanced seller profile fields
                    enhanced_fields = ["display_name", "bio", "location_display", "contact_info", "trust_score"]
                    missing_fields = [field for field in enhanced_fields if field not in seller]
                    
                    # Check stats fields
                    stats_fields = ["products_count", "average_rating", "total_reviews"]
                    missing_stats = [field for field in stats_fields if field not in stats]
                    
                    if not missing_fields and not missing_stats:
                        self.log_test("Get Seller Profile", True, 
                                    f"Seller: {seller.get('display_name', 'N/A')}, Products: {stats['products_count']}, Rating: {stats['average_rating']}")
                    else:
                        self.log_test("Get Seller Profile", False, 
                                    f"Missing fields: {missing_fields}, Missing stats: {missing_stats}")
                        return False
                else:
                    self.log_test("Get Seller Profile", False, "Missing seller or stats in response")
                    return False
            else:
                self.log_test("Get Seller Profile", False, f"HTTP {profile_response.status_code}: {profile_response.text}")
                return False
            
            # Test GET /api/sellers/{user_id}/products
            products_response = self.session.get(f"{self.base_url}/sellers/{seller_id}/products")
            
            if products_response.status_code == 200:
                seller_products = products_response.json()
                
                if isinstance(seller_products, list):
                    # Verify all products belong to this seller
                    all_correct_seller = all(p["seller_id"] == seller_id for p in seller_products)
                    
                    if all_correct_seller:
                        self.log_test("Get Seller Products", True, 
                                    f"Retrieved {len(seller_products)} products for seller")
                        return True
                    else:
                        self.log_test("Get Seller Products", False, "Some products don't belong to the seller")
                        return False
                else:
                    self.log_test("Get Seller Products", False, "Invalid products format")
                    return False
            else:
                self.log_test("Get Seller Products", False, f"HTTP {products_response.status_code}: {products_response.text}")
                return False
                
        except Exception as e:
            self.log_test("Seller Profile Endpoints", False, f"Error: {str(e)}")
            return False
    
    def test_enhanced_user_model(self):
        """Test enhanced user model with new seller profile fields"""
        try:
            # Create a test user with enhanced fields
            test_user = {
                "username": "TestSellerProfile",
                "email": "testseller@example.com",
                "location": "fr",
                "display_name": "Test Seller Pro",
                "bio": "Vendeur professionnel de jeux vidéo avec 5 ans d'expérience",
                "location_display": "Paris, France"
            }
            
            response = self.session.post(f"{self.base_url}/users", json=test_user)
            
            if response.status_code == 200:
                created_user = response.json()
                
                # Check if all enhanced fields are present
                enhanced_fields = ["display_name", "bio", "location_display", "contact_info", "seller_stats", "is_online", "last_seen"]
                missing_fields = [field for field in enhanced_fields if field not in created_user]
                
                if not missing_fields:
                    # Store user ID for cleanup
                    self.sample_user_ids.append(created_user["id"])
                    self.log_test("Enhanced User Model", True, 
                                f"Created user with enhanced fields: {created_user['display_name']}")
                    return True
                else:
                    self.log_test("Enhanced User Model", False, f"Missing enhanced fields: {missing_fields}")
                    return False
            else:
                self.log_test("Enhanced User Model", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Enhanced User Model", False, f"Error: {str(e)}")
            return False
    
    def test_seller_stats_calculation(self):
        """Test seller stats calculation accuracy"""
        if not self.sample_user_ids:
            self.log_test("Seller Stats Calculation", False, "No user IDs available for testing")
            return False
        
        try:
            seller_id = self.sample_user_ids[0]
            
            # Get seller profile with stats
            profile_response = self.session.get(f"{self.base_url}/sellers/{seller_id}/profile")
            
            if profile_response.status_code == 200:
                profile_data = profile_response.json()
                stats = profile_data["stats"]
                
                # Get seller products to verify count
                products_response = self.session.get(f"{self.base_url}/sellers/{seller_id}/products")
                
                if products_response.status_code == 200:
                    seller_products = products_response.json()
                    actual_product_count = len(seller_products)
                    
                    # Verify product count matches
                    if stats["products_count"] == actual_product_count:
                        self.log_test("Seller Stats - Product Count", True, 
                                    f"Product count accurate: {actual_product_count}")
                        
                        # Check if rating and review stats are reasonable
                        avg_rating = stats["average_rating"]
                        total_reviews = stats["total_reviews"]
                        
                        if 0 <= avg_rating <= 5 and total_reviews >= 0:
                            self.log_test("Seller Stats - Rating & Reviews", True, 
                                        f"Rating: {avg_rating}/5, Reviews: {total_reviews}")
                            return True
                        else:
                            self.log_test("Seller Stats - Rating & Reviews", False, 
                                        f"Invalid rating ({avg_rating}) or review count ({total_reviews})")
                            return False
                    else:
                        self.log_test("Seller Stats - Product Count", False, 
                                    f"Count mismatch: stats={stats['products_count']}, actual={actual_product_count}")
                        return False
                else:
                    self.log_test("Seller Stats Calculation", False, "Could not get seller products for verification")
                    return False
            else:
                self.log_test("Seller Stats Calculation", False, f"HTTP {profile_response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Seller Stats Calculation", False, f"Error: {str(e)}")
            return False
    
    def test_error_handling(self):
        """Test error handling for non-existent resources"""
        try:
            # Test non-existent product
            response = self.session.get(f"{self.base_url}/products/non-existent-id")
            
            if response.status_code == 404:
                self.log_test("Error Handling - Non-existent Product", True, 
                            "Properly returns 404 for non-existent product")
            else:
                self.log_test("Error Handling - Non-existent Product", False, 
                            f"Expected 404, got {response.status_code}")
                return False
            
            # Test non-existent seller profile
            seller_response = self.session.get(f"{self.base_url}/sellers/non-existent-seller/profile")
            
            if seller_response.status_code == 404:
                self.log_test("Error Handling - Non-existent Seller", True, 
                            "Properly returns 404 for non-existent seller")
                return True
            else:
                self.log_test("Error Handling - Non-existent Seller", False, 
                            f"Expected 404, got {seller_response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Error Handling", False, f"Error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting CocMarket Gaming Marketplace Backend API Tests")
        print("=" * 60)
        print()
        
        # Test sequence
        tests = [
            ("API Health Check", self.test_api_health),
            ("Sample Data Initialization", self.test_init_sample_data),
            ("Get All Products", self.test_get_products),
            ("Product Filtering", self.test_product_filtering),
            ("Get Single Product", self.test_get_single_product),
            ("Create New Product", self.test_create_product),
            ("Gaming Categories", self.test_categories_endpoint),
            ("Popular Games", self.test_popular_games),
            ("Enhanced User Model", self.test_enhanced_user_model),
            ("Seller Profile Endpoints", self.test_seller_profile_endpoints),
            ("Seller Stats Calculation", self.test_seller_stats_calculation),
            ("Product Reviews System", self.test_product_reviews),
            ("Market Statistics", self.test_market_stats),
            ("Price History", self.test_price_history),
            ("Error Handling", self.test_error_handling)
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            print(f"Running: {test_name}")
            if test_func():
                passed += 1
            print("-" * 40)
        
        # Summary
        print()
        print("=" * 60)
        print(f"🏁 TEST SUMMARY: {passed}/{total} tests passed")
        print("=" * 60)
        
        if passed == total:
            print("✅ ALL TESTS PASSED - Gaming Marketplace Backend is working correctly!")
        else:
            print(f"❌ {total - passed} tests failed - Check details above")
        
        return passed == total

def main():
    """Main test execution"""
    tester = GameMarketplaceAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎮 CocMarket Gaming Marketplace Backend API is fully functional!")
        sys.exit(0)
    else:
        print("\n⚠️  Some backend tests failed - see details above")
        sys.exit(1)

if __name__ == "__main__":
    main()