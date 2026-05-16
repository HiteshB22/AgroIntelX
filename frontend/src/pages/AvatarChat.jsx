import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, RotateCcw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

// ─── Language config (same codes as ChatWindow) ───────────────────────────────
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
const ALLOWED_LANG_CODES = new Set(LANGUAGES.map((l) => l.code));
const getLang = (code) => LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

// ─── Avatar states ─────────────────────────────────────────────────────────────
const S = { IDLE: "idle", LISTENING: "listening", THINKING: "thinking", SPEAKING: "speaking" };

const STATUS = {
  [S.IDLE]:      { label: "Tap the mic and speak naturally", color: "text-gray-400",   dot: "bg-gray-500"   },
  [S.LISTENING]: { label: "Listening…",                      color: "text-green-400",  dot: "bg-green-400"  },
  [S.THINKING]:  { label: "Thinking…",                       color: "text-yellow-400", dot: "bg-yellow-400" },
  [S.SPEAKING]:  { label: "Speaking…",                       color: "text-blue-400",   dot: "bg-blue-400"   },
};

// ─── Animated SVG Avatar face ──────────────────────────────────────────────────
const AvatarFace = ({ state, mouthOpen }) => {
  const [blink, setBlink] = useState(false);
  const blinkTimerRef = useRef(null);

  // Periodic, randomized blinking
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

  // Eye shape driven by state
  const eyeRy   = blink ? 1 : state === S.LISTENING ? 22 : state === S.THINKING ? 10 : 18;
  const pupilCy  = state === S.THINKING ? 129 : 141;
  const pupilCxL = state === S.THINKING ? 105 : 108;
  const pupilCxR = state === S.THINKING ? 215 : 212;

  return (
    <svg viewBox="0 0 320 320" className="w-full h-full">
      <defs>
        <radialGradient id="av-face" cx="45%" cy="38%" r="60%">
          <stop offset="0%"   stopColor="#1e3d2b" />
          <stop offset="100%" stopColor="#07130d" />
        </radialGradient>
        <radialGradient id="av-iris" cx="38%" cy="32%" r="58%">
          <stop offset="0%"   stopColor="#86efac" />
          <stop offset="100%" stopColor="#15803d" />
        </radialGradient>
        <filter id="av-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="av-softglow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Outermost animated halo ── */}
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

      {/* Listening expanding rings */}
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

      {/* ── Face circle ── */}
      <circle cx="160" cy="160" r="128" fill="url(#av-face)" />
      {/* Subtle specular highlight */}
      <ellipse cx="128" cy="96" rx="46" ry="34" fill="white" opacity="0.04" />

      {/* ── Left eye ── */}
      <ellipse cx="108" cy="138" rx="26" ry="27" fill="white" opacity="0.92" />
      <motion.ellipse cx="108" cy="138" rx="17"
        animate={{ ry: eyeRy }}
        transition={{ duration: blink ? 0.07 : 0.22 }}
        fill="url(#av-iris)"
      />
      <motion.circle r="7.5" fill="#050f08"
        animate={{ cx: pupilCxL, cy: pupilCy }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      />
      <circle cx="102" cy="131" r="3.5" fill="white" opacity="0.88" />
      <circle cx="114" cy="143" r="1.5" fill="white" opacity="0.45" />

      {/* ── Right eye ── */}
      <ellipse cx="212" cy="138" rx="26" ry="27" fill="white" opacity="0.92" />
      <motion.ellipse cx="212" cy="138" rx="17"
        animate={{ ry: eyeRy }}
        transition={{ duration: blink ? 0.07 : 0.22 }}
        fill="url(#av-iris)"
      />
      <motion.circle r="7.5" fill="#050f08"
        animate={{ cx: pupilCxR, cy: pupilCy }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      />
      <circle cx="206" cy="131" r="3.5" fill="white" opacity="0.88" />
      <circle cx="218" cy="143" r="1.5" fill="white" opacity="0.45" />

      {/* ── Eyebrows ── */}
      <motion.path fill="none" stroke="#4ade80" strokeWidth="4" strokeLinecap="round"
        filter="url(#av-glow)"
        animate={{
          d: state === S.LISTENING ? "M 82 103 Q 105 95 130 100"
           : state === S.THINKING  ? "M 82 109 Q 105 107 130 110"
           :                         "M 82 110 Q 105 102 130 108",
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.path fill="none" stroke="#4ade80" strokeWidth="4" strokeLinecap="round"
        filter="url(#av-glow)"
        animate={{
          d: state === S.LISTENING ? "M 190 100 Q 215 95 238 103"
           : state === S.THINKING  ? "M 190 110 Q 215 107 238 109"
           :                         "M 190 108 Q 215 102 238 110",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* ── Nose (subtle) ── */}
      <path d="M 154 158 Q 151 173 156 178 Q 160 180 164 178 Q 169 173 166 158"
        fill="none" stroke="#4ade8038" strokeWidth="1.5" strokeLinecap="round" />

      {/* ── Mouth ── */}
      <AnimatePresence mode="wait">
        {state === S.THINKING ? (
          <motion.g key="m-think"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <motion.line x1="138" y1="199" x2="182" y2="199"
              stroke="#4ade80" strokeWidth="3.5" strokeLinecap="round"
              filter="url(#av-glow)"
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
            <ellipse cx="160" cy="200" rx="30" ry="16" fill="none" stroke="#4ade80" strokeWidth="2.5" filter="url(#av-glow)" />
            <line x1="133" y1="199" x2="187" y2="199" stroke="white" strokeWidth="1.5" opacity="0.45" />
          </motion.g>
        ) : (
          <motion.g key="m-smile"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.path fill="none" stroke="#4ade80" strokeWidth="3.5" strokeLinecap="round"
              filter="url(#av-glow)"
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

      {/* ── Speaking sound-wave bars ── */}
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

      {/* ── Thinking dots ── */}
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

// ─── Main Page ─────────────────────────────────────────────────────────────────
const AvatarChat = () => {
  const [avatarState, setAvatarState]   = useState(S.IDLE);
  const [mouthOpen,   setMouthOpen]     = useState(false);
  const [messages,    setMessages]      = useState([]);
  const [interimText, setInterimText]   = useState("");
  const [language,    setLanguage]      = useState("en");
  const [isMuted,     setIsMuted]       = useState(false);
  const [showLangMenu,setShowLangMenu]  = useState(false);
  const [isListening, setIsListening]   = useState(false);
  const [errorMsg,    setErrorMsg]      = useState("");

  const recognitionRef  = useRef(null);
  const mouthIntervalRef= useRef(null);
  const sessionIdRef    = useRef(null);
  const finalTextRef    = useRef("");
  const langMenuRef     = useRef(null);
  const messagesEndRef  = useRef(null);
  const busyRef         = useRef(false); // guard: no overlapping AI calls

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handler = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target))
        setShowLangMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Full cleanup on unmount
  useEffect(() => () => {
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    clearInterval(mouthIntervalRef.current);
  }, []);

  /* ── TTS speak ─────────────────────────────────────────────────────────── */
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    clearInterval(mouthIntervalRef.current);

    if (isMuted) {
      setAvatarState(S.IDLE);
      busyRef.current = false;
      return;
    }

    // Strip markdown symbols before speaking
    const clean = text.replace(/[*_#`>~]/g, "").replace(/\s+/g, " ").trim();
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang  = getLang(language).bcp47;
    utter.rate  = 0.92;
    utter.pitch = 1.05;

    setAvatarState(S.SPEAKING);
    setMouthOpen(false);

    // Animate mouth: alternate open/closed every ~130 ms
    let toggle = false;
    mouthIntervalRef.current = setInterval(() => {
      toggle = !toggle;
      setMouthOpen(toggle);
    }, 130);

    // Word-boundary events give more precise mouth sync where supported
    utter.onboundary = (e) => {
      if (e.name === "word") setMouthOpen((prev) => !prev);
    };

    const onDone = () => {
      clearInterval(mouthIntervalRef.current);
      setMouthOpen(false);
      setAvatarState(S.IDLE);
      busyRef.current = false;
    };
    utter.onend   = onDone;
    utter.onerror = onDone;

    window.speechSynthesis.speak(utter);
  }, [isMuted, language]);

  /* ── Send transcript to AI ────────────────────────────────────────────── */
  const sendToAI = useCallback(async (text) => {
    if (!text.trim() || busyRef.current) return;
    busyRef.current = true;
    setInterimText("");
    setAvatarState(S.THINKING);
    setMessages((prev) => [...prev, { role: "user", text }]);

    // Validate language code before sending
    const safeLang = ALLOWED_LANG_CODES.has(language) ? language : "en";

    try {
      const res = await api.post("/chat/send", {
        message:   text,
        language:  safeLang,
        newChat:   !sessionIdRef.current,
        sessionId: sessionIdRef.current ?? null,
      });

      if (res.data.sessionId && !sessionIdRef.current)
        sessionIdRef.current = res.data.sessionId;

      const reply =
        res.data.assistantMessage?.message ??
        "I couldn't generate a response right now. Please try again.";

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      speak(reply);
    } catch {
      const fallback = "Sorry, something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", text: fallback }]);
      setAvatarState(S.IDLE);
      busyRef.current = false;
    }
  }, [language, speak]);

  /* ── Start speech recognition ─────────────────────────────────────────── */
  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      setErrorMsg("Voice input requires Chrome or Edge browser.");
      return;
    }
    if (busyRef.current) return;

    // Interrupt any ongoing TTS
    window.speechSynthesis?.cancel();
    clearInterval(mouthIntervalRef.current);
    setMouthOpen(false);

    recognitionRef.current?.abort();
    finalTextRef.current = "";
    setInterimText("");
    setErrorMsg("");

    const rec           = new SpeechRecognitionAPI();
    rec.lang            = getLang(language).bcp47;
    rec.interimResults  = true;
    rec.continuous      = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setIsListening(true);
      setAvatarState(S.LISTENING);
    };

    rec.onresult = (e) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setInterimText(interim || final);
      if (final) finalTextRef.current = final;
    };

    // onspeechend fires when the user stops talking — stop recognition
    rec.onspeechend = () => rec.stop();

    rec.onend = () => {
      setIsListening(false);
      const captured = finalTextRef.current.trim();
      finalTextRef.current = "";
      if (captured) sendToAI(captured);
      else {
        setAvatarState(S.IDLE);
        setInterimText("");
      }
    };

    rec.onerror = (e) => {
      setIsListening(false);
      setAvatarState(S.IDLE);
      if (e.error !== "no-speech" && e.error !== "aborted")
        setErrorMsg(`Microphone error: ${e.error}`);
    };

    recognitionRef.current = rec;
    rec.start();
  }, [language, sendToAI]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggleMic = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const resetConversation = () => {
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    clearInterval(mouthIntervalRef.current);
    sessionIdRef.current  = null;
    finalTextRef.current  = "";
    busyRef.current       = false;
    setMessages([]);
    setInterimText("");
    setAvatarState(S.IDLE);
    setMouthOpen(false);
    setIsListening(false);
    setErrorMsg("");
  };

  const statusCfg  = STATUS[avatarState];
  const currentLang = getLang(language);
  const isBusy     = avatarState === S.THINKING || avatarState === S.SPEAKING;

  return (
    <div className="min-h-screen bg-[#050e0a] flex flex-col select-none">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
        <Link to="/chat"
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-900/30 border border-brand-700/30">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <span className="text-brand-300 text-xs font-bold tracking-widest uppercase">AI Voice Avatar</span>
        </div>

        {/* Language selector */}
        <div className="relative" ref={langMenuRef}>
          <button type="button" onClick={() => setShowLangMenu((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-medium text-gray-300"
          >
            {currentLang.label}
            <svg width="10" height="7" viewBox="0 0 10 7"
              className={`transition-transform ${showLangMenu ? "rotate-180" : ""}`}
            >
              <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <AnimatePresence>
            {showLangMenu && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.97 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit={{   opacity: 0, y: -5, scale: 0.97 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 top-full mt-2 w-36 bg-[#0c1f16] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                {LANGUAGES.map((lang) => (
                  <button key={lang.code} type="button"
                    onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/5 hover:text-green-400 ${
                      language === lang.code
                        ? "text-green-400 font-bold bg-white/5"
                        : "text-gray-300"
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

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-6 max-w-6xl mx-auto w-full px-4 py-6 overflow-hidden">

        {/* ── Avatar column ── */}
        <div className="flex flex-col items-center justify-center gap-6 lg:flex-1 shrink-0">

          {/* Glow wrapper */}
          <motion.div className="relative w-64 h-64 md:w-72 md:h-72"
            animate={{
              filter: avatarState === S.LISTENING
                ? "drop-shadow(0 0 36px #16a34a)"
                : avatarState === S.SPEAKING
                ? "drop-shadow(0 0 28px #3b82f6)"
                : avatarState === S.THINKING
                ? "drop-shadow(0 0 22px #ca8a04)"
                : "drop-shadow(0 0 14px #16a34a55)",
            }}
            transition={{ duration: 0.55 }}
          >
            <AvatarFace state={avatarState} mouthOpen={mouthOpen} />
          </motion.div>

          {/* Status */}
          <div className="flex flex-col items-center gap-2 min-h-[52px]">
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-2.5 h-2.5 rounded-full ${statusCfg.dot}`}
                animate={avatarState !== S.IDLE
                  ? { scale: [1, 1.4, 1], opacity: [1, 0.65, 1] }
                  : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
              <span className={`text-sm font-semibold ${statusCfg.color}`}>
                {statusCfg.label}
              </span>
            </div>

            <AnimatePresence>
              {interimText && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-gray-500 text-sm italic text-center max-w-[240px] leading-snug"
                >
                  "{interimText}"
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {errorMsg && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-red-400 text-xs text-center max-w-[260px] bg-red-900/20 border border-red-800/30 rounded-xl px-3 py-1.5 mt-1"
                >
                  {errorMsg}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Control buttons */}
          <div className="flex items-center gap-4">

            {/* Mic — primary CTA */}
            <motion.button type="button" onClick={toggleMic} disabled={isBusy}
              whileHover={!isBusy ? { scale: 1.06 } : {}}
              whileTap={!isBusy  ? { scale: 0.93 } : {}}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all disabled:opacity-35 disabled:cursor-not-allowed ${
                isListening
                  ? "bg-red-500 shadow-red-500/40 ring-4 ring-red-400/35"
                  : "bg-brand-600 shadow-brand-600/40 hover:bg-brand-500 ring-4 ring-brand-500/20"
              }`}
              aria-label={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening
                ? <MicOff size={26} className="text-white" />
                : <Mic    size={26} className="text-white" />
              }
            </motion.button>

            {/* Mute voice output */}
            <button type="button" onClick={() => setIsMuted((m) => !m)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                isMuted
                  ? "bg-red-900/40 border-red-700/50 text-red-400"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
              title={isMuted ? "Unmute AI voice" : "Mute AI voice"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Reset */}
            <button type="button" onClick={resetConversation}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              title="Reset conversation"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          {!SpeechRecognitionAPI && (
            <p className="text-amber-400/80 text-xs text-center max-w-xs bg-amber-900/20 border border-amber-700/30 rounded-xl px-4 py-2">
              Voice input requires Chrome or Edge
            </p>
          )}
        </div>

        {/* ── Transcript column ── */}
        <div className="lg:w-[400px] flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-white font-bold text-lg">Conversation</h2>
            {messages.length > 0 && (
              <span className="text-xs text-gray-600">
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1 max-h-[55vh] lg:max-h-full">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center text-gray-600 gap-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Mic size={20} className="text-gray-600" />
                </div>
                <p className="text-sm leading-relaxed">
                  Press the mic and speak naturally.<br />
                  The avatar will listen, think, and respond.
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[88%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-brand-900/60 border border-brand-700/40 text-brand-100 rounded-tr-sm"
                      : "bg-white/5 border border-white/8 text-gray-200 rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarChat;
