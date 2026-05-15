import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
  const { signup, error } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await signup(name, email, password);
    setLoading(false);
    if (success) navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-white -mt-20">
      {/* Left Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative pt-28">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 group text-gray-600 hover:text-brand-700 transition">
          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition">
            🌱
          </div>
          <span className="font-bold tracking-tight">AgroIntelX</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-gray-500 font-medium">
              Start your journey to smarter farming today
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-sm font-medium"
            >
              <div className="mt-0.5">⚠️</div>
              <p>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 pt-6 pb-2 border-2 border-gray-100 rounded-xl outline-none focus:border-brand-500 transition-colors peer bg-gray-50 focus:bg-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder=" "
                />
                <label 
                  htmlFor="name"
                  className="absolute left-4 top-4 text-gray-400 text-sm origin-[0] -translate-y-3 scale-75 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-brand-600 font-medium"
                >
                  Full name
                </label>
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-brand-600 transition-colors" size={20} />
              </div>

              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 pt-6 pb-2 border-2 border-gray-100 rounded-xl outline-none focus:border-brand-500 transition-colors peer bg-gray-50 focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder=" "
                />
                <label 
                  htmlFor="email"
                  className="absolute left-4 top-4 text-gray-400 text-sm origin-[0] -translate-y-3 scale-75 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-brand-600 font-medium"
                >
                  Email address
                </label>
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-brand-600 transition-colors" size={20} />
              </div>

              <div className="relative group">
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 pt-6 pb-2 border-2 border-gray-100 rounded-xl outline-none focus:border-brand-500 transition-colors peer bg-gray-50 focus:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder=" "
                />
                <label 
                  htmlFor="password"
                  className="absolute left-4 top-4 text-gray-400 text-sm origin-[0] -translate-y-3 scale-75 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-brand-600 font-medium"
                >
                  Create password
                </label>
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-brand-600 transition-colors" size={20} />
              </div>
            </div>

            <div className="flex items-center text-sm font-medium">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" required className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                <span className="text-gray-600">I agree to the <a href="#" className="text-brand-600 hover:underline">Terms</a> and <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a></span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] shadow-lg
                ${loading ? "bg-brand-400 cursor-not-allowed shadow-none" : "bg-brand-600 hover:bg-brand-700 hover:shadow-brand-500/30"}
              `}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 hover:text-brand-800 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Pane - Visual */}
      <div className="hidden lg:flex w-1/2 bg-brand-900 relative items-center justify-center p-12 overflow-hidden pt-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c86?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/40 to-transparent"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 max-w-lg text-white space-y-6"
        >
          <div className="inline-flex py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-100 text-sm font-semibold tracking-wide uppercase">
            Join the Revolution
          </div>
          <h3 className="text-4xl md:text-5xl font-extrabold leading-tight">
            The next generation of farming starts here.
          </h3>
          <p className="text-brand-100/80 text-lg font-medium leading-relaxed">
            Get instant access to AI-powered soil analysis, predictive crop modeling, and personalized agronomy advice. Join the network of modern farmers utilizing advanced AI.
          </p>
          
          <div className="pt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-900 bg-brand-200 flex items-center justify-center text-xs overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-sm font-medium text-brand-200">
              Trusted by <span className="text-white font-bold">10,000+</span> experts
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
