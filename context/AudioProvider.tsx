"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type AudioContextValue = {
  isPlaying: boolean;

  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;

  setVolume: (volume: number) => void;
  setFilter: (frequency: number) => void;

  fadeTo: (volume: number, duration?: number) => void;
  filterTo: (frequency: number, duration?: number) => void;
};

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const contextRef = useRef<globalThis.AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const setupAudio = useCallback(() => {
    if (!audioRef.current) return;

    if (contextRef.current) return;

    const AudioContextClass = window.AudioContext || window.AudioContext;

    const ctx = new AudioContextClass();

    const source = ctx.createMediaElementSource(audioRef.current);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 22000;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 1;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    contextRef.current = ctx;
    sourceRef.current = source;
    gainRef.current = gain;
    filterRef.current = filter;
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current) return;

    setupAudio();

    const ctx = contextRef.current;

    if (ctx?.state === "suspended") {
      await ctx.resume();
    }

    await audioRef.current.play();

    setIsPlaying(true);
  }, [setupAudio]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  }, [isPlaying, pause, play]);

  const setVolume = useCallback((volume: number) => {
    if (!gainRef.current) return;

    gainRef.current.gain.value = Math.max(0, Math.min(1, volume));
  }, []);

  const setFilter = useCallback((frequency: number) => {
    if (!filterRef.current) return;

    filterRef.current.frequency.value = Math.max(20, frequency);
  }, []);

  const fadeTo = useCallback((volume: number, duration = 0.5) => {
    const gain = gainRef.current;
    const ctx = contextRef.current;

    if (!gain || !ctx) return;

    const now = ctx.currentTime;

    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);

    gain.gain.linearRampToValueAtTime(
      Math.max(0, Math.min(1, volume)),
      now + duration,
    );
  }, []);

  const filterTo = useCallback((frequency: number, duration = 0.5) => {
    const filter = filterRef.current;
    const ctx = contextRef.current;

    if (!filter || !ctx) return;

    const now = ctx.currentTime;

    filter.frequency.cancelScheduledValues(now);
    filter.frequency.setValueAtTime(filter.frequency.value, now);

    filter.frequency.linearRampToValueAtTime(
      Math.max(20, frequency),
      now + duration,
    );
  }, []);

  useEffect(() => {
    const audio = new Audio("/audio/main.mp3");

    audio.loop = true;
    audio.preload = "auto";

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";

      contextRef.current?.close();

      audioRef.current = null;
      contextRef.current = null;
      sourceRef.current = null;
      gainRef.current = null;
      filterRef.current = null;
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        play,
        pause,
        toggle,
        setVolume,
        setFilter,
        fadeTo,
        filterTo,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error("useAudio must be used inside AudioProvider");
  }

  return context;
}
