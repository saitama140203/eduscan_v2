const API_BASE_URL = "http://localhost:8000/api/v1";

async function testAPI() {
  console.log('Testing API endpoints...');
  
  // Test 1: List classes với trailing slash
  try {
    console.log('\n1. Testing /classes/ (with trailing slash)');
    const response1 = await fetch(`${API_BASE_URL}/classes/`);
    console.log('Status:', response1.status);
    console.log('Content-Type:', response1.headers.get('content-type'));
    const text1 = await response1.text();
    console.log('Response preview:', text1.substring(0, 200));
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test 2: List classes không có trailing slash  
  try {
    console.log('\n2. Testing /classes (without trailing slash)');
    const response2 = await fetch(`${API_BASE_URL}/classes`);
    console.log('Status:', response2.status);
    console.log('Content-Type:', response2.headers.get('content-type'));
    const text2 = await response2.text();
    console.log('Response preview:', text2.substring(0, 200));
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test 3: Dashboard analytics
  try {
    console.log('\n3. Testing /classes/analytics/dashboard');
    const response3 = await fetch(`${API_BASE_URL}/classes/analytics/dashboard`);
    console.log('Status:', response3.status);
    console.log('Content-Type:', response3.headers.get('content-type'));
    const text3 = await response3.text();
    console.log('Response preview:', text3.substring(0, 200));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI(); 