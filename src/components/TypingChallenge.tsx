"use client";

import { useState, useRef } from "react";
import typingPassages from "~/lib/typingPassages";
import { Button } from "./ui/Button";
import { Input } from "./ui/input";
import { sdk } from "@farcaster/frame-sdk"; // 👈 Import Farcaster SDK

function getRandomPassage() {
  return typingPassages[Math.floor(Math.random() * typingPassages.length)];
}

function calculateWPM(charsTyped: number, timeMs: number) {
  const words = charsTyped / 5;
  const minutes = timeMs / 60000;
  return minutes > 0 ? Math.round(words / minutes) : 0;
}

function calculateAccuracy(passage: string, input: string) {
  let correct = 0;
  for (let i = 0; i < passage.length; i++) {
    if (input[i] === passage[i]) correct++;
  }
  return Math.round((correct / passage.length) * 100);
}

export default function TypingChallenge() {
  const [gameState, setGameState] = useState<
    "init" | "ready" | "typing" | "finished"
  >("init");
  const [passage, setPassage] = useState<string>(getRandomPassage());
  const [userInput, setUserInput] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isShareLoading, setIsShareLoading] = useState(false);

  // Start the challenge
  const handleStart = () => {
    setGameState("ready");
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setTimer(0);
  };

  // On first keystroke, start timer
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (gameState === "ready") {
      setGameState("typing");
      const now = Date.now();
      setStartTime(now);
      timerRef.current = setInterval(() => {
        setTimer(Date.now() - now);
      }, 100);
    }
    if (value.length <= passage.length) {
      setUserInput(value);
      // If finished
      if (value === passage) {
        handleFinish(value);
      }
    }
  };

  // When user finishes typing
  const handleFinish = (finalInput: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setEndTime(Date.now());
    setGameState("finished");
    setTimer(startTime ? Date.now() - startTime : 0);
  };

  // Retry with a new passage
  const handleRetry = () => {
    setPassage(getRandomPassage());
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setTimer(0);
    setGameState("init");
  };

  // Scoring
  const totalTime = endTime && startTime ? endTime - startTime : timer;
  const wpm = calculateWPM(userInput.length, totalTime);
  const accuracy = calculateAccuracy(passage, userInput);
  const progress = Math.min(userInput.length / passage.length, 1);

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
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto min-h-screen">
      <div className="text-center mb-2">
        <p className="text-lg text-gray-600 mb-2">
          Type the passage as fast and accurately as you can!
        </p>
      </div>

      {/* Game states */}
      {gameState === "init" && (
        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          <div className="bg-blue-50 p-4 rounded-lg mb-2">
            <p className="text-gray-700 text-base mb-2">
              You will be shown a short passage. Type it as quickly and
              accurately as possible. Your WPM and accuracy will be scored!
            </p>
          </div>
          <Button onClick={handleStart} className="">
            Start
          </Button>
        </div>
      )}

      {(gameState === "ready" || gameState === "typing") && (
        <div className="w-full max-w-sm flex flex-col gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-800 text-base mb-2 select-none whitespace-pre-line">
              {passage}
            </p>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Timer:{" "}
              <span className="font-bold">
                {((timer || 0) / 1000).toFixed(1)}s
              </span>
            </span>
            <span className="text-sm text-gray-600">
              Progress:{" "}
              <span className="font-bold">{Math.round(progress * 100)}%</span>
            </span>
          </div>
          <Input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            // disabled={gameState === "finished"}
            placeholder="Start typing here..."
            className="mb-2"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            maxLength={passage.length}
          />
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {gameState === "finished" && (
        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          <div className="bg-green-50 p-4 rounded-lg mb-2 w-full">
            <h2 className="text-xl font-bold text-green-600 mb-2">
              🏁 Challenge Complete!
            </h2>
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-lg font-bold">WPM: {wpm}</span>
              <span className="text-lg font-bold">Accuracy: {accuracy}%</span>
              {wpm >= 70 && (
                <span className="inline-block mt-2 px-3 py-1 bg-yellow-300 text-yellow-900 rounded-full font-semibold text-sm">
                  ⚡ Lightning Fingers
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <Button onClick={handleRetry} className="">
              🔁 Retry
            </Button>
            <div className="text-center">
          {/* ... existing results UI */}

          <button
            onClick={() => shareCast(wpm, accuracy)}
            disabled={isShareLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
          >
            {isShareLoading ? "Sharing..." : "📤 Share Cast"}
          </button>
        </div>
          </div>
        </div>
      )}
    </div>
  );
}
