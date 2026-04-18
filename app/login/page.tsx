"use client";

import { useState, FormEvent } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  // Initialize the Supabase browser client inside the component
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (isSignUp && password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Success! Check your email for a confirmation link.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // IMPORTANT: Use window.location.href instead of router.push
        // This forces a full page load so the middleware can "see" the new cookie.
        window.location.href = "/";
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-slate-800 max-w-lg mx-auto my-20 bg-white p-8 rounded-xl shadow shadow-slate-300">
      <h1 className="text-4xl font-medium text-slate-900">{isSignUp ? "Register" : "Login"}</h1>
      <p className="text-slate-500 mt-2">
        {isSignUp ? "Create a new account " : "Hi, Welcome back "}
      </p>

      <form onSubmit={handleAuth} className="my-10">
        <div className="flex flex-col space-y-5">
          <label htmlFor="email">
            <p className="font-medium text-slate-700 pb-2">Email address</p>
            <input 
              id="email" 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-slate-900 w-full py-3 border border-slate-400 rounded-lg px-3 focus:outline-none focus:border-slate-700 hover:shadow" 
              placeholder="Enter email address" 
            />
          </label>
          
          <label htmlFor="password">
            <p className="font-medium text-slate-700 pb-2">Password</p>
            <input 
              id="password" 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-slate-900 w-full py-3 border border-slate-400 rounded-lg px-3 focus:outline-none focus:border-slate-700 hover:shadow" 
              placeholder="Enter your password" 
            />
          </label>

          {isSignUp && (
            <label htmlFor="confirmPassword">
              <p className="font-medium text-slate-700 pb-2">Confirm Password</p>
              <input 
                id="confirmPassword" 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-slate-900 w-full py-3 border border-slate-400 rounded-lg px-3 focus:outline-none focus:border-slate-700 hover:shadow" 
                placeholder="Confirm your password" 
              />
            </label>
          )}

          {!isSignUp && (
            <div className="flex flex-row justify-between">
              <div>
                <label htmlFor="remember" className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="remember" className="w-4 h-4 border-slate-400 focus:bg-indigo-600" />
                  <span className="text-slate-900">Remember me</span>
                </label>
              </div>
              <div>
                <a href="#" className="font-medium text-blue-600 hover:underline">Forgot Password?</a>
              </div>
            </div>
          )}

          {errorMsg && <p className="text-red-500 text-sm font-medium">{errorMsg}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 font-medium text-white bg-slate-900 hover:bg-slate-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center disabled:bg-indigo-300 transition-colors"
          >
            {loading ? <span>Processing...</span> : <span>{isSignUp ? "Create Account" : "Login"}</span>}
          </button>
          
          <p className="text-center text-slate-700 mt-4">
            {isSignUp ? "Already have an account? " : "Not registered yet? "}
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 font-medium inline-flex space-x-1 items-center hover:underline"
            >
              <u><span>{isSignUp ? "Login now" : "Register now"}</span></u>
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}