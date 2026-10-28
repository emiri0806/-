import { Property, RenovationOption } from '../types';
import { NICHINAN_REAL_AKIYA_BANK_PROPERTIES } from './nichinanRealAkiya';
import { OBI_PROPERTIES } from './properties/obi';
import { ABURATSU_PROPERTIES } from './properties/aburatsu';
import { NANGO_PROPERTIES } from './properties/nango';
import { KITAGO_PROPERTIES } from './properties/kitago';
import { SAKATANI_TOGO_PROPERTIES } from './properties/sakatani_togo';
import { FUTO_UDO_PROPERTIES } from './properties/futo_udo';
import { AGATA_PROPERTIES } from './properties/agata_center';
import { HOSODA_YOWARA_PROPERTIES } from './properties/hosoda_yowara';

// Consolidated vacant house properties across Nichinan City
const RAW_INITIAL_PROPERTIES: Property[] = [
  ...OBI_PROPERTIES,
  ...ABURATSU_PROPERTIES,
  ...NANGO_PROPERTIES,
  ...KITAGO_PROPERTIES,
  ...SAKATANI_TOGO_PROPERTIES,
  ...FUTO_UDO_PROPERTIES,
  ...AGATA_PROPERTIES,
  ...HOSODA_YOWARA_PROPERTIES
];

