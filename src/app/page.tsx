"use client";

import TypingChallenge from "~/components/TypingChallenge";
export default function Home() {


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-blue-600">
                🧠 SpeedKeys
              </h1>
              
            </div>
          
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">

        <TypingChallenge />

      </div>
    </div>
  );
}
