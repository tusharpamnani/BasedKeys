"use client";

import { useState, useRef, useEffect } from "react";
import typingPassages from "~/lib/typingPassages";
import { sdk } from "@farcaster/frame-sdk"; // 👈 Import Farcaster SDK

const TIME_LIMIT_MS = 60000; // 60 seconds for a proper WPM test

function getRandomPassage() {
  return typingPassages[Math.floor(Math.random() * typingPassages.length)];
}

function calculateWPM(correctChars: number, timeMs: number, debug = false) {
  const words = correctChars / 5;
  const minutes = timeMs / 60000;
  const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
  
  if (debug) {
    console.log(`Correct chars: ${correctChars}`);
    console.log(`Time: ${timeMs}ms (${minutes.toFixed(2)} minutes)`);
    console.log(`Words: ${words}`);
    console.log(`WPM: ${wpm}`);
  }
  
  return wpm;
}

function calculateAccuracy(correctChars: number, totalChars: number) {
  return totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
}

export default function TypingSpeedTest() {
  const [gameState, setGameState] = useState("init");
  const [passage, setPassage] = useState(getRandomPassage());
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null); // 👈 NEW: Track end time
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_MS);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isShareLoading, setIsShareLoading] = useState(false);  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Timer effect
  useEffect(() => {
    if (gameState === "typing" && startTime) {
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = TIME_LIMIT_MS - elapsed;
        
        if (remaining <= 0) {
          handleFinish();
        } else {
          setTimeLeft(remaining);
        }
      }, 100);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gameState, startTime]);

  const handleStart = () => {
    const newPassage = getRandomPassage();
    setPassage(newPassage);
    setUserInput("");
    setCurrentIndex(0);
    setCorrectChars(0);
    setTotalChars(0);
    setErrors(0);
    setTimeLeft(TIME_LIMIT_MS);
    setStartTime(null); // 👈 Reset start time
    setEndTime(null);   // 👈 Reset end time
    setGameState("ready");
    
    // Focus input after state update
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Start timer on first keystroke
    if (gameState === "ready") {
      setGameState("typing");
      setStartTime(Date.now());
    }

    if (gameState !== "typing" && gameState !== "ready") return;

    // Prevent typing beyond passage length
    if (value.length > passage.length) return;

    setUserInput(value);
    setTotalChars(value.length);

    // Calculate correct characters and current position
    let correct = 0;
    let errorCount = 0;
    
    for (let i = 0; i < value.length; i++) {
      if (value[i] === passage[i]) {
        correct++;
      } else {
        errorCount++;
      }
    }
    
    setCorrectChars(correct);
    setErrors(errorCount);
    setCurrentIndex(value.length);

    // Check if passage is completed
    if (value === passage) {
      handleFinish();
    }
  };

  const handleFinish = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setEndTime(Date.now()); // 👈 NEW: Record end time
    setGameState("finished");
  };

  const handleRetry = () => {
    setGameState("init");
  };

  // 👈 FIXED: Better elapsed time calculation
  const getElapsedTime = () => {
    if (!startTime) return 0;
    
    if (gameState === "finished" && endTime) {
      // Use actual time between start and finish
      return endTime - startTime;
    } else if (gameState === "typing") {
      // Use current time for real-time calculation
      return Date.now() - startTime;
    }
    
    return 0;
  };

  const elapsedTime = getElapsedTime();
  
  // 👈 FIXED: Use minimum 100ms instead of 1000ms to avoid artificially low WPM
  const currentWPM = calculateWPM(correctChars, Math.max(elapsedTime, 100));
  const currentAccuracy = calculateAccuracy(correctChars, totalChars);
  const progress = (currentIndex / passage.length) * 100;

  // Render passage with color coding
  const renderPassage = () => {
    return passage.split('').map((char, index) => {
      let className = "text-gray-400"; // Untyped
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className = "text-green-400 bg-green-900/20"; // Correct
        } else {
          className = "text-red-400 bg-red-900/20"; // Incorrect
        }
      } else if (index === currentIndex) {
        className = "text-white bg-blue-600 animate-pulse"; // Current cursor
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  // Share config
  const shareCast = async (wpm: number, accuracy: number) => {
    try {
      setIsShareLoading(true);
      const resultText = `⌨️ I just scored ${wpm} WPM with ${accuracy}% accuracy on this typing speed test! Can you beat me?`;

      if (sdk.actions && "openUrl" in sdk.actions) {
        await sdk.actions.openUrl(
          `https://warpcast.com/~/compose?text=${encodeURIComponent(
            resultText
          )}&embeds[]=https://your-app-url.com`
        );
      } else {
        console.log("Demo Mode - Would share:", resultText);
        alert("✅ Share prepared! (Demo mode)");
      }
    } catch (error) {
      console.error("Share Cast failed:", error);
      alert("❌ Failed to share");
    } finally {
      setIsShareLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-black rounded-lg shadow-lg max-w-md mx-auto min-h-screen">
      <div className="text-center mb-2">
        <p className="text-lg text-gray-400 mb-2">
          Type the passage as fast and accurately as you can!
        </p>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">⌨️ Typing Speed Test</h1>
          <p className="text-gray-300">Test your typing speed and accuracy</p>
        </div>

        {/* Initial State */}
        {gameState === "init" && (
          <div className="text-center">
            <div className="bg-gray-700 rounded-lg p-8 mb-6">
              <h2 className="text-2xl text-white mb-4">Ready to test your typing speed?</h2>
              <p className="text-gray-300 mb-6">
                You&apos;ll have 60 seconds to type the given passage as accurately and quickly as possible.
              </p>
              <button 
                onClick={handleStart}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
              >
                Start Test
              </button>
            </div>
          </div>
        )}

        {/* Typing Interface */}
        {(gameState === "ready" || gameState === "typing") && (
          <div className="space-y-6">
            
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{Math.ceil(timeLeft / 1000)}</div>
                <div className="text-sm text-gray-300">Seconds Left</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{currentWPM}</div>
                <div className="text-sm text-gray-300">WPM</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{currentAccuracy}%</div>
                <div className="text-sm text-gray-300">Accuracy</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{errors}</div>
                <div className="text-sm text-gray-300">Errors</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Passage Display */}
            <div className="bg-gray-900 rounded-lg p-6 font-mono text-lg leading-relaxed border-2 border-gray-600">
              {renderPassage()}
            </div>

            {/* Input Field */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder={gameState === "ready" ? "Start typing here..." : ""}
                className="w-full p-4 text-lg bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none font-mono"
                autoFocus
              />
              {gameState === "ready" && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  Press any key to start
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {gameState === "finished" && (
          <div className="text-center">
            <div className="bg-gray-700 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-white mb-6">🏁 Test Complete!</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 w-full">
                <div className="bg-blue-900/50 rounded-lg p-4 text-center min-h-[100px] flex flex-col justify-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1 break-words">{currentWPM}</div>
                  <div className="text-xs text-gray-300 leading-tight">Words Per Minute</div>
                </div>
                <div className="bg-green-900/50 rounded-lg p-4 text-center min-h-[100px] flex flex-col justify-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1 break-words">{currentAccuracy}%</div>
                  <div className="text-xs text-gray-300 leading-tight">Accuracy</div>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4 text-center min-h-[100px] flex flex-col justify-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1 break-words">{correctChars}</div>
                  <div className="text-xs text-gray-300 leading-tight">Correct Characters</div>
                </div>
              </div>


              {/* Performance Message */}
              <div className="mb-6">
                {currentWPM >= 80 ? (
                  <p className="text-green-400 text-lg">🚀 Excellent! You&apos;re a typing master!</p>
                ) : currentWPM >= 60 ? (
                  <p className="text-blue-400 text-lg">👍 Great job! Above average typing speed!</p>
                ) : currentWPM >= 40 ? (
                  <p className="text-yellow-400 text-lg">👌 Good work! Keep practicing to improve!</p>
                ) : (
                  <p className="text-orange-400 text-lg">💪 Keep practicing! You&apos;ll get faster!</p>
                )}
              </div>

              <button 
                onClick={handleRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg mr-4 mb-8"
              >
                🔄 Try Again
              </button>

              <button
                onClick={() => shareCast(currentWPM, currentAccuracy)}
                disabled={isShareLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
              >
                {isShareLoading ? "Sharing..." : "📤 Share Cast"}
              </button>
            </div>
          </div>
        )}  
    </div>
  );
}