import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, HelpCircle, Compass, RefreshCw, CheckCircle2, ChevronRight, AlertCircle, Home } from 'lucide-react';
import { Property, AiConsultMessage } from '../types';

interface AiConsultantProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  selectedPropertyContext?: Property | null;
  onClearPropertyContext?: () => void;
}

const PRESET_QUESTIONS = [
  '日南市内の格安物件（50万〜100万円台）の取得手続きや諸費用は？',
  '日南市空き家バンク改修補助金（最大150万円）を受ける条件は？',
  '飫肥城下町の重伝建地区で古民家カフェや民泊を開業するポイント',
  '油津商店街でのワーケーション・サテライトオフィス創業支援について',
  '南郷（目井津港）や富土での海辺・サーフィン移住向け物件の選び方',
  '北郷温泉や酒谷（坂元棚田）での里山・農業・自給自足ライフ'
];

export const AiConsultant: React.FC<AiConsultantProps> = ({
  properties,
  onSelectProperty,
  selectedPropertyContext,
  onClearPropertyContext,
}) => {
  const [messages, setMessages] = useState<AiConsultMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'こんにちは！日南市 空き家・古民家再生AIコンシェルジュです。\n飫肥城下町・油津港町・南郷・北郷・酒谷など、日南市内の格安空き家（50万〜300万円台）の取得手続き、飫肥杉リノベーション費用試算、日南市空き家改修補助金（最大150万円）や重伝建保存補助金の活用法、サーフィン・農業移住の疑問など何でもお気軽に相談してください！',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'diagnostic'>('chat');

  // Diagnostic Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({
    budget: '',
    purpose: '',
    regionPreference: '',
    diySkill: ''
  });
  const [diagnosticResult, setDiagnosticResult] = useState<{
    profileTitle: string;
    description: string;
    recommendations: Property[];
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: AiConsultMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          propertyContext: selectedPropertyContext || null,
          conversationType: 'chat'
        })
      });

      const data = await res.json();

      const aiMsg: AiConsultMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || '回答の取得に失敗しました。',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: '通信エラーが発生しました。しばらく経ってから再度お試しください。',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Run Diagnostic Logic
  const handleQuizAnswer = (field: string, value: string) => {
    const nextAnswers = { ...quizAnswers, [field]: value };
    setQuizAnswers(nextAnswers);

    if (quizStep < 3) {
      setQuizStep(prev => prev + 1);
    } else {
      // Calculate matches
      evaluateDiagnostic(nextAnswers);
    }
  };

  const evaluateDiagnostic = (answers: typeof quizAnswers) => {
    let matches = [...properties];

    if (answers.budget === '0yen') {
      matches = matches.filter(p => p.price === 0);
    } else if (answers.budget === 'under300') {
      matches = matches.filter(p => p.price <= 3000000);
    }

    if (answers.purpose === 'diy') {
      matches = matches.filter(p => p.tags.includes('DIY向け') || p.tags.includes('0円物件'));
    } else if (answers.purpose === 'cafe') {
      matches = matches.filter(p => p.tags.includes('店舗付き') || p.tags.includes('古民家') || p.tags.includes('土間あり'));
    }

    if (matches.length === 0) {
      matches = properties.slice(0, 3);
    }

    let title = '【熱血DIY＆フリー取得挑戦チャレンジャー派】';
    let desc = 'コストを最小化して0円〜格安物件を取得し、自分好みにリノベしていくスタイルがピッタリです！';

    if (answers.purpose === 'cafe') {
      title = '【古民家カフェ・起業クリエイター派】';
      desc = '土間や広大な敷地、店舗スペースのある風情豊かな物件で夢の拠点づくりが似合います。';
    } else if (answers.budget === 'ready') {
      title = '【安心即入居・快適スローライフ派】';
      desc = '改修の手間を最小限に、すぐ自然に囲まれた新生活をスタートできる物件がおすすめです。';
    }

    setDiagnosticResult({
      profileTitle: title,
      description: desc,
      recommendations: matches.slice(0, 3)
    });
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({ budget: '', purpose: '', regionPreference: '', diySkill: '' });
    setDiagnosticResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <Sparkles className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                Gemini 3.6 Flash Powered
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                AI空き家コンシェルジュ & 判定ナビ
              </h2>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-stone-800/80 p-1.5 rounded-2xl border border-stone-700">
            <button
              onClick={() => setActiveMode('chat')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeMode === 'chat'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              自由チャット相談
            </button>
            <button
              onClick={() => setActiveMode('diagnostic')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                activeMode === 'diagnostic'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>適性診断テスト</span>
            </button>
          </div>
        </div>
      </div>

      {/* Property Context Banner if active */}
      {selectedPropertyContext && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Home className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span className="font-bold text-amber-950">相談対象の物件:</span>{' '}
              <span className="text-stone-800 font-medium">{selectedPropertyContext.title} ({selectedPropertyContext.address})</span>
            </div>
          </div>
          <button
            onClick={onClearPropertyContext}
            className="text-xs text-stone-500 hover:text-stone-800 underline shrink-0 cursor-pointer"
          >
            解除する
          </button>
        </div>
      )}

      {/* MODE 1: CHAT CONSULTATION */}
      {activeMode === 'chat' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col h-[600px]">
          {/* Preset Questions Bar */}
          <div className="p-4 bg-stone-50 border-b border-stone-200 overflow-x-auto flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500 shrink-0 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              よくある相談:
            </span>
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-xl text-xs text-stone-700 hover:text-emerald-900 transition shrink-0 shadow-2xs cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-stone-50/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xs ${
                    msg.sender === 'user'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-amber-500 text-stone-950'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`space-y-1 ${msg.sender === 'user' ? 'items-end' : ''}`}>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-emerald-800 text-white rounded-tr-none'
                        : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-stone-400 px-1 block">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-xs text-stone-500 italic">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                <span>AIが回答を分析・生成中...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-stone-200">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                id="ai-chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="質問を入力（例：0円物件にかかる贈与税・登記費用はいくら？、雪国の空き家の注意点は？）"
                className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4 text-amber-200" />
                <span>送信</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODE 2: DIAGNOSTIC QUIZ */}
      {activeMode === 'diagnostic' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
          {!diagnosticResult ? (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="text-center">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
                  STEP {quizStep + 1} / 4
                </span>
                <h3 className="text-xl font-extrabold text-stone-900 mt-2">
                  あなたにピッタリの空き家＆移住スタイル診断
                </h3>
              </div>

              {quizStep === 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-stone-800 text-sm">Q1. 物件取得のご希望予算感は？</h4>
                  <button
                    onClick={() => handleQuizAnswer('budget', '0yen')}
                    className="w-full p-4 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-2xl text-left transition font-semibold text-stone-800 text-sm cursor-pointer"
                  >
                    ✨ 0円（無償譲渡物件）を中心に、安く手に入れたい
                  </button>
                  <button
                    onClick={() => handleQuizAnswer('budget', 'under300')}
                    className="w-full p-4 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-2xl text-left transition font-semibold text-stone-800 text-sm cursor-pointer"
                  >
                    🏡 100万円〜300万円程度の格安物件を探したい
                  </button>
                  <button
                    onClick={() => handleQuizAnswer('budget', 'ready')}
                    className="w-full p-4 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-2xl text-left transition font-semibold text-stone-800 text-sm cursor-pointer"
                  >
                    🔑 400万〜500万程度でリノベ済み・すぐ住める状態が良い
                  </button>
                </div>
              )}

              {quizStep === 1 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-stone-800 text-sm">Q2. 空き家活用の主な目的は？</h4>
                  <button
                    onClick={() => handleQuizAnswer('purpose', 'diy')}
                    className="w-full p-4 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-2xl text-left transition font-semibold text-stone-800 text-sm cursor-pointer"
                  >
                    🔨 自分の手でコツコツDIYリノベーションを楽しみたい
                  </button>
                  <button
                    onClick={() => handleQuizAnswer('purpose', 'cafe')}
                    className="w-full p-4 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-2xl text-left transition font-semibold text-stone-800 text-sm cursor-pointer"
                  >
                    ☕ 古民家カフェ、アトリエ、農家民泊などを開業したい
                  </button>
                  <button
                    onClick={() => handleQuizAnswer('purpose', 'remote')}
                    className="w-full p-4 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-2xl text-left transition font-semibold text-stone-800 text-sm cursor-pointer"
                  >
                    💻 リモートワーク＆二拠点生活（ワーケーション拠点）
                  </button>
                </div>
              )}

              {quizStep === 2 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-stone-800 text-sm">Q3. 日南市内での希望ロケーションは？</h4>
                  <button
                    onClick={() => handleQuizAnswer('regionPreference', 'mountain')}
                    className="w-full p-4 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-2xl text-left transition font-semibold text-stone-800 text-sm cursor-pointer"
                  >
                    🌲 飫肥城下町・北郷温泉・酒谷の棚田など、歴史と森の里山エリア
                  </button>
                  <button
                    onClick={() => handleQuizAnswer('regionPreference', 'sea')}
                    className="w-full p-4 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-2xl text-left transition font-semibold text-stone-800 text-sm cursor-pointer"
                  >
                    🌊 油津港・南郷目井津・富土海岸など、海とサーフィンの沿岸エリア
                  </button>
                </div>
              )}

              {quizStep === 3 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-stone-800 text-sm">Q4. DIY・リフォームへの関心度は？</h4>
                  <button
                    onClick={() => handleQuizAnswer('diySkill', 'beginner')}
                    className="w-full p-4 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-2xl text-left transition font-semibold text-stone-800 text-sm cursor-pointer"
                  >
                    🌱 初心者（ペンキ塗りや畳替えなど軽度な作業希望）
                  </button>
                  <button
                    onClick={() => handleQuizAnswer('diySkill', 'advanced')}
                    className="w-full p-4 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-2xl text-left transition font-semibold text-stone-800 text-sm cursor-pointer"
                  >
                    🛠️ 本格派（床張りや壁塗り・ウッドデッキ自作もやりたい）
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl text-center">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
                  診断結果レポート
                </span>
                <h3 className="text-xl font-extrabold text-stone-900 mb-2">
                  {diagnosticResult.profileTitle}
                </h3>
                <p className="text-stone-700 text-sm max-w-lg mx-auto">
                  {diagnosticResult.description}
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-stone-900 text-base mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>あなたにベストマッチするおすすめ物件</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {diagnosticResult.recommendations.map(prop => (
                    <div
                      key={prop.id}
                      onClick={() => onSelectProperty(prop)}
                      className="bg-stone-50 border border-stone-200 rounded-2xl p-4 hover:border-emerald-700 transition cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-16/10 rounded-xl overflow-hidden mb-2">
                          <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 block">{prop.address}</span>
                        <h5 className="font-bold text-xs text-stone-900 line-clamp-2 mt-0.5 mb-2">{prop.title}</h5>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200">
                        <span className="font-extrabold text-amber-800">
                          {prop.price === 0 ? '0円' : `${(prop.price / 10000).toLocaleString()}万円`}
                        </span>
                        <span className="text-emerald-800 font-bold flex items-center gap-0.5">
                          詳細見る <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={resetQuiz}
                  className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5 mx-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>診断をやり直す</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
