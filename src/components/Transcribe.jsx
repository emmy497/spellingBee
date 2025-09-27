import React, { useState, useRef } from 'react';
import './Transcribe.css'; // For basic styling

function Transcribe() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcribedWord, setTranscribedWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // --- Audio Recording Functions ---
  const startRecording = async () => {
    setError(null); // Clear previous errors
    setTranscribedWord('');
    setDefinition('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); // Use webm for broader browser support
        setAudioBlob(blob);
        // You might want to immediately process the audio here
        // if you're sending it directly after recording stops.
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please ensure permissions are granted.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // --- API Call Functions ---

  // NOTE: In a real application, this function would make a request to YOUR BACKEND
  // The backend would then call the Gemini API.
  const transcribeAudio = async () => {
    if (!audioBlob) {
      setError('No audio recorded to transcribe.');
      return;
    }

    setLoading(true);
    setError(null);
    setTranscribedWord('');
    setDefinition('');

    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm'); // Ensure 'audio' matches backend's expected field

    try {
      // Replace with your actual backend endpoint
      const response = await fetch('/api/transcribe', { // Proxy configured in setupProxy.js for development
        method: 'POST',
        body: formData,
        // No 'Content-Type' header needed for FormData; browser sets it automatically
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transcribe audio.');
      }

      const data = await response.json();
      const transcribedText = data.transcript;
      setTranscribedWord(transcribedText);
      console.log('Transcribed:', transcribedText);

      // Immediately get the definition after transcription
      if (transcribedText) {
        getDefinition(transcribedText);
      } else {
        setLoading(false);
        setError('No discernible speech was transcribed.');
      }

    } catch (err) {
      console.error('Error during transcription:', err);
      setError(`Transcription error: ${err.message}`);
      setLoading(false);
    }
  };

  const getDefinition = async (word) => {
    setLoading(true);
    setError(null);
    setDefinition('');
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Word '${word}' not found in dictionary.`);
        }
        throw new Error('Failed to fetch definition.');
      }

      const data = await response.json();
      if (data && data.length > 0) {
        // Extract the first definition from the first entry
        const meanings = data[0]?.meanings;
        if (meanings && meanings.length > 0) {
          const firstDefinition = meanings[0]?.definitions[0]?.definition;
          setDefinition(firstDefinition || 'No detailed definition found.');
        } else {
          setDefinition('No meanings found for this word.');
        }
      } else {
        setDefinition('No definition found.');
      }
    } catch (err) {
      console.error('Error fetching definition:', err);
      setError(`Dictionary error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Voice Dictionary</h1>
        <p>Speak a word and get its definition!</p>

        <div className="controls">
          <button
            onClick={startRecording}
            disabled={isRecording || loading}
          >
            {isRecording ? 'Recording...' : 'Start Recording'}
          </button>
          <button
            onClick={stopRecording}
            disabled={!isRecording || loading}
          >
            Stop Recording
          </button>
          <button
            onClick={transcribeAudio}
            disabled={!audioBlob || loading || isRecording}
          >
            Get Meaning
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {transcribedWord && (
          <div className="result">
            <h2>Transcribed Word:</h2>
            <p className="transcribed-word">{transcribedWord}</p>

            {definition && (
              <>
                <h2>Definition:</h2>
                <p className="definition-text">{definition}</p>
              </>
            )}
          </div>
        )}

        {audioBlob && !transcribedWord && (
            <p>Audio recorded. Click "Get Meaning" to process.</p>
        )}
      </header>
    </div>
  );
}



export default Transcribe