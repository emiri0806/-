import React from 'react';
import { BookOpen, Banknote, ShieldCheck, CheckCircle2, FileText, HelpCircle, ArrowRight, Sparkles, Building2, Scale, Landmark, Trees, Waves } from 'lucide-react';

export const SubsidyGuide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-amber-950 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-md border border-amber-300/30">
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="px-3 py-1 bg-amber-400 text-stone-950 font-extrabold text-xs rounded-full inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            日南市公式制度ガイド 2026年最新版
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            日南市 空き家再生補助金＆0円物件取得完全マニュアル
          </h1>
          <p className="text-stone-200 text-sm leading-relaxed">
            宮崎県日南市（飫肥・油津・南郷・北郷・酒谷・富土）が提供する「空き家バンク改修補助金（最大150万円）」や「飫肥重伝建地区修景補助（最大200万円）」、0円物件の諸費用を徹底解説。
          </p>
        </div>
      </div>

      {/* Grid: Nichinan Subsidy Schemes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Banknote className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-stone-900 text-base">① 日南市空き家バンク活用補助金</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            日南市空き家バンク登録物件を購入または賃借した移住者・市民に対し、改修工事費用の最大1/2〜2/3（上限100万〜150万円）を補助。水回り・屋根・内装改修が対象。
          </p>
          <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-xl">
            上限: 最大150万円（子育て・県外移住加算あり）
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Landmark className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-stone-900 text-base">② 飫肥重伝建地区 保存改修補助</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            国選定の重要伝統的建造物群保存地区（飫肥）の武家屋敷や伝統的町家を修復・景観保存する場合、日南市より手厚い修理修景補助金が交付されます。
          </p>
          <div className="text-[11px] font-bold text-amber-900 bg-amber-50 p-2 rounded-xl">
            上限: 最大200万円（外観・屋根・塀の伝統修景）
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-stone-900 text-base">③ 0円物件（無償譲渡）の諸費用</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            物件代金は0円ですが、所有権移転登記費用（司法書士報酬＋登録免許税）、固定資産税精算、不動産取得税などの実費が発生します。
          </p>
          <div className="text-[11px] font-bold text-stone-800 bg-stone-100 p-2 rounded-xl">
            日南市内の実質諸費用目安: 約15万〜25万円
          </div>
        </div>
      </div>

      {/* Nichinan Unique Support Programs */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-extrabold text-amber-950 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span>日南市ならではの特別移住支援施策</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-700">
          <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1.5">
            <span className="font-extrabold text-stone-900 text-sm block">🌲 飫肥杉利用促進補助</span>
            <p className="text-stone-600">日南特産の飫肥杉材を内外装リノベーションに使用することで、材料費・施工費に対する上乗せ助成を受けられます。</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1.5">
            <span className="font-extrabold text-stone-900 text-sm block">🌊 お試し滞在住宅制度</span>
            <p className="text-stone-600">日南市での移住生活やワーケーションを体験できる「お試し滞在住宅」を格安で利用可能（事前予約制）。</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1.5">
            <span className="font-extrabold text-stone-900 text-sm block">💼 油津商店街・創業支援</span>
            <p className="text-stone-600">油津商店街や市内空き店舗を活用してカフェ・ITオフィスを開業する起業家に向けた家賃・改装費補助。</p>
          </div>
        </div>
      </div>

      {/* Step by Step acquisition guide */}
      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-700" />
          <span>日南市で空き家を取得・補助金を受け取るまでの5ステップ</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">1</span>
            <h4 className="font-bold text-stone-900 text-sm">日南市内物件の検索</h4>
            <p className="text-stone-600">当ポータルで飫肥・油津・南郷・北郷など希望地区の物件を探索し内見予約。</p>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">2</span>
            <h4 className="font-bold text-stone-900 text-sm">創客創人センターへ事前相談</h4>
            <p className="text-stone-600">改修工事着工前に創客創人センター（または日南市役所担当課）へ補助金事前申請書を提出・相談。</p>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">3</span>
            <h4 className="font-bold text-stone-900 text-sm">譲渡契約・登記完了</h4>
            <p className="text-stone-600">売買または贈与契約を締結し、宮崎地方法務局日南支局にて所有権移転登記。</p>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">4</span>
            <h4 className="font-bold text-stone-900 text-sm">リノベ工事・DIY着工</h4>
            <p className="text-stone-600">日南市内の地元工務店やセルフDIYで施工。領収書と施工前後の写真を記録。</p>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">5</span>
            <h4 className="font-bold text-stone-900 text-sm">完了報告・補助金受取</h4>
            <p className="text-stone-600">実績報告書を提出後、日南市より補助金（最大150万円〜200万円）が交付。</p>
          </div>
        </div>
      </div>

      {/* Official Consultation Desk: Sokyaku Sojin Center */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-700/60 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-xl shadow-xs">
              🏛️
            </div>
            <div>
              <span className="text-xs text-amber-300 font-bold tracking-wider block">日南市 移住・空き家バンク担当窓口</span>
              <h3 className="text-xl font-extrabold text-white">日南市 創客創人センター</h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800/80 border border-emerald-600/50 rounded-full text-xs font-bold text-amber-200">
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            移住定住・空き家再生ワンストップ窓口
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-emerald-100">
          <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800 space-y-1">
            <span className="font-bold text-white block">📍 所在地・アクセス</span>
            <p className="text-stone-300">宮崎県日南市岩崎3-4-1-2（油津商店街 ittenほりかわ内 / JR油津駅 徒歩5分）</p>
          </div>
          <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800 space-y-1">
            <span className="font-bold text-white block">🤝 主なサポート業務</span>
            <p className="text-stone-300">空き家内見アテンド、空き家バンク登録・活用相談、改修補助金の申請助言、起業・就農支援</p>
          </div>
          <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800 space-y-1">
            <span className="font-bold text-white block">💬 ご相談方法</span>
            <p className="text-stone-300">当ポータルの各物件ページ「内見・問合せ」フォーム、または現地・オンライン相談受付</p>
          </div>
        </div>
      </div>
    </div>
  );
};
