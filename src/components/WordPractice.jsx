import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import VoiceSpellingChecker from "./VoiceSpellingChecker";
import LoadingScreen from "./LoadingScreen";
import HexagonCard from "./HexagonCard";
import { useAuth } from "../utils/AuthContext";
// import { getMasteredStatus } from "../../../backend-Node/utils/getMasteredStatus";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCZgRSPkC3IxZhxzN9QJVhURLoWQ3y7d74",
});

const WordPractice = () => {
  const [loadingCreen, setLoadingScreen] = useState(true);
  const [word, setWord] = useState("");
  const [wordId, setWordId] = useState(null); // ✅ Track word_id
  const [difficulty, setDifficulty] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [meaning, setMeaning] = useState("");
  const [sentence, setSentence] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [retries, setRetries] = useState(0); // ✅ Track retries
  const [recording, setRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [showMeaning, setShowMeaning] = useState(false);
  const [TextForAudio, setTextForAudio] = useState("");
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(null); // ✅ Track start time
  const [stateVector, setStateVector] = useState(null) //monitor state vector

  const {userId} = useAuth()

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
     const res = await axios.get("http://localhost:3000/api/word/getWord", {
      params: { user_id: userId }
    });

    // const performanceData = await axios.get("http://localhost:3000/api/state/getStateVector", {
    //   params: { user_Id: userId }
    // });



//  const res = await axios.get("http://localhost:5000/getWord" , {
//   params: { user_id: userId }
//  });

      const newWord = res.data.word;
      console.log(res.data)
      const newWordId = res.data.word_id; // ✅ Assume backend gives word_id
      setWord(newWord);
      setWordId(newWordId);
      setDifficulty(res.data.difficulty);
      setUserInput("");
      setFeedback("");
      setMeaning("");
      setSentence("");
      setShowResult(false);
      setAttemptsLeft(2);
      setRetries(0);
      setLiveTranscript("");
      setShowMeaning(false);
     // setStartTime(Date.now()); // ✅ Set time when word is shown

    //  getMasteredStatus(userId, newWord)
      
    } catch (err) {
      console.error("Error fetching word:", err);
    }

    try{
      const res = await axios.get("http://localhost:3000/api/state/getStateVector", { params: { user_Id: userId } }); // ✅ Get state vector from backend 
      const stateVector = res.data.stateVector;
      console.log(stateVector);
       try {
        //✅ POST the state vector to Python Flask backend
       const response = await axios.post("http://localhost:5000/api/dqn/predict", {
         state_vector: stateVector,
         user_id: userId,
       });

       console.log("Response from Python backend:", response.data);
     } catch (postErr) {
      console.error("Error posting state vector to Python backend:", postErr);
     }
    }catch (err){ console.error("Error fetching state vector:", err);}


    
  };



 

// const sendWordToDQN = async (word) => {
//   try {
//     const response = await axios.post("http://localhost:5000/predict", {
//       word: word,
//     });
//     console.log("DQN Prediction:", response.data);
//   } catch (error) {
//     console.error("Error sending word to DQN:", error);
//   }
// };


  const handleCheck = async () => {
    const endTime = Date.now(); // ✅

    //get response time
    const responseTime = parseFloat(((endTime - startTime) / 1000).toFixed(2));
    const answer = userInput.trim().toLowerCase();
    const isCorrect = answer === word.toLowerCase();

    if (isCorrect || attemptsLeft === 1) {
      try {
        await axios.post("http://localhost:3000/api/word/update-performance", {
          user_id: userId,
         word: word,
          was_correct: isCorrect,
          retries,
          response_time: responseTime,
        });
       
        setFeedback(
          isCorrect
            ? "✅ Correct!"
            : `❌ Incorrect. The correct spelling is "${word}".`
        );
        setShowResult(true);

        setTimeout(() => fetchWord(), 1000);
      } catch (err) {
        console.error("Error sending feedback:", err);
      }
    } else {
      setAttemptsLeft((prev) => prev - 1);
      setRetries((r) => r + 1); // ✅ Increment retry
      setFeedback("❌ Incorrect. Try again! You have one more chance.");
      setShowResult(false);
    }
  };

  const askAI = async (content) => {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: content,
    });
    const sentence = response.text;
    setSentence(sentence);
    speak(sentence);
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
            headers: { "Content-Type": "application/json" },
          }
        );

        const audioBlob = response.data;
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
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

  useEffect(() => {}, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchWord();
      setLoadingScreen(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (loadingCreen) return <LoadingScreen />;

  return (
    <div className="bg-custom bg-cover bg-center h-screen relative w-full">
      <div className="h-screen w-screen flex items-center justify-center ">
        <div className="w-[80%] max-w-2xl  border-2  border-white/30 rounded-xl p-2 ">
          <div className="w-[50%] text-center mx-auto font-bold text-center">
            {feedback && (
              <div className="mt-4">
                <p className="">{feedback}</p>
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

          <div className="flex flex-col items-center w-[80%] md:w-[60%] mx-auto gap-2 text-red-500">
            <input
              type="text"
              placeholder="Type the spelling here..."
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value)
              
                // Start the timer on first keystroke
             if (startTime === null && e.target.value.length === 1) {
             setStartTime(Date.now());
    }
              }}
              className="w-[50%] px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleCheck}
              className="bg-yellow-500 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-600 transition cursor-pointer"
            >
              Check
            </button>
          </div>

          <div className="mt-8 mb-8 flex items-center justify-center">
            <button
              onClick={() => sayWord(word)}
              className="bg-white w-[50%] text-gray-500 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Listen
            </button>
          </div>

          <div className="flex justify-center space-around">
            <button
              onClick={() =>
                askAI(`explain the word ${word} to a child in less than 15 words`)
              }
              className="bg-white text-gray-500 font-semibold ml-4 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Meaning
            </button>
            <button
              onClick={() =>
                askAI(`use the word ${word} in a sentence, short and child friendly`)
              }
              className="bg-white text-gray-500 font-semibold ml-4 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Sentence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordPractice;
