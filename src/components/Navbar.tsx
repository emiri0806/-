import React from 'react';
import { MapPin, Sun, Building2 } from 'lucide-react';

interface NavbarProps {
  favoriteCount?: number;
  totalPropertiesCount: number;
  onOpenAkiyaBankSync?: () => void;
  lastSyncTime?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalPropertiesCount,
  onOpenAkiyaBankSync
}) => {
  return (
    <header id="main-header" className="h-14 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs z-30 shrink-0 px-3 sm:px-6 flex items-center justify-between">
      {/* Brand Logo & Tagline */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-900 text-white flex items-center justify-center font-bold text-base shadow-sm border border-emerald-600">
          <MapPin className="w-4 h-4 text-amber-300" />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="font-black text-stone-950 text-sm sm:text-base tracking-tight">
            日南市 空き家マップ
          </h1>
          <span className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-black bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 items-center gap-1">
            <Sun className="w-3 h-3 text-amber-500" />
            日南市域特化
          </span>
          <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-50 text-amber-900 rounded-full border border-amber-200">
            掲載 {totalPropertiesCount} 件
          </span>
        </div>
      </div>

      {/* Right side: Nichinan Akiya Bank Pull / Sync & Status */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs text-stone-600">
        {onOpenAkiyaBankSync && (
          <button
            onClick={onOpenAkiyaBankSync}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-600 hover:scale-105 active:scale-95"
            title="日南市公式空き家バンクから最新情報を引っ張る・同期する"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden xs:inline">空き家バンク連携</span>
            <span className="xs:hidden">バンク</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/80 text-[10px] font-bold">
              取得済
            </span>
          </button>
        )}

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>🛰️ リアル衛星写真表示中</span>
        </div>
      </div>
    </header>
  );
};

