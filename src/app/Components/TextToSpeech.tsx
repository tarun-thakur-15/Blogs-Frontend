"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Play, Pause, RefreshCcw, StopCircle } from "lucide-react";

interface TextToSpeechPlayerProps {
  text: string;
  autoPlay?: boolean;
}

const CHUNK_SIZE = 200; // chars per chunk for stable playback

const TextToSpeechPlayer: React.FC<TextToSpeechPlayerProps> = ({
  text,
  autoPlay,
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  const chunksRef = useRef<string[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean HTML, remove emojis/symbols and return plain text
  const cleanText = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    let plain = tempDiv.textContent || tempDiv.innerText || "";

    // Remove unwanted symbols (add more as needed)
    plain = plain.replace(/🔹|✅|•|★|✔️|→|–|—|▪️/g, "");
    plain = plain.replace(/\s{2,}/g, " "); // normalize whitespace
    return plain.trim();
  };

useEffect(() => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const synth = window.speechSynthesis;

  const loadVoices = () => {
    let voices = synth.getVoices();
    if (voices.length) {
      setVoices(voices);
      if (!selectedVoice) {
        const preferred = voices.find(v => v.lang.includes("en")) || voices[0];
        setSelectedVoice(preferred);
      }
    } else {
      // Retry after short delay for Opera
      setTimeout(() => {
        voices = synth.getVoices();
        if (voices.length) {
          setVoices(voices);
          if (!selectedVoice) {
            const preferred = voices.find(v => v.lang.includes("en")) || voices[0];
            setSelectedVoice(preferred);
          }
        }
      }, 500); // try again after 0.5s
    }
  };

  loadVoices();

  if (typeof synth.onvoiceschanged !== "undefined") {
    synth.onvoiceschanged = loadVoices;
  }

  return () => {
    synth.cancel();
    synth.onvoiceschanged = null;
  };
}, []);


  // Split cleaned text into chunks
  useEffect(() => {
    const splitIntoChunks = (rawText: string) => {
      const cleaned = cleanText(rawText);
      const sentences = cleaned.match(/[^.!?]+[.!?]*\s*/g) || [cleaned];

      const chunks: string[] = [];
      let chunk = "";

      for (let sentence of sentences) {
        if ((chunk + sentence).length < CHUNK_SIZE) {
          chunk += sentence;
        } else {
          chunks.push(chunk);
          chunk = sentence;
        }
      }
      if (chunk) chunks.push(chunk);
      chunksRef.current = chunks;
    };

    splitIntoChunks(text);
    setCurrentChunkIndex(0);
  }, [text]);

  const speakChunk = (index: number) => {
    const synth = window.speechSynthesis;
    if (index >= chunksRef.current.length) {
      setIsSpeaking(false);
      setIsPaused(false);
      return;
    }

    if (
      typeof window === "undefined" ||
      typeof window.SpeechSynthesisUtterance === "undefined"
    )
      return;

    const utterance = new window.SpeechSynthesisUtterance(
      chunksRef.current[index]
    );

    utterance.voice = selectedVoice || null!;
    utterance.onend = () => {
      if (!isPaused) {
        setCurrentChunkIndex(index + 1);
        speakChunk(index + 1);
      }
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const handlePlayPause = () => {
    const synth = window.speechSynthesis;

    if (isSpeaking && !isPaused) {
      synth.pause();
      setIsPaused(true);
    } else if (isSpeaking && isPaused) {
      synth.resume();
      setIsPaused(false);
    } else {
      setIsSpeaking(true);
      setIsPaused(false);
      setCurrentChunkIndex(0);
      speakChunk(0);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleRestart = () => {
    handleStop();
    setTimeout(() => {
      setCurrentChunkIndex(0);
      speakChunk(0);
      setIsSpeaking(true);
      setIsPaused(false);
    }, 100);
  };

  // Auto play on mount or prop change
  useEffect(() => {
    if (autoPlay) {
      handlePlayPause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  return (
    <Card className="w-full mx-auto shadow-xl rounded-xl">
      <CardContent className="py-4 space-y-4">
        <Select
          value={selectedVoice?.name}
          onValueChange={(val) => {
            const voice = voices.find((v) => v.name === val);
            setSelectedVoice(voice || null);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Voice..." />
          </SelectTrigger>
          <SelectContent>
            {voices.map((voice) => (
              <SelectItem key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" onClick={handlePlayPause}>
            {isSpeaking && !isPaused ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleStop}
            disabled={!isSpeaking && !isPaused}
          >
            <StopCircle className="w-5 h-5 text-red-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRestart}
            disabled={!text}
          >
            <RefreshCcw className="w-5 h-5 text-green-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextToSpeechPlayer;
