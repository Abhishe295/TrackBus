import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bus, Mail, Lock, User, MapPin, Route, ArrowRight, AlertCircle } from "lucide-react";
import useAuthStore from "../store/useAuthStore.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { login, register, loading, error } = useAuthStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup) {
      await register(form.name, form.email, form.password);
    } else {
      await login(form.email, form.password);
    }
    navigate("/");
  };

  return (
    <div className="h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <Bus className="w-12 h-12 text-primary" />
        </div>
        <div className="absolute bottom-32 right-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <MapPin className="w-10 h-10 text-secondary" />
        </div>
        <div className="absolute top-1/2 right-10 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>
          <Route className="w-11 h-11 text-accent" />
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="card bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body p-6">
            {/* Logo & Title */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg mb-3">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
                TrackBus
              </h1>
              <p className="text-base-content/70 text-xs">
                {isSignup 
                  ? "Create your account to start tracking buses" 
                  : "Track your local buses in real-time"}
              </p>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed bg-base-200/50 p-1 mb-4">
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className={`tab flex-1 gap-2 text-sm ${!isSignup ? 'tab-active' : ''}`}
              >
                <ArrowRight className="w-3 h-3" />
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsSignup(true)}
                className={`tab flex-1 gap-2 text-sm ${isSignup ? 'tab-active' : ''}`}
              >
                <User className="w-3 h-3" />
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {isSignup && (
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm font-medium">Full Name</span>
                  </label>
                  <label className="input input-sm input-bordered flex items-center gap-2 focus-within:input-primary">
                    <User className="w-4 h-4 text-base-content/50" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      className="grow text-sm"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
              )}

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm font-medium">Email</span>
                </label>
                <label className="input input-bordered flex items-center gap-2 focus-within:input-primary">
                  <Mail className="w-4 h-4 text-base-content/50" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="grow text-sm"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm font-medium">Password</span>
                </label>
                <label className="input input-bordered flex items-center gap-2 focus-within:input-primary">
                  <Lock className="w-4 h-4 text-base-content/50" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="grow text-sm"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              {error && (
                <div className="alert alert-error shadow-lg py-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    <span className="text-sm">Please wait...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">{isSignup ? "Create Account" : "Login"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </form>

            {/* Divider & Switch */}
            <div className="divider text-xs text-base-content/50 my-3">OR</div>

            <div className="text-center">
              <p className="text-xs text-base-content/70">
                {isSignup ? "Already have an account?" : "Don't have an account?"}
              </p>
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="btn btn-link btn-xs text-primary font-semibold"
                type="button"
              >
                {isSignup ? "Login here" : "Sign up now"}
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="card bg-base-100/50 backdrop-blur-sm p-3 shadow-md border border-base-300/50">
            <MapPin className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xs font-medium text-base-content/80">Real-time</p>
          </div>
          <div className="card bg-base-100/50 backdrop-blur-sm p-3 shadow-md border border-base-300/50">
            <Route className="w-5 h-5 text-secondary mx-auto mb-1" />
            <p className="text-xs font-medium text-base-content/80">Routes</p>
          </div>
          <div className="card bg-base-100/50 backdrop-blur-sm p-3 shadow-md border border-base-300/50">
            <Bus className="w-5 h-5 text-accent mx-auto mb-1" />
            <p className="text-xs font-medium text-base-content/80">Live Updates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;