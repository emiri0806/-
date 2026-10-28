import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini API client on server-side
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Gemini API features will run in fallback mode.');
      return null;
    }
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Route: Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Route: AI Consultation / Property Q&A
  app.post('/api/ai-consult', async (req, res) => {
    try {
      const { prompt, propertyContext, conversationType } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          reply: '【日南市空き家ナビ回答】日南市（飫肥・油津・南郷・北郷・酒谷・富土・吾田など）の空き家改修には「日南市空き家バンク活用補助金（最大150万円）」や「飫肥重伝建地区保存修景補助金（最大200万円）」を活用できます。まずは物件の屋根・水回りの状態を確認し、着工前に担当窓口「日南市 創客創人センター」（油津商店街 ittenほりかわ内）への事前相談・内見予約をおすすめします。',
          fallback: true
        });
      }

      let systemInstruction = `あなたは宮崎県日南市（飫肥城下町、油津港町、南郷海浜、北郷温泉・森林、酒谷・東郷里山、富土・鵜戸海岸）に特化した「日南市 空き家・古民家バンク＆移住定住」の専門AIコンシェルジュです。
丁寧で親しみやすく、かつ具体的・実用的なアドバイスを提供してください。
公式の担当相談窓口は「日南市 創客創人センター（油津商店街 ittenほりかわ内 / 移住定住・空き家ワンストップ窓口）」です。
日南市での0円無償譲渡物件の取得手続きや諸費用、飫肥杉を活用した古民家リノベーション費用の目安、DIYで削減できる部分、日南市の各種補助金制度（空き家改修補助金最大150万円、飫肥重伝建地区修景補助金最大200万円、移住定住奨励金、商店街活性化支援等）、南国・日南市でのスローライフ・サーフィン・ワーケーション・柑橘栽培・就農の注意点について簡潔かつ明確に回答してください。`;

      let fullPrompt = prompt;
      if (propertyContext) {
        fullPrompt = `対象物件情報:
【物件名】${propertyContext.title}
【所在地】${propertyContext.address}
【価格】${propertyContext.price === 0 ? '0円（無償譲渡）' : propertyContext.price + '円'}
【築年数・構造】築${new Date().getFullYear() - propertyContext.builtYear}年 (${propertyContext.builtYear}年築) / ${propertyContext.structure}
【間取り・面積】${propertyContext.layout} / 建物 ${propertyContext.buildingArea}㎡ / 土地 ${propertyContext.landArea}㎡
【状態】${propertyContext.conditionText}
【利用可能な補助金】${propertyContext.subsidyName}

質問内容: ${prompt}`;
      }

      if (conversationType === 'diagnostic') {
        systemInstruction += ` ユーザーの回答に基づいて、理想の空き家タイプ（0円DIY挑戦派、すぐ住める快適派、古民家カフェ開業派、二拠点ワーケーション派など）とおすすめの探し方を解説してください。`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || '申し訳ありません。回答を生成できませんでした。';

      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      return res.status(500).json({
        error: 'AI相談の処理中にエラーが発生しました。',
        details: error.message
      });
    }
  });

  // API Route: AI Property Listing Assessment (Owners)
  app.post('/api/evaluate-property', async (req, res) => {
    try {
      const { propertyData } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          evaluation: {
            recommendedPrice: '0円〜100万円（無償譲渡推奨または格安売却）',
            targetBuyers: 'DIY愛好家、地方移住希望者、二拠点生活者',
            keySellingPoints: [
              '自然豊かなロケーション',
              '手頃な広さとアレンジの自由度',
              '自治体の空き家リフォーム補助対象となり得る点'
            ],
            advice: '水回りの清掃と敷地内の雑草処理を行うと内見時の印象が劇的に良くなります。'
          },
          fallback: true
        });
      }

      const prompt = `以下の空き家売却・譲渡希望データを査定・分析し、JSON形式でアドバイスを出力してください。
所在地: ${propertyData.prefecture} ${propertyData.city}
構造/間取り: ${propertyData.structure} / ${propertyData.layout}
築年数: ${propertyData.builtYear}年築
建物面積: ${propertyData.buildingArea}㎡
希望価格: ${propertyData.price}円
現況: ${propertyData.conditionText}
物件概要: ${propertyData.description}

出力フォーマット（JSON厳守）:
{
  "recommendedPrice": "推奨される販売・譲渡価格帯のコメント",
  "targetBuyers": "最もマッチするターゲット層（例: DIY移住派、ワーケーション層など）",
  "keySellingPoints": ["アピールポイント1", "アピールポイント2", "アピールポイント3"],
  "advice": "売却・譲渡をスムーズに進めるための片付け・アピール改善のアドバイス"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const jsonString = response.text || '{}';
      const parsed = JSON.parse(jsonString);

      return res.json({ evaluation: parsed });
    } catch (error: any) {
      console.error('Error evaluating property:', error);
      return res.status(500).json({ error: '物件評価の処理に失敗しました。' });
    }
  });

  // Vite Middleware for Dev / Static for Prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vacant House Portal Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
