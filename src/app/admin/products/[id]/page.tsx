'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  CloudUpload, 
  Check, 
  ImagePlus 
} from 'lucide-react';

export default function ProductEditPage() {
  const [specs, setSpecs] = useState([
    { property: 'Architecture', value: '64-bit RISC-V' },
    { property: '', value: '' },
  ]);

  const addSpec = () => {
    setSpecs([...specs, { property: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, key: 'property' | 'value', val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][key] = val;
    setSpecs(newSpecs);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex font-body-md">
      {/* TopAppBar */}
      <header className="bg-graphite-1 w-full h-16 border-b border-border-line flex justify-between items-center px-edge-margin fixed top-0 z-50">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products" className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-label-ui text-label-ui">Back to Inventory</span>
          </Link>
          <div className="w-px h-6 bg-border-line mx-4"></div>
          <h1 className="font-display text-headline-md font-bold text-primary tracking-tighter">PRECISION ENGINE</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 border border-border-line text-on-surface rounded-lg font-label-ui text-label-ui hover:bg-surface-variant transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 bg-primary-container text-white rounded-lg font-label-ui text-label-ui hover:bg-inverse-primary transition-colors flex items-center gap-2">
            <Save className="w-[18px] h-[18px]" />
            Save Product
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="mt-16 w-full max-w-container-max mx-auto p-edge-margin lg:p-section-gap flex flex-col lg:flex-row gap-stack-gap">
        {/* Left Side: Product Details */}
        <div className="w-full lg:w-2/3 flex flex-col space-y-stack-gap">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">New Product Registration</h2>
            <div className="h-[2px] w-32 mb-6 bg-gradient-to-r from-primary to-transparent shadow-[0_0_8px_rgba(47,111,255,0.08)]"></div>
            <p className="text-on-surface-variant font-body-lg text-body-lg">
              Enter the technical specifications and identification details for the new hardware component.
            </p>
          </div>

          {/* Details Form Card */}
          <div className="bg-graphite-2 border border-border-line rounded-xl p-component-padding space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-grid-gutter">
              <div className="flex flex-col space-y-2">
                <label className="font-micro-mono text-micro-mono text-slate uppercase tracking-wider">Product Name</label>
                <input 
                  type="text"
                  placeholder="e.g., Quantum Processor Node"
                  className="bg-surface border border-border-line rounded-lg px-4 py-3 text-on-surface font-body-md focus:shadow-[0_0_0_2px_rgba(96,139,255,0.2)] focus:border-primary-container outline-none transition-all w-full placeholder-slate-dim"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-micro-mono text-micro-mono text-slate uppercase tracking-wider">SKU / Identifier</label>
                <input 
                  type="text"
                  placeholder="QPN-2024-X"
                  className="bg-surface border border-border-line rounded-lg px-4 py-3 text-on-surface font-data-mono text-data-mono focus:shadow-[0_0_0_2px_rgba(96,139,255,0.2)] focus:border-primary-container outline-none transition-all w-full placeholder-slate-dim uppercase"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col space-y-2">
              <label className="font-micro-mono text-micro-mono text-slate uppercase tracking-wider">Technical Description</label>
              <textarea 
                rows={4}
                placeholder="Detailed component overview and functional description..."
                className="bg-surface border border-border-line rounded-lg px-4 py-3 text-on-surface font-body-md focus:shadow-[0_0_0_2px_rgba(96,139,255,0.2)] focus:border-primary-container outline-none transition-all w-full placeholder-slate-dim resize-none"
              ></textarea>
            </div>

            {/* Specs */}
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Hardware Specifications</h3>
              <div className="space-y-4">
                {specs.map((spec, index) => (
                  <div key={index} className="flex items-center gap-4 bg-surface p-4 rounded-lg border border-border-line focus-within:border-primary-container transition-colors">
                    <div className="flex-1 flex flex-col space-y-1">
                      <label className="font-micro-mono text-micro-mono text-slate uppercase">Property</label>
                      <input 
                        type="text"
                        value={spec.property}
                        onChange={(e) => updateSpec(index, 'property', e.target.value)}
                        placeholder={index === 0 ? "Form Factor" : "e.g., Clock Speed"}
                        className="bg-transparent border-none text-on-surface font-body-md outline-none w-full p-0 focus:ring-0"
                      />
                    </div>
                    <div className="w-px h-8 bg-border-line"></div>
                    <div className="flex-1 flex flex-col space-y-1">
                      <label className="font-micro-mono text-micro-mono text-slate uppercase">Value</label>
                      <input 
                        type="text"
                        value={spec.value}
                        onChange={(e) => updateSpec(index, 'value', e.target.value)}
                        placeholder={index === 0 ? "e.g., ATX" : "e.g., 4.2 GHz"}
                        className="bg-transparent border-none text-on-surface font-data-mono text-data-mono outline-none w-full p-0 focus:ring-0"
                      />
                    </div>
                    <button 
                      onClick={() => removeSpec(index)}
                      className={`text-slate-dim hover:text-error transition-colors p-2 ${specs.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={specs.length === 1}
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={addSpec}
                  className="w-full py-3 border border-dashed border-border-line rounded-lg text-slate hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2 font-label-ui text-label-ui"
                >
                  <Plus className="w-[18px] h-[18px]" />
                  Add Specification Row
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Imagery, Price, Inventory */}
        <div className="w-full lg:w-1/3 flex flex-col space-y-stack-gap">
          {/* Image Upload Card */}
          <div className="bg-graphite-2 border border-border-line rounded-xl p-component-padding space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-on-surface">Visual Assets</h3>
              <span className="bg-surface-variant text-on-surface-variant font-caption text-caption px-2 py-1 rounded-full">Max 5</span>
            </div>
            
            {/* Main Upload Area */}
            <div className="border-2 border-dashed border-border-line rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary-container hover:bg-surface transition-all group relative overflow-hidden">
              <div className="w-12 h-12 bg-graphite-1 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10">
                <CloudUpload className="w-6 h-6 text-slate group-hover:text-primary" />
              </div>
              <p className="font-label-ui text-label-ui text-on-surface mb-1 relative z-10">Drag & Drop schematics</p>
              <p className="font-caption text-caption text-slate relative z-10">or click to browse local files (.png, .jpg, .svg)</p>
              {/* Ambient Glow effect on hover */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,111,255,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-tight-gap overflow-x-auto pb-2 custom-scrollbar">
              <div className="w-16 h-16 rounded-lg bg-surface border border-primary-container relative flex-shrink-0 group overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP8Ys86u8SdkwRzDJqHov6_L4rBqW7DDFc1JV6hKaicdrx6XimsVXbJUwtD_nBc-wTwijNdFPDefzbweuX0K-2Rm83n7QPyRdPnG0VsBLnQCe7biDW4TGjSyjeXFWuBR6yBW7puDl36nL0OzQaQd2kMNXxp35mVvfbQY_mgaw4rmVVIIeLiuZ2zLH_WQwNhArB_HxNBecWlYbKNF68XxZkGeDY_hK1MB6hQ6Gc3eA__NMZzhP6KXYTAA" 
                  alt="Microchip processor" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                />
                <div className="absolute top-1 right-1 w-4 h-4 bg-primary-container rounded-full flex items-center justify-center">
                  <Check className="w-[10px] h-[10px] text-white" />
                </div>
              </div>
              <div className="w-16 h-16 rounded-lg bg-surface border border-border-line relative flex-shrink-0 group flex items-center justify-center text-slate hover:border-slate-dim cursor-pointer">
                <ImagePlus className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory Card */}
          <div className="bg-graphite-2 border border-border-line rounded-xl p-component-padding space-y-6">
            <h3 className="font-headline-md text-headline-md text-on-surface">Economics & Stock</h3>
            
            <div className="flex flex-col space-y-2">
              <label className="font-micro-mono text-micro-mono text-slate uppercase tracking-wider">Unit Price (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-dim font-data-mono">$</span>
                <input 
                  type="number"
                  placeholder="0.00"
                  className="bg-surface border border-border-line rounded-lg pl-8 pr-4 py-3 text-on-surface font-data-mono text-data-mono focus:shadow-[0_0_0_2px_rgba(96,139,255,0.2)] focus:border-primary-container outline-none transition-all w-full placeholder-slate-dim"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-micro-mono text-micro-mono text-slate uppercase tracking-wider">Initial Stock Allocation</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  placeholder="0"
                  className="bg-surface border border-border-line rounded-lg px-4 py-3 text-on-surface font-data-mono text-data-mono focus:shadow-[0_0_0_2px_rgba(96,139,255,0.2)] focus:border-primary-container outline-none transition-all w-full placeholder-slate-dim"
                />
                <span className="text-on-surface-variant font-body-md whitespace-nowrap bg-surface px-4 py-3 rounded-lg border border-border-line">Units</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2 pt-4 border-t border-border-line">
              <label className="font-micro-mono text-micro-mono text-slate uppercase tracking-wider">Status Flag</label>
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-surface-variant border border-border-line text-on-surface font-label-ui text-label-ui hover:bg-surface-bright transition-colors">
                  Draft
                </button>
                <button className="flex-1 py-2 rounded-lg bg-primary-container/20 border border-primary-container text-primary font-label-ui text-label-ui relative overflow-hidden group">
                  <span className="relative z-10">Active</span>
                  <div className="absolute inset-0 bg-primary-container/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #121315; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #343537; 
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #5B5F66; 
        }
      `}</style>
    </div>
  );
}
