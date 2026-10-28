import React, { useState } from 'react';
import { Heart, MapPin, Home, Banknote, Sparkles, ChevronLeft, ChevronRight, Calculator, CheckCircle2, Camera } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
  onSelectProperty,
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const getConditionBadge = (level: string) => {
    switch (level) {
      case 'ready_to_move':
        return { label: '即入居可能', color: 'bg-emerald-600 text-white' };
      case 'minor_repair':
        return { label: '軽微な補修で利用可', color: 'bg-teal-600 text-white' };
      case 'major_renovation':
        return { label: 'リノベーション推奨', color: 'bg-amber-600 text-white' };
      case 'as_is':
      default:
        return { label: '現況渡し', color: 'bg-stone-600 text-white' };
    }
  };

  const cond = getConditionBadge(property.conditionLevel);
  const hasImages = property.images && property.images.length > 0;

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasImages) return;
    setCurrentImgIndex(prev => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasImages) return;
    setCurrentImgIndex(prev => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group cursor-pointer"
      onClick={() => onSelectProperty(property)}
    >
      {/* Image Gallery Container */}
      <div className="relative aspect-16/10 bg-gradient-to-br from-stone-100 to-stone-200/80 overflow-hidden flex items-center justify-center border-b border-stone-200">
        {hasImages ? (
          <>
            <img
              src={property.images[currentImgIndex] || property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            
            {/* Photo caption label */}
            {property.imageLabels && property.imageLabels[currentImgIndex] && (
              <div className="absolute top-12 left-3 px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-xs text-white text-[10px] font-medium max-w-[220px] truncate shadow-xs">
                📷 {property.imageLabels[currentImgIndex]}
              </div>
            )}

            {/* Price Badge Overlay at bottom-left */}
            <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
              {property.price === 0 ? (
                <span className="px-3 py-1 rounded-xl bg-amber-500 text-stone-950 font-black text-sm sm:text-base shadow-md flex items-center gap-1">
                  <span>0円</span>
                  <span className="text-[10px] font-bold bg-stone-950 text-amber-300 px-1.5 py-0.2 rounded">無償譲渡</span>
                </span>
              ) : property.bankTransactionType === '賃貸' || property.tags.some(t => t.includes('賃貸')) ? (
                <span className="px-3 py-1 rounded-xl bg-emerald-900/90 text-amber-300 font-black text-sm sm:text-base shadow-md backdrop-blur-xs flex items-center gap-1">
                  <span>月額 {(property.monthlyRent || property.price).toLocaleString()}円</span>
                  <span className="text-[10px] font-bold text-emerald-200">賃貸</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-xl bg-stone-950/90 text-amber-300 font-black text-sm sm:text-base shadow-md backdrop-blur-xs flex items-center gap-1">
                  <span>{(property.price / 10000).toLocaleString()}万円</span>
                  <span className="text-[10px] font-bold text-stone-300">売買</span>
                </span>
              )}
            </div>

            {/* Photo count indicator at bottom-right */}
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/65 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
              <Camera className="w-3 h-3 text-amber-300" />
              <span>{currentImgIndex + 1}/{property.images.length}</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-stone-400 group-hover:text-stone-600 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-white/80 border border-stone-200/70 shadow-xs flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6 text-stone-400" />
            </div>
            <span className="text-xs font-bold text-stone-600 tracking-wide">写真未掲載</span>
            <span className="text-[10px] text-stone-400 mt-0.5">※ 詳細スペック・現況情報を掲載中</span>
          </div>
        )}

        {/* Carousel overlay controls */}
        {hasImages && property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="前の画像"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              aria-label="次の画像"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className={`px-2.5 py-0.8 font-bold text-xs rounded-lg shadow-md flex items-center gap-1 ${cond.color}`}>
            <Home className="w-3.5 h-3.5" />
            {cond.label}
          </span>

          <span className="px-2 py-0.5 bg-emerald-950/85 text-amber-200 font-bold text-[10px] rounded-md backdrop-blur-xs shadow-xs">
            {property.registrationNumber ? property.registrationNumber.replace('日南市空き家バンク登録 ', '') : '空き家バンク'}
          </span>

          <span className="px-2 py-0.5 bg-amber-400 text-stone-950 font-black text-[9px] rounded-md backdrop-blur-xs shadow-xs flex items-center gap-0.5">
            <CheckCircle2 className="w-2.5 h-2.5 text-stone-950" />
            <span>公式実写写真</span>
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          aria-label={isFavorite ? 'キープから削除' : 'キープに追加'}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/85 hover:bg-white text-stone-700 shadow-sm transition backdrop-blur-xs cursor-pointer z-10"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-stone-600'}`}
          />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Title */}
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800 mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">{property.address}</span>
          </div>

          <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug mb-2.5 group-hover:text-emerald-800 transition-colors line-clamp-2">
            {property.title}
          </h3>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-xl mb-3 border border-stone-100">
            <div>
              <span className="text-stone-400 block text-[10px]">間取り</span>
              <span className="font-bold text-stone-800">{property.layout}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px]">延床 / 敷地面積</span>
              <span className="font-bold text-stone-800">{property.buildingArea}㎡ / {property.landArea}㎡ ({Math.round(property.landArea * 0.3025)}坪)</span>
            </div>
            <div className="pt-1.5 border-t border-stone-200/50">
              <span className="text-stone-400 block text-[10px]">構造・築年</span>
              <span className="font-semibold text-stone-700">{property.structure.split('（')[0]} / {property.builtYear}年</span>
            </div>
            <div className="pt-1.5 border-t border-stone-200/50">
              <span className="text-stone-400 block text-[10px]">駐車場</span>
              <span className="font-semibold text-stone-700">{property.parking.split('（')[0]}</span>
            </div>
          </div>

          {/* Subsidy & Condition Highlight */}
          <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-2.5 mb-3 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-950 font-bold truncate">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">{property.conditionText}</span>
            </div>
            <div className="text-[11px] text-emerald-800 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>日南市補助金：最大{Math.round(property.availableSubsidy / 10000)}万円活用対象</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {property.tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[11px] font-medium rounded-md"
              >
                #{tag}
              </span>
            ))}
            {property.tags.length > 4 && (
              <span className="text-[10px] text-stone-400 self-center">+{property.tags.length - 4}</span>
            )}
          </div>
        </div>

        {/* Card Footer Button */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div className="text-xs text-stone-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>再建築可・内見可</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProperty(property);
            }}
            className="px-3.5 py-1.5 bg-stone-900 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <span>写真と詳細を見る</span>
          </button>
        </div>
      </div>
    </div>
  );
};
