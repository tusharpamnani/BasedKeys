// Simple test script to check quiz API functionality
const API_BASE = 'http://localhost:3000/api';

async function testQuizAPI() {
  console.log('Testing Quiz API...\n');

  try {
    // Test 1: Check debug endpoint
    console.log('1. Testing debug endpoint...');
    const debugResponse = await fetch(`${API_BASE}/quizzes?action=debug`);
    const debugData = await debugResponse.json();
    console.log('Debug response:', debugData);

    // Test 2: Check featured quizzes
    console.log('\n2. Testing featured quizzes...');
    const featuredResponse = await fetch(`${API_BASE}/quizzes?action=featured`);
    const featuredData = await featuredResponse.json();
    console.log('Featured response:', featuredData);

    // Test 3: Check trending quizzes
    console.log('\n3. Testing trending quizzes...');
    const trendingResponse = await fetch(`${API_BASE}/quizzes?action=trending`);
    const trendingData = await trendingResponse.json();
    console.log('Trending response:', trendingData);

    // Test 4: Check list quizzes
    console.log('\n4. Testing list quizzes...');
    const listResponse = await fetch(`${API_BASE}/quizzes?action=list`);
    const listData = await listResponse.json();
    console.log('List response:', listData);

    // Test 5: Try to join a quiz (if any exist)
    if (listData.success && listData.quizzes.length > 0) {
      const firstQuiz = listData.quizzes[0];
      console.log('\n5. Testing join quiz...');
      console.log('Attempting to join quiz:', firstQuiz.id);
      
      const joinResponse = await fetch(`${API_BASE}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          quizId: firstQuiz.id,
          fid: 9999,
          username: 'test_user',
          walletAddress: '0x1234567890123456789012345678901234567890'
        })
      });
      const joinData = await joinResponse.json();
      console.log('Join response:', joinData);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testQuizAPI(); 