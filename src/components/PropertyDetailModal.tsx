import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Home,
  Heart,
  Calculator,
  Hammer,
  Banknote,
  Sparkles,
  Info,
  CheckCircle,
  Clock,
  Send,
  PhoneCall,
  UserCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Building,
  Camera,
  Wifi,
  GraduationCap,
  Car,
  Compass,
  FileText,
  HelpCircle,
  Eye,
  ShieldCheck,
  FileCheck,
  Coins
} from 'lucide-react';
import { Property, RenovationOption } from '../types';
import { RENOVATION_CATALOG } from '../data/mockProperties';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenAiWithProperty: (property: Property, initialQuestion?: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenAiWithProperty,
}) => {
  if (!property) return null;

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedRenovations, setSelectedRenovations] = useState<Record<string, { selected: boolean; mode: 'pro' | 'diy' }>>(() => {
    // Initial selection based on recommended
    const initial: Record<string, { selected: boolean; mode: 'pro' | 'diy' }> = {};
    RENOVATION_CATALOG.forEach(item => {
      initial[item.id] = {
        selected: item.recommended,
        mode: item.isDiyPossible ? 'diy' : 'pro'
      };
    });
    return initial;
  });

  const [useSubsidy, setUseSubsidy] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'renovation' | 'inquiry'>('details');

  // Viewing Reservation Form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    message: ''
  });

  // Calculate customized renovation total
  const calculatedRenovationTotal = Object.entries(selectedRenovations).reduce((acc, [id, config]) => {
    const cfg = config as { selected: boolean; mode: 'pro' | 'diy' };
    if (!cfg.selected) return acc;
    const item = RENOVATION_CATALOG.find(r => r.id === id);
    if (!item) return acc;
    return acc + (cfg.mode === 'diy' ? item.diyEstimate : item.proEstimate);
  }, 0);

  const appliedSubsidyAmount = useSubsidy ? property.availableSubsidy : 0;
  const grandTotalEstimate = Math.max(0, property.price + calculatedRenovationTotal - appliedSubsidyAmount);

  const handleToggleRenovation = (id: string) => {
    setSelectedRenovations(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        selected: !prev[id]?.selected
      }
    }));
  };

  const handleModeChange = (id: string, mode: 'pro' | 'diy') => {
    setSelectedRenovations(prev => ({
      ...prev,
      [id]: {
        selected: true,
        mode
      }
    }));
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const hasImages = property.images && property.images.length > 0;

  return (
    <div id="property-detail-modal" className="fixed inset-0 z-[99999] bg-stone-100 flex flex-col overflow-hidden animate-fadeIn select-text">
      {/* Top Navigation Bar: Easy Return to Map */}
      <div className="px-3 sm:px-6 py-3 border-b border-stone-200 flex items-center justify-between bg-white shadow-xs sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-95 text-white font-extrabold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="地図画面に戻る"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            <span>← 地図に戻る</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
              物件No. {property.id.toUpperCase()}
            </span>
            <span className="text-xs text-stone-500 font-bold hidden sm:inline-block max-w-sm truncate">
              {property.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(property.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
            <span>{isFavorite ? 'キープ中' : 'キープ保存'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition cursor-pointer"
            title="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Full-Page Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-stone-100 p-2 sm:p-5 md:p-7">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-4 sm:p-7 md:p-8 shadow-sm border border-stone-200 space-y-6">
          {/* Main Title & Price Row */}
          <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{property.address}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-semibold">
                  {property.structure.split('（')[0]}
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${property.coordinates?.lat || property.lat || 31.6289},${property.coordinates?.lng || property.lng || 131.3542}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-bold border border-sky-200 transition shadow-2xs"
                  title="Google Mapsでリアルな現地の3D航空写真・ストリートビューを表示"
                >
                  <ExternalLink className="w-3 h-3 text-sky-600" />
                  <span>Google 3D・現地ストリートビュー</span>
                </a>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight mb-3">
                {property.title}
              </h1>

              {/* Price & Financial Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-stone-900 text-white p-3 rounded-xl border border-stone-800">
                  <span className="text-[10px] text-stone-400 font-bold block">物件価格 / 譲渡金</span>
                  <div className="text-lg sm:text-xl font-black text-amber-300 mt-0.5 truncate">
                    {property.price === 0
                      ? '0円（無償譲渡）'
                      : property.bankTransactionType === '賃貸'
                      ? `月額 ${(property.monthlyRent || property.price).toLocaleString()}円`
                      : `${(property.price / 10000).toLocaleString()}万円`}
                  </div>
                  <span className="text-[10px] text-stone-400 block mt-0.5">{property.bankTransactionType || '売買'}</span>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold block">推定リフォーム概算</span>
                  <div className="text-base sm:text-lg font-black text-stone-900 mt-0.5">
                    約 {(property.estimatedRenovationCost / 10000).toLocaleString()} 万円
                  </div>
                  <span className="text-[10px] text-stone-500 block mt-0.5">水回り・外壁点検等</span>
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-bold block">日南市移住改修補助金</span>
                  <div className="text-base sm:text-lg font-black text-emerald-900 mt-0.5">
                    最大 {Math.round(property.availableSubsidy / 10000)} 万円
                  </div>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">空き家バンク交付対象</span>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <span className="text-[10px] text-amber-900 font-bold block">実質自己負担目安</span>
                  <div className="text-base sm:text-lg font-black text-amber-950 mt-0.5">
                    約 {Math.max(0, Math.round((property.price + property.estimatedRenovationCost - property.availableSubsidy) / 10000)).toLocaleString()} 万円
                  </div>
                  <span className="text-[10px] text-amber-800 block mt-0.5">※ 補助金適用後試算</span>
                </div>
              </div>
            </div>

            {/* Official Akiya Bank Registration Widget */}
            <div className="bg-gradient-to-br from-stone-900 to-emerald-950 text-white p-4 rounded-2xl shrink-0 min-w-[240px] shadow-sm flex flex-col justify-center border border-emerald-900/40">
              <div className="flex items-center justify-between text-stone-300 text-xs font-semibold pb-1.5 border-b border-stone-800">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>日南市公式空き家バンク</span>
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-400 text-stone-950 font-black text-[10px]">
                  {property.bankTransactionType || (property.price === 0 ? '0円譲渡' : '売買')}
                </span>
              </div>
              <div className="text-base font-bold text-amber-300 flex items-center gap-1.5 mt-2 truncate">
                <span>{property.registrationNumber || '日南市登録 第24-01号'}</span>
              </div>
              <div className="text-[11px] text-emerald-300 font-medium mt-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>移住者優先枠・現地内見受付中</span>
              </div>
              {property.officialBankUrl && (
                <a
                  href={property.officialBankUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>空き家バンク公式ページで確認</span>
                </a>
              )}
              <div className="mt-2.5 pt-2 border-t border-stone-800 flex items-center justify-between">
                <span className="text-[10px] text-stone-400">直通コンシェルジュ</span>
                <span className="text-xs font-bold text-white tracking-wide">{property.bankContactPhone || '090-8355-3900'}</span>
              </div>
            </div>
          </div>

          {/* Photos Gallery with Caption Overlays & Thumbnails */}
          <div className="mb-8">
            {hasImages ? (
              <div className="space-y-3">
                {/* Main Hero Photo Viewer */}
                <div className="relative aspect-16/9 bg-stone-950 rounded-2xl overflow-hidden shadow-sm border border-stone-200">
                  <img
                    src={property.images[activeImgIndex] || property.images[0]}
                    alt={property.imageLabels?.[activeImgIndex] || property.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {/* Caption badge overlay & official verification */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2 items-center">
                    <div className="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm">
                      <Camera className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>{property.imageLabels?.[activeImgIndex] || `写真 ${activeImgIndex + 1}`}</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-700/90 text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1 shadow-sm">
                      <CheckCircle className="w-3 h-3 text-emerald-200" />
                      <span>日南市空き家バンク掲載実写</span>
                    </div>
                  </div>

                  {/* Photo counter */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                    <span>{activeImgIndex + 1} / {property.images.length} 枚</span>
                  </div>

                  {/* Carousel navigation buttons */}
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImgIndex(prev => (prev === 0 ? property.images.length - 1 : prev - 1))}
                        aria-label="前の写真"
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/85 transition cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setActiveImgIndex(prev => (prev === property.images.length - 1 ? 0 : prev + 1))}
                        aria-label="次の写真"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/85 transition cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails row with labels */}
                {property.images.length > 1 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {property.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImgIndex(idx)}
                        className={`group relative rounded-xl overflow-hidden border-2 transition text-left cursor-pointer ${
                          activeImgIndex === idx
                            ? 'border-emerald-700 ring-2 ring-emerald-500/30'
                            : 'border-stone-200 opacity-70 hover:opacity-100 hover:border-stone-400'
                        }`}
                      >
                        <div className="aspect-16/10 bg-stone-100 overflow-hidden">
                          <img
                            src={img}
                            alt={`サムネイル${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-1 bg-stone-900/90 text-white text-[10px] font-medium truncate">
                          {property.imageLabels?.[idx] ? property.imageLabels[idx].split('・')[0] : `写真 ${idx + 1}`}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 border-2 border-dashed border-stone-300 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center mb-3">
                  <Camera className="w-8 h-8 text-stone-400" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-200/80 text-stone-700 font-bold text-xs rounded-full mb-2">
                  <span>写真未掲載</span>
                </div>
                <p className="text-sm text-stone-600 max-w-lg mb-4 leading-relaxed font-medium">
                  建物の構造・間取り・インフラ・設備・周辺環境などの詳しいスペック情報は下記に詳しく掲載しています。
                </p>
              </div>
            )}
          </div>

          {/* Navigation Tabs inside Modal */}
          <div className="flex border-b border-stone-200 mb-6 font-semibold text-sm">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition cursor-pointer ${
                activeTab === 'details'
                  ? 'border-emerald-800 text-emerald-900 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>物件詳細・現況スペック</span>
            </button>

            <button
              onClick={() => setActiveTab('renovation')}
              className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition cursor-pointer ${
                activeTab === 'renovation'
                  ? 'border-emerald-800 text-emerald-900 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Hammer className="w-4 h-4 text-amber-600" />
              <span>リフォーム・DIY改修プラン検討</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiry')}
              className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition cursor-pointer ${
                activeTab === 'inquiry'
                  ? 'border-emerald-800 text-emerald-900 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Send className="w-4 h-4 text-emerald-700" />
              <span>内見予約・創客創人センター問合せ</span>
            </button>
          </div>

          {/* TAB 1: DETAILS & SPECS */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Highlight Badges */}
              <div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">物件の特徴・ポイント</h3>
                <div className="flex flex-wrap gap-2">
                  {property.highlights.map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-900 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description & Condition */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <h3 className="font-bold text-stone-900 text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-800" />
                  <span>物件概要・現況の様子</span>
                </h3>
                <p className="text-stone-700 text-sm leading-relaxed mb-4 whitespace-pre-line">
                  {property.description}
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 text-xs block">建物コンディション判定:</span>
                    <span className="text-xs text-amber-800">{property.conditionText}</span>
                  </div>
                </div>
              </div>

              {/* Owner Message if present */}
              {property.ownerMessage && (
                <div className="bg-emerald-800/5 p-4 rounded-2xl border border-emerald-800/10 flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-900 text-xs block mb-0.5">所有者様からのメッセージ:</span>
                    <p className="text-stone-700 text-xs italic">「{property.ownerMessage}」</p>
                  </div>
                </div>
              )}

              {/* NICHINAN OFFICIAL AKIYA BANK CARD */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-stone-50 rounded-2xl p-4 sm:p-5 border-2 border-emerald-300 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
                      <Building className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-emerald-950 text-sm">
                          日南市公式 空き家・空き地情報バンク登録情報
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-black rounded-full">
                          公式連携物件
                        </span>
                      </div>
                      <div className="text-xs text-stone-600 font-semibold mt-0.5">
                        登録番号: <strong className="text-emerald-900 font-black">{property.registrationNumber || '日南市空き家バンク登録 第24-01号'}</strong>
                        <span className="mx-2 text-stone-300">|</span>
                        区分: <strong className="text-stone-800">{property.bankTransactionType || (property.price === 0 ? '0円無償譲渡' : '売買')}</strong>
                      </div>
                    </div>
                  </div>

                  <a
                    href={property.officialBankUrl || 'https://nichinan-iju.jp/akiya/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-300 shadow-2xs transition flex items-center gap-1.5 self-start sm:self-center"
                    title="日南市移住・定住ポータルサイト「やさしい移住」公式ページを開く"
                  >
                    <span>公式空き家バンク（やさしい移住）で確認</span>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-white/95 p-2.5 rounded-xl border border-emerald-200">
                    <span className="font-black text-emerald-900 block mb-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>移住者優先制度</span>
                    </span>
                    <p className="text-stone-700 font-medium text-[11px] leading-snug">
                      市外・県外からの移住希望者と競合した場合に優先交渉権が適用されます
                    </p>
                  </div>
                  <div className="bg-white/95 p-2.5 rounded-xl border border-emerald-200">
                    <span className="font-black text-emerald-900 block mb-0.5 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-600" />
                      <span>家財処分等補助金</span>
                    </span>
                    <p className="text-stone-700 font-medium text-[11px] leading-snug">
                      日南市より家財撤去・片付けに<strong>最大10万円</strong>（2/3）を補助
                    </p>
                  </div>
                  <div className="bg-white/95 p-2.5 rounded-xl border border-emerald-200">
                    <span className="font-black text-emerald-900 block mb-0.5 flex items-center gap-1">
                      <Home className="w-3.5 h-3.5 text-emerald-600" />
                      <span>空き家改修リフォーム補助</span>
                    </span>
                    <p className="text-stone-700 font-medium text-[11px] leading-snug">
                      改修・水回り新設に<strong>最大150万円</strong>の手厚い移住支援補助
                    </p>
                  </div>
                </div>

                <div className="bg-white/95 p-2.5 rounded-xl border border-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-[11px] text-stone-600">
                    <strong className="text-stone-900">公式相談窓口: </strong>
                    移住定住コンシェルジュ（090-8355-3900） / 空き家カウンセラー（090-9480-3456） / 日南市役所 総合政策課
                  </div>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                    利用登録申込書・誓約書 提出対象
                  </span>
                </div>
              </div>

              {/* SECTION 1: 基本諸元・建物構造 */}
              <div>
                <h3 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-800" />
                  <span>① 基本諸元・建物構造</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">所在地</span>
                    <span className="font-semibold text-stone-900">{property.address}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">交通・アクセス</span>
                    <span className="font-semibold text-stone-900">{property.accessInfo}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">構造・階数</span>
                    <span className="font-semibold text-stone-900">{property.structure}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">築年・建築年月</span>
                    <span className="font-semibold text-stone-900">{property.builtYear}年（築{new Date().getFullYear() - property.builtYear}年）</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">間取り</span>
                    <span className="font-semibold text-stone-900">{property.layout}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">延床面積 / 敷地面積</span>
                    <span className="font-semibold text-stone-900">{property.buildingArea}㎡ / {property.landArea}㎡ ({Math.round(property.landArea * 0.3025)}坪)</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">空き家期間・現況</span>
                    <span className="font-semibold text-stone-900">{property.vacantPeriod || '約1年'}（現況渡し・即相談可）</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: 土地・法的規制・接道 */}
              <div>
                <h3 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-800" />
                  <span>② 土地・法的規制・道路状況</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">接道状況・道路幅員</span>
                    <span className="font-semibold text-stone-900">{property.roadAccess || '公道に接道'}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">用途地域・都市計画</span>
                    <span className="font-semibold text-stone-900">{property.zoning || '都市計画区域内'}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">建ぺい率 / 容積率</span>
                    <span className="font-semibold text-stone-900">{property.buildingCoverage || '60% / 200%'}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">再建築可否</span>
                    <span className="font-semibold text-emerald-800">再建築可能（建築基準法適合）</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">固定資産税（年間概算）</span>
                    <span className="font-semibold text-stone-900">約 {property.annualTaxEstimate.toLocaleString()} 円 / 年</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">駐車場</span>
                    <span className="font-semibold text-stone-900">{property.parking}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: インフラ・現況診断 */}
              <div>
                <h3 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-emerald-800" />
                  <span>③ インフラ設備・建物現況診断</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">上水道・下水道 / 排水</span>
                    <span className="font-semibold text-stone-900">{property.waterSewer}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">光回線・通信環境</span>
                    <span className="font-semibold text-stone-900">{property.internetEnv || '光回線対応エリア'}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">屋根・外壁の状態</span>
                    <span className="font-semibold text-stone-900">{property.roofCondition || '瓦屋根（点検済・雨漏りなし）'}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">室内・床・木部の状態</span>
                    <span className="font-semibold text-stone-900">{property.interiorCondition || '柱梁の歪みなし・畳表替え推奨'}</span>
                  </div>
                  {property.waterFacilityDetail && (
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 sm:col-span-2">
                      <span className="text-stone-500 block text-[11px]">水回り設備詳細</span>
                      <span className="font-semibold text-stone-900">{property.waterFacilityDetail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: 周辺環境・生活利便・学区 */}
              <div>
                <h3 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-800" />
                  <span>④ 交通・学区・周辺施設</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">交通・アクセス</span>
                    <span className="font-semibold text-stone-900">{property.accessInfo}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">小中学校学区</span>
                    <span className="font-semibold text-stone-900">{property.schoolDistrict || '日南市立小学校 / 中学校'}</span>
                  </div>
                  {property.nearbyFacilities && (
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 sm:col-span-2">
                      <span className="text-stone-500 block text-[11px]">周辺の主な施設（スーパー・病院・公共機関）</span>
                      <span className="font-semibold text-stone-900">{property.nearbyFacilities}</span>
                    </div>
                  )}
                  {property.recommendedUsage && (
                    <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-xl sm:col-span-2">
                      <span className="text-emerald-900 font-bold block text-[11px]">💡 おすすめの活用用途</span>
                      <span className="text-emerald-800 font-semibold">{property.recommendedUsage}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 5: 担当窓口案内 */}
              <div className="bg-gradient-to-r from-emerald-900 to-stone-900 text-white p-5 rounded-2xl shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-emerald-100 text-[10px] font-bold inline-block mb-1">
                      空き家・移住ワンストップ支援
                    </span>
                    <h4 className="font-extrabold text-base text-amber-300">
                      担当窓口：{property.contactDesk || '日南市 創客創人センター'}
                    </h4>
                    <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                      内見の日程調整、所有者様との売買条件の確認、日南市の空き家バンク補助金申請手続きまで無料で一括伴走いたします。
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('inquiry')}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition shrink-0 shadow-sm cursor-pointer"
                  >
                    創客創人センターへ相談・内見
                  </button>
                </div>
              </div>

              {/* AI Quick Callout */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-950 text-sm">この物件についてAIに相談・質問する</h4>
                    <p className="text-xs text-amber-800">リノベ注意点、日南の暮らし、補助金の適用条件をAIが詳しく解説します。</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenAiWithProperty(property, 'この物件の購入時・リノベ時のリスクと注意点を詳しく教えてください。')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AIに質問する</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: RENOVATION SIMULATOR */}
          {activeTab === 'renovation' && (
            <div className="space-y-6">
              <div className="bg-stone-900 text-white p-5 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider block">改修プラン検討</span>
                    <h3 className="text-lg font-bold text-amber-200">
                      プロ施工 vs DIY選択 ＆ 自治体補助金の活用検討
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-stone-400 text-xs block">選択した改修項目の目安</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                      {Object.values(selectedRenovations).filter((v: { selected: boolean; mode: 'pro' | 'diy' }) => v.selected).length} 項目 選択中
                    </span>
                  </div>
                </div>

                {/* Calculation Breakdown pill */}
                <div className="mt-4 pt-4 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-center text-xs">
                  <div className="bg-stone-800/80 p-2.5 rounded-xl">
                    <span className="text-stone-400 block text-[10px]">改修工事・DIY項目</span>
                    <span className="font-bold text-amber-300 text-sm">
                      {Object.values(selectedRenovations).filter((v: { selected: boolean; mode: 'pro' | 'diy' }) => v.selected).length} 箇所を計画中
                    </span>
                  </div>
                  <div className="bg-stone-800/80 p-2.5 rounded-xl">
                    <span className="text-stone-400 block text-[10px]">日南市補助金制度</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {property.subsidyName} 対象
                    </span>
                  </div>
                </div>
              </div>

              {/* Local Subsidy Option Toggle */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-amber-700" />
                  <div>
                    <span className="font-bold text-stone-900 text-sm block">{property.subsidyName}</span>
                    <span className="text-xs text-stone-600">自治体から支給される改修・移住補助金を試算に含める</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useSubsidy}
                    onChange={e => setUseSubsidy(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
                </label>
              </div>

              {/* Renovation Catalog Checklist */}
              <div>
                <h3 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-2">
                  <Hammer className="w-4 h-4 text-emerald-700" />
                  <span>改修内容の選択＆「業者依頼 vs DIY」比較</span>
                </h3>

                <div className="space-y-3">
                  {RENOVATION_CATALOG.map(item => {
                    const state = selectedRenovations[item.id] || { selected: false, mode: 'pro' };

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition ${
                          state.selected ? 'bg-stone-50/90 border-emerald-700/50 shadow-2xs' : 'bg-white border-stone-200 opacity-80'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={state.selected}
                              onChange={() => handleToggleRenovation(item.id)}
                              className="mt-1 w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 accent-emerald-800"
                            />
                            <div>
                              <span className="font-bold text-stone-900 text-sm block">{item.name}</span>
                              <span className="text-xs text-stone-500">{item.description}</span>
                            </div>
                          </label>

                          {/* DIY vs Pro toggle button group */}
                          {state.selected && (
                            <div className="flex items-center gap-1 bg-stone-200 p-1 rounded-xl shrink-0 self-end sm:self-center">
                              <button
                                onClick={() => handleModeChange(item.id, 'pro')}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                  state.mode === 'pro'
                                    ? 'bg-emerald-800 text-white shadow-2xs'
                                    : 'text-stone-600 hover:text-stone-900'
                                }`}
                              >
                                プロ施工 (約{(item.proEstimate / 10000).toLocaleString()}万)
                              </button>

                              {item.isDiyPossible && (
                                <button
                                  onClick={() => handleModeChange(item.id, 'diy')}
                                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    state.mode === 'diy'
                                      ? 'bg-amber-600 text-white shadow-2xs'
                                      : 'text-stone-600 hover:text-stone-900'
                                  }`}
                                >
                                  DIY施工 (約{(item.diyEstimate / 10000).toLocaleString()}万)
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INQUIRY & RESERVATION */}
          {activeTab === 'inquiry' && (
            <div>
              {formSubmitted ? (
                <div className="text-center py-12 bg-emerald-50 rounded-3xl border border-emerald-200 p-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-800 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-950">内見・ご相談のお問合せを送信しました</h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                    日南市 創客創人センター（油津商店街 ittenほりかわ内 / 空き家支援窓口）の担当スタッフより、入力いただいた連絡先へご連絡いたします。
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="px-6 py-2.5 bg-emerald-800 text-white font-bold text-xs rounded-xl hover:bg-emerald-900 transition cursor-pointer"
                    >
                      問合せ内容を再確認・再送する
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-5">
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-xs font-bold text-emerald-800 block mb-1">お問合せ対象物件:</span>
                    <h4 className="font-bold text-stone-900 text-sm leading-snug">{property.title}</h4>
                    <span className="text-xs text-stone-500">{property.address}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">お名前 *</label>
                      <input
                        type="text"
                        required
                        placeholder="日南 太郎"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">メールアドレス *</label>
                      <input
                        type="email"
                        required
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">電話番号 *</label>
                      <input
                        type="tel"
                        required
                        placeholder="090-1234-5678"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">内見希望日時（任意）</label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">ご質問・ご相談内容</label>
                    <textarea
                      rows={3}
                      placeholder="例：日南市への移住を検討中です。改修補助金の対象要件や、実際の状態を現地で見学したいです。"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl flex items-start gap-2.5">
                    <Building className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-stone-600 leading-relaxed">
                      送信先：<strong className="text-stone-900 font-bold">日南市 創客創人センター（油津商店街 ittenほりかわ内）</strong>。所有者様との現地内見アテンド、売買条件の調整、最大150万円の改修補助金申請まで無料で伴走サポートいたします。
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>創客創人センターへ送信する（無料）</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom CTA Footer with Return to Map Button */}
        <div className="px-4 sm:px-6 py-3.5 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm shrink-0">
          <div className="text-xs text-stone-600 hidden sm:block">
            <span className="font-bold text-stone-900">担当窓口:</span> 創客創人センター（日南市 移住定住・空き家バンク支援窓口 / 油津商店街 ittenほりかわ内）
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl border border-stone-300 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4 text-stone-600" />
              <span>地図に戻る</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiry')}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold rounded-xl shadow-xs transition cursor-pointer"
            >
              内見予約・窓口相談をする
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
