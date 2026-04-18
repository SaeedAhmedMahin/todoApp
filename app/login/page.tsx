"use client";

import { useState, FormEvent } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(false); // Defaulting to Login based on your template
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
        router.push('/');
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
          
          {/* Email Input */}
          <label htmlFor="email">
            <p className="font-medium text-slate-700 pb-2">Email address</p>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 border border-slate-400 rounded-lg px-3 focus:outline-none focus:border-slate-700 hover:shadow" 
              placeholder="Enter email address" 
            />
          </label>
          
          {/* Password Input */}
          <label htmlFor="password">
            <p className="font-medium text-slate-700 pb-2">Password</p>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 border border-slate-400 rounded-lg px-3 focus:outline-none focus:border-slate-700 hover:shadow" 
              placeholder="Enter your password" 
            />
          </label>

          {/* Confirm Password (Only visible during Sign Up) */}
          {isSignUp && (
            <label htmlFor="confirmPassword">
              <p className="font-medium text-slate-700 pb-2">Confirm Password</p>
              <input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-3 border border-slate-400 rounded-lg px-3 focus:outline-none focus:border-slate-700 hover:shadow" 
                placeholder="Confirm your password" 
              />
            </label>
          )}

          {/* Utilities Row (Remember Me / Forgot Password) */}
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

          {/* Error Message Display */}
          {errorMsg && <p className="text-red-500 text-sm font-medium">{errorMsg}</p>}

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 font-medium text-white bg-slate-900 hover:bg-slate-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center disabled:bg-indigo-300 transition-colors"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>{isSignUp ? "Create Account" : "Login"}</span>
              </>
            )}
          </button>
          
          {/* Toggle Button */}
          <p className="text-center text-slate-700 mt-4">
            {isSignUp ? "Already have an account? " : "Not registered yet? "}
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 font-medium inline-flex space-x-1 items-center hover:underline"
            >
              <u><span>{isSignUp ? "Login now" : "Register now"}</span></u>
              {!isSignUp && (
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </span>
              )}
            </button>
          </p>

        </div>
      </form>
    </div>
  );
}