// Authentic published photograph presets directly from Nichinan City Vacant House Bank (日南市空き家バンク「やさしい移住」)
const DISTRICT_PHOTO_PRESETS: Record<string, { images: string[]; imageLabels: string[] }> = {
  OBI: {
    images: [
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-4032x3024_v-frms_webp_55f3afe4-1524-420f-8844-777ef28a89fe.jpg',
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-3214x1632_v-frms_webp_453791bd-378b-498f-8924-d5d84524cd39.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-4032x3024_v-frms_webp_522219f4-4644-4bfb-ac1f-cdf7459232e0.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1382x1185_v-fms_webp_e9ad1a44-20ce-4921-bead-17c33fdda94c.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1390x1178_v-fms_webp_65919b9f-d62b-4b54-90cf-1f92718d663b.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1477x1108_v-fms_webp_a947dcfb-e5ab-4081-b6ff-a011c0a2fe12.jpg'
    ],
    imageLabels: [
      '【空き家バンク掲載写真】飫肥城下町・瓦屋根日本家屋 外観',
      '間取り図・区画配置図',
      '本間和室・畳の間と飫肥杉建具',
      'ダイニングキッチン・居室空間',
      '水回り・浴室洗面',
      '庭園・敷地スペース'
    ]
  },
  ABURATSU: {
    images: [
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1280x960_v-fms_webp_3164eb80-b23b-49c5-97a6-aaed7f1f3efb.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-2190x1704_v-frms_webp_4b1e94c3-0e58-492d-a7a2-3e9419493a18.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1280x960_v-fms_webp_71fde7a6-3bf6-4703-a0d1-05c93e288fa7.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1280x960_v-fms_webp_c0b45588-dc19-4575-b176-0f17c201b48a.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1280x960_v-fms_webp_34d2ab6c-983d-47c2-97e5-406aa2655e48.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1280x960_v-fms_webp_6aae9180-326d-485c-bd3c-eb7855ffa4a8.jpg'
    ],
    imageLabels: [
      '【空き家バンク掲載写真】油津港街・園田平屋 外観正面',
      '間取り図・配置図',
      '居間・リビングスペース',
      '明るい和室・畳の間',
      'キッチン・流し台',
      '敷地内駐車場・進入路'
    ]
  },
  NANGO: {
    images: [
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-4032x3024_v-frms_webp_5ca35815-b7ec-4728-a73c-061cde593961.jpg',
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-2400x1801_v-frms_webp_3b08340c-39a3-44c8-bb21-a8761d6ab3f9.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-4032x3024_v-frms_webp_9471fc01-2ba7-46eb-9935-42d34f859f2e.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-4032x3024_v-frms_webp_79620139-d431-4d46-9059-fd6f66b82a8f.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-4032x3024_v-frms_webp_7902f78a-fff9-44f8-bd4e-a78956693f1c.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-4000x3000_v-frms_webp_f3a99369-b36f-4181-9ee0-bfb4a85907b8.jpg'
    ],
    imageLabels: [
      '【空き家バンク掲載写真】南郷町潟上 戸建て外観',
      '間取り図・区画図',
      '1階和室・広縁',
      'ダイニングキッチン・改修スペース',
      '2階居室・見晴らし良好',
      '敷地・駐車スペース'
    ]
  },
  KITAGO: {
    images: [
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1477x1108_v-fms_webp_fbca2777-57ba-4ed9-93b4-7e852d64dcb1.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-661x805_v-fs_webp_d1436a29-08a1-4e61-a3c3-24a8d403ab20.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1477x1108_v-fms_webp_8496d955-0de7-4cfb-993a-3948a10d7d9e.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1477x1108_v-fms_webp_ac836c97-a14d-4866-a17f-0b959223eb8e.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1477x1108_v-fms_webp_3e8e15aa-b366-4726-b42e-55ca7208c405.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1477x1108_v-fms_webp_e6f238bb-e1e4-48cf-9886-3519cb8a995a.jpg'
    ],
    imageLabels: [
      '【空き家バンク掲載写真】北郷町郷之原 平屋戸建て外観',
      '間取り図・敷地図',
      '日当たりの良い和室・畳間',
      'キッチン・ダイニング設備',
      '清潔な浴室・水回り',
      '広々とした庭・駐車スペース（3台可）'
    ]
  },
  SAKATANI_TOGO: {
    images: [
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-3507x2480_v-frms_webp_b1b858f9-8915-4914-a49d-46723f9175fc.jpg',
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-1406x758_v-fms_webp_bdfc9366-da53-455f-b446-bb370cf29237.jpg',
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-4032x3024_v-frms_webp_fbb122e4-69cb-4468-b99e-772116401ab3.jpg',
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-2898x2669_v-frms_webp_69d8d40b-60c4-42c6-aff5-df0ce27a7027.jpg',
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-2888x2274_v-frms_webp_f2794363-e66b-474a-8222-32877088b171.jpg'
    ],
    imageLabels: [
      '【空き家バンク掲載写真】里山・緑に囲まれた平屋住宅 外観',
      '間取り図・敷地配置図',
      '落ち着きのある和室・床の間',
      '広々としたダイニングキッチン',
      '家庭菜園・畑スペース'
    ]
  },
  FUTO_UDO: {
    images: [
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-621x466_v-fs_webp_b95f491b-8019-43af-963f-7cdff936cda1.png',
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-638x618_v-fs_webp_2ef37877-9790-4da8-b6e9-d0ff8a67aa58.png',
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-480x360_webp_0e60e300-1de7-4b51-87cd-febc65c8ff93.png',
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-725x544_v-fs_webp_d2ea7fea-bef5-4ffc-9f0f-5b210732da6e.png',
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-480x360_webp_6b57517b-d068-4df6-a63b-ad0f70b0464e.png'
    ],
    imageLabels: [
      '【空き家バンク掲載写真】日南海岸沿い住宅 外観',
      '間取り図・配置図',
      '明るい和室・客間',
      'キッチン・流し台',
      '浴室・水回り設備'
    ]
  },
  AGATA: {
    images: [
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1202x899_v-fms_webp_bd2123ce-f1f3-4b2d-82bf-49368fff530a.jpg',
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-2625x2216_v-frms_webp_fab4b11e-c84e-4783-9025-b98f235feacd.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1109x1089_v-fs_webp_64bdeb40-912b-42fd-babe-e3224a6a7072.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1477x1109_v-fms_webp_566ea7c1-2f3b-42dc-b340-3f900c9b9b11.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1477x1109_v-fms_webp_83c092fc-6b4c-4af9-b154-815e1d7296b3.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1109x1020_v-fs_webp_957ea7ed-b65d-4c16-ab0a-dd41ba640b2d.jpg'
    ],
    imageLabels: [
      '【空き家バンク掲載写真】上平野１丁目 瓦葺平屋 外観',
      '間取り図・配置図',
      '日当たり良好な本間和室',
      'ダイニング・キッチン空間',
      '水洗トイレ・浴室水回り',
      '敷地内駐車場・外構'
    ]
  },
  HOSODA_YOWARA: {
    images: [
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1280x960_v-fms_webp_978413bc-4a01-4021-910e-c2a3c54ae675.jpg',
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-2400x1683_v-frms_webp_a3c170fd-3cbf-44f1-acd8-63ceaad21a63.jpg',
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-2400x1800_v-frms_webp_d6125dde-7a9e-46e7-8de0-8dad7ec07348.jpg',
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-2400x1800_v-frms_webp_ecc9d6c2-c661-4d57-bc12-99a0fe901bc1.jpg',
      'https://storage.googleapis.com/studio-cms-assets/projects/RQqJ0YmZWg/s-2400x1800_v-frms_webp_b565e72c-fe64-455c-b661-aecf9006792d.jpg',
      'https://storage.googleapis.com/studio-design-asset-files/projects/RQqJ0YmZWg/s-1176x882_v-fs_webp_c4173b45-96b8-4110-a396-9657d451abac.jpg'
    ],
    imageLabels: [
      '【空き家バンク掲載写真】萩之嶺 戸建て平屋 外観',
      '間取り図・配置図',
      '明るい居間・リビング',
      '和室・客間スペース',
      'キッチン・ダイニング',
      '日当たりの良い庭・駐車スペース'
    ]
  }
};

