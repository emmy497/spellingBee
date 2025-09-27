import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import VoiceSpellingChecker from "./VoiceSpellingChecker";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCZgRSPkC3IxZhxzN9QJVhURLoWQ3y7d74",
});

const somecode = () => {
  const [word, setWord] = useState("");
  const [difficulty, setDifficulty] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [meaning, setMeaning] = useState("");
  const [sentence, setSentence] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [recording, setRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [showMeaning, setShowMeaning] = useState(false);
  const [TextForAudio, setTextForAudio] = useState("");
  const [loading, setLoading] = useState(false);
  // const [syllables, setSyllables] = useState("");

  const studentId = "student_001";

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const sayWord = async (word) => {
    speak(word);
  };

  const fetchWord = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/word", {
        params: { student_id: studentId },
      });
      const newWord = res.data.word;
      setWord(newWord);
      setDifficulty(res.data.difficulty);
      setUserInput("");
      setFeedback("");
      setMeaning("");
      setSentence("");
      setShowResult(false);
      setAttemptsLeft(2);
      setLiveTranscript("");
      setShowMeaning(false); // Ensure meaning is hidden initially
    } catch (err) {
      console.error("Error fetching word:", err);
    }
  };

  const handleCheck = async () => {
    const answer = userInput.trim().toLowerCase();
    const isCorrect = answer === word.toLowerCase();

    if (isCorrect || attemptsLeft === 1) {
      try {
        await axios.post("http://localhost:5000/api/feedback", { 
          student_id: studentId,
          correct: isCorrect,
          difficulty,
        });
        setFeedback(
          isCorrect
            ? "✅ Correct!"
            : `❌ Incorrect. The correct spelling is "${word}".`
        );
        setShowResult(true);
        setTimeout(() => fetchWord(), 4000);
      } catch (err) {
        console.error("Error sending feedback:", err);
      }
    } else {
      setAttemptsLeft((prev) => prev - 1);
      setFeedback("❌ Incorrect. Try again! You have one more chance.");
      setShowResult(false);
    }
  };

  const askAI = async (content) => {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: content,
    });
    console.log(response.text);
    // setSentence(response.text);
    const sentence = response.text;
    setSentence(sentence);

    speak(sentence);
  };

  const fetchMeaning = async (word) => {
    try {
      const res = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const definition =
        res.data[0]?.meanings[0]?.definitions[0]?.definition ||
        "No definition found.";
      setMeaning(definition);
      setShowMeaning(true); // Show meaning only after button click
    } catch (err) {
      setMeaning("Definition not available.");
      setShowMeaning(true);
    }
  };

  const TTs = async () => {
  const speak = async () => {
  if (!TextForAudio.trim()) return;

  try {
    setLoading(true);
    const response = await axios.post(
      "http://localhost:5000/api/speak",
      { TextForAudio },
      {
        responseType: "blob",
        headers: { "Content-Type": "application/json" }
      }
    );
    
    const audioBlob = response.data;
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    console.log("Playing audio...");
    await audio.play();
  } catch (error) {
    console.error("Error calling TTS API:", error);
    alert("Failed to speak. See console for details.");
  } finally {
    setLoading(false);
  }
};

  };

  const stopStreamingTranscription = () => {
    setRecording(false);
  };

  useEffect(() => {
    fetchWord();
  }, []);

  return (
    <div className="max-w-xl mx-auto text-center p-8">
      <h1 className="text-3xl font-bold mb-4">Spelling Bee</h1>

      <button
        onClick={() => sayWord(word)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        🔊 Say Word
      </button>

      {showMeaning && <p className="text-sm italic mb-2">Meaning: {meaning}</p>}
      {/* {sentence && <p className="text-sm italic mb-2">Sentence: {sentence}</p>} */}

      <input
        type="text"
        placeholder="Type the spelling here..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="w-full border p-2 rounded mb-2"
      />

      <div className="flex gap-2 justify-center mb-4">
        <button
          onClick={handleCheck}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Check
        </button>
      </div>

      <div className="flex gap-2 justify-center mb-4">
        {/* <button
          onClick={startStreamingTranscription}
          disabled={recording}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          🎙️ Start Speaking
        </button> */}

        <button
          onClick={stopStreamingTranscription}
          disabled={!recording}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          ⏹️ Stop
        </button>

        {/* TTS */}

        <div className="p-4 max-w-md mx-auto">
          <textarea
            rows="4"
            value={TextForAudio}
            onChange={(e) => setTextForAudio(e.target.value)}
            className="border p-2 w-full"
            placeholder="Enter text to speak..."
          />
          <button
            onClick={speak}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "Speaking..." : "Speak"}
          </button>
        </div>
      </div>

      <div className="flex gap-2 justify-center mb-4">
        <button
          onClick={() =>
            askAI(
              `use the word ${word} in a sentence, short and child friendly`
            )
          }
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          🧠 Sentence
        </button>
        <button
          onClick={() =>
            askAI(`explain the word ${word} to a child in less than 15 words`)
          }
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          📖 Meaning
        </button>

        {/* <button
          onClick={() => fetchSyllables(word)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Break word to syllables
        </button> */}
      </div>

      <p className="mt-4 text-sm text-gray-700">Transcript: {liveTranscript}</p>

      {feedback && (
        <div className="mt-4">
          <p className="text-lg">{feedback}</p>
        </div>
      )}

      {showResult && (
        <div className="mt-2">
          <p>
            Correct Spelling: <strong>{word}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default somecode;
