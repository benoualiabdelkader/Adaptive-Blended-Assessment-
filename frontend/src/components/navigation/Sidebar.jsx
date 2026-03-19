import React from 'react';

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col z-40 bg-[#141b2e] w-20 md:w-64 border-none pt-16">
      <div className="p-4 mb-4 border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-[#c0c1ff]">biotech</span>
          </div>
          <div className="hidden md:block">
            <p className="text-lg font-mono text-[#c0c1ff] leading-tight">Pipeline</p>
            <p className="font-mono uppercase tracking-widest text-[10px] text-slate-500">12-Station Analytics</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-2 space-y-1">
        {/* Navigation Items */}
        <div className="flex items-center gap-3 p-3 text-slate-500 hover:bg-[#181f32]/50 cursor-pointer transition-colors">
          <span className="material-symbols-outlined">assignment</span>
          <span className="hidden md:block font-mono uppercase tracking-widest text-[10px]">Context</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-[#181f32] text-[#c0c1ff] border-l-4 border-[#c0c1ff] cursor-pointer">
          <span className="material-symbols-outlined">database</span>
          <span className="hidden md:block font-mono uppercase tracking-widest text-[10px]">Data Streams</span>
        </div>
        <div className="flex items-center gap-3 p-3 text-slate-500 hover:bg-[#181f32]/50 cursor-pointer transition-colors">
          <span className="material-symbols-outlined">abc</span>
          <span className="hidden md:block font-mono uppercase tracking-widest text-[10px]">Lexical</span>
        </div>
        <div className="flex items-center gap-3 p-3 text-slate-500 hover:bg-[#181f32]/50 cursor-pointer transition-colors">
          <span className="material-symbols-outlined">account_tree</span>
          <span className="hidden md:block font-mono uppercase tracking-widest text-[10px]">Syntactic</span>
        </div>
        <div className="flex items-center gap-3 p-3 text-slate-500 hover:bg-[#181f32]/50 cursor-pointer transition-colors">
          <span className="material-symbols-outlined">psychology</span>
          <span className="hidden md:block font-mono uppercase tracking-widest text-[10px]">Semantic</span>
        </div>
        <div className="flex items-center gap-3 p-3 text-slate-500 hover:bg-[#181f32]/50 cursor-pointer transition-colors">
          <span className="material-symbols-outlined">link</span>
          <span className="hidden md:block font-mono uppercase tracking-widest text-[10px]">Cohesion</span>
        </div>
      </nav>
      
      <div className="p-4 mt-auto border-t border-outline-variant/10">
        <button className="w-full bg-[#c0c1ff] text-[#0d0096] font-label text-xs uppercase tracking-widest py-3 font-bold rounded-sm hover:opacity-90 transition-opacity">
          Execute Analysis
        </button>
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-2 text-slate-500 hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">help</span>
            <span className="hidden md:block font-mono uppercase tracking-widest text-[8px]">Documentation</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
