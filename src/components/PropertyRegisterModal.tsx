import React, { useState } from 'react';
import { PlusCircle, Sparkles, CheckCircle2, AlertCircle, Home, Send, DollarSign, Building } from 'lucide-react';
import { PropertyRegistration } from '../types';
import { NICHINAN_DISTRICTS_LIST } from '../data/mockProperties';

interface PropertyRegisterModalProps {
  onClose: () => void;
  onAddProperty: (newProperty: any) => void;
}

export const PropertyRegisterModal: React.FC<PropertyRegisterModalProps> = ({
  onClose,
  onAddProperty,
}) => {
  const [formData, setFormData] = useState<PropertyRegistration>({
    title: '',
    prefecture: '宮崎県',
    city: '日南市飫肥',
    address: '宮崎県日南市飫肥',
    price: 0,
    layout: '4LDK',
    structure: '木造2階建て',
    builtYear: 1980,
    landArea: 350,
    buildingArea: 110,
    conditionText: '水回り要改修、飫肥杉の柱・梁は状態良好',
    description: '',
    ownerName: '',
    contactEmail: '',
    contactPhone: '',
    imageUrl: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1200&q=80'
  });

  const [aiEvaluation, setAiEvaluation] = useState<any | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAiEvaluation = async () => {
    if (!formData.description || !formData.city) return;
    setEvaluating(true);

    try {
      const res = await fetch('/api/evaluate-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyData: formData })
      });
      const data = await res.json();
      setAiEvaluation(data.evaluation);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const createdProp = {
      id: `custom-${Date.now()}`,
      title: formData.title || '【新規掲載】実家の空き家譲渡・売却物件',
      address: `${formData.prefecture}${formData.city}`,
      prefecture: formData.prefecture,
      city: formData.city,
      price: Number(formData.price),
      estimatedRenovationCost: 2000000,
      availableSubsidy: 1000000,
      subsidyName: `${formData.prefecture}空き家改修・定住補助金`,
      landArea: Number(formData.landArea) || 200,
      buildingArea: Number(formData.buildingArea) || 90,
      builtYear: Number(formData.builtYear) || 1980,
      structure: formData.structure || '木造2階建て',
      layout: formData.layout || '4LDK',
      images: [formData.imageUrl || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'],
      tags: formData.price === 0 ? ['0円物件', '無償譲渡', 'DIY向け'] : ['格安物件', '手押し掲載'],
      description: formData.description || 'オーナー様直接掲載の空き家物件です。',
      conditionLevel: 'minor_repair',
      conditionText: formData.conditionText || '現状渡し。内見随時受付中。',
      accessInfo: '最寄り駅より車で15分',
      annualTaxEstimate: 25000,
      rebuildingPossible: true,
      parking: '2台可',
      waterSewer: '公営水道 / 汲み取りまたは浄化槽',
      highlights: ['オーナー直送物件', '0円〜格安譲渡可能', '内見予約受付け中'],
      ownerMessage: `所有者の${formData.ownerName || '匿名'}です。大切に使ってくださる方に。`,
      coordinates: { lat: 35.6895, lng: 139.6917 }
    };

    onAddProperty(createdProp);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-300" />
            <h2 className="font-extrabold text-base sm:text-lg">空き家を掲載する・AI価格査定</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl font-bold cursor-pointer">
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-900">掲載登録が完了しました！</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                ご登録いただいた空き家情報がポータルに反映されました。全国の移住検討者・DIYファンが閲覧可能です。
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl"
              >
                物件一覧へ戻る
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold block">AI査定機能つきフォーム</span>
                  物件概要を入力すると、AIが「おすすめ販売・譲渡価格」や「ターゲット層」「アピールポイント」を即座に提案します。
                </div>
              </div>

              {/* Basic Specs */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">物件タイトル *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="【0円譲渡】富士山が見える庭付き平屋"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">所在地（日南市内地区）</label>
                  <select
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value, address: `宮崎県日南市${e.target.value}` })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold"
                  >
                    {NICHINAN_DISTRICTS_LIST.filter(p => p !== 'すべて').map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">詳細番地</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="日南市飫肥4丁目1-12"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">希望譲渡・売却価格 (円)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-amber-800"
                  />
                  <span className="text-[10px] text-stone-400">※0を入力すると「0円物件（無償譲渡）」</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">間取り</label>
                  <input
                    type="text"
                    value={formData.layout}
                    onChange={e => setFormData({ ...formData, layout: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">築年 (西暦)</label>
                  <input
                    type="number"
                    value={formData.builtYear}
                    onChange={e => setFormData({ ...formData, builtYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">敷地面積 (㎡)</label>
                  <input
                    type="number"
                    value={formData.landArea}
                    onChange={e => setFormData({ ...formData, landArea: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">延床面積 (㎡)</label>
                  <input
                    type="number"
                    value={formData.buildingArea}
                    onChange={e => setFormData({ ...formData, buildingArea: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">物件の詳細説明・コンディション *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="父から相続した実家です。庭が広く、日当たりが良いです。水回りはリフォームが必要です。"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                ></textarea>
              </div>

              {/* AI Evaluation Button & Output */}
              <div className="bg-stone-100 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    AI査定・アピール診断
                  </span>
                  <button
                    type="button"
                    onClick={handleAiEvaluation}
                    disabled={evaluating || !formData.description}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    {evaluating ? 'AI解析中...' : 'AIに査定してもらう'}
                  </button>
                </div>

                {aiEvaluation && (
                  <div className="bg-white p-3.5 rounded-xl border border-stone-200 text-xs space-y-2">
                    <div>
                      <span className="font-bold text-emerald-800">推奨価格設定:</span> {aiEvaluation.recommendedPrice}
                    </div>
                    <div>
                      <span className="font-bold text-emerald-800">おすすめのターゲット層:</span> {aiEvaluation.targetBuyers}
                    </div>
                    <div>
                      <span className="font-bold text-emerald-800 block mb-1">アピールポイント:</span>
                      <ul className="list-disc list-inside text-stone-700 space-y-0.5">
                        {aiEvaluation.keySellingPoints?.map((pt: string, idx: number) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-stone-600 italic pt-1 border-t border-stone-100">
                      💡 {aiEvaluation.advice}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-200" />
                  <span>空き家ポータルへ無料掲載する</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
