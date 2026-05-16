import React, { useEffect, useRef, useState, useCallback } from "react";
import { Send, User, Sparkles, Mic, MicOff, Volume2, VolumeX, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ---- Language config ----
const LANGUAGES = [
  { code: "en", label: "English",  bcp47: "en-IN" },
  { code: "hi", label: "हिंदी",    bcp47: "hi-IN" },
  { code: "mr", label: "मराठी",    bcp47: "mr-IN" },
  { code: "te", label: "తెలుగు",   bcp47: "te-IN" },
  { code: "ta", label: "தமிழ்",    bcp47: "ta-IN" },
  { code: "kn", label: "ಕನ್ನಡ",    bcp47: "kn-IN" },
  { code: "bn", label: "বাংলা",    bcp47: "bn-IN" },
  { code: "pa", label: "ਪੰਜਾਬੀ",   bcp47: "pa-IN" },
];

const getLang = (code) => LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];

// ---- Speech Recognition singleton ----
const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

// ---- Avatar states ----
const S = { IDLE: "idle", LISTENING: "listening", THINKING: "thinking", SPEAKING: "speaking" };

// ---- Inline AvatarFace SVG component ----
const AvatarFace = ({ state, mouthOpen }) => {
  const [blink, setBlink] = useState(false);
  const blinkTimerRef = useRef(null);

  const scheduleBlink = useCallback(() => {
    blinkTimerRef.current = setTimeout(() => {
      setBlink(true);
      setTimeout(() => {
        setBlink(false);
        scheduleBlink();
      }, 170);
    }, 2600 + Math.random() * 2800);
  }, []);

  useEffect(() => {
    scheduleBlink();
    return () => clearTimeout(blinkTimerRef.current);
  }, [scheduleBlink]);

  const eyeRy    = blink ? 1 : state === S.LISTENING ? 22 : state === S.THINKING ? 10 : 18;
  const pupilCy  = state === S.THINKING ? 129 : 141;
  const pupilCxL = state === S.THINKING ? 105 : 108;
  const pupilCxR = state === S.THINKING ? 215 : 212;

  return (
    <svg viewBox="0 0 320 320" className="w-full h-full">
      <defs>
        <radialGradient id="cw-av-face" cx="45%" cy="38%" r="60%">
          <stop offset="0%"   stopColor="#1e3d2b" />
          <stop offset="100%" stopColor="#07130d" />
        </radialGradient>
        <radialGradient id="cw-av-iris" cx="38%" cy="32%" r="58%">
          <stop offset="0%"   stopColor="#86efac" />
          <stop offset="100%" stopColor="#15803d" />
        </radialGradient>
        <filter id="cw-av-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Animated halo */}
      <motion.circle cx="160" cy="160" r="152" fill="none" stroke="#16a34a" strokeWidth="1.5"
        animate={{
          opacity: state === S.IDLE      ? [0.1, 0.25, 0.1]
                 : state === S.LISTENING ? [0.5, 1,    0.5]
                 : state === S.SPEAKING  ? [0.6, 1,    0.6]
                 :                         [0.2, 0.5,  0.2],
          scale: state === S.LISTENING ? [1, 1.04, 1]
               : state === S.SPEAKING  ? [1, 1.06, 1]
               : [1],
        }}
        transition={{ duration: state === S.LISTENING ? 0.85 : 1.7, repeat: Infinity }}
        style={{ transformOrigin: "160px 160px" }}
      />

      {/* Listening rings */}
      <AnimatePresence>
        {state === S.LISTENING && [0, 1, 2].map((i) => (
          <motion.circle key={`lr-${i}`} cx="160" cy="160" r="132" fill="none"
            stroke="#4ade80" strokeWidth="1"
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{ opacity: 0, scale: 1.22 + i * 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.38 }}
            style={{ transformOrigin: "160px 160px" }}
          />
        ))}
      </AnimatePresence>

      {/* Face */}
      <circle cx="160" cy="160" r="128" fill="url(#cw-av-face)" />
      <ellipse cx="128" cy="96" rx="46" ry="34" fill="white" opacity="0.04" />

      {/* Left eye */}
      <ellipse cx="108" cy="138" rx="26" ry="27" fill="white" opacity="0.92" />
      <motion.ellipse cx="108" cy="138" rx="17"
        animate={{ ry: eyeRy }}
        transition={{ duration: blink ? 0.07 : 0.22 }}
        fill="url(#cw-av-iris)"
      />
      <motion.circle r="7.5" fill="#050f08"
        animate={{ cx: pupilCxL, cy: pupilCy }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      />
      <circle cx="102" cy="131" r="3.5" fill="white" opacity="0.88" />
      <circle cx="114" cy="143" r="1.5" fill="white" opacity="0.45" />

      {/* Right eye */}
      <ellipse cx="212" cy="138" rx="26" ry="27" fill="white" opacity="0.92" />
      <motion.ellipse cx="212" cy="138" rx="17"
        animate={{ ry: eyeRy }}
        transition={{ duration: blink ? 0.07 : 0.22 }}
        fill="url(#cw-av-iris)"
      />
      <motion.circle r="7.5" fill="#050f08"
        animate={{ cx: pupilCxR, cy: pupilCy }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      />
      <circle cx="206" cy="131" r="3.5" fill="white" opacity="0.88" />
      <circle cx="218" cy="143" r="1.5" fill="white" opacity="0.45" />

      {/* Eyebrows */}
      <motion.path fill="none" stroke="#4ade80" strokeWidth="4" strokeLinecap="round"
        filter="url(#cw-av-glow)"
        animate={{
          d: state === S.LISTENING ? "M 82 103 Q 105 95 130 100"
           : state === S.THINKING  ? "M 82 109 Q 105 107 130 110"
           :                         "M 82 110 Q 105 102 130 108",
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.path fill="none" stroke="#4ade80" strokeWidth="4" strokeLinecap="round"
        filter="url(#cw-av-glow)"
        animate={{
          d: state === S.LISTENING ? "M 190 100 Q 215 95 238 103"
           : state === S.THINKING  ? "M 190 110 Q 215 107 238 109"
           :                         "M 190 108 Q 215 102 238 110",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Nose */}
      <path d="M 154 158 Q 151 173 156 178 Q 160 180 164 178 Q 169 173 166 158"
        fill="none" stroke="#4ade8038" strokeWidth="1.5" strokeLinecap="round" />

      {/* Mouth */}
      <AnimatePresence mode="wait">
        {state === S.THINKING ? (
          <motion.g key="m-think"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <motion.line x1="138" y1="199" x2="182" y2="199"
              stroke="#4ade80" strokeWidth="3.5" strokeLinecap="round"
              filter="url(#cw-av-glow)"
              animate={{ x1: [138, 141, 138], x2: [182, 179, 182] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </motion.g>
        ) : mouthOpen ? (
          <motion.g key="m-open"
            initial={{ opacity: 0, scaleY: 0.4 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.4 }}
            transition={{ duration: 0.1 }}
            style={{ transformOrigin: "160px 200px" }}
          >
            <ellipse cx="160" cy="200" rx="30" ry="16" fill="#07130d" />
            <ellipse cx="160" cy="200" rx="30" ry="16" fill="none" stroke="#4ade80" strokeWidth="2.5" filter="url(#cw-av-glow)" />
            <line x1="133" y1="199" x2="187" y2="199" stroke="white" strokeWidth="1.5" opacity="0.45" />
          </motion.g>
        ) : (
          <motion.g key="m-smile"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.path fill="none" stroke="#4ade80" strokeWidth="3.5" strokeLinecap="round"
              filter="url(#cw-av-glow)"
              animate={{
                d: state === S.LISTENING
                  ? "M 128 195 Q 160 222 192 195"
                  : state === S.SPEAKING
                  ? "M 133 197 Q 160 214 187 197"
                  : "M 135 201 Q 160 217 185 201",
              }}
              transition={{ duration: 0.35 }}
            />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Speaking sound-wave bars */}
      <AnimatePresence>
        {state === S.SPEAKING && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {[12, 9, 20, 14, 24, 11, 18].map((bh, i) => (
              <motion.rect key={i} x={118 + i * 13} width={7} rx={3.5} fill="#4ade80" opacity={0.75}
                animate={{
                  height: [bh * 0.5, bh, bh * 1.3, bh * 0.6, bh * 0.5],
                  y:      [245 - bh * 0.5, 245 - bh, 245 - bh * 1.3, 245 - bh * 0.6, 245 - bh * 0.5],
                }}
                transition={{ duration: 0.48 + i * 0.07, repeat: Infinity, delay: i * 0.06 }}
              />
            ))}
          </motion.g>
        )}
      </AnimatePresence>

      {/* Thinking dots */}
      <AnimatePresence>
        {state === S.THINKING && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {[0, 1, 2].map((i) => (
              <motion.circle key={i} cx={147 + i * 16} r={5.5} fill="#4ade80"
                animate={{ cy: [246, 234, 246], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.72, repeat: Infinity, delay: i * 0.22 }}
              />
            ))}
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
};

/* ---------------- Assistant Message Formatter ---------------- */
const formatAssistantMessage = (text) => {
  if (!text) return null;
  const lines = text.split("\n").filter(Boolean);
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        const cleanLine = line.replace(/\*\*/g, "").trim();
        if (
          cleanLine.toLowerCase().includes("soil ph") ||
          cleanLine.toLowerCase().includes("nutrient") ||
          cleanLine.toLowerCase().includes("micronutrient") ||
          cleanLine.toLowerCase().includes("recommended crops") ||
          cleanLine.toLowerCase().includes("summary")
        ) {
          return (
            <h4 key={i} className="text-brand-800 font-bold mt-4 border-b-2 border-brand-100 pb-2 flex items-center gap-2 text-[15px] uppercase tracking-wide">
              <Sparkles size={16} className="text-brand-500" /> {cleanLine}
            </h4>
          );
        }
        if (cleanLine.toLowerCase().includes("do not apply") || cleanLine.toLowerCase().includes("avoid")) {
          return (
            <div key={i} className="bg-red-50/80 border border-red-100 text-red-800 px-4 py-3 rounded-xl text-[15px] font-medium flex items-start gap-3 shadow-sm">
              <div className="mt-0.5 shrink-0">⚠️</div>
              <p>{cleanLine}</p>
            </div>
          );
        }
        if (
          cleanLine.toLowerCase().includes("recommended") ||
          cleanLine.toLowerCase().includes("apply") ||
          cleanLine.toLowerCase().includes("focus on")
        ) {
          return (
            <div key={i} className="bg-brand-50 border border-brand-100 text-brand-800 px-4 py-3 rounded-xl text-[15px] font-medium flex items-start gap-3 shadow-sm">
              <div className="mt-0.5 shrink-0">✅</div>
              <p>{cleanLine}</p>
            </div>
          );
        }
        if (cleanLine.startsWith("*")) {
          return (
            <li key={i} className="ml-6 list-disc text-gray-700 text-[15px] marker:text-brand-500 pl-1">
              {cleanLine.replace("*", "")}
            </li>
          );
        }
        return <p key={i} className="text-gray-700 text-[15px] leading-relaxed">{cleanLine}</p>;
      })}
    </div>
  );
};

/* ---------------- Main Component ---------------- */
const ChatWindow = ({ messages, loading, onSend, activeSession }) => {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [isListening, setIsListening] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Avatar state
  const [ttsActive, setTtsActive] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const messagesEndRef   = useRef(null);
  const recognitionRef   = useRef(null);
  const langMenuRef      = useRef(null);
  const mouthIntervalRef = useRef(null);
  const prevMsgCountRef  = useRef(0);

  // Derived avatar state
  const avatarState = isListening ? S.LISTENING
                    : loading     ? S.THINKING
                    : ttsActive   ? S.SPEAKING
                    : S.IDLE;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Close lang menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target))
        setShowLangMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Stop speech when language changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      clearInterval(mouthIntervalRef.current);
      setSpeakingIdx(null);
      setTtsActive(false);
      setMouthOpen(false);
    }
  }, [language]);

  // Cleanup on unmount
  useEffect(() => () => {
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    clearInterval(mouthIntervalRef.current);
  }, []);

  /* ---- Auto-speak new assistant messages ---- */
  const autoSpeak = useCallback((text) => {
    if (!window.speechSynthesis || isMuted) return;
    window.speechSynthesis.cancel();
    clearInterval(mouthIntervalRef.current);
    setSpeakingIdx(null);

    const clean = text.replace(/[*_#`>~]/g, "").replace(/\s+/g, " ").trim();
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang  = getLang(language).bcp47;
    utter.rate  = 0.92;
    utter.pitch = 1.05;

    setTtsActive(true);
    setMouthOpen(false);

    let toggle = false;
    mouthIntervalRef.current = setInterval(() => {
      toggle = !toggle;
      setMouthOpen(toggle);
    }, 130);

    utter.onboundary = (e) => {
      if (e.name === "word") setMouthOpen((p) => !p);
    };

    const onDone = () => {
      clearInterval(mouthIntervalRef.current);
      setMouthOpen(false);
      setTtsActive(false);
    };
    utter.onend   = onDone;
    utter.onerror = onDone;

    window.speechSynthesis.speak(utter);
  }, [isMuted, language]);

  // Watch for new assistant messages and auto-speak them
  useEffect(() => {
    if (messages.length > prevMsgCountRef.current) {
      const newest = messages[messages.length - 1];
      if (newest?.sender === "assistant") {
        autoSpeak(newest.message);
      }
    }
    prevMsgCountRef.current = messages.length;
  }, [messages, autoSpeak]);

  /* ---- Manual per-message TTS ---- */
  const speakMessage = useCallback((text, idx) => {
    if (!window.speechSynthesis) return;
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      clearInterval(mouthIntervalRef.current);
      setSpeakingIdx(null);
      setTtsActive(false);
      setMouthOpen(false);
      return;
    }
    window.speechSynthesis.cancel();
    clearInterval(mouthIntervalRef.current);
    setTtsActive(false);
    setMouthOpen(false);

    const clean = text.replace(/[*_#`>~]/g, "").replace(/\s+/g, " ").trim();
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang  = getLang(language).bcp47;
    utter.rate  = 0.92;
    utter.pitch = 1.05;

    setSpeakingIdx(idx);
    setTtsActive(true);
    setMouthOpen(false);

    let toggle = false;
    mouthIntervalRef.current = setInterval(() => {
      toggle = !toggle;
      setMouthOpen(toggle);
    }, 130);

    utter.onboundary = (e) => {
      if (e.name === "word") setMouthOpen((p) => !p);
    };

    const onDone = () => {
      clearInterval(mouthIntervalRef.current);
      setSpeakingIdx(null);
      setTtsActive(false);
      setMouthOpen(false);
    };
    utter.onend   = onDone;
    utter.onerror = onDone;

    window.speechSynthesis.speak(utter);
  }, [language, speakingIdx]);

  /* ---- Voice Input ---- */
  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }
    // Interrupt any ongoing TTS when mic starts
    window.speechSynthesis?.cancel();
    clearInterval(mouthIntervalRef.current);
    setTtsActive(false);
    setMouthOpen(false);

    if (recognitionRef.current) recognitionRef.current.abort();

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = getLang(language).bcp47;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend   = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [language]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggleMic = () => {
    if (isListening) stopListening();
    else startListening();
  };

  /* ---- Send ---- */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend({ text: input, newChat: !activeSession, language });
    setInput("");
  };

  const currentLang = getLang(language);

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

      {/* Header */}
      <div className="px-8 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-xl z-10 sticky top-0 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Animated Avatar in header */}
          <motion.div
            className="w-14 h-14 shrink-0"
            animate={{
              filter: avatarState === S.LISTENING
                ? "drop-shadow(0 0 10px #16a34a)"
                : avatarState === S.SPEAKING
                ? "drop-shadow(0 0 8px #3b82f6)"
                : avatarState === S.THINKING
                ? "drop-shadow(0 0 8px #ca8a04)"
                : "drop-shadow(0 0 4px #16a34a55)",
            }}
            transition={{ duration: 0.45 }}
          >
            <AvatarFace state={avatarState} mouthOpen={mouthOpen} />
          </motion.div>

          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              AgroIntelX Assistant
              <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[10px] uppercase font-bold tracking-widest">Beta</span>
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              {avatarState === S.LISTENING ? "Listening…"
               : avatarState === S.THINKING ? "Thinking…"
               : avatarState === S.SPEAKING ? "Speaking…"
               : "AI-powered agronomic insights"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !isMuted;
              setIsMuted(next);
              if (next) {
                window.speechSynthesis?.cancel();
                clearInterval(mouthIntervalRef.current);
                setTtsActive(false);
                setMouthOpen(false);
                setSpeakingIdx(null);
              }
            }}
            className={`p-2 rounded-xl border transition-all ${
              isMuted
                ? "bg-red-50 border-red-200 text-red-500"
                : "bg-gray-50 border-gray-200 text-gray-500 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50"
            }`}
            title={isMuted ? "Unmute avatar voice" : "Mute avatar voice"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Language Selector */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setShowLangMenu((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:border-brand-400 hover:bg-brand-50 transition-all text-sm font-semibold text-gray-700 shadow-sm"
              aria-label="Select language"
            >
              <span>{currentLang.label}</span>
              <ChevronDown size={14} className={`transition-transform ${showLangMenu ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-36 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-brand-50 hover:text-brand-700 ${
                        language === lang.code ? "bg-brand-50 text-brand-700 font-bold" : "text-gray-700"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-8 custom-scrollbar z-0">
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-sm">
              <Sparkles size={32} className="text-brand-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">How can I help today?</h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              Ask me to analyze your soil report, suggest optimal crops, or generate a tailored fertilizer plan.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
              {["What crops are best for pH 6.5?", "Suggest a fertilizer plan", "Analyze my NPK levels"].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-3 bg-white border border-gray-100 rounded-xl text-left text-sm font-medium text-gray-600 hover:border-brand-300 hover:text-brand-700 hover:shadow-sm transition-all text-ellipsis overflow-hidden whitespace-nowrap"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.sender === "assistant" && (
                <div className="w-8 h-8 shrink-0 mt-1">
                  <AvatarFace
                    state={speakingIdx === idx ? S.SPEAKING : S.IDLE}
                    mouthOpen={speakingIdx === idx ? mouthOpen : false}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1 max-w-[85%] md:max-w-[75%]">
                <div
                  className={`px-5 py-4 text-[15px] leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gray-900 text-white rounded-2xl rounded-tr-sm"
                      : "bg-white border border-gray-100 rounded-2xl rounded-tl-sm text-gray-800"
                  }`}
                >
                  {msg.sender === "assistant" ? formatAssistantMessage(msg.message) : msg.message}
                </div>

                {/* Speaker button for AI messages */}
                {msg.sender === "assistant" && (
                  <button
                    type="button"
                    onClick={() => speakMessage(msg.message, idx)}
                    className={`self-start flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      speakingIdx === idx
                        ? "bg-brand-100 text-brand-700"
                        : "text-gray-400 hover:text-brand-600 hover:bg-brand-50"
                    }`}
                    title={speakingIdx === idx ? "Stop reading" : "Read aloud"}
                  >
                    {speakingIdx === idx ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span>{speakingIdx === idx ? "Stop" : "Listen"}</span>
                  </button>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shrink-0 mt-1">
                  <User size={16} />
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4">
              <div className="w-8 h-8 shrink-0 mt-1">
                <AvatarFace state={S.THINKING} mouthOpen={false} />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 md:p-6 bg-transparent z-10">
        <form
          onSubmit={handleSubmit}
          className="relative max-w-4xl mx-auto flex items-end gap-2 bg-white border border-gray-200 rounded-[2rem] p-2 shadow-lg shadow-gray-200/50 focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-50 transition-all"
        >
          {/* Mic button */}
          <button
            type="button"
            onClick={toggleMic}
            disabled={loading}
            title={isListening ? "Stop listening" : `Voice input (${currentLang.label})`}
            className={`p-3 rounded-full shrink-0 flex items-center justify-center transition-all ${
              isListening
                ? "bg-red-500 text-white shadow-md animate-pulse"
                : "bg-gray-100 text-gray-500 hover:bg-brand-50 hover:text-brand-600"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={
              isListening
                ? `Listening in ${currentLang.label}…`
                : loading
                ? "Waiting for response…"
                : `Message AgroIntelX in ${currentLang.label}…`
            }
            disabled={loading}
            className="flex-1 max-h-32 min-h-[44px] px-4 py-3 bg-transparent text-gray-800 text-[15px] focus:outline-none resize-none custom-scrollbar disabled:opacity-50"
            rows={1}
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`p-3 rounded-full flex shrink-0 items-center justify-center transition-all ${
              input.trim() && !loading
                ? "bg-brand-600 text-white shadow-md hover:bg-brand-700 hover:scale-105"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send size={18} className={input.trim() && !loading ? "translate-x-0.5 -translate-y-0.5" : ""} />
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="text-xs text-gray-400">AgroIntelX AI can make mistakes. Verify important agronomic information.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
