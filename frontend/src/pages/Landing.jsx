import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header / Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-350">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 text-emerald-500 animate-pulse"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              ApexMotors
            </span>
          </div>

          <nav className="flex items-center gap-6">
            {token ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-medium transition-all shadow-lg shadow-emerald-950/40 hover:-translate-y-0.5 text-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 font-medium transition-all shadow-lg shadow-slate-900/55 hover:-translate-y-0.5 text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-grow flex flex-col">
        <section className="max-w-5xl mx-auto px-6 py-20 lg:py-32 flex flex-col items-center justify-center text-center relative">
          {/* Subtle glowing background accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="flex flex-col gap-6 items-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-semibold w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Precision Vehicle Management System
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Manage Your Inventory With{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Apex Authority
              </span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
              Track stock, update listings in real time, and streamline vehicle purchases with a high-performance admin controls system. Engineered for dealerships requiring speed, reliability, and precision.
            </p>
            <div className="flex flex-wrap gap-4 mt-2 justify-center">
              <Link
                to={token ? "/dashboard" : "/register"}
                className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
              <Link
                to={token ? "/dashboard" : "/login"}
                className="px-6 py-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold transition-all hover:bg-slate-900/60"
              >
                Explore Inventory
              </Link>
            </div>
          </div>

        </section>

        {/* Feature Grid */}
        <section className="border-t border-slate-900 bg-slate-950 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Built For Modern Automotive Dealerships
              </h2>
              <p className="mt-4 text-slate-400 text-sm">
                Powering operations with intuitive workflows, role-based controls, and absolute visibility.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl border border-slate-900 bg-gradient-to-b from-slate-900/50 to-slate-950 hover:border-slate-800 hover:from-slate-900 hover:to-slate-950 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Fast Search & Filters</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Instantly lookup cars by make, model, type, or price range. Find exact matches within seconds.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl border border-slate-900 bg-gradient-to-b from-slate-900/50 to-slate-950 hover:border-slate-800 hover:from-slate-900 hover:to-slate-950 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Instant Sales System</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Purchase vehicles with a single click, instantly decrementing inventory stock counts. Zero-quantity protection.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl border border-slate-900 bg-gradient-to-b from-slate-900/50 to-slate-950 hover:border-slate-800 hover:from-slate-900 hover:to-slate-950 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-slate-950 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Granular Role Security</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Separate standard user privileges from administrative actions like adding, editing, or restocking cars.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <div>© {new Date().getFullYear()} ApexMotors Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
