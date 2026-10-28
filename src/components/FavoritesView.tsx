import React from 'react';
import { Heart, Trash2, ArrowRight, CheckCircle2, Calculator, ExternalLink } from 'lucide-react';
import { Property } from '../types';

interface FavoritesViewProps {
  favoriteProperties: Property[];
  onSelectProperty: (property: Property) => void;
  onToggleFavorite: (id: string) => void;
  onNavigateToSearch: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteProperties,
  onSelectProperty,
  onToggleFavorite,
  onNavigateToSearch,
}) => {
  if (favoriteProperties.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-stone-900 mb-2">
          キープ保存された物件はありません
        </h2>
        <p className="text-stone-500 text-xs mb-6 max-w-md mx-auto">
          気になる空き家・古民家物件を見つけたら「キープ保存」ボタンを押してください。ここで比較・検討できます。
        </p>
        <button
          onClick={onNavigateToSearch}
          className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition cursor-pointer"
        >
          物件を探しに行く
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-1">
            Saved Properties
          </span>
          <h2 className="text-xl font-extrabold text-stone-900">
            キープ物件一覧・横並び比較 ({favoriteProperties.length}件)
          </h2>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-x-auto p-6">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-stone-200 text-stone-400">
              <th className="p-3 w-44 font-bold">項目</th>
              {favoriteProperties.map(p => (
                <th key={p.id} className="p-3 font-bold text-stone-900 min-w-[220px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{p.address}</span>
                    <button
                      onClick={() => onToggleFavorite(p.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {/* Image Row */}
            <tr>
              <td className="p-3 font-bold text-stone-500 bg-stone-50/50">写真</td>
              {favoriteProperties.map(p => (
                <td key={p.id} className="p-3">
                  <div className="aspect-16/10 rounded-xl overflow-hidden bg-stone-100">
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </td>
              ))}
            </tr>

            {/* Title Row */}
            <tr>
              <td className="p-3 font-bold text-stone-500 bg-stone-50/50">物件名</td>
              {favoriteProperties.map(p => (
                <td key={p.id} className="p-3 font-extrabold text-stone-900 leading-snug">
                  {p.title}
                </td>
              ))}
            </tr>

            {/* Price Row */}
            <tr>
              <td className="p-3 font-bold text-stone-500 bg-stone-50/50">取得価格</td>
              {favoriteProperties.map(p => (
                <td key={p.id} className="p-3 font-extrabold text-amber-800 text-sm">
                  {p.price === 0 ? '0円 (無償譲渡)' : `${(p.price / 10000).toLocaleString()}万円`}
                </td>
              ))}
            </tr>

            {/* Renovation Estimate Row */}
            <tr>
              <td className="p-3 font-bold text-stone-500 bg-stone-50/50">改修見込み額</td>
              {favoriteProperties.map(p => (
                <td key={p.id} className="p-3 font-bold text-stone-800">
                  約 {(p.estimatedRenovationCost / 10000).toLocaleString()} 万円
                </td>
              ))}
            </tr>

            {/* Subsidy Row */}
            <tr>
              <td className="p-3 font-bold text-stone-500 bg-stone-50/50">自治体補助金</td>
              {favoriteProperties.map(p => (
                <td key={p.id} className="p-3 font-bold text-emerald-800">
                  最大 {(p.availableSubsidy / 10000).toLocaleString()} 万円
                </td>
              ))}
            </tr>

            {/* Specs Row */}
            <tr>
              <td className="p-3 font-bold text-stone-500 bg-stone-50/50">築年数・構造</td>
              {favoriteProperties.map(p => (
                <td key={p.id} className="p-3 text-stone-700">
                  築{new Date().getFullYear() - p.builtYear}年 / {p.structure} ({p.layout})
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr>
              <td className="p-3 font-bold text-stone-500 bg-stone-50/50">操作</td>
              {favoriteProperties.map(p => (
                <td key={p.id} className="p-3">
                  <button
                    onClick={() => onSelectProperty(p)}
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    詳細・試算を開く
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
