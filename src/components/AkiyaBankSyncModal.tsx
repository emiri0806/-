import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  Building2,
  FileCheck,
  ShieldCheck,
  Phone,
  Home,
  Database,
  ArrowRight,
  Search,
  Sparkles,
  MapPin,
  Clock,
  Coins
} from 'lucide-react';
import { Property } from '../types';

interface AkiyaBankSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  lastSyncTime: string;
  onRefreshSync: () => void;
}

export const AkiyaBankSyncModal: React.FC<AkiyaBankSyncModalProps> = ({
  isOpen,
  onClose,
  properties,
  onSelectProperty,
  lastSyncTime,
  onRefreshSync
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState<string>('');
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [importQuery, setImportQuery] = useState('');
  const [importResult, setImportResult] = useState<Property | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter stats
  const registeredCount = properties.filter(p => p.isAkiyaBankRegistered).length;
  const zeroYenCount = properties.filter(p => p.price === 0).length;
  const rentalCount = properties.filter(p => p.bankTransactionType === '賃貸').length;
  const saleCount = properties.filter(p => p.bankTransactionType === '売買' || p.bankTransactionType === '0円無償譲渡').length;

  const handleStartSync = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setSyncStep('日南市移住ポータル「やさしい移住」空き家バンク接続中...');

    setTimeout(() => {
      setSyncStep('日南市全域（飫肥・油津・南郷・北郷・酒谷・富土・吾田・細田）の登録台帳照合中...');
      setTimeout(() => {
        setSyncStep('家財処分補助（最大10万円）・リフォーム補助（最大150万円）適用情報を更新中...');
        setTimeout(() => {
          setIsSyncing(false);
          setSyncSuccess(true);
          onRefreshSync();
        }, 600);
      }, 700);
    }, 600);
  };

  const handleSearchAndImport = (query: string) => {
    const q = (query || importQuery).trim().toLowerCase();
    if (!q) {
      setImportError('物件番号またはキーワードを入力してください');
      setImportResult(null);
      return;
    }

    setImportError(null);
    const found = properties.find(p =>
      (p.registrationNumber && p.registrationNumber.toLowerCase().includes(q)) ||
      p.id.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q)
    );

    if (found) {
      setImportResult(found);
    } else {
      setImportResult(null);
      setImportError(`「${query}」に一致する空き家バンク登録物件が見つかりませんでした。別の登録番号や地区名でお試しください。`);
    }
  };

  const sampleQuickQueries = [
    { label: 'No.221（上平野 580万円）', query: 'No.221' },
    { label: 'No.249（北郷 賃貸5.5万）', query: 'No.249' },
    { label: 'No233（飫肥 400万円）', query: 'No233' },
    { label: 'No.282（南郷潟上 398万）', query: 'No.282' },
    { label: 'No226（油津 賃貸5.5万）', query: 'No226' },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-5 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg tracking-tight">
                  日南市公式 空き家バンク連携・データ同期
                </h3>
                <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  公式連携中
                </span>
              </div>
              <p className="text-xs text-stone-300">
                日南市空き家・空き地情報バンク（やさしい移住・あったか宮崎ひなた暮らし）
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            title="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Status & Sync Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50 rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200/80">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-black text-emerald-950">データ取得元</span>
                </div>
                <div className="text-sm font-extrabold text-stone-900 mt-0.5">
                  日南市役所 総合政策課「空き家・空き地情報バンク」 / ポータル「やさしい移住」
                </div>
                <div className="text-xs text-stone-500 flex items-center gap-2 mt-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>最終同期: <strong className="text-stone-800">{lastSyncTime}</strong></span>
                </div>
              </div>

              {/* Sync Trigger Button */}
              <button
                onClick={handleStartSync}
                disabled={isSyncing}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-400 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'データ引込中...' : '最新データを今すぐ引っ張る（再同期）'}</span>
              </button>
            </div>

            {/* Sync Progress & Success */}
            {isSyncing && (
              <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-300 shadow-2xs text-xs space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>{syncStep}</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            )}

            {syncSuccess && (
              <div className="mt-3 p-3 bg-emerald-100/90 text-emerald-950 rounded-xl border border-emerald-300 shadow-2xs text-xs flex items-center justify-between gap-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-black">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>日南市空き家バンクとの同期が完了しました！全{registeredCount}件の最新情報を反映中です。</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-700 text-white font-bold rounded-md text-[10px] shrink-0">
                  最新
                </span>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
              <div className="bg-white/90 p-2.5 rounded-xl border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500 block">空き家バンク登録</span>
                <span className="text-xl font-black text-emerald-900">{registeredCount} <span className="text-xs font-bold text-stone-600">件</span></span>
              </div>
              <div className="bg-white/90 p-2.5 rounded-xl border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500 block">売買物件</span>
                <span className="text-xl font-black text-stone-900">{saleCount} <span className="text-xs font-bold text-stone-600">件</span></span>
              </div>
              <div className="bg-white/90 p-2.5 rounded-xl border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500 block">賃貸物件</span>
                <span className="text-xl font-black text-stone-900">{rentalCount} <span className="text-xs font-bold text-stone-600">件</span></span>
              </div>
              <div className="bg-white/90 p-2.5 rounded-xl border border-amber-300 bg-amber-50/60">
                <span className="text-[11px] font-bold text-amber-900 block">0円無償譲渡</span>
                <span className="text-xl font-black text-amber-900">{zeroYenCount} <span className="text-xs font-bold text-stone-600">件</span></span>
              </div>
            </div>
          </div>

          {/* Quick Search & Specific Property Pull */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-700" />
              <h4 className="font-black text-stone-900 text-sm">
                登録番号・キーワードから特定の空き家情報を引っ張る
              </h4>
            </div>
            <p className="text-xs text-stone-600">
              日南市空き家バンクの登録番号（例: 第24-03号）や地区名（南郷、飫肥、北郷など）を入力して、該当物件を直接呼び出せます。
            </p>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={importQuery}
                  onChange={(e) => setImportQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchAndImport(importQuery)}
                  placeholder="例: 第24-03号、南郷町、飫肥、0円"
                  className="w-full px-3.5 py-2 pl-9 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
              <button
                onClick={() => handleSearchAndImport(importQuery)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                引っ張る
              </button>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-stone-500">クイック選択:</span>
              {sampleQuickQueries.map(sample => (
                <button
                  key={sample.query}
                  onClick={() => {
                    setImportQuery(sample.query);
                    handleSearchAndImport(sample.query);
                  }}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-stone-950 rounded-lg text-[11px] font-bold transition cursor-pointer border border-stone-200"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {/* Import Result Preview */}
            {importResult && (
              <div className="mt-3 p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-300 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 border border-emerald-300 shrink-0">
                    {importResult.images && importResult.images.length > 0 ? (
                      <img
                        src={importResult.images[0]}
                        alt={importResult.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-800 text-white flex items-center justify-center font-black">
                        <FileCheck className="w-6 h-6 text-amber-300" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-emerald-800 text-white rounded text-[10px] font-black">
                        {importResult.registrationNumber || '日南市空き家バンク登録'}
                      </span>
                      <span className="text-xs font-black text-amber-900 bg-amber-200 px-1.5 py-0.2 rounded">
                        {importResult.bankTransactionType || '売買'}
                      </span>
                    </div>
                    <div className="font-extrabold text-stone-900 text-xs sm:text-sm mt-0.5">
                      {importResult.title}
                    </div>
                    <div className="text-[11px] text-stone-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{importResult.address}</span>
                      <strong className="text-stone-900 ml-1">
                        {importResult.price === 0 ? '0円譲渡' : `${(importResult.price / 10000).toLocaleString()}万円`}
                      </strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onSelectProperty(importResult);
                  }}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer shrink-0"
                >
                  <span>地図と詳細を見る</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {importError && (
              <div className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs font-medium">
                {importError}
              </div>
            )}
          </div>

          {/* Official Nichinan Bank Policy & Benefits */}
          <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-3">
            <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>日南市空き家バンク 公式制度とメリット</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <div className="font-black text-emerald-900 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>家財処分支援補助金</span>
                </div>
                <div className="text-stone-800 font-extrabold">最大 10 万円補助</div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  空き家バンク登録物件の家財道具・不用品の片付け費用（3分の2補助）
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <div className="font-black text-emerald-900 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-amber-500" />
                  <span>空き家改修補助金</span>
                </div>
                <div className="text-stone-800 font-extrabold">最大 150 万円補助</div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  水回りリフレッシュや外壁塗装など、居住に向けた改修工事を大幅支援
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <div className="font-black text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>移住者優先制度</span>
                </div>
                <div className="text-stone-800 font-extrabold">移住希望者優先</div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  市外・県外からの移住希望者と重複した場合、移住者の希望を優先マッチング
                </p>
              </div>
            </div>

            {/* Official Contact Desk Info */}
            <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <span className="font-black text-stone-800 block">日南市 空き家相談窓口・コンシェルジュ</span>
                <span className="text-[11px] text-stone-500">
                  市外の方: 移住定住コンシェルジュ (090-8355-3900) / 市内の方: 空き家カウンセラー (090-9480-3456)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://nichinan-iju.jp/akiya/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-lg transition flex items-center gap-1 border border-stone-300"
                >
                  <span>公式サイト</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-5 py-3 border-t border-stone-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-stone-500 font-medium">
            ※空き家の内覧・契約には、日南市への利用登録申込（申請書・誓約書）が必要です。
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
