// src/components/MinimaxAssistant.js
import React, { useState, useEffect, useRef } from 'react';

// Check for SpeechRecognition compatibility
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const MinimaxAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.error('SpeechRecognition API is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => console.log('Listening started.');
    recognition.onresult = (event) => {
      const userInput = event.results[0][0].transcript;
      console.log('Transcript:', userInput);
      setTranscript(userInput);
      generateAssistantResponse(userInput);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleStartListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const generateAssistantResponse = async (userInput) => {
    console.log('Sending to Minimax:', userInput);
    const apiKey = import.meta.env.VITE_MINIMAX_API_KEY;

    const url = 'https://api.minimaxi.chat/v1/text/chatcompletion_v2';
    const payload = {
      model: 'MiniMax-Text-01',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for a travel booking agency.' },
        { role: 'user', content: userInput }
      ]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Minimax Response:', data);

      const assistantReply = data.choices[0].message.content;
      setResponse(assistantReply);

      // Speak out the assistant's response
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(assistantReply);
      synth.speak(utterance);
    } catch (error) {
      console.error('Error fetching from Minimax API:', error);
      setResponse('Sorry, I could not process that.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#fff',
      color: '#000',
      borderRadius: '12px',
      padding: '1rem',
      width: '300px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      fontFamily: 'sans-serif',
      zIndex: 1000
    }}>
      <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Minimax Assistant</div>

      <div style={{
        fontSize: '0.9rem',
        color: '#333',
        marginBottom: '0.5rem',
        minHeight: '1.2rem'
      }}>
        {isListening ? '🎤 Listening...' : `📝 Transcript: ${transcript || 'None'}`}
      </div>

      <div style={{
        fontSize: '0.9rem',
        color: '#333',
        marginBottom: '0.5rem',
        minHeight: '1.2rem'
      }}>
        💬 Response: {response || 'None'}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={handleStartListening}
          disabled={isListening}
          style={{
            flex: 1,
            padding: '0.3rem 0.5rem',
            borderRadius: '6px',
            border: '1px solid #ddd',
            background: isListening ? '#f0f0f0' : '#f9f9f9',
            cursor: isListening ? 'not-allowed' : 'pointer'
          }}
        >
          Start
        </button>
        <button
          onClick={handleStopListening}
          disabled={!isListening}
          style={{
            flex: 1,
            padding: '0.3rem 0.5rem',
            borderRadius: '6px',
            border: '1px solid #ddd',
            background: !isListening ? '#f0f0f0' : '#f9f9f9',
            cursor: !isListening ? 'not-allowed' : 'pointer'
          }}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default MinimaxAssistant;
