import React from 'react';
import { Search, Filter, X, ArrowUpDown, Tag, Sparkles } from 'lucide-react';
import { PropertyFilter } from '../types';
import { NICHINAN_DISTRICTS_LIST } from '../data/mockProperties';

interface FilterBarProps {
  filter: PropertyFilter;
  setFilter: React.Dispatch<React.SetStateAction<PropertyFilter>>;
  resultCount: number;
}

const POPULAR_TAGS = [
  '格安古民家',
  '飫肥城下町',
  '油津港町',
  '南郷町',
  '北郷町',
  '平屋',
  '海が見える',
  'サーフィン',
  '菜園付き',
  '武家屋敷',
  '蔵付き',
  '店舗付き',
  '温泉近く',
  '坂元棚田',
  'みかん果樹園'
];

export const FilterBar: React.FC<FilterBarProps> = ({ filter, setFilter, resultCount }) => {
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, keyword: e.target.value }));
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(prev => ({ ...prev, prefecture: e.target.value }));
  };

  const handlePricePreset = (maxPrice: number) => {
    setFilter(prev => ({
      ...prev,
      maxPrice,
      onlyZeroYen: false
    }));
  };

  const toggleTag = (tag: string) => {
    setFilter(prev => {
      const exists = prev.selectedTags.includes(tag);
      const updated = exists
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag];
      return { ...prev, selectedTags: updated };
    });
  };

  const resetFilters = () => {
    setFilter({
      keyword: '',
      prefecture: 'すべて',
      maxPrice: 15000000,
      onlyZeroYen: false,
      selectedTags: [],
      condition: 'all',
      sortBy: 'newest'
    });
  };

  const hasActiveFilters =
    filter.keyword !== '' ||
    filter.prefecture !== 'すべて' ||
    filter.maxPrice < 15000000 ||
    filter.selectedTags.length > 0;

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs mb-6 transition-all">
      {/* Top Search Line & Sort */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-4">
        {/* Search Keyword */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            id="property-search-input"
            value={filter.keyword}
            onChange={handleKeywordChange}
            placeholder="日南市内の条件・地区で検索（例：飫肥、油津、南郷、北郷、平屋、サーフィン、果樹園）"
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition"
          />
          {filter.keyword && (
            <button
              onClick={() => setFilter(prev => ({ ...prev, keyword: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* District Select */}
        <div className="w-full md:w-60">
          <select
            id="prefecture-select"
            value={filter.prefecture}
            onChange={handleDistrictChange}
            className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer font-bold"
          >
            <option value="すべて">日南市 全域</option>
            {NICHINAN_DISTRICTS_LIST.filter(d => d !== 'すべて').map(d => (
              <option key={d} value={d.split('（')[0]}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="w-full md:w-48 flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1">
          <ArrowUpDown className="w-4 h-4 text-stone-500 shrink-0" />
          <select
            id="sort-select"
            value={filter.sortBy}
            onChange={e => setFilter(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="w-full py-1.5 bg-transparent text-stone-800 text-sm focus:outline-none cursor-pointer"
          >
            <option value="newest">新着順</option>
            <option value="area_desc">敷地面積が広い順</option>
            <option value="built_desc">築年が新しい順</option>
          </select>
        </div>
      </div>

      {/* Quick Condition Presets */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-stone-100">
        <span className="text-xs font-bold text-stone-500 mr-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          物件タイプ・状態:
        </span>
        <button
          onClick={() => setFilter(prev => ({ ...prev, condition: 'all' }))}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            filter.condition === 'all'
              ? 'bg-stone-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          すべての物件
        </button>
        <button
          onClick={() => setFilter(prev => ({ ...prev, condition: 'minor_repair' }))}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            filter.condition === 'minor_repair'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          軽微な補修で入居可
        </button>
        <button
          onClick={() => setFilter(prev => ({ ...prev, condition: 'ready_to_move' }))}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            filter.condition === 'ready_to_move'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
          }`}
        >
          即入居可能
        </button>
        <button
          onClick={() => setFilter(prev => ({ ...prev, condition: 'major_renovation' }))}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            filter.condition === 'major_renovation'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
          }`}
        >
          リノベ推奨
        </button>
      </div>

      {/* Tag Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 pt-3">
        <span className="text-xs font-bold text-stone-500 mr-1 flex items-center gap-1">
          <Tag className="w-3 h-3" />
          日南の人気テーマ:
        </span>
        {POPULAR_TAGS.map(tag => {
          const isSelected = filter.selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              #{tag}
            </button>
          );
        })}
      </div>

      {/* Filter Status / Reset */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>
            日南市内 <strong className="text-stone-900 font-extrabold">{resultCount} 件</strong> の物件がヒット
          </span>
          <button
            onClick={resetFilters}
            className="text-stone-500 hover:text-stone-800 underline font-medium flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            絞り込みをすべて解除
          </button>
        </div>
      )}
    </div>
  );
};
