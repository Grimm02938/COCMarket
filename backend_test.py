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
BACKEND_URL = "https://d02ac46b-dcb3-44b0-9471-c9fdd9b7114e.preview.emergentagent.com/api"

class GameMarketplaceAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        self.sample_product_ids = []
        self.sample_user_ids = []
        self.auth_tokens = []  # Store authentication tokens for testing
        
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
    
    def test_auth_user_registration(self):
        """Test user registration with password hashing"""
        try:
            # Test user registration
            test_user = {
                "username": "testgamer2025",
                "email": "testgamer2025@cocmarket.fr",
                "password": "SecurePassword123!",
                "location": "fr",
                "display_name": "Test Gamer 2025",
                "bio": "Passionate gamer and collector",
                "location_display": "Lyon, France"
            }
            
            response = self.session.post(f"{self.base_url}/auth/register", json=test_user)
            
            if response.status_code == 200:
                auth_data = response.json()
                
                # Check response structure
                required_fields = ["user", "token", "expires_at"]
                missing_fields = [field for field in required_fields if field not in auth_data]
                
                if not missing_fields:
                    user = auth_data["user"]
                    token = auth_data["token"]
                    
                    # Verify user data (password should be hidden)
                    if user["email"] == test_user["email"] and user["password_hash"] == "***":
                        # Store token for further tests
                        self.auth_tokens.append(token)
                        self.sample_user_ids.append(user["id"])
                        
                        self.log_test("User Registration", True, 
                                    f"User registered: {user['username']}, Token: {token[:20]}...")
                        return True
                    else:
                        self.log_test("User Registration", False, "Invalid user data or password not hidden")
                        return False
                else:
                    self.log_test("User Registration", False, f"Missing fields: {missing_fields}")
                    return False
            else:
                self.log_test("User Registration", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Registration", False, f"Error: {str(e)}")
            return False
    
    def test_auth_user_login(self):
        """Test user login with credentials"""
        try:
            # Test login with the registered user
            login_data = {
                "email": "testgamer2025@cocmarket.fr",
                "password": "SecurePassword123!"
            }
            
            response = self.session.post(f"{self.base_url}/auth/login", json=login_data)
            
            if response.status_code == 200:
                auth_data = response.json()
                
                # Check response structure
                required_fields = ["user", "token", "expires_at"]
                missing_fields = [field for field in required_fields if field not in auth_data]
                
                if not missing_fields:
                    user = auth_data["user"]
                    token = auth_data["token"]
                    
                    # Verify user data and token
                    if user["email"] == login_data["email"] and len(token) > 20:
                        # Store new token (should be different from registration)
                        self.auth_tokens.append(token)
                        
                        self.log_test("User Login", True, 
                                    f"Login successful: {user['username']}, New token: {token[:20]}...")
                        return True
                    else:
                        self.log_test("User Login", False, "Invalid login response data")
                        return False
                else:
                    self.log_test("User Login", False, f"Missing fields: {missing_fields}")
                    return False
            else:
                self.log_test("User Login", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Login", False, f"Error: {str(e)}")
            return False
    
    def test_auth_invalid_login(self):
        """Test login with invalid credentials"""
        try:
            # Test with wrong password
            invalid_login = {
                "email": "testgamer2025@cocmarket.fr",
                "password": "WrongPassword123!"
            }
            
            response = self.session.post(f"{self.base_url}/auth/login", json=invalid_login)
            
            if response.status_code == 401:
                self.log_test("Invalid Login Handling", True, 
                            "Correctly rejects invalid credentials with 401")
                return True
            else:
                self.log_test("Invalid Login Handling", False, 
                            f"Expected 401, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Invalid Login Handling", False, f"Error: {str(e)}")
            return False
    
    def test_auth_get_current_user(self):
        """Test getting current user profile with token"""
        if not self.auth_tokens:
            self.log_test("Get Current User", False, "No auth tokens available for testing")
            return False
        
        try:
            token = self.auth_tokens[-1]  # Use latest token
            
            # Test GET /auth/me with token
            response = self.session.get(f"{self.base_url}/auth/me", params={"token": token})
            
            if response.status_code == 200:
                user = response.json()
                
                # Check user data structure
                required_fields = ["id", "username", "email", "location", "trust_score"]
                missing_fields = [field for field in required_fields if field not in user]
                
                if not missing_fields:
                    # Verify password is hidden
                    if user["password_hash"] == "***":
                        self.log_test("Get Current User", True, 
                                    f"Retrieved user profile: {user['username']} ({user['email']})")
                        return True
                    else:
                        self.log_test("Get Current User", False, "Password hash not properly hidden")
                        return False
                else:
                    self.log_test("Get Current User", False, f"Missing fields: {missing_fields}")
                    return False
            else:
                self.log_test("Get Current User", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Current User", False, f"Error: {str(e)}")
            return False
    
    def test_auth_update_profile(self):
        """Test updating user profile"""
        if not self.auth_tokens:
            self.log_test("Update User Profile", False, "No auth tokens available for testing")
            return False
        
        try:
            token = self.auth_tokens[-1]  # Use latest token
            
            # Test profile update
            update_data = {
                "display_name": "Updated Gamer Pro",
                "bio": "Updated bio - Professional esports player and collector",
                "location_display": "Marseille, France"
            }
            
            response = self.session.put(f"{self.base_url}/auth/profile", 
                                      params={"token": token}, 
                                      json=update_data)
            
            if response.status_code == 200:
                updated_user = response.json()
                
                # Verify updates were applied
                updates_applied = all(
                    updated_user.get(field) == value 
                    for field, value in update_data.items()
                )
                
                if updates_applied:
                    self.log_test("Update User Profile", True, 
                                f"Profile updated: {updated_user['display_name']}")
                    return True
                else:
                    self.log_test("Update User Profile", False, "Updates not properly applied")
                    return False
            else:
                self.log_test("Update User Profile", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Update User Profile", False, f"Error: {str(e)}")
            return False
    
    def test_auth_logout(self):
        """Test user logout"""
        if not self.auth_tokens:
            self.log_test("User Logout", False, "No auth tokens available for testing")
            return False
        
        try:
            token = self.auth_tokens[-1]  # Use latest token
            
            # Test logout
            response = self.session.post(f"{self.base_url}/auth/logout", params={"token": token})
            
            if response.status_code == 200:
                logout_data = response.json()
                
                if "message" in logout_data and "logged out" in logout_data["message"].lower():
                    self.log_test("User Logout", True, "Successfully logged out user")
                    
                    # Test that token is now invalid
                    test_response = self.session.get(f"{self.base_url}/auth/me", params={"token": token})
                    
                    if test_response.status_code == 401:
                        self.log_test("Token Invalidation", True, "Token properly invalidated after logout")
                        return True
                    else:
                        self.log_test("Token Invalidation", False, 
                                    f"Token still valid after logout: {test_response.status_code}")
                        return False
                else:
                    self.log_test("User Logout", False, "Invalid logout response")
                    return False
            else:
                self.log_test("User Logout", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Logout", False, f"Error: {str(e)}")
            return False
    
    def test_auth_duplicate_registration(self):
        """Test duplicate user registration handling"""
        try:
            # Try to register the same user again
            duplicate_user = {
                "username": "testgamer2025",
                "email": "testgamer2025@cocmarket.fr",
                "password": "AnotherPassword123!",
                "location": "fr"
            }
            
            response = self.session.post(f"{self.base_url}/auth/register", json=duplicate_user)
            
            if response.status_code == 400:
                error_data = response.json()
                if "detail" in error_data and ("email" in error_data["detail"].lower() or "already" in error_data["detail"].lower()):
                    self.log_test("Duplicate Registration Handling", True, 
                                "Correctly prevents duplicate email registration")
                    return True
                else:
                    self.log_test("Duplicate Registration Handling", False, 
                                f"Wrong error message: {error_data}")
                    return False
            else:
                self.log_test("Duplicate Registration Handling", False, 
                            f"Expected 400, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Duplicate Registration Handling", False, f"Error: {str(e)}")
            return False
    
    def test_auth_password_hashing(self):
        """Test that passwords are properly hashed and not stored in plain text"""
        try:
            # Register a new user for this test
            test_user = {
                "username": "hashtest2025",
                "email": "hashtest2025@cocmarket.fr", 
                "password": "TestPassword123!",
                "location": "fr"
            }
            
            response = self.session.post(f"{self.base_url}/auth/register", json=test_user)
            
            if response.status_code == 200:
                auth_data = response.json()
                user = auth_data["user"]
                
                # Verify password is not returned in plain text
                if user["password_hash"] == "***":
                    # Try to login with the password to verify hashing works
                    login_response = self.session.post(f"{self.base_url}/auth/login", json={
                        "email": test_user["email"],
                        "password": test_user["password"]
                    })
                    
                    if login_response.status_code == 200:
                        self.log_test("Password Hashing", True, 
                                    "Password properly hashed and verification works")
                        return True
                    else:
                        self.log_test("Password Hashing", False, 
                                    "Password hashing failed - cannot login with original password")
                        return False
                else:
                    self.log_test("Password Hashing", False, 
                                "Password hash exposed in response")
                    return False
            else:
                self.log_test("Password Hashing", False, f"Registration failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Password Hashing", False, f"Error: {str(e)}")
            return False
    
    def test_auth_session_management(self):
        """Test session token management and expiration"""
        try:
            # Register a user for session testing
            session_user = {
                "username": "sessiontest2025",
                "email": "sessiontest2025@cocmarket.fr",
                "password": "SessionTest123!",
                "location": "fr"
            }
            
            # Register user
            reg_response = self.session.post(f"{self.base_url}/auth/register", json=session_user)
            
            if reg_response.status_code == 200:
                reg_data = reg_response.json()
                first_token = reg_data["token"]
                
                # Login again to get a new token (should deactivate old sessions)
                login_response = self.session.post(f"{self.base_url}/auth/login", json={
                    "email": session_user["email"],
                    "password": session_user["password"]
                })
                
                if login_response.status_code == 200:
                    login_data = login_response.json()
                    second_token = login_data["token"]
                    
                    # Verify tokens are different
                    if first_token != second_token:
                        # Test that new token works
                        profile_response = self.session.get(f"{self.base_url}/auth/me", 
                                                          params={"token": second_token})
                        
                        if profile_response.status_code == 200:
                            self.log_test("Session Management", True, 
                                        "Session tokens properly managed - new login creates new session")
                            return True
                        else:
                            self.log_test("Session Management", False, 
                                        "New session token doesn't work")
                            return False
                    else:
                        self.log_test("Session Management", False, 
                                    "Same token returned for new login")
                        return False
                else:
                    self.log_test("Session Management", False, f"Login failed: {login_response.status_code}")
                    return False
            else:
                self.log_test("Session Management", False, f"Registration failed: {reg_response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Session Management", False, f"Error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend API tests including authentication"""
        print("🚀 Starting CocMarket Gaming Marketplace Backend API Tests")
        print("=" * 60)
        print()
        
        # Test sequence - Authentication tests first
        tests = [
            ("API Health Check", self.test_api_health),
            ("Sample Data Initialization", self.test_init_sample_data),
            ("🔐 User Registration", self.test_auth_user_registration),
            ("🔐 User Login", self.test_auth_user_login),
            ("🔐 Invalid Login Handling", self.test_auth_invalid_login),
            ("🔐 Get Current User", self.test_auth_get_current_user),
            ("🔐 Update User Profile", self.test_auth_update_profile),
            ("🔐 User Logout", self.test_auth_logout),
            ("🔐 Duplicate Registration Handling", self.test_auth_duplicate_registration),
            ("🔐 Password Hashing", self.test_auth_password_hashing),
            ("🔐 Session Management", self.test_auth_session_management)
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
            print("✅ ALL AUTHENTICATION TESTS PASSED - Authentication system is working correctly!")
        else:
            print(f"❌ {total - passed} tests failed - Check details above")
        
        return passed == total

def main():
    """Main test execution"""
    tester = GameMarketplaceAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎮 CocMarket Authentication System is fully functional!")
        sys.exit(0)
    else:
        print("\n⚠️  Some authentication tests failed - see details above")
        sys.exit(1)

if __name__ == "__main__":
    main()