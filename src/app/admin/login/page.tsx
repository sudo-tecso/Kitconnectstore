'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Key, Eye, EyeOff, LogIn, Fingerprint, Building } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication: accept any non-empty input and redirect
    if (adminId && password) {
      router.push('/admin');
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex items-center justify-center font-body-md overflow-hidden relative">
      {/* Ambient Background Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[rgba(47,111,255,0.05)] via-background to-background pointer-events-none z-0"></div>
      
      <main className="relative z-10 w-full max-w-md px-edge-margin sm:px-0">
        {/* Auth Container */}
        <div className="bg-graphite-1 rounded-xl border border-border-line overflow-hidden relative">
          {/* Decorative Trace Line */}
          <div className="h-[2px] w-full trace-bg trace-glow absolute top-0 left-0"></div>
          
          <div className="p-component-padding sm:p-stack-gap flex flex-col space-y-stack-gap">
            {/* Header */}
            <div className="text-center space-y-tight-gap">
              <div className="w-12 h-12 rounded-full bg-graphite-2 border border-border-line mx-auto flex items-center justify-center mb-4 relative shadow-[0_0_15px_rgba(47,111,255,0.1)]">
                <Lock className="w-5 h-5 text-primary" />
                {/* Subtle pulse indicator for secure connection */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full pulse-shadow"></div>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">PRECISION ENGINE</h1>
              <p className="font-eyebrow-mono text-eyebrow-mono text-slate uppercase tracking-[3px]">KitConnect Secure Access</p>
            </div>
            
            {/* Form */}
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-1">
                <label className="font-micro-mono text-micro-mono text-slate uppercase block ml-1" htmlFor="admin-id">Administrator ID</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-dim w-4 h-4" />
                  <input 
                    className="w-full bg-graphite-2 border border-border-line rounded-lg py-3 pl-10 pr-4 text-on-surface font-data-mono text-data-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                    id="admin-id" 
                    placeholder="SYS-ADMIN-001" 
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-micro-mono text-micro-mono text-slate uppercase block ml-1" htmlFor="security-key">Security Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-dim w-4 h-4" />
                  <input 
                    className="w-full bg-graphite-2 border border-border-line rounded-lg py-3 pl-10 pr-4 text-on-surface font-data-mono text-data-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                    id="security-key" 
                    placeholder="••••••••••••••••" 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-dim hover:text-on-surface transition-colors" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {/* Actions */}
              <div className="pt-4 space-y-3">
                <button 
                  className="w-full bg-primary-container text-white font-label-ui text-label-ui py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:opacity-80 transition-opacity" 
                  type="submit"
                >
                  <LogIn className="w-4 h-4" />
                  Authenticate Session
                </button>
                
                <div className="flex gap-3">
                  <button className="flex-1 bg-transparent border border-border-line text-on-surface font-label-ui text-label-ui py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors" type="button">
                    <Fingerprint className="w-4 h-4" />
                    Biometric
                  </button>
                  <button className="flex-1 bg-transparent border border-border-line text-on-surface font-label-ui text-label-ui py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors" type="button">
                    <Building className="w-4 h-4" />
                    SSO
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          {/* Footer Status */}
          <div className="bg-surface-container-low px-component-padding py-3 border-t border-border-line flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="font-micro-mono text-micro-mono text-slate">Systems Normal</span>
            </div>
            <a className="font-micro-mono text-micro-mono text-primary hover:underline" href="#">Support Protocol</a>
          </div>
        </div>
        
        {/* Decorative Tech Details below auth */}
        <div className="mt-4 flex justify-between px-2 font-micro-mono text-micro-mono text-slate-dim opacity-50">
          <span>NODE: KC-AUTH-04</span>
          <span>ENCRYPTION: AES-256-GCM</span>
        </div>
      </main>
    </div>
  );
}
