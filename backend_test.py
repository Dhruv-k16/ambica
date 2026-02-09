import requests
import sys
import json
from datetime import datetime

class AmbicaWeddingAPITester:
    def __init__(self, base_url="https://ambicaweddings.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_admin_login(self):
        """Test admin login"""
        login_data = {
            "email": "admin@ambicadecor.com",
            "password": "Admin@123"
        }
        success, response = self.run_test("Admin Login", "POST", "auth/login", 200, data=login_data)
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_admin_me(self):
        """Test get current admin info"""
        if not self.token:
            print("❌ Skipping admin/me test - no token")
            return False
        return self.run_test("Get Admin Info", "GET", "auth/me", 200)[0]

    def test_get_services(self):
        """Test get all services"""
        return self.run_test("Get Services", "GET", "services", 200)[0]

    def test_get_events(self):
        """Test get all events"""
        return self.run_test("Get Events", "GET", "events", 200)[0]

    def test_get_events_with_filter(self):
        """Test get events with category filter"""
        return self.run_test("Get Events (Wedding)", "GET", "events?category=wedding", 200)[0]

    def test_create_event(self):
        """Test create new event (admin only)"""
        if not self.token:
            print("❌ Skipping create event test - no token")
            return False, None
        
        event_data = {
            "title": "Test Wedding Event",
            "location": "Test Location, Gujarat",
            "event_type": "Wedding",
            "category": "wedding",
            "images": ["https://images.unsplash.com/photo-1710498689566-868b93f934c4"],
            "description": "Test wedding event for API testing",
            "date": "2025-12-25"
        }
        success, response = self.run_test("Create Event", "POST", "events", 200, data=event_data)
        if success and 'event_id' in response:
            return True, response['event_id']
        return False, None

    def test_update_event(self, event_id):
        """Test update event"""
        if not self.token or not event_id:
            print("❌ Skipping update event test - no token or event_id")
            return False
        
        update_data = {
            "description": "Updated test wedding event description"
        }
        return self.run_test("Update Event", "PUT", f"events/{event_id}", 200, data=update_data)[0]

    def test_delete_event(self, event_id):
        """Test delete event"""
        if not self.token or not event_id:
            print("❌ Skipping delete event test - no token or event_id")
            return False
        
        return self.run_test("Delete Event", "DELETE", f"events/{event_id}", 200)[0]

    def test_create_enquiry(self):
        """Test create enquiry (public)"""
        enquiry_data = {
            "name": "Test Customer",
            "phone": "+91 9876543210",
            "email": "test@example.com",
            "event_type": "Wedding",
            "event_date": "2025-12-25",
            "location": "Ahmedabad, Gujarat",
            "message": "Test enquiry for API testing"
        }
        success, response = self.run_test("Create Enquiry", "POST", "enquiries", 200, data=enquiry_data)
        if success and 'enquiry_id' in response:
            return True, response['enquiry_id']
        return False, None

    def test_get_enquiries(self):
        """Test get all enquiries (admin only)"""
        if not self.token:
            print("❌ Skipping get enquiries test - no token")
            return False
        
        return self.run_test("Get Enquiries", "GET", "enquiries", 200)[0]

    def test_update_enquiry_status(self, enquiry_id):
        """Test update enquiry status"""
        if not self.token or not enquiry_id:
            print("❌ Skipping update enquiry status test - no token or enquiry_id")
            return False
        
        status_data = {"status": "contacted"}
        return self.run_test("Update Enquiry Status", "PATCH", f"enquiries/{enquiry_id}", 200, data=status_data)[0]

    def test_get_content(self):
        """Test get content sections"""
        tests = [
            self.run_test("Get Homepage Content", "GET", "content/homepage", 200)[0],
            self.run_test("Get About Content", "GET", "content/about", 200)[0]
        ]
        return all(tests)

    def test_update_content(self):
        """Test update content (admin only)"""
        if not self.token:
            print("❌ Skipping update content test - no token")
            return False
        
        content_data = {
            "content": {
                "test_field": "Test content update",
                "updated_at": datetime.now().isoformat()
            }
        }
        return self.run_test("Update Content", "PUT", "content/test", 200, data=content_data)[0]

    def test_cloudinary_signature(self):
        """Test Cloudinary signature generation (admin only)"""
        if not self.token:
            print("❌ Skipping Cloudinary signature test - no token")
            return False
        
        return self.run_test("Get Cloudinary Signature", "GET", "cloudinary/signature", 200)[0]

    def test_admin_email_settings(self):
        """Test admin email settings"""
        if not self.token:
            print("❌ Skipping admin email settings test - no token")
            return False
        
        return self.run_test("Get Admin Email", "GET", "settings/admin-email", 200)[0]

def main():
    print("🚀 Starting Ambica Wedding Decor API Tests")
    print("=" * 50)
    
    tester = AmbicaWeddingAPITester()
    
    # Test sequence
    print("\n📋 Testing Public Endpoints...")
    tester.test_root_endpoint()
    tester.test_get_services()
    tester.test_get_events()
    tester.test_get_events_with_filter()
    tester.test_get_content()
    
    print("\n🔐 Testing Authentication...")
    if not tester.test_admin_login():
        print("❌ Admin login failed, stopping admin tests")
        print(f"\n📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
        return 1
    
    tester.test_admin_me()
    
    print("\n📝 Testing Enquiry System...")
    enquiry_success, enquiry_id = tester.test_create_enquiry()
    tester.test_get_enquiries()
    if enquiry_id:
        tester.test_update_enquiry_status(enquiry_id)
    
    print("\n🎪 Testing Event Management...")
    event_success, event_id = tester.test_create_event()
    if event_id:
        tester.test_update_event(event_id)
        tester.test_delete_event(event_id)
    
    print("\n📄 Testing Content Management...")
    tester.test_update_content()
    
    print("\n☁️ Testing Cloudinary Integration...")
    tester.test_cloudinary_signature()
    
    print("\n⚙️ Testing Settings...")
    tester.test_admin_email_settings()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"   - {failure.get('test', 'Unknown')}: {failure}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if success_rate >= 80 else 1

if __name__ == "__main__":
    sys.exit(main())