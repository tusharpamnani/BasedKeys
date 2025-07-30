// Simple test script for quiz API
const http = require("http");

const API_HOST = "localhost";
const API_PORT = 3000;

function makeRequest(path, method = "GET", body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testQuizAPI() {
  console.log("Testing Quiz API...\n");

  try {
    // Test 1: Check if server is running
    console.log("1. Testing server connection...");
    try {
      const testResult = await makeRequest("/api/quizzes?action=test");
      console.log("✅ Server is running:", testResult);
    } catch (error) {
      console.log("❌ Server not running:", error.message);
      console.log("Please start the development server with: npm run dev");
      return;
    }

    // Test 2: Check debug endpoint
    console.log("\n2. Testing debug endpoint...");
    const debugResult = await makeRequest("/api/quizzes?action=debug");
    console.log("Debug result:", debugResult);

    // Test 3: Check featured quizzes
    console.log("\n3. Testing featured quizzes...");
    const featuredResult = await makeRequest("/api/quizzes?action=featured");
    console.log("Featured result:", featuredResult);

    // Test 4: Check trending quizzes
    console.log("\n4. Testing trending quizzes...");
    const trendingResult = await makeRequest("/api/quizzes?action=trending");
    console.log("Trending result:", trendingResult);

    // Test 5: Check list quizzes
    console.log("\n5. Testing list quizzes...");
    const listResult = await makeRequest("/api/quizzes?action=list");
    console.log("List result:", listResult);

    // Test 6: Try to join a quiz (if any exist)
    if (listResult.data.success && listResult.data.quizzes.length > 0) {
      const firstQuiz = listResult.data.quizzes[0];
      console.log("\n6. Testing join quiz...");
      console.log("Attempting to join quiz:", firstQuiz.id);

      const joinResult = await makeRequest("/api/quizzes", "POST", {
        action: "join",
        quizId: firstQuiz.id,
        fid: 9999,
        username: "test_user",
        walletAddress: "0x1234567890123456789012345678901234567890",
      });
      console.log("Join result:", joinResult);
    } else {
      console.log("\n6. No quizzes available to join");
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testQuizAPI();
