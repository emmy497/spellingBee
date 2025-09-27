import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

// Gemini setup
const genAI = new GoogleGenAI({
  apiKey: "AIzaSyCZgRSPkC3IxZhxzN9QJVhURLoWQ3y7d74",
});

const VoiceSpellingChecker = ({ targetWord }) => {
  const [spokenText, setSpokenText] = useState("");
  const [cleanedSpelling, setCleanedSpelling] = useState("");
  const [result, setResult] = useState("");
  const [aiHelp, setAiHelp] = useState("");
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = async (event) => {
      const spoken = event.results[0][0].transcript;
      setSpokenText(spoken);

      // Process to clean up and join letters
      const lettersOnly = spoken
        .toLowerCase()
        .replace(/[^a-z]/g, "") // Remove non-letters
        .split("")
        .join(""); // Join letters into one word

      setCleanedSpelling(lettersOnly);

      if (lettersOnly === targetWord.toLowerCase()) {
        setResult("✅ Correct!");
      } else {
        setResult("❌ Incorrect.");
      }

      setListening(false);
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e);
      setResult("⚠️ Could not understand. Try again.");
      setListening(false);
    };
  };

  const askForHelp = async () => {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Explain the word "${targetWord}" to a child. Include a definition and use it in a sentence.`,
    });
    setAiHelp(result.response.text());
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">🎤 Spell by Voice</h2>
      <p>
        <strong>Spell this word:</strong> {targetWord}
      </p>

      <button
        onClick={startListening}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        disabled={listening}
      >
        {listening ? "🎧 Listening..." : "🎙️ Say the spelling"}
      </button>

      {spokenText && (
        <div className="mt-4">
          <p>
            <strong>You said:</strong> {spokenText}
          </p>
          <p>
            <strong>Parsed spelling:</strong> {cleanedSpelling}
          </p>
          <p className="text-lg">{result}</p>

          {result.includes("Incorrect") && (
            <button
              onClick={askForHelp}
              className="mt-3 bg-green-600 text-white px-3 py-2 rounded"
            >
              🧠 I need help!
            </button>
          )}
        </div>
      )}

      {aiHelp && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          <p
            dangerouslySetInnerHTML={{ __html: aiHelp.replace(/\n/g, "<br>") }}
          />
        </div>
      )}
    </div>
  );
};

export default VoiceSpellingChecker;
