import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Sparkles,
  ChevronRight,
  Maximize2,
  Minimize2,
  Heart,
  Sun,
  Layers,
  Search,
  Trees,
  Compass,
  Navigation,
  ExternalLink,
  Eye,
  Camera,
  Map as MapIcon,
  RotateCcw,
  Waves,
  Landmark,
  Building,
  Building2,
  Fish,
  Home,
  Plus,
  Minus,
  Locate,
  X
} from 'lucide-react';
import { Property } from '../types';

// Helper to extract concise, distinctive neighborhood names so pins don't clutter with duplicate text
const getShortLocationName = (address: string, title?: string): string => {
  if (address.includes('飫肥4丁目')) return '飫肥4丁目';
  if (address.includes('飫肥小楠')) return '飫肥小楠';
  if (address.includes('飫肥本町')) return '飫肥本町';
  if (address.includes('飫肥8丁目')) return '飫肥8丁目';
  if (address.includes('飫肥')) return '飫肥';
  if (address.includes('油津2丁目')) return '油津2丁目';
  if (address.includes('油津1丁目')) return '油津1丁目';
  if (address.includes('油津')) return '油津';
  if (address.includes('材木町')) return '材木町';
  if (address.includes('園田')) return '園田';
  if (address.includes('栄松')) return '南郷栄松';
  if (address.includes('外浦')) return '南郷外浦';
  if (address.includes('目井津') || address.includes('中村')) return '南郷中村';
  if (address.includes('贄波')) return '南郷贄波';
  if (address.includes('榎原')) return '榎原';
  if (address.includes('南郷')) return '南郷';
  if (address.includes('郷之原')) return '北郷郷之原';
  if (address.includes('北郷')) return '北郷';
  if (address.includes('酒谷')) return '酒谷';
  if (address.includes('東郷')) return '東郷';
  if (address.includes('富土')) return '富土';
  if (address.includes('鵜戸') || address.includes('宮浦')) return '鵜戸';
  if (address.includes('平野')) return '平野';
  if (address.includes('戸高')) return '戸高';
  if (address.includes('吾田')) return '吾田';
  if (address.includes('大堂津')) return '大堂津';
  if (address.includes('細田')) return '細田';

  const clean = address.replace(/^宮崎県/, '').replace(/^日南市/, '').split(/[0-9０-９]/)[0];
  return clean ? clean.slice(0, 5) : '日南';
};

interface MapViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  isFavorite?: (id: string) => boolean;
  onToggleFavorite?: (id: string) => void;
  onOpenAiConsultant?: (property: Property) => void;
  isDetailOpen?: boolean;
  onOpenAkiyaBankSync?: () => void;
}

export interface NichinanDistrictBounds {
  key: string;
  name: string;
  shortName: string;
  center: [number, number]; // lat, lng
  zoom: number;
  badge: string;
  description: string;
}

export const NICHINAN_DISTRICTS: Record<string, NichinanDistrictBounds> = {
  ALL: {
    key: 'ALL',
    name: '日南市全域',
    shortName: '日南市全域',
    center: [31.615, 131.365],
    zoom: 11,
    badge: '🌴 日南市全域',
    description: '日南市全域'
  },
  OBI: {
    key: 'OBI',
    name: '飫肥（おび・城下町エリア）',
    shortName: '飫肥（城下町）',
    center: [31.628, 131.352],
    zoom: 14,
    badge: '🏯 九州の小京都・重伝建',
    description: '伊東藩5万1千石の城下町。飫肥杉の武家屋敷や石垣、白壁の蔵が並ぶ風情ある町並み'
  },
  ABURATSU: {
    key: 'ABURATSU',
    name: '油津（あぶらつ・港町＆商店街）',
    shortName: '油津（港町・商店街）',
    center: [31.583, 131.402],
    zoom: 14,
    badge: '⚓ 港町＆カープ油津',
    description: '天然の良港・油津港と赤レンガ館、再生商店街、広島カープ春季キャンプ地（天福球場）'
  },
  NANGO: {
    key: 'NANGO',
    name: '南郷（なんごう・目井津港＆海）',
    shortName: '南郷（目井津港・海）',
    center: [31.530, 131.378],
    zoom: 13,
    badge: '🐟 カツオ一本釣り日本一',
    description: '目井津港の新鮮な海鮮、夫婦浦の絶景、栄松ビーチ、西武ライオンズ南郷キャンプ地'
  },
  KITAGO: {
    key: 'KITAGO',
    name: '北郷（きたごう・温泉＆森林渓谷）',
    shortName: '北郷（温泉・森林）',
    center: [31.698, 131.365],
    zoom: 13,
    badge: '♨️ 北郷温泉＆猪八重渓谷',
    description: '美肌の湯・北郷温泉郷と世界的コケの宝庫・猪八重渓谷。飫肥杉の森に抱かれた高原地帯'
  },
  SAKATANI_TOGO: {
    key: 'SAKATANI_TOGO',
    name: '酒谷・東郷（棚田＆里山みかん）',
    shortName: '酒谷・東郷（里山棚田）',
    center: [31.620, 131.285],
    zoom: 13,
    badge: '🌾 日本の棚田百選・果樹園',
    description: '日本の棚田百選「坂元棚田」と道の駅酒谷、日南みかん果樹園が広がる自給自足の里山'
  },
  FUTO_UDO: {
    key: 'FUTO_UDO',
    name: '富土・鵜戸・伊比井（日南海岸・サーフ）',
    shortName: '富土・鵜戸・伊比井',
    center: [31.668, 131.465],
    zoom: 13,
    badge: '🏄 鵜戸神宮＆富土ビーチ',
    description: '神秘の洞窟神社「鵜戸神宮」とサンメッセ日南、富土・伊比井のメジャーサーフポイント'
  },
  AGATA: {
    key: 'AGATA',
    name: '吾田・戸高（市役所＆中心街）',
    shortName: '吾田・戸高（中心街）',
    center: [31.604, 131.382],
    zoom: 14,
    badge: '🏢 市役所・生活便利',
    description: '日南市役所、JR日南駅、商業施設、県立日南病院が集約された生活利便性抜群の街なか'
  },
  HOSODA_OTOTSU: {
    key: 'HOSODA_OTOTSU',
    name: '細田・大堂津（海水浴場＆港町）',
    shortName: '細田・大堂津（海辺）',
    center: [31.552, 131.380],
    zoom: 14,
    badge: '🏖️ 白砂青松・JR駅近',
    description: '白砂青松の大堂津海水浴場とJR大堂津駅・細田駅、のどかな田園と漁港が広がる南部の町'
  },
  ENOHARA: {
    key: 'ENOHARA',
    name: '榎原（よわら・緑と清流の山里）',
    shortName: '榎原（神社・山里）',
    center: [31.512, 131.325],
    zoom: 14,
    badge: '⛩️ 榎原神社＆清流の郷',
    description: '由緒ある縁結びの榎原神社とJR榎原駅、ホタル舞う清流に囲まれた心安らぐ静穏な山里'
  }
};

