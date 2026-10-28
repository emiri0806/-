export interface Property {
  id: string;
  title: string;
  address: string;
  prefecture: string;
  city: string;
  price: number; // In JPY (0 means 0円物件)
  estimatedRenovationCost: number; // Default base estimate in JPY
  availableSubsidy: number; // Local grant amount in JPY
  subsidyName: string;
  landArea: number; // sq meters
  buildingArea: number; // sq meters
  builtYear: number; // e.g. 1978
  structure: string; // e.g., 木造2階建て
  layout: string; // e.g., 5LDK
  images: string[];
  imageLabels?: string[]; // 写真キャプション（外観、和室・飫肥杉梁、縁側、キッチン、水回り、庭園等）
  tags: string[]; // e.g., "0円物件", "古民家", "菜園付き", "DIY向け", "即入居可", "移住補助対象"
  description: string;
  conditionLevel: 'good' | 'minor_repair' | 'full_renovation' | 'major_renovation' | 'diy_only';
  conditionText: string;
  accessInfo: string;
  annualTaxEstimate: number; // JPY per year
  rebuildingPossible: boolean; // 再建築可否
  parking: string; // e.g. 2台分あり
  waterSewer: string; // e.g. 井戸水・汲み取り / 上下水道完備
  highlights: string[];
  ownerMessage?: string;
  coordinates: { lat: number; lng: number };
  district?: string; // e.g. 'OBI' | 'ABURATSU' | 'NANGO' | 'KITAGO' | 'SAKATANI_TOGO' | 'FUTO_UDO' | 'AGATA' | 'HOSODA_OTOTSU' | 'ENOHARA'
  // Rich detailed fields
  vacantPeriod?: string; // 空き家期間 (e.g. 約1年半)
  roadAccess?: string; // 接道状況
  internetEnv?: string; // 光回線・通信環境
  schoolDistrict?: string; // 小・中学校学区
  nearbyFacilities?: string; // 周辺のスーパー・病院・コンビニ等
  zoning?: string; // 都市計画・用途地域
  buildingCoverage?: string; // 建ぺい率・容積率
  roofCondition?: string; // 屋根・外壁の状態
  interiorCondition?: string; // 室内・床・畳の状態
  waterFacilityDetail?: string; // 水回り設備詳細
  recommendedUsage?: string; // おすすめの活用方法（住居、店舗、民泊、工房等）
  contactDesk?: string; // 担当窓口
  // Official Nichinan City Vacant House Bank fields
  isAkiyaBankRegistered?: boolean; // 日南市公式空き家バンク登録物件
  registrationNumber?: string; // 登録番号 例: "日南市空き家バンク登録 第24-03号"
  bankTransactionType?: '売買' | '賃貸' | '売買・賃貸' | '0円無償譲渡'; // 取引形態
  officialBankUrl?: string; // 日南市空き家バンク公式詳細URL
  monthlyRent?: number; // 賃貸の場合の月額賃料 (円)
  disposalSubsidyEligible?: boolean; // 日南市家財道具等処分補助金（最大10万円）対象
  renovationSubsidyEligible?: boolean; // 日南市空き家活用リフォーム補助金（最大150万円）対象
  prioritizeImmigrant?: boolean; // 市外・県外からの移住者優先枠
  bankContactPhone?: string; // 移住定住コンシェルジュ / 空き家カウンセラー直通番号
}

export interface PropertyFilter {
  keyword: string;
  prefecture: string;
  maxPrice: number; // Max price slider (e.g. 1000万円, 0 means 0円 only, 1500万 means all)
  onlyZeroYen: boolean;
  selectedTags: string[];
  condition: string;
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'renovation_low';
}

export interface RenovationOption {
  id: string;
  name: string;
  category: 'water' | 'structure' | 'interior' | 'eco';
  proEstimate: number;
  diyEstimate: number;
  isDiyPossible: boolean;
  recommended: boolean;
  description: string;
}

export interface AiConsultMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedProperties?: Property[];
}

export interface PropertyRegistration {
  title: string;
  prefecture: string;
  city: string;
  address: string;
  price: number;
  layout: string;
  structure: string;
  builtYear: number;
  landArea: number;
  buildingArea: number;
  conditionText: string;
  description: string;
  ownerName: string;
  contactEmail: string;
  contactPhone: string;
  imageUrl: string;
}