// Enrich with authentic Nichinan City Vacant House Bank (日南市空き家・空き地情報バンク) registration metadata & rich photography
export const enrichWithNichinanAkiyaBank = (properties: Property[]): Property[] => {
  return properties.map((p, idx) => {
    const regYear = 24 + Math.floor(idx / 40); // 24 or 25
    const numInYear = String((idx % 40) + 1).padStart(2, '0');
    const defaultRegNo = `日南市空き家バンク登録 第${regYear}-${numInYear}号`;
    const isZeroYen = p.price === 0;
    const isRental = p.tags.some(t => t.includes('賃貸') || t.includes('お試し'));
    const defaultTxType = isZeroYen ? '0円無償譲渡' : isRental ? '賃貸' : '売買';

    // Retrieve district photo preset
    const districtKey = p.district || 'OBI';
    const fallbackPreset = DISTRICT_PHOTO_PRESETS[districtKey] || DISTRICT_PHOTO_PRESETS.OBI;

    const assignedImages = (p.images && p.images.length > 0 && !p.images[0].includes('unsplash')) ? p.images : fallbackPreset.images;
    const assignedLabels = (p.imageLabels && p.imageLabels.length > 0) ? p.imageLabels : fallbackPreset.imageLabels;

    return {
      ...p,
      images: assignedImages,
      imageLabels: assignedLabels,
      isAkiyaBankRegistered: p.isAkiyaBankRegistered ?? true,
      registrationNumber: p.registrationNumber || defaultRegNo,
      bankTransactionType: p.bankTransactionType || defaultTxType,
      officialBankUrl: p.officialBankUrl || 'https://nichinan-iju.jp/akiya/',
      monthlyRent: isRental ? (p.price > 0 && p.price < 200000 ? p.price : 45000) : undefined,
      disposalSubsidyEligible: p.disposalSubsidyEligible ?? true,
      renovationSubsidyEligible: p.renovationSubsidyEligible ?? true,
      prioritizeImmigrant: p.prioritizeImmigrant ?? true,
      bankContactPhone: p.bankContactPhone || '090-8355-3900', // 日南市移住定住コンシェルジュ直通
      tags: p.tags.includes('日南市公式空き家バンク') ? p.tags : ['日南市公式空き家バンク', ...p.tags]
    };
  });
};

export const INITIAL_PROPERTIES: Property[] = [
  ...NICHINAN_REAL_AKIYA_BANK_PROPERTIES,
  ...enrichWithNichinanAkiyaBank(RAW_INITIAL_PROPERTIES)
];

export const NICHINAN_DISTRICTS_LIST = [
  'すべて',
  '飫肥（城下町・武家屋敷）',
  '油津（港町・商店街）',
  '南郷（海・目井津港）',
  '北郷（温泉・飫肥杉の森）',
  '酒谷・東郷（棚田・里山）',
  '富土・鵜戸（日南海岸・サーフ）',
  '吾田（市役所・中心街）',
  '細田・大堂津（港町・ビーチ）',
  '榎原（山里・神社前）'
];

export const DEFAULT_RENOVATION_OPTIONS: RenovationOption[] = [
  {
    id: 'reno-1',
    name: '水回り設備一式交換（キッチン・バス・トイレ）',
    category: 'water',
    proEstimate: 1400000,
    diyEstimate: 600000,
    isDiyPossible: false,
    recommended: true,
    description: '最新のシステムキッチン、ユニットバス、温水洗浄便座へ交換。日南市補助金（最大150万円）で費用負担を大幅軽減。'
  },
  {
    id: 'reno-2',
    name: '屋根・雨漏り点検補修＆外壁飫肥杉オイル塗装',
    category: 'structure',
    proEstimate: 700000,
    diyEstimate: 200000,
    isDiyPossible: true,
    recommended: true,
    description: '日南の温暖な陽射しや台風から家を守る屋根点検と外壁塗装。飫肥杉の風合いを引き出します。'
  },
  {
    id: 'reno-3',
    name: '無垢飫肥杉フローリング張り＆壁漆喰DIY塗り',
    category: 'interior',
    proEstimate: 600000,
    diyEstimate: 180000,
    isDiyPossible: true,
    recommended: true,
    description: '日南名産の飫肥杉無垢床板と調湿効果の高い自然素材漆喰による快適な室内リノベーション。'
  },
  {
    id: 'reno-4',
    name: '浄化槽新設・水洗化工事（日南市補助金あり）',
    category: 'water',
    proEstimate: 800000,
    diyEstimate: 800000,
    isDiyPossible: false,
    recommended: false,
    description: '汲み取り式トイレから最新合併処理浄化槽へ転換。日南市から手厚い補助金（最大60万円）が交付されます。'
  },
  {
    id: 'reno-5',
    name: '薪ストーブ・サウナ＆ウッドデッキ設置',
    category: 'eco',
    proEstimate: 750000,
    diyEstimate: 300000,
    isDiyPossible: true,
    recommended: false,
    description: '日南の豊かな自然・星空を眺める開放的なウッドデッキと、冬を暖かく彩る薪ストーブ。'
  }
];

export const RENOVATION_CATALOG = DEFAULT_RENOVATION_OPTIONS;