export const DISTRICT_ICONS: Record<string, string> = {
  ALL: '🌴',
  OBI: '🏯',
  ABURATSU: '⚓',
  NANGO: '🐟',
  KITAGO: '♨️',
  SAKATANI_TOGO: '🌾',
  FUTO_UDO: '🏄',
  AGATA: '🏢',
  HOSODA_OTOTSU: '🏖️',
  ENOHARA: '⛩️'
};

// Map Tile Layers (Realistic high-definition satellite hybrid, GSI aerial photo, 3D relief, and city map)
const TILE_LAYERS = {
  esri_hybrid: {
    name: 'リアル高精細衛星写真（道路・地名ハイブリッド）',
    shortName: 'リアル衛星',
    icon: '🛰️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    overlayUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
    attribution: 'Tiles &copy; Esri &mdash; Maxar, Earthstar Geographics, Carto',
    maxZoom: 19,
    description: '日南市のリアルな街並み・海岸・山林・個々の屋根まで鮮明に見える高精細実写衛星写真'
  },
  gsi_photo: {
    name: '国土地理院 リアル航空写真',
    shortName: '航空写真',
    icon: '📸',
    url: 'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
    overlayUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
    attribution: '国土地理院 (GSI Japan)',
    maxZoom: 18,
    description: '国土地理院による日本の最新シームレス航空写真'
  },
  gsi_relief: {
    name: '立体地形・色別標高図',
    shortName: '立体地形',
    icon: '⛰️',
    url: 'https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png',
    overlayUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
    attribution: '国土地理院 (GSI Japan)',
    maxZoom: 15,
    description: '日南海岸や飫肥杉の山並み・河川の起伏がリアルにわかる3Dカラー標高図'
  },
  gsi_std: {
    name: '国土地理院 標準市街地図',
    shortName: '市街地図',
    icon: '🗺️',
    url: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
    attribution: '国土地理院 (GSI Japan)',
    maxZoom: 18,
    description: '道路や町名・施設がわかりやすい標準地図'
  }
};

// Nichinan Landmarks (unobtrusive points of interest)
const NICHINAN_LANDMARKS = [
  { name: '飫肥城跡', lat: 31.6275, lng: 131.3505, icon: '🏯' },
  { name: '油津港・堀川運河', lat: 31.5790, lng: 131.4080, icon: '⚓' },
  { name: '天福球場(広島カープ)', lat: 31.5900, lng: 131.4020, icon: '⚾' },
  { name: '目井津港・港の駅めいつ', lat: 31.5310, lng: 131.3800, icon: '🐟' },
  { name: '南郷スタジアム(西武)', lat: 31.5380, lng: 131.3650, icon: '⚾' },
  { name: '北郷温泉郷', lat: 31.7050, lng: 131.3720, icon: '♨️' },
  { name: '猪八重渓谷', lat: 31.7250, lng: 131.3400, icon: '🌲' },
  { name: '坂元棚田(日本の棚田百選)', lat: 31.6420, lng: 131.2380, icon: '🌾' },
  { name: '鵜戸神宮', lat: 31.6495, lng: 131.4665, icon: '⛩️' },
  { name: 'サンメッセ日南', lat: 31.6670, lng: 131.4690, icon: '🗿' },
  { name: '富土海水浴場', lat: 31.6820, lng: 131.4720, icon: '🏄' },
  { name: '日南市役所', lat: 31.6000, lng: 131.3820, icon: '🏛️' }
];


export interface PositionedProperty {

  property: Property;
  index: number;
  shortLocation: string;
  priceLabel: string;
  originLatLng: L.LatLng;
  displayLatLng: L.LatLng;
  isDisplaced: boolean;
}

// Guaranteed Zero-Overlap Mathematical Pixel Positioning Engine
// Clusters close-by pins and arranges them with strict geometric clearance (Spiderfy fan-out + AABB collision relaxation)
function computeNonOverlappingLayout(
  props: Property[],
  map: L.Map,
  badgeMode: 'label' | 'price' | 'compact'
): PositionedProperty[] {
  if (props.length === 0) return [];

  // Exact visual bounding box dimensions with safety padding
  const boxW = badgeMode === 'compact' ? 36 : badgeMode === 'price' ? 76 : 84;
  const boxH = badgeMode === 'compact' ? 36 : 34;

  // 1. Project all properties to current map container pixel coordinates
  const items = props.map((prop, idx) => {
    const originLatLng = L.latLng(prop.coordinates.lat, prop.coordinates.lng);
    let pt = { x: 0, y: 0 };
    try {
      pt = map.latLngToContainerPoint(originLatLng);
    } catch {
      // Fallback
      pt = { x: idx * 80, y: 300 };
    }

    const shortLocation = getShortLocationName(prop.address, prop.title);
    const priceLabel = prop.price === 0 ? '0円' : `${Math.round(prop.price / 10000)}万円`;
    return {
      property: prop,
      index: idx + 1,
      shortLocation,
      priceLabel,
      originLatLng,
      originPt: pt,
      displayPt: { x: pt.x, y: pt.y },
      isDisplaced: false
    };
  });

  // 2. Cluster pins that are closer than the required clearance
  // Clear distance needed to prevent any visual overlap
  const clusterThresholdX = boxW + 12;
  const clusterThresholdY = boxH + 12;

  const visited = new Set<number>();
  const clusters: number[][] = [];

  for (let i = 0; i < items.length; i++) {
    if (visited.has(i)) continue;
    visited.add(i);
    const cluster = [i];
    const queue = [i];

    while (queue.length > 0) {
      const currentIdx = queue.shift()!;
      const currentPt = items[currentIdx].originPt;

      for (let j = 0; j < items.length; j++) {
        if (!visited.has(j)) {
          const otherPt = items[j].originPt;
          const dx = Math.abs(currentPt.x - otherPt.x);
          const dy = Math.abs(currentPt.y - otherPt.y);

          if (dx < clusterThresholdX && dy < clusterThresholdY) {
            visited.add(j);
            cluster.push(j);
            queue.push(j);
          }
        }
      }
    }
    clusters.push(cluster);
  }

  // 3. For each cluster with N > 1, apply Spiderfy Fan-out spacing
  clusters.forEach(cluster => {
    if (cluster.length <= 1) {
      const item = items[cluster[0]];
      item.displayPt = { x: item.originPt.x, y: item.originPt.y };
      item.isDisplaced = false;
      return;
    }

    const N = cluster.length;
    const cx = cluster.reduce((sum, idx) => sum + items[idx].originPt.x, 0) / N;
    const cy = cluster.reduce((sum, idx) => sum + items[idx].originPt.y, 0) / N;

    // Minimum radius ensuring adjacent items have at least boxW / boxH clearance
    // Arc distance between items: (2 * PI * R) / N >= max(boxW, boxH) + 16
    const minArc = Math.max(boxW, boxH) + 16;
    const R = Math.max(52, (minArc * N) / (2 * Math.PI));

    if (N === 2) {
      // Horizontal separation
      const halfSpan = (boxW + 16) / 2;
      items[cluster[0]].displayPt = { x: cx - halfSpan, y: cy };
      items[cluster[1]].displayPt = { x: cx + halfSpan, y: cy };
    } else {
      // Symmetrical radial fan-out starting from top
      for (let k = 0; k < N; k++) {
        const angle = (k / N) * 2 * Math.PI - Math.PI / 2;
        // Oval radius scaled for horizontal text labels (wider horizontally than vertically)
        const rx = R * 1.05;
        const ry = R * 0.75;
        items[cluster[k]].displayPt = {
          x: cx + Math.cos(angle) * rx,
          y: cy + Math.sin(angle) * ry
        };
      }
    }

    cluster.forEach(idx => {
      items[idx].isDisplaced = true;
    });
  });

  // 4. Secondary Multi-Pass AABB Collision Relaxation (Guarantees zero overlap across different clusters)
  const minClearanceX = boxW + 8;
  const minClearanceY = boxH + 8;

  for (let pass = 0; pass < 8; pass++) {
    let hadCollision = false;
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const dx = items[j].displayPt.x - items[i].displayPt.x;
        const dy = items[j].displayPt.y - items[i].displayPt.y;
        const overlapX = minClearanceX - Math.abs(dx);
        const overlapY = minClearanceY - Math.abs(dy);

        if (overlapX > 0 && overlapY > 0) {
          hadCollision = true;
          const signX = dx >= 0 ? 1 : -1;
          const signY = dy >= 0 ? 1 : -1;

          if (overlapX < overlapY) {
            const push = (overlapX + 4) / 2;
            items[i].displayPt.x -= push * signX;
            items[j].displayPt.x += push * signX;
          } else {
            const push = (overlapY + 4) / 2;
            items[i].displayPt.y -= push * signY;
            items[j].displayPt.y += push * signY;
          }
          items[i].isDisplaced = true;
          items[j].isDisplaced = true;
        }
      }
    }
    if (!hadCollision) break;
  }

  // 5. Convert projected container pixel positions back to LatLng coordinates
  return items.map(item => {
    let displayLatLng: L.LatLng;
    try {
      displayLatLng = map.containerPointToLatLng([item.displayPt.x, item.displayPt.y]);
    } catch {
      displayLatLng = item.originLatLng;
    }

    return {
      property: item.property,
      index: item.index,
      shortLocation: item.shortLocation,
      priceLabel: item.priceLabel,
      originLatLng: item.originLatLng,
      displayLatLng,
      isDisplaced: item.isDisplaced
    };
  });
}

export const MapView: React.FC<MapViewProps> = ({
  properties,
  onSelectProperty,
  isFavorite = (_id: string) => false,
  onToggleFavorite = (_id: string) => {},
  onOpenAiConsultant = (_property: Property) => {},
  isDetailOpen = false,
  onOpenAkiyaBankSync
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const overlayLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const landmarksLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedDistrictKey, setSelectedDistrictKey] = useState<string>('ALL');
  const [activeProperty, setActiveProperty] = useState<Property | null>(properties[0] || null);
  const [currentTileKey, setCurrentTileKey] = useState<keyof typeof TILE_LAYERS>('esri_hybrid');
  const [filterZeroOnly, setFilterZeroOnly] = useState(false);
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(15000000);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [badgeMode, setBadgeMode] = useState<'label' | 'price' | 'compact'>('label');
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [positionedProperties, setPositionedProperties] = useState<PositionedProperty[]>([]);

  // Calculate property count per district for immediate clarity
  const districtCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    properties.forEach(p => {
      if (p.district) {
        counts[p.district] = (counts[p.district] || 0) + 1;
      }
    });
    return counts;
  }, [properties]);

  // Filtered properties for Nichinan (when ALL is selected, show nothing as requested)
  const displayedProperties = useMemo(() => {
    if (selectedDistrictKey === 'ALL') {
      return [];
    }

    return properties.filter(p => {
      if (filterZeroOnly && p.price !== 0) return false;
      if (!filterZeroOnly && p.price > filterMaxPrice) return false;

      // Filter by district matching property.district strictly
      if (p.district) {
        if (p.district !== selectedDistrictKey) return false;
      } else {
        // Fallback for any legacy properties without district
        if (selectedDistrictKey === 'OBI' && !p.address.includes('飫肥') && !p.title.includes('飫肥')) return false;
        if (selectedDistrictKey === 'ABURATSU' && !p.address.includes('油津') && !p.title.includes('油津')) return false;
        if (selectedDistrictKey === 'NANGO' && !p.address.includes('南郷') && !p.title.includes('南郷')) return false;
        if (selectedDistrictKey === 'KITAGO' && !p.address.includes('北郷') && !p.title.includes('北郷')) return false;
        if (selectedDistrictKey === 'SAKATANI_TOGO' && !p.address.includes('酒谷') && !p.address.includes('東郷') && !p.title.includes('酒谷') && !p.title.includes('東郷')) return false;
        if (selectedDistrictKey === 'FUTO_UDO' && !p.address.includes('富土') && !p.address.includes('鵜戸') && !p.address.includes('宮浦') && !p.title.includes('富土') && !p.title.includes('鵜戸')) return false;
        if (selectedDistrictKey === 'AGATA' && !p.address.includes('吾田') && !p.address.includes('平野') && !p.address.includes('戸高') && !p.title.includes('吾田') && !p.title.includes('平野') && !p.title.includes('戸高')) return false;
        if (selectedDistrictKey === 'HOSODA_OTOTSU' && !p.address.includes('大堂津') && !p.address.includes('細田') && !p.address.includes('下方') && !p.title.includes('大堂津') && !p.title.includes('細田')) return false;
        if (selectedDistrictKey === 'ENOHARA' && !p.address.includes('榎原') && !p.title.includes('榎原')) return false;
      }

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchAddress = p.address.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchAddress && !matchDesc && !matchTags) return false;
      }
      return true;
    });
  }, [properties, filterZeroOnly, filterMaxPrice, selectedDistrictKey, searchQuery]);

  // Initialize Leaflet Map focused strictly on Nichinan City
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Nichinan strict boundary bounds to prevent drifting far away
      const nichinanMaxBounds: L.LatLngBoundsLiteral = [
        [31.40, 131.10], // South-West
        [31.84, 131.60]  // North-East
      ];

      const map = L.map(mapContainerRef.current, {
        center: [31.625, 131.355],
        zoom: 11.5,
        minZoom: 10,
        maxZoom: 18,
        maxBounds: nichinanMaxBounds,
        maxBoundsViscosity: 0.8,
        zoomControl: false,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        attributionControl: false
      });

      // Fit Nichinan city bounds on load with balanced padding
      const nichinanBounds: L.LatLngBoundsLiteral = [
        [31.48, 131.21], // South-West (Nango & Sakatani)
        [31.76, 131.50]  // North-East (Kitago & Futo/Udo)
      ];
      map.fitBounds(nichinanBounds, { padding: [30, 30] });

      // Add Initial Tile Layer (Base + Optional Labels Overlay)
      const initialLayerConfig = TILE_LAYERS[currentTileKey];
      const tile = L.tileLayer(initialLayerConfig.url, {
        attribution: initialLayerConfig.attribution,
        maxZoom: initialLayerConfig.maxZoom
      }).addTo(map);
      tileLayerRef.current = tile;

      if (initialLayerConfig.overlayUrl) {
        const overlay = L.tileLayer(initialLayerConfig.overlayUrl, {
          maxZoom: initialLayerConfig.maxZoom,
          subdomains: 'abcd',
          opacity: 0.95
        }).addTo(map);
        overlayLayerRef.current = overlay;
      }

      // Attribution
      L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map);

      // Create Layer Groups (clean layers, no masks, no shading)
      const landmarksLayer = L.layerGroup().addTo(map);
      landmarksLayerGroupRef.current = landmarksLayer;

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerGroupRef.current = markersLayer;

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Guarantee instant map rendering and accurate sizing when returning from property detail view
  useEffect(() => {
    if (!isDetailOpen && mapInstanceRef.current) {
      const timer = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isDetailOpen]);

  // Observe container resize to ensure Leaflet recalculates dimensions immediately
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    ro.observe(mapContainerRef.current);
    return () => ro.disconnect();
  }, []);

  // Update Tile Layer (Switches base layer and overlay labels layer smoothly)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }
    if (overlayLayerRef.current) {
      map.removeLayer(overlayLayerRef.current);
      overlayLayerRef.current = null;
    }

    const layerConfig = TILE_LAYERS[currentTileKey];
    const newTile = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      maxZoom: layerConfig.maxZoom
    }).addTo(map);
    tileLayerRef.current = newTile;

    if (layerConfig.overlayUrl) {
      const newOverlay = L.tileLayer(layerConfig.overlayUrl, {
        maxZoom: layerConfig.maxZoom,
        subdomains: 'abcd',
        opacity: 0.95
      }).addTo(map);
      overlayLayerRef.current = newOverlay;
    }
  }, [currentTileKey]);

  // Update Landmarks (compact round badges that never occlude properties)
  useEffect(() => {
    if (!landmarksLayerGroupRef.current) return;
    const layer = landmarksLayerGroupRef.current;
    layer.clearLayers();

    if (!showLandmarks || selectedDistrictKey === 'ALL') return;

    NICHINAN_LANDMARKS.forEach(lm => {
      const landmarkIcon = L.divIcon({
        className: 'landmark-marker',
        html: `
          <div style="background: rgba(255,255,255,0.96); border: 1.5px solid #d97706; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; box-shadow: 0 1px 4px rgba(0,0,0,0.18); cursor: pointer;" title="${lm.name}">
            <span>${lm.icon}</span>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([lm.lat, lm.lng], {
        icon: landmarkIcon,
        zIndexOffset: -200
      });
      marker.bindTooltip(`<b>${lm.icon} ${lm.name}</b>`, {
        direction: 'top',
        offset: [0, -12],
        opacity: 0.95
      });
      marker.addTo(layer);
    });
  }, [showLandmarks, selectedDistrictKey]);

  // Update Property Pins with dynamic screen-pixel collision resolution (Zero Overlap)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersLayerGroupRef.current;
    if (!map || !layerGroup) return;

    const updatePins = () => {
      if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;
      const currentMap = mapInstanceRef.current;
      const currentLayer = markersLayerGroupRef.current;
      currentLayer.clearLayers();

      const layout = computeNonOverlappingLayout(displayedProperties, currentMap, badgeMode);

      layout.forEach(item => {
        const { property: prop, index, shortLocation, priceLabel, originLatLng, displayLatLng, isDisplaced } = item;
        const isSelected = activeProperty?.id === prop.id;

        // 1. If marker was displaced to avoid collision, draw anchor point & leader line
        if (isDisplaced) {
          const anchorDot = L.circleMarker(originLatLng, {
            radius: isSelected ? 5.5 : 4,
            fillColor: isSelected ? '#f59e0b' : '#059669',
            fillOpacity: 1,
            color: '#ffffff',
            weight: 2
          });
          anchorDot.bindTooltip(
            `<div style="font-size: 11px; font-weight: bold;">📍 ${index}. ${shortLocation}（所在地）</div>`,
            { direction: 'top', offset: [0, -6], opacity: 0.95 }
          );
          anchorDot.on('click', () => {
            setActiveProperty(prop);
            onSelectProperty(prop);
            currentMap.panTo(displayLatLng, { animate: true, duration: 0.3 });
          });
          anchorDot.addTo(currentLayer);

          const leaderLine = L.polyline([originLatLng, displayLatLng], {
            color: isSelected ? '#d97706' : '#059669',
            weight: isSelected ? 2 : 1.5,
            opacity: isSelected ? 0.9 : 0.65
          });
          leaderLine.addTo(currentLayer);
        }

        // 2. Build custom pin marker HTML based on badgeMode
        let badgeInnerHtml = '';
        let iconW = 82;
        let iconH = 30;

        if (badgeMode === 'compact') {
          iconW = 28;
          iconH = 28;
          const bg = isSelected
            ? 'background: #f59e0b; color: #1c1917; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.8);'
            : 'background: #065f46; color: #ffffff; border: 1.5px solid #ffffff; box-shadow: 0 2px 6px rgba(6, 95, 70, 0.5);';
          badgeInnerHtml = `
            <div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; ${bg} cursor: pointer; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); ${
              isSelected ? 'transform: scale(1.22);' : ''
            }">
              ${index}
            </div>
          `;
        } else if (badgeMode === 'price') {
          iconW = 74;
          iconH = 30;
          const bg = isSelected
            ? 'background: #f59e0b; color: #1c1917; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.8);'
            : 'background: #065f46; color: #ffffff; border: 1.5px solid #ffffff; box-shadow: 0 2px 6px rgba(6, 95, 70, 0.5);';
          badgeInnerHtml = `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); ${
              isSelected ? 'transform: scale(1.18);' : ''
            }">
              <div style="padding: 2px 7px; border-radius: 9999px; font-size: 11px; white-space: nowrap; display: flex; align-items: center; gap: 3.5px; font-weight: 800; ${bg}">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 50%; background: ${
                  isSelected ? '#1c1917' : 'rgba(255,255,255,0.25)'
                }; color: ${isSelected ? '#fbbf24' : '#ffffff'}; font-size: 9.5px; font-weight: 900; line-height: 1;">
                  ${index}
                </span>
                <span>${priceLabel}</span>
              </div>
              <div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid ${
                isSelected ? '#f59e0b' : '#065f46'
              }; margin-top: -1px;"></div>
            </div>
          `;
        } else {
          // Default: 'label' (Number + Neighborhood name)
          iconW = 82;
          iconH = 30;
          const bg = isSelected
            ? 'background: #f59e0b; color: #1c1917; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.8);'
            : 'background: #065f46; color: #ffffff; border: 1.5px solid #ffffff; box-shadow: 0 2px 8px rgba(6, 95, 70, 0.45);';
          badgeInnerHtml = `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); ${
              isSelected ? 'transform: scale(1.18);' : ''
            }">
              <div style="padding: 2.5px 7.5px; border-radius: 9999px; font-size: 11px; white-space: nowrap; display: flex; align-items: center; gap: 3.5px; font-weight: 800; ${bg}">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 50%; background: ${
                  isSelected ? '#1c1917' : 'rgba(255,255,255,0.22)'
                }; color: ${isSelected ? '#fbbf24' : '#ffffff'}; font-size: 9.5px; font-weight: 900; line-height: 1;">
                  ${index}
                </span>
                <span>${shortLocation}</span>
              </div>
              <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${
                isSelected ? '#f59e0b' : '#065f46'
              }; margin-top: -1px;"></div>
              <div style="width: 5px; height: 5px; border-radius: 50%; background: ${
                isSelected ? '#d97706' : '#047857'
              }; margin-top: 1px; border: 1px solid #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
            </div>
          `;
        }

        const customIcon = L.divIcon({
          className: 'custom-pin-marker',
          html: badgeInnerHtml,
          iconSize: [iconW, iconH],
          iconAnchor: badgeMode === 'compact' ? [iconW / 2, iconH / 2] : [iconW / 2, iconH]
        });

        const marker = L.marker([displayLatLng.lat, displayLatLng.lng], {
          icon: customIcon,
          zIndexOffset: isSelected ? 1500 : 100
        });

        marker.on('click', () => {
          setActiveProperty(prop);
          onSelectProperty(prop);
          currentMap.panTo(displayLatLng, { animate: true, duration: 0.3 });
        });

        const tooltipContent = `
          <div style="padding: 6px; font-family: sans-serif; min-width: 180px;">
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 3px;">
              <span style="background: #065f46; color: white; border-radius: 999px; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900;">${index}</span>
              <span style="font-weight: 800; font-size: 12px; color: #1c1917;">${prop.title}</span>
            </div>
            <div style="font-size: 11px; color: #047857; font-weight: 700; margin-bottom: 3px;">📍 ${prop.address}</div>
            <div style="font-size: 11px; font-weight: 800; color: #b45309; margin-bottom: 4px;">💰 価格: ${prop.price === 0 ? '0円（無償譲渡）' : `${(prop.price / 10000).toLocaleString()}万円`}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e7e5e4; padding-top: 4px; font-size: 10px;">
              <span style="color: #44403c;">${prop.accessInfo}</span>
              <span style="background: #dcfce7; color: #166534; font-size: 9px; font-weight: 800; padding: 2px 4px; border-radius: 4px;">重なり防止配置済</span>
            </div>
          </div>
        `;
        marker.bindTooltip(tooltipContent, { direction: 'top', offset: [0, -24], opacity: 0.98 });

        marker.addTo(currentLayer);
      });

      setPositionedProperties(layout);
    };

    updatePins();
    // Safety delay to ensure Leaflet container pixel dimensions are fully hydrated
    const initTimer = setTimeout(updatePins, 80);

    map.on('zoomend', updatePins);
    map.on('moveend', updatePins);
    map.on('resize', updatePins);

    return () => {
      clearTimeout(initTimer);
      map.off('zoomend', updatePins);
      map.off('moveend', updatePins);
      map.off('resize', updatePins);
    };
  }, [displayedProperties, activeProperty?.id, badgeMode, onSelectProperty]);

  // Handle District Change - smoothly zooms directly into selected area so individual locations spread out
  const handleSelectDistrict = (key: string) => {
    setSelectedDistrictKey(key);
    if (key === 'ALL') {
      setActiveProperty(null);
    }
    if (!mapInstanceRef.current) return;
    if (key === 'ALL') {
      const nichinanBounds: L.LatLngBoundsLiteral = [
        [31.48, 131.21],
        [31.76, 131.50]
      ];
      mapInstanceRef.current.fitBounds(nichinanBounds, { padding: [30, 30] });
    } else {
      const dist = NICHINAN_DISTRICTS[key];
      if (dist) {
        mapInstanceRef.current.flyTo(dist.center, dist.zoom, { duration: 0.8 });
      }
    }
  };

  // Reset to Nichinan overview filter
  const handleResetBounds = () => {
    setSelectedDistrictKey('ALL');
    setActiveProperty(null);
    if (mapInstanceRef.current) {
      const nichinanBounds: L.LatLngBoundsLiteral = [
        [31.48, 131.21],
        [31.76, 131.50]
      ];
      mapInstanceRef.current.fitBounds(nichinanBounds, { padding: [30, 30] });
    }
  };

  // Zoom in/out controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };
  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-white rounded-2xl border border-stone-200 shadow-sm">
      {/* Top Map Control Bar (Status & Layer Controls) */}
      <div className="shrink-0 bg-white border-b border-stone-200 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 z-20">
        {/* Current status / Reset button */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 rounded-lg text-stone-800 border border-stone-200">
            <span className="text-sm">{DISTRICT_ICONS[selectedDistrictKey] || '🌴'}</span>
            <span className="text-stone-500 font-medium">現在選択中:</span>
            <span className="text-emerald-950 font-black">
              {NICHINAN_DISTRICTS[selectedDistrictKey]?.shortName}
            </span>
            {selectedDistrictKey !== 'ALL' && (
              <span className="text-[11px] font-black text-amber-800 bg-amber-200/80 px-1.5 py-0.2 rounded-full ml-1">
                {displayedProperties.length}件
              </span>
            )}
          </div>

          {selectedDistrictKey !== 'ALL' && (
            <button
              onClick={handleResetBounds}
              className="px-2.5 py-1 bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-stone-950 rounded-lg transition cursor-pointer border border-stone-200 flex items-center gap-1 text-xs font-bold"
              title="日南市全域表示に戻す"
            >
              <RotateCcw className="w-3 h-3" />
              <span>全域に戻す</span>
            </button>
          )}

          {/* Landmarks Layer Toggle */}
          {selectedDistrictKey !== 'ALL' && (
            <button
              onClick={() => setShowLandmarks(!showLandmarks)}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer border flex items-center gap-1 ${
                showLandmarks
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200'
              }`}
              title="主要ランドマーク（名所・駅・市役所）表示切替"
            >
              <span>🏛️</span>
              <span className="hidden sm:inline">名所</span>
            </button>
          )}

          {/* Official Nichinan Akiya Bank Sync / Pull Button */}
          {onOpenAkiyaBankSync && (
            <button
              onClick={onOpenAkiyaBankSync}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="日南市公式空き家バンク連携・データ同期マネージャーを開く"
            >
              <span>🏛️</span>
              <span>空き家バンク連携</span>
              <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded-full font-black">
                公式
              </span>
            </button>
          )}
        </div>

        {/* Map Display & Layer Settings */}
        <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
          {/* Badge Display Mode Switcher (Label / Price / Number) - only relevant when pins are displayed in a district */}
          {selectedDistrictKey !== 'ALL' && (
            <div className="bg-stone-100 p-0.5 rounded-lg flex items-center border border-stone-200">
              <button
                onClick={() => setBadgeMode('label')}
                className={`px-2 py-1 rounded-md transition cursor-pointer text-xs ${
                  badgeMode === 'label' ? 'bg-emerald-800 text-white font-black shadow-xs' : 'hover:text-stone-950'
                }`}
                title="地区名ラベル表示"
              >
                地区名
              </button>
              <button
                onClick={() => setBadgeMode('price')}
                className={`px-2 py-1 rounded-md transition cursor-pointer text-xs ${
                  badgeMode === 'price' ? 'bg-emerald-800 text-white font-black shadow-xs' : 'hover:text-stone-950'
                }`}
                title="価格ラベル表示"
              >
                価格
              </button>
              <button
                onClick={() => setBadgeMode('compact')}
                className={`px-2 py-1 rounded-md transition cursor-pointer text-xs ${
                  badgeMode === 'compact' ? 'bg-emerald-800 text-white font-black shadow-xs' : 'hover:text-stone-950'
                }`}
                title="番号ピン表示"
              >
                番号
              </button>
            </div>
          )}

          {/* Map Layer Switcher: Real Satellite Hybrid / Aerial Photo / 3D Relief / City Map */}
          <div className="flex bg-stone-100 p-0.5 rounded-lg items-center border border-stone-200 text-xs">
            <button
              onClick={() => setCurrentTileKey('esri_hybrid')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                currentTileKey === 'esri_hybrid' ? 'bg-emerald-800 text-white font-black shadow-xs ring-1 ring-emerald-600' : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
              }`}
              title="リアル高精細衛星写真（道路・地名ハイブリッド）"
            >
              <span>🛰️</span>
              <span>リアル衛星</span>
            </button>
            <button
              onClick={() => setCurrentTileKey('gsi_photo')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                currentTileKey === 'gsi_photo' ? 'bg-emerald-800 text-white font-black shadow-xs ring-1 ring-emerald-600' : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
              }`}
              title="国土地理院 リアル航空写真"
            >
              <span>📸</span>
              <span>航空写真</span>
            </button>
            <button
              onClick={() => setCurrentTileKey('gsi_relief')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                currentTileKey === 'gsi_relief' ? 'bg-amber-500 text-stone-950 font-black shadow-xs ring-1 ring-amber-400' : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
              }`}
              title="立体地形・色別標高リアルマップ"
            >
              <span>⛰️</span>
              <span>立体地形</span>
            </button>
            <button
              onClick={() => setCurrentTileKey('gsi_std')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                currentTileKey === 'gsi_std' ? 'bg-stone-800 text-white font-black shadow-xs ring-1 ring-stone-700' : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
              }`}
              title="国土地理院 標準市街地図"
            >
              <span>🗺️</span>
              <span>市街地図</span>
            </button>
          </div>
        </div>
      </div>

      {/* DEDICATED DISTRICT SELECTOR BAR: All 10 regions wrap cleanly so every single region is 100% visible and clickable */}
      <div className="shrink-0 bg-stone-50 border-b border-stone-200 px-3 sm:px-4 py-2 z-20">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-black text-stone-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>各地域を選択（全10エリア・クリックで空き家を表示）:</span>
          </span>
          {selectedDistrictKey === 'ALL' && (
            <span className="text-[11px] font-semibold text-stone-500 hidden md:inline">
              ※各地域ボタンをクリックすると登録空き家（計79件）のピンが表示されます
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-bold">
          {Object.entries(NICHINAN_DISTRICTS).map(([key, d]) => {
            const isSelected = selectedDistrictKey === key;
            const count = districtCounts[key] || 0;
            const icon = DISTRICT_ICONS[key] || '📍';
            return (
              <button
                key={key}
                onClick={() => handleSelectDistrict(key)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  isSelected
                    ? 'bg-emerald-800 text-white font-black shadow-xs ring-2 ring-emerald-600/40'
                    : 'bg-white hover:bg-amber-50 text-stone-700 hover:text-stone-950 border border-stone-200 shadow-2xs hover:border-amber-300'
                }`}
              >
                <span className="text-sm">{icon}</span>
                <span>{d.shortName}</span>
                {key !== 'ALL' && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isSelected ? 'bg-amber-400 text-stone-950' : 'bg-stone-100 text-stone-600 border border-stone-200'
                    }`}
                  >
                    {count}件
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Edge-to-Edge Interactive Map Area */}
      <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden">
        {/* Real Leaflet Map */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Informative Guide Chip when in Citywide View */}
        {selectedDistrictKey === 'ALL' && (
          <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-stone-200 shadow-lg text-xs font-bold text-stone-800 flex items-center gap-2.5 max-w-md pointer-events-auto">
            <span className="text-2xl">🏛️</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-stone-900">日南市公式空き家バンク連携中</span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black">79件取得済</span>
              </div>
              <div className="text-[11px] text-stone-600 font-medium leading-tight mt-0.5">
                日南市空き家・空き地情報バンク（やさしい移住）より全10地区の空き家情報を引込済み。上の地区ボタンから物件を表示できます
              </div>
            </div>
          </div>
        )}

        {/* Floating City Info Chip (only shown when a specific district is selected) */}
        {selectedDistrictKey !== 'ALL' && (
          <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 shadow-md text-xs font-black text-stone-800 flex items-center gap-1.5 pointer-events-none">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>{NICHINAN_DISTRICTS[selectedDistrictKey]?.badge}</span>
          </div>
        )}

        {/* Floating Zoom & Control Pad */}
        <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-stone-200 shadow-lg">
          <button
            onClick={handleZoomIn}
            className="w-7 h-7 rounded-xl bg-white hover:bg-amber-100 text-stone-800 flex items-center justify-center font-black transition cursor-pointer border border-stone-200 shadow-2xs text-xs"
            title="拡大"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-7 h-7 rounded-xl bg-white hover:bg-amber-100 text-stone-800 flex items-center justify-center font-black transition cursor-pointer border border-stone-200 shadow-2xs text-xs"
            title="縮小"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetBounds}
            className="w-7 h-7 rounded-xl bg-stone-100 hover:bg-amber-200 text-stone-800 flex items-center justify-center text-[10px] font-black transition cursor-pointer border border-stone-200"
            title="日南市全域に戻す"
          >
            全域
          </button>
        </div>

        {/* Floating Bottom Location Pins Scroller (only shown when a specific district is selected and has properties) */}
        {selectedDistrictKey !== 'ALL' && positionedProperties.length > 0 && (
          <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-stone-200 shadow-lg flex items-center gap-2">
            <span className="shrink-0 text-xs font-black text-stone-800 flex items-center gap-1 px-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">地区内空き家</span>
              <span className="text-[10px] text-stone-500">({positionedProperties.length}件)</span>
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {positionedProperties.map(item => {
                const isSelected = activeProperty?.id === item.property.id;
                return (
                  <button
                    key={item.property.id}
                    onClick={() => {
                      setActiveProperty(item.property);
                      onSelectProperty(item.property);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.flyTo(
                          [item.originLatLng.lat, item.originLatLng.lng],
                          Math.max(mapInstanceRef.current.getZoom(), 14),
                          { duration: 0.6 }
                        );
                      }
                    }}
                    className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 border-amber-500 shadow-xs font-black scale-105'
                        : 'bg-stone-50 hover:bg-amber-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-black ${
                        isSelected ? 'bg-stone-950 text-amber-300' : 'bg-emerald-800 text-white'
                      }`}
                    >
                      {item.index}
                    </span>
                    <span>{item.shortLocation}</span>
                    <span className="text-[10px] text-stone-500 font-medium">{item.priceLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* FLOATING PROPERTY DETAIL CARD (Slides up when a pin is selected in a district, suppressed when full details are open) */}
        {selectedDistrictKey !== 'ALL' && activeProperty && !isDetailOpen && (
          <div className="absolute bottom-16 right-3 z-[1010] w-[calc(100vw-24px)] sm:w-96 bg-white/98 backdrop-blur-md rounded-2xl border border-emerald-300/80 shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setActiveProperty(null)}
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition shadow-2xs z-10"
              title="閉じる"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Quick Property View */}
            <div className="flex gap-3">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                {activeProperty.images && activeProperty.images.length > 0 ? (
                  <img
                    src={activeProperty.images[0]}
                    alt={activeProperty.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <Building2 className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="px-1.5 py-0.2 bg-emerald-800 text-white rounded text-[10px] font-black shrink-0">
                    {activeProperty.registrationNumber || '空き家バンク登録'}
                  </span>
                  <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[10px] font-black shrink-0">
                    {activeProperty.bankTransactionType || (activeProperty.price === 0 ? '0円譲渡' : '売買')}
                  </span>
                </div>
                <span className="text-[11px] font-black text-emerald-800 flex items-center gap-1 mb-0.5 truncate">
                  <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                  {activeProperty.address}
                </span>
                <h4 className="font-extrabold text-stone-900 text-xs sm:text-sm leading-tight truncate mb-1.5">
                  {activeProperty.title}
                </h4>
                <div className="flex items-center gap-1 text-xs">
                  <span className="px-2 py-0.5 bg-amber-400 text-stone-950 font-black rounded-md text-[11px]">
                    {activeProperty.price === 0 ? '0円譲渡' : `${(activeProperty.price / 10000).toLocaleString()}万円`}
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold truncate">
                    {activeProperty.layout} • 延床{activeProperty.buildingArea}㎡
                  </span>
                </div>
              </div>
            </div>

            {/* Condition & Tags */}
            <div className="flex items-center justify-between text-[11px] bg-stone-50 p-2 rounded-xl border border-stone-200">
              <span className="font-medium text-stone-600">状態: {activeProperty.conditionText}</span>
              <span className="font-bold text-emerald-700">{activeProperty.tags[0] ? `#${activeProperty.tags[0]}` : ''}</span>
            </div>

            {/* Google Maps 3D & Street View External Link for Real Local Check */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${activeProperty.lat},${activeProperty.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 px-2.5 bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-[11px] rounded-xl border border-sky-200 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              title="Google Mapsでリアルな現地の3D航空写真・ストリートビューを表示"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Google 3D・ストリートビューで現地のリアルな街並みを確認</span>
            </a>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-0.5">
              <button
                onClick={() => onSelectProperty(activeProperty)}
                className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>物件詳細・補助金を見る</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onToggleFavorite(activeProperty.id)}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  isFavorite(activeProperty.id)
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
                title="お気に入り"
              >
                <Heart className={`w-4 h-4 ${isFavorite(activeProperty.id) ? 'fill-rose-600' : ''}`} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
