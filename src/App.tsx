import { useState, useRef, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Region = 'World' | 'Euro' | 'KSA' | 'UAE' | 'Ziyarat';
type View = 'home' | 'settings';
type BundleAction = 'buy' | 'subscribe';
type PayView = null | 'jc-amount' | 'jc-account' | 'jc-otp' | 'card-amount' | 'card-form' | 'scratch';

interface Bundle {
  id: string;
  name: string;
  region: Region;
  price: number;
  validityLabel: string;  // display label e.g. "30 Days"
  validityDays: number;   // for sorting/grouping
  data: string;
  dataGB: number;
  countries: string[];
}

// ─── Country lists (from reference document) ──────────────────────────────────

const WORLD_COUNTRIES = [
  'Albania','Algeria','American Samoa','Anguilla','Antigua And Barbuda','Armenia','Australia',
  'Austria','Azerbaijan','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Bermuda',
  'Brazil','Canada','Cayman Islands','China','Croatia','Cyprus','Czech Republic','Denmark',
  'Dominica','Egypt','Estonia','Fiji','Finland','France','Germany','Greece','Grenada',
  'Hong Kong','Hungary','Indonesia','Iran','Iraq','Ireland','Italy','Jamaica','Japan',
  'Jersey','Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyzstan','Laos','Latvia','Liechtenstein',
  'Lithuania','Luxembourg','Macao','Malaysia','Maldives','Malta','Mauritius','Mexico',
  'Montserrat','Morocco','Nepal','Netherlands','Oman','Philippines','Poland','Portugal',
  'Qatar','Republic of Korea','Romania','Russia','Saint Kitts And Nevis','Saint Lucia',
  'Saint Vincent And The Grenadines','Saudi Arabia','Singapore','South Africa','Spain',
  'Sri Lanka','Sudan','Sweden','Switzerland','Taiwan','Thailand','Turkey',
  'Turks And Caicos Islands','Uganda','Ukraine','United Arab Emirates','United Kingdom',
  'United States','Uzbekistan',
];

const EURO_COUNTRIES = [
  'Austria','Belgium','Bulgaria','Croatia','Cyprus','Czech Republic','Denmark','Estonia',
  'Finland','France','Germany','Greece','Hungary','Ireland','Italy','Latvia','Liechtenstein',
  'Lithuania','Luxembourg','Malta','Netherlands','Norway','Poland','Portugal','Romania',
  'Slovakia','Slovenia','Spain','Sweden','Turkey','United Kingdom',
];

// ─── Bundle Catalogue ─────────────────────────────────────────────────────────

const BUNDLES: Bundle[] = [
  // KSA
  {
    id: 'saudi-2000', name: 'Saudi Roaming 2GB', region: 'KSA',
    price: 2749, validityLabel: '30 Days', validityDays: 30,
    data: '2 GB', dataGB: 2,
    countries: ['Saudi Arabia'],
  },
  {
    id: 'saudi-5000', name: 'Saudi Roaming 6GB', region: 'KSA',
    price: 6872, validityLabel: '45 Days', validityDays: 45,
    data: '6 GB', dataGB: 6,
    countries: ['Saudi Arabia'],
  },
  {
    id: 'hajj-takaful', name: 'Hajj Roaming + Travel Takaful', region: 'KSA',
    price: 5800, validityLabel: '30 Days', validityDays: 30,
    data: '2 GB', dataGB: 2,
    countries: ['Saudi Arabia'],
  },
  // UAE
  {
    id: 'uae-1gb', name: 'UAE Roaming 1 GB', region: 'UAE',
    price: 1374, validityLabel: '7 Days', validityDays: 7,
    data: '1 GB', dataGB: 1,
    countries: ['United Arab Emirates'],
  },
  {
    id: 'uae-2gb', name: 'UAE Roaming 2 GB', region: 'UAE',
    price: 2473, validityLabel: '15 Days', validityDays: 15,
    data: '2 GB', dataGB: 2,
    countries: ['United Arab Emirates'],
  },
  {
    id: 'uae-5gb', name: 'UAE Roaming 5 GB', region: 'UAE',
    price: 6183, validityLabel: '30 Days', validityDays: 30,
    data: '5 GB', dataGB: 5,
    countries: ['United Arab Emirates'],
  },
  // World
  {
    id: 'world-200mb', name: 'World Bundle 200MB', region: 'World',
    price: 1100, validityLabel: '1 Day', validityDays: 1,
    data: '200 MB', dataGB: 0.2,
    countries: WORLD_COUNTRIES,
  },
  {
    id: 'world-500mb', name: 'World Bundle 500MB', region: 'World',
    price: 2474, validityLabel: '7 Days', validityDays: 7,
    data: '500 MB', dataGB: 0.5,
    countries: WORLD_COUNTRIES,
  },
  {
    id: 'world-1gb', name: 'World Bundle 1GB', region: 'World',
    price: 4123, validityLabel: '7 Days', validityDays: 7,
    data: '1 GB', dataGB: 1,
    countries: WORLD_COUNTRIES,
  },
  {
    id: 'world-3gb', name: 'World Bundle 3GB', region: 'World',
    price: 8934, validityLabel: '30 Days', validityDays: 30,
    data: '3 GB', dataGB: 3,
    countries: WORLD_COUNTRIES,
  },
  {
    id: 'world-5gb', name: 'World Bundle 5GB', region: 'World',
    price: 11682, validityLabel: '90 Days', validityDays: 90,
    data: '5 GB', dataGB: 5,
    countries: WORLD_COUNTRIES,
  },
  {
    id: 'roaming-pass', name: 'Roaming Pass', region: 'World',
    price: 12000, validityLabel: '365 Days', validityDays: 365,
    data: '8 GB', dataGB: 8,
    countries: WORLD_COUNTRIES,
  },
  // Euro
  {
    id: 'euro-5gb', name: 'Euro Bundle 5 GB', region: 'Euro',
    price: 6872, validityLabel: '30 Days', validityDays: 30,
    data: '5 GB', dataGB: 5,
    countries: EURO_COUNTRIES,
  },
  {
    id: 'euro-10gb', name: 'Euro Bundle 10 GB', region: 'Euro',
    price: 10308, validityLabel: '90 Days', validityDays: 90,
    data: '10 GB', dataGB: 10,
    countries: EURO_COUNTRIES,
  },
  // Ziyarat
  {
    id: 'ziyarat-5gb', name: 'Ziyarat Offer 5 GB', region: 'Ziyarat',
    price: 5497, validityLabel: '30 Days', validityDays: 30,
    data: '5 GB', dataGB: 5,
    countries: ['Iran', 'Iraq'],
  },
];

// Region order as specified
const REGIONS: Region[] = ['KSA', 'World', 'UAE', 'Ziyarat', 'Euro'];

const REGION_META: Record<Region, { icon: string; color: string; desc: string }> = {
  KSA:     { icon: '🕌', color: '#F59E0B', desc: 'Saudi Arabia' },
  World:   { icon: '🌍', color: '#06B6D4', desc: '90+ countries' },
  UAE:     { icon: '🏙️', color: '#34D399', desc: 'UAE & Emirates' },
  Ziyarat: { icon: '✨', color: '#FB7185', desc: 'Pilgrimage routes' },
  Euro:    { icon: '🇪🇺', color: '#818CF8', desc: '31 European countries' },
};

function ordinalDate(validityDays: number): string {
  const d = new Date(2026, 8, 29); // today: Sept 29 2026
  d.setDate(d.getDate() + validityDays);
  const day = d.getDate();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const s = day === 1 || day === 21 || day === 31 ? 'st'
    : day === 2 || day === 22 ? 'nd'
    : day === 3 || day === 23 ? 'rd' : 'th';
  return `${day}${s} ${months[d.getMonth()]}`;
}
const DATA_TOTAL = 5, DATA_USED = 1.8, DATA_REM = 3.2;
const VOICE_TOTAL = 50, VOICE_USED = 15, VOICE_REM = 35;
const MIN_CREDIT = 5000;

// Country search keyword map
const COUNTRY_MAP: Record<string, Region[]> = {
  'saudi': ['KSA', 'World'], 'saudi arabia': ['KSA', 'World'], 'ksa': ['KSA', 'World'],
  'mecca': ['KSA', 'World'], 'medina': ['KSA', 'World'], 'riyadh': ['KSA', 'World'],
  'jeddah': ['KSA', 'World'], 'hajj': ['KSA'],
  'uae': ['UAE', 'World'], 'dubai': ['UAE', 'World'], 'abu dhabi': ['UAE', 'World'],
  'sharjah': ['UAE', 'World'], 'ajman': ['UAE', 'World'], 'emirates': ['UAE', 'World'],
  'uk': ['Euro', 'World'], 'london': ['Euro', 'World'], 'france': ['Euro', 'World'],
  'paris': ['Euro', 'World'], 'germany': ['Euro', 'World'], 'italy': ['Euro', 'World'],
  'spain': ['Euro', 'World'], 'netherlands': ['Euro', 'World'], 'belgium': ['Euro', 'World'],
  'austria': ['Euro', 'World'], 'switzerland': ['Euro', 'World'], 'portugal': ['Euro', 'World'],
  'greece': ['Euro', 'World'], 'poland': ['Euro', 'World'], 'europe': ['Euro', 'World'],
  'usa': ['World'], 'america': ['World'], 'china': ['World'], 'turkey': ['Euro', 'World'],
  'malaysia': ['World'], 'thailand': ['World'], 'singapore': ['World'],
  'iraq': ['Ziyarat', 'World'], 'iran': ['Ziyarat', 'World'],
  'syria': ['World'], 'ziyarat': ['Ziyarat'],
  'najaf': ['Ziyarat', 'World'], 'karbala': ['Ziyarat', 'World'],
};

function searchBundles(q: string): Bundle[] {
  const low = q.toLowerCase().trim();
  if (!low) return [];
  const matched = new Set<Region>();
  for (const [k, v] of Object.entries(COUNTRY_MAP)) {
    if (k.includes(low) || low.includes(k)) v.forEach(r => matched.add(r));
  }
  const seen = new Set<string>();
  return BUNDLES.filter(b => {
    const ok = b.name.toLowerCase().includes(low) || b.region.toLowerCase().includes(low) ||
      matched.has(b.region) || b.countries.some(c => c.toLowerCase().includes(low));
    if (!ok || seen.has(b.id)) return false;
    seen.add(b.id); return true;
  });
}

function groupByValidity(bundles: Bundle[]): [string, Bundle[]][] {
  const map = new Map<number, { label: string; bundles: Bundle[] }>();
  for (const b of bundles) {
    if (!map.has(b.validityDays)) map.set(b.validityDays, { label: b.validityLabel, bundles: [] });
    map.get(b.validityDays)!.bundles.push(b);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => [v.label, v.bundles]);
}

// ─── Static T&Cs content ──────────────────────────────────────────────────────

const MORE_INFO_TEXT = [
  { label: 'More info', value: 'https://jazz.com.pk/media-center/detail/jazzworld-introduces-ziyarat-roaming-offer-for-pilgrims-traveling-to-iraq-and-iran' },
  { label: 'Subscription & usage details', value: 'SIMOSA App or dial *7626#' },
];

const TC_TEXT = [
  'To use international roaming (IR) services for voice and data, ensure that IR is already activated for your number. You can activate IR via SIMOSA App or by using Jazz WhatsApp self-service (0300 3008000).',
  'For Euro bundle countries & operators list, please visit our website: https://jazz.com.pk/prepaid/euro-bundle-10-ab',
  'Voice Calls & SMS are charged as per the applicable tariff for the specific country. For tariff details and the applicable Jazz General and Roaming Terms & Conditions, please visit: https://jazz.com.pk/international-roaming-tariff',
  'Multiple bundle subscriptions are allowed. If same bundle is re-subscribed before expiry, then remaining incentive from previous subscription will be carried forward & added to new subscription with updated expiry.',
  'Once your bundle\'s incentives are fully utilized, IR data services will become unavailable & IR data base rate charging (Charges per MB) will not apply. You will have to subscribe to a bundle via SIMOSA App to continue using IR data services or activate IR data on base rate by dialing *7626#',
  'Roaming Helpline: +92 300 2000100 ("Call to pak" rates will be applicable) · SIMOSA App: Support → Submit a Complaint · WhatsApp Support: Send "Hi" to 0300 3008000 · Email: customercare@jazz.com.pk',
];

// ─── Circular Progress ────────────────────────────────────────────────────────

function CircularProgress({ pct, color, size = 120, strokeWidth = 10, children }: {
  pct: number; color: string; size?: number; strokeWidth?: number; children?: React.ReactNode;
}) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(pct, 100) / 100)} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${color}99)` }} />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

// ─── Dual Incentive ───────────────────────────────────────────────────────────

// Demo usage ratio per bundle (seeded by index for variety)
const USAGE_RATIOS = [0.36, 0.18, 0.52, 0.09, 0.71, 0.28, 0.44];

function bundleUsage(b: Bundle, idx: number) {
  const ratio = USAGE_RATIOS[idx % USAGE_RATIOS.length];
  const total = b.dataGB;
  const used = parseFloat((total * ratio).toFixed(2));
  const rem = parseFloat((total - used).toFixed(2));
  const pct = (rem / total) * 100;
  const fmtGB = (n: number) => n >= 1 ? `${n} GB` : `${Math.round(n * 1024)} MB`;
  return { total, used, rem, pct, fmtRem: fmtGB(rem), fmtUsed: fmtGB(used), fmtTotal: fmtGB(total) };
}

const DATA_COLORS = ['#06B6D4', '#818CF8', '#34D399', '#F59E0B', '#FB7185'];

function DataIncentive({ bundles }: { bundles: Bundle[] }) {
  if (bundles.length === 0) return null;

  return (
    <div className="w-full space-y-3">
      {bundles.map((b, idx) => {
        const u = bundleUsage(b, idx);
        const color = DATA_COLORS[idx % DATA_COLORS.length];
        const usedPct = Math.min(100, (u.used / u.total) * 100);
        return (
          <div key={b.id + idx} className="rounded-2xl p-3.5"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}22` }}>
            {/* Header row: icon + label + bundle name */}
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M1 6C1 6 5 2 12 2C19 2 23 6 23 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                  <path d="M5 10C5 10 7.5 7 12 7C16.5 7 19 10 19 10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 14C9 14 10.5 12 12 12C13.5 12 15 14 15 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="18" r="1.5" fill={color}/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}>DATA</div>
                {bundles.length > 1 && (
                  <div className="text-xs truncate" style={{ color: '#475569', fontFamily: 'Outfit' }}>{b.name}</div>
                )}
              </div>
              <div className="text-xs font-semibold" style={{ color: '#475569', fontFamily: 'JetBrains Mono' }}>{u.fmtUsed} used</div>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full mb-2.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${usedPct}%`, background: `linear-gradient(90deg, ${color}cc, ${color})` }} />
            </div>
            {/* Stats row */}
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold" style={{ color, fontFamily: 'JetBrains Mono', fontSize: 22 }}>{u.fmtRem}</span>
              <span className="text-xs" style={{ color: '#475569', fontFamily: 'Outfit' }}>Left out of {u.fmtTotal}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Overlay Modal ────────────────────────────────────────────────────────────

function OverlayModal({ children, onBdClick }: { children: React.ReactNode; onBdClick?: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-5"
      style={{ background: 'rgba(7,11,20,0.65)', backdropFilter: 'blur(16px)' }}
      onClick={e => { if (e.target === e.currentTarget) onBdClick?.(); }}>
      {children}
    </div>
  );
}

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────

function BottomSheet({ children, onBdClick }: { children: React.ReactNode; onBdClick?: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end"
      style={{ background: 'rgba(7,11,20,0.65)', backdropFilter: 'blur(16px)' }}
      onClick={e => { if (e.target === e.currentTarget) onBdClick?.(); }}>
      <div className="w-full rounded-t-3xl overflow-y-auto slide-up"
        style={{ background: '#0E1828', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '92vh' }}>
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Countries Screen ─────────────────────────────────────────────────────────

function CountriesScreen({ bundle, onClose }: { bundle: Bundle; onClose: () => void }) {
  const meta = REGION_META[bundle.region];
  const sorted = [...bundle.countries].sort();
  return (
    <div className="fixed inset-0 z-[80] flex flex-col"
      style={{ background: '#070B14', maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.07)', color: '#94A3B8', fontSize: 20 }}>‹</button>
        <div className="flex-1 min-w-0">
          <div className="text-xs" style={{ color: '#475569', fontFamily: 'Outfit' }}>Applicable Countries</div>
          <div className="text-base font-bold truncate" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>{bundle.name}</div>
        </div>
        <div className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
          style={{ background: `${meta.color}18`, color: meta.color, fontFamily: 'Outfit' }}>
          {sorted.length} {sorted.length === 1 ? 'country' : 'countries'}
        </div>
      </div>
      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {sorted.map((c, i) => (
          <div key={c} className="flex items-center gap-3 py-3"
            style={{ borderBottom: i < sorted.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.color }} />
            <span className="text-sm" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed top-6 left-1/2 z-[90] -translate-x-1/2 px-5 py-3 rounded-2xl text-sm font-medium fade-in"
      style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.4)', color: '#06B6D4', fontFamily: 'Outfit', backdropFilter: 'blur(12px)', whiteSpace: 'nowrap' }}>
      {message}
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function ToggleSwitch({ active, onChange }: { active: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!active)}
      className="relative flex-shrink-0 rounded-full transition-all duration-300"
      style={{ width: 44, height: 24, background: active ? '#06B6D4' : 'rgba(255,255,255,0.12)' }}>
      <div className="absolute top-1 rounded-full transition-all duration-300"
        style={{ width: 16, height: 16, background: '#fff', left: active ? 'calc(100% - 20px)' : 4 }} />
    </button>
  );
}

// ─── Payment Gateway ──────────────────────────────────────────────────────────

function PaymentGateway({ targetAmount, onSuccess, onClose }: {
  targetAmount: number; onSuccess: () => void; onClose: () => void;
}) {
  const [pv, setPv] = useState<PayView>(null);
  const [amount, setAmount] = useState(targetAmount.toString());
  const [jcAcct, setJcAcct] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [cardNum, setCardNum] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [scratch, setScratch] = useState('');
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (pv !== 'jc-otp') return;
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, [pv]);

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const fmtCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExp = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; };

  const inputSt: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#E2E8F0', fontFamily: 'JetBrains Mono', borderRadius: 16, padding: '14px 16px', fontSize: 15, width: '100%', outline: 'none' };
  const purpleBtn: React.CSSProperties = { background: 'linear-gradient(135deg,#c026d3,#e11d48)', color: '#fff', fontFamily: 'Outfit' };

  function otpInput(i: number, v: string) {
    const d = v.replace(/\D/g, '').slice(-1);
    const n = [...otp]; n[i] = d; setOtp(n);
    if (d && i < 3) refs[i + 1].current?.focus();
  }

  const backBtn = (onClick: () => void) => (
    <button onClick={onClick} className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
      style={{ background: 'rgba(255,255,255,0.07)', color: '#94A3B8', fontSize: 18 }}>‹</button>
  );

  const amtScreen = (icon: string, label: string, back: () => void, next: () => void, btnSt: React.CSSProperties) => (
    <BottomSheet onBdClick={onClose}>
      <div className="px-5 pb-8 pt-2">
        <div className="flex items-center gap-3 mb-6">{backBtn(back)}<div className="flex items-center gap-2"><span style={{ fontSize: 18 }}>{icon}</span><span className="font-bold text-base" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>{label}</span></div></div>
        <div className="mb-2 text-sm font-medium" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}>Amount to pay</div>
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: '#475569', fontFamily: 'JetBrains Mono' }}>PKR</span>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ ...inputSt, paddingLeft: 52 }} placeholder="0" />
        </div>
        <button onClick={next} className="w-full py-4 rounded-2xl font-bold text-base" style={btnSt}>CONTINUE</button>
      </div>
    </BottomSheet>
  );

  if (!pv) return (
    <BottomSheet onBdClick={onClose}>
      <div className="px-5 pb-8 pt-2">
        <div className="flex items-start justify-between mb-5">
          <div><div className="text-xs" style={{ color: '#475569', fontFamily: 'Outfit' }}>Credit Limit</div><div className="text-lg font-bold" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>Choose payment method</div></div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.07)', color: '#94A3B8', fontSize: 14 }}>✕</button>
        </div>
        <div className="rounded-2xl p-3.5 mb-6" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
          <div className="text-sm" style={{ color: '#94A3B8', fontFamily: 'Inter' }}>
            Payment required: <span className="font-bold" style={{ color: '#06B6D4', fontFamily: 'JetBrains Mono' }}>PKR {targetAmount.toLocaleString()}</span>
          </div>
        </div>
        {[
          { icon: '💛', label: 'JazzCash', desc: 'Pay via JazzCash wallet', next: 'jc-amount' as PayView },
          { icon: '💳', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, UnionPay', next: 'card-amount' as PayView },
          { icon: '🎫', label: 'Scratch Card', desc: 'Enter your 14-digit card code', next: 'scratch' as PayView },
        ].map(o => (
          <button key={o.label} onClick={() => setPv(o.next)} className="w-full flex items-center gap-4 p-4 rounded-2xl mb-3 text-left" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>{o.icon}</div>
            <div className="flex-1 min-w-0"><div className="font-semibold text-sm" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>{o.label}</div><div className="text-xs mt-0.5" style={{ color: '#475569', fontFamily: 'Inter' }}>{o.desc}</div></div>
            <span style={{ color: '#475569', fontSize: 18 }}>›</span>
          </button>
        ))}
      </div>
    </BottomSheet>
  );

  if (pv === 'jc-amount') return amtScreen('💛', 'Pay Via JazzCash', () => setPv(null), () => setPv('jc-account'), purpleBtn);

  if (pv === 'jc-account') return (
    <BottomSheet onBdClick={onClose}>
      <div className="px-5 pb-8 pt-2">
        <div className="flex items-center gap-3 mb-6">{backBtn(() => setPv('jc-amount'))}<div className="flex items-center gap-2"><span style={{ fontSize: 18 }}>💛</span><span className="font-bold text-base" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>Pay Via JazzCash</span></div></div>
        <div className="mb-2 text-sm font-medium text-center" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}>Enter JazzCash Account number</div>
        <input type="tel" value={jcAcct} onChange={e => setJcAcct(e.target.value.replace(/\D/g, '').slice(0, 11))} style={{ ...inputSt, textAlign: 'center', fontSize: 18, letterSpacing: 2, marginBottom: 24 }} placeholder="03XX XXXXXXX" />
        <button onClick={() => { setOtp(['', '', '', '']); setTimer(120); setPv('jc-otp'); }} className="w-full py-4 rounded-2xl font-bold text-base mb-5" style={purpleBtn}>CONTINUE</button>
        <p className="text-xs text-center" style={{ color: '#475569', fontFamily: 'Inter' }}>Don&apos;t have a JazzCash account? <span style={{ color: '#06B6D4', textDecoration: 'underline' }}>Download the JazzCash app</span></p>
      </div>
    </BottomSheet>
  );

  if (pv === 'jc-otp') return (
    <BottomSheet onBdClick={onClose}>
      <div className="px-5 pb-8 pt-2">
        <div className="flex items-center gap-3 mb-6">{backBtn(() => setPv('jc-account'))}<span className="font-bold text-base" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>Verification Code</span></div>
        <p className="text-sm text-center mb-6" style={{ color: '#475569', fontFamily: 'Inter' }}>Check your SMS on <span style={{ color: '#E2E8F0' }}>{jcAcct || '03XX XXXXXXX'}</span></p>
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((d, i) => (
            <input key={i} ref={refs[i]} type="text" inputMode="numeric" value={d} maxLength={1}
              onChange={e => otpInput(i, e.target.value)} onKeyDown={e => { if (e.key === 'Backspace' && !d && i > 0) refs[i - 1].current?.focus(); }}
              className="text-center text-xl font-bold rounded-2xl"
              style={{ width: 56, height: 60, background: d ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.04)', border: `2px solid ${d ? '#06B6D4' : 'rgba(255,255,255,0.12)'}`, color: '#E2E8F0', fontFamily: 'JetBrains Mono', outline: 'none' }} />
          ))}
        </div>
        <div className="text-center text-sm mb-6" style={{ color: '#475569', fontFamily: 'JetBrains Mono' }}>{fmtTime(timer)}</div>
        <button onClick={onSuccess} className="w-full py-4 rounded-2xl font-bold text-base" style={{ ...purpleBtn, opacity: otp.every(d => d) ? 1 : 0.4 }}>Verify Number</button>
      </div>
    </BottomSheet>
  );

  if (pv === 'card-amount') return amtScreen('💳', 'Credit / Debit Card', () => setPv(null), () => setPv('card-form'), { background: '#06B6D4', color: '#070B14', fontFamily: 'Outfit' });

  if (pv === 'card-form') return (
    <BottomSheet onBdClick={onClose}>
      <div className="px-5 pb-8 pt-2">
        <div className="flex items-center gap-3 mb-6">{backBtn(() => setPv('card-amount'))}<span className="font-bold text-base" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>Card Details</span></div>
        <div className="space-y-4 mb-5">
          <div><div className="text-xs mb-1.5 font-medium" style={{ color: '#475569', fontFamily: 'Outfit' }}>Card Number</div><input type="text" value={cardNum} onChange={e => setCardNum(fmtCard(e.target.value))} style={inputSt} placeholder="0000 0000 0000 0000" /></div>
          <div><div className="text-xs mb-1.5 font-medium" style={{ color: '#475569', fontFamily: 'Outfit' }}>Name on Card</div><input type="text" value={cardName} onChange={e => setCardName(e.target.value)} style={{ ...inputSt, fontFamily: 'Inter' }} placeholder="Full name" /></div>
          <div className="flex gap-3">
            <div className="flex-1"><div className="text-xs mb-1.5 font-medium" style={{ color: '#475569', fontFamily: 'Outfit' }}>Expiry Date</div><input type="text" value={cardExp} onChange={e => setCardExp(fmtExp(e.target.value))} style={inputSt} placeholder="MM/YY" /></div>
            <div className="flex-1"><div className="text-xs mb-1.5 font-medium" style={{ color: '#475569', fontFamily: 'Outfit' }}>CVV</div><input type="text" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} style={inputSt} placeholder="•••" /></div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-6 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <span className="text-sm" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}>Payment Amount</span>
          <span className="font-bold" style={{ color: '#06B6D4', fontFamily: 'JetBrains Mono' }}>PKR {parseInt(amount || '0').toLocaleString()}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-base" style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Outfit' }}>Cancel</button>
          <button onClick={onSuccess} className="flex-1 py-4 rounded-2xl font-bold text-base" style={{ background: '#06B6D4', color: '#070B14', fontFamily: 'Outfit' }}>Pay</button>
        </div>
      </div>
    </BottomSheet>
  );

  if (pv === 'scratch') return (
    <BottomSheet onBdClick={onClose}>
      <div className="px-5 pb-8 pt-2">
        <div className="flex items-center gap-3 mb-6">{backBtn(() => setPv(null))}<div className="flex items-center gap-2"><span style={{ fontSize: 18 }}>🎫</span><span className="font-bold text-base" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>Scratch Card</span></div></div>
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>🎫</div>
          <div className="text-sm font-medium text-center" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>Enter your 14-digit scratch card number</div>
        </div>
        <input type="text" value={scratch} onChange={e => setScratch(e.target.value.replace(/\D/g, '').slice(0, 14))} style={{ ...inputSt, textAlign: 'center', fontSize: 18, letterSpacing: 3, marginBottom: 8 }} placeholder="— — — — — — — —" maxLength={14} />
        <div className="text-xs text-center mb-6" style={{ color: '#475569', fontFamily: 'JetBrains Mono' }}>{scratch.length}/14 digits</div>
        <button onClick={onSuccess} disabled={scratch.length !== 14} className="w-full py-4 rounded-2xl font-bold text-base"
          style={{ background: scratch.length === 14 ? '#06B6D4' : 'rgba(255,255,255,0.06)', color: scratch.length === 14 ? '#070B14' : '#475569', fontFamily: 'Outfit' }}>Redeem Scratch Card</button>
      </div>
    </BottomSheet>
  );

  return null;
}

// ─── Credit Limit Section ─────────────────────────────────────────────────────

function CreditLimitSection({ committedLimit, onUpdate, showTitle = true, payDifferential = false }: {
  committedLimit: number; onUpdate: (v: number) => void; showTitle?: boolean; payDifferential?: boolean;
}) {
  const [draft, setDraft] = useState(committedLimit);
  const [inputStr, setInputStr] = useState(committedLimit.toString());
  const [showPanel, setShowPanel] = useState(false);
  const [showGw, setShowGw] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const baseLimit = useRef(committedLimit);

  useEffect(() => {
    setDraft(committedLimit); setInputStr(committedLimit.toString()); setShowPanel(false);
    baseLimit.current = committedLimit;
  }, [committedLimit]);

  const slide = (v: number) => { setDraft(v); setInputStr(v.toString()); setShowPanel(v !== committedLimit); };
  const input = (s: string) => { setInputStr(s); const c = Math.max(1000, Math.min(50000, parseInt(s.replace(/,/g, '')) || 0)); setDraft(c); setShowPanel(c !== committedLimit); };
  const exit = () => { setDraft(committedLimit); setInputStr(committedLimit.toString()); setShowPanel(false); setShowGw(false); };
  const payAmount = payDifferential ? Math.max(0, draft - baseLimit.current) : draft;
  const paySuccess = () => { onUpdate(draft); baseLimit.current = draft; setShowPanel(false); setShowGw(false); setToast(`Credit limit updated to PKR ${draft.toLocaleString()}`); };

  const pct = ((draft - 1000) / 49000) * 100;

  return (
    <>
      {toast && <Toast message={`✓ ${toast}`} onDone={() => setToast(null)} />}
      {showGw && <PaymentGateway targetAmount={payAmount} onSuccess={paySuccess} onClose={() => setShowGw(false)} />}
      <div className="rounded-3xl p-5" style={{ background: '#0E1828', border: '1px solid rgba(255,255,255,0.07)' }}>
        {showTitle && <>
          <div className="text-sm font-bold mb-1" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>Credit Limit Adjustment</div>
          <div className="text-xs mb-4" style={{ color: '#475569', fontFamily: 'Outfit' }}>Adjust your roaming credit ceiling</div>
        </>}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}>Current Limit</span>
          <span className="text-lg font-bold" style={{ color: '#06B6D4', fontFamily: 'JetBrains Mono' }}>PKR {committedLimit.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}>New Limit</span>
          <span className="text-base font-bold transition-all duration-200"
            style={{ color: draft !== committedLimit ? '#10B981' : '#475569', fontFamily: 'JetBrains Mono' }}>
            PKR {draft.toLocaleString()}
          </span>
        </div>
        <input type="range" min={1000} max={50000} step={500} value={draft} onChange={e => slide(Number(e.target.value))} className="w-full mb-2"
          style={{ background: `linear-gradient(to right,#06B6D4 ${pct}%,rgba(255,255,255,0.1) ${pct}%)` }} />
        <div className="flex justify-between text-xs mb-4" style={{ color: '#475569', fontFamily: 'JetBrains Mono' }}>
          <span>PKR 1,000</span><span>PKR 50,000</span>
        </div>
        {showPanel && (
          <div className="fade-in">
            <div className="text-xs mb-1.5 font-medium" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}>Or enter a custom amount</div>
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: '#475569', fontFamily: 'JetBrains Mono' }}>PKR</span>
              <input type="number" value={inputStr} onChange={e => input(e.target.value)}
                className="w-full rounded-xl py-2.5 pl-12 pr-4 text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(6,182,212,0.3)', color: '#E2E8F0', fontFamily: 'JetBrains Mono' }} />
            </div>
            <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: '#06B6D4', fontFamily: 'Outfit' }}>
                {payDifferential ? `Amount to top-up to reach PKR ${draft.toLocaleString()}` : 'Choose payment method to set credit limit to'}
              </div>
              <div className="text-xl font-bold" style={{ color: '#E2E8F0', fontFamily: 'JetBrains Mono' }}>
                PKR {payAmount.toLocaleString()}
              </div>
              {payDifferential && <div className="text-xs mt-1" style={{ color: '#475569', fontFamily: 'Outfit' }}>New limit after payment: PKR {draft.toLocaleString()}</div>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowGw(true)} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ background: '#06B6D4', color: '#070B14', fontFamily: 'Outfit' }}>Proceed to Payment</button>
              <button onClick={exit} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Outfit' }}>Exit &amp; Keep Limit</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Mode Toggle ──────────────────────────────────────────────────────────────

function ModeToggle({ active, onChange, disabled }: { active: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2" style={{ opacity: disabled ? 0.45 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <button onClick={() => onChange(!active)}
        className="relative flex items-center rounded-full transition-all duration-300 select-none"
        style={{
          background: active ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.06)',
          border: `1.5px solid ${active ? 'rgba(6,182,212,0.5)' : 'rgba(255,255,255,0.12)'}`,
          padding: '4px',
          boxShadow: active ? '0 0 24px rgba(6,182,212,0.25)' : 'none',
        }}>
        <span className="text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300"
          style={{ background: !active ? 'rgba(255,255,255,0.14)' : 'transparent', color: !active ? '#E2E8F0' : '#475569', fontFamily: 'Outfit' }}>
          Roaming Off
        </span>
        <span className="text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300"
          style={{ background: active ? '#06B6D4' : 'transparent', color: active ? '#070B14' : '#475569', fontFamily: 'Outfit', fontWeight: active ? 700 : 500 }}>
          Roaming On
        </span>
      </button>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: active ? '#10B981' : '#475569' }} />
        <span className="text-xs" style={{ color: active ? '#10B981' : '#475569', fontFamily: 'Outfit' }}>
          {disabled ? 'Requires credit limit ≥ PKR 5,000' : active ? 'International roaming enabled' : 'Roaming services off'}
        </span>
      </div>
    </div>
  );
}

// ─── Bundle Card (regional / Browse All grid) ─────────────────────────────────

function BundleCard({ bundle, isFav, onToggleFav, onAction, onViewCountries }: {
  bundle: Bundle; isFav: boolean; onToggleFav: () => void;
  onAction: (a: BundleAction) => void;
  onViewCountries?: (b: Bundle) => void;
}) {
  const meta = REGION_META[bundle.region];
  return (
    <div className="relative flex flex-col rounded-2xl p-4 fade-in"
      style={{ background: '#0E1828', border: '1px solid rgba(255,255,255,0.07)', minWidth: 160 }}>
      <button onClick={onToggleFav} className="absolute top-3 left-3 w-7 h-7 flex items-center justify-center rounded-full"
        style={{ background: isFav ? 'rgba(251,113,133,0.15)' : 'rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: 13, color: isFav ? '#FB7185' : '#475569' }}>{isFav ? '♥' : '♡'}</span>
      </button>
      <div className="flex justify-end mb-1">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${meta.color}18`, color: meta.color, fontFamily: 'Outfit' }}>{meta.icon} {bundle.region}</span>
      </div>
      <h3 className="text-sm font-semibold mt-1 mb-3 pl-1" style={{ color: '#E2E8F0', fontFamily: 'Outfit', lineHeight: 1.3 }}>{bundle.name}</h3>
      <div className="flex gap-3 mb-3 items-end">
        <div><div className="text-xs mb-0.5" style={{ color: '#475569', fontFamily: 'Outfit' }}>Data</div><div className="font-bold text-base" style={{ color: '#06B6D4', fontFamily: 'JetBrains Mono' }}>{bundle.data}</div></div>
        <div className="ml-auto text-right"><div className="text-xs mb-0.5" style={{ color: '#475569', fontFamily: 'Outfit' }}>Valid</div><div className="text-xs font-medium" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}>{bundle.validityLabel}</div></div>
      </div>
      <div className="mb-4"><span className="font-bold text-xl" style={{ color: '#E2E8F0', fontFamily: 'JetBrains Mono' }}>PKR {bundle.price.toLocaleString()}</span></div>
      <div className="flex gap-2">
        <button onClick={() => onAction('buy')} className="flex-1 py-2 rounded-xl text-xs font-bold" style={{ background: '#06B6D4', color: '#070B14', fontFamily: 'Outfit' }}>Buy</button>
        <button onClick={() => onAction('subscribe')} className="flex-1 py-2 rounded-xl text-xs font-semibold" style={{ background: 'rgba(6,182,212,0.1)', color: '#06B6D4', border: '1px solid rgba(6,182,212,0.25)', fontFamily: 'Outfit' }}>Subscribe</button>
      </div>
    </div>
  );
}

// ─── Bundle List Row (search / validity-grouped list) ─────────────────────────

function BundleListRow({ bundle, isFav, onToggleFav, onSubscribe, onViewCountries }: {
  bundle: Bundle; isFav: boolean; onToggleFav: () => void;
  onSubscribe: () => void; onViewCountries: (b: Bundle) => void;
}) {
  const meta = REGION_META[bundle.region];
  return (
    <div className="flex items-center gap-3 py-3.5 px-4 rounded-2xl mb-2 fade-in"
      style={{ background: '#0E1828', border: '1px solid rgba(255,255,255,0.07)' }}>
      <button onClick={onToggleFav} className="w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0"
        style={{ background: isFav ? 'rgba(251,113,133,0.15)' : 'rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: 12, color: isFav ? '#FB7185' : '#475569' }}>{isFav ? '♥' : '♡'}</span>
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: `${meta.color}18`, color: meta.color, fontFamily: 'Outfit', fontSize: 10 }}>{meta.icon} {bundle.region}</span>
        </div>
        <div className="text-sm font-semibold truncate" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>{bundle.name}</div>
        <div className="flex items-center gap-3 mt-0.5">
          <span style={{ color: '#06B6D4', fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 600 }}>{bundle.data}</span>
          <span className="font-bold text-sm" style={{ color: '#E2E8F0', fontFamily: 'JetBrains Mono', marginLeft: 'auto' }}>PKR {bundle.price.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <button onClick={() => onViewCountries(bundle)} className="px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.35)', fontFamily: 'Outfit', whiteSpace: 'nowrap' }}>
          View Countries
        </button>
        <button onClick={onSubscribe} className="px-3 py-1.5 rounded-xl text-xs font-bold"
          style={{ background: 'rgba(6,182,212,0.12)', color: '#06B6D4', border: '1px solid rgba(6,182,212,0.25)', fontFamily: 'Outfit' }}>
          Subscribe
        </button>
      </div>
    </div>
  );
}

// ─── Validity-Grouped Bundle List ─────────────────────────────────────────────

function GroupedBundleList({ bundles, favs, onToggleFav, onSubscribe, onViewCountries }: {
  bundles: Bundle[]; favs: Set<string>; onToggleFav: (id: string) => void;
  onSubscribe: (b: Bundle) => void; onViewCountries: (b: Bundle) => void;
}) {
  const groups = groupByValidity(bundles);
  return (
    <>
      {groups.map(([label, grpBundles]) => (
        <div key={label} className="mb-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <span style={{ fontSize: 14 }}>⏱</span>
            <span className="text-sm font-semibold" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}>{label}</span>
          </div>
          {grpBundles.map(b => (
            <BundleListRow key={b.id} bundle={b} isFav={favs.has(b.id)}
              onToggleFav={() => onToggleFav(b.id)}
              onSubscribe={() => onSubscribe(b)}
              onViewCountries={onViewCountries} />
          ))}
        </div>
      ))}
    </>
  );
}

// ─── Bundle Modal ─────────────────────────────────────────────────────────────

function BundleModal({ bundle, action, onClose, onConfirm, onViewCountries }: {
  bundle: Bundle; action: BundleAction; onClose: () => void; onConfirm: () => void;
  onViewCountries: (b: Bundle) => void;
}) {
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [tcOpen, setTcOpen] = useState(false);
  const [showSubPayGw, setShowSubPayGw] = useState(false);
  const meta = REGION_META[bundle.region];
  const displayCountries = bundle.countries.length <= 3
    ? bundle.countries
    : bundle.countries.slice(0, 3);
  const hasMore = bundle.countries.length > 3;

  const sheet = (
    <BottomSheet onBdClick={onClose}>
      <div className="px-5 pb-8 pt-2">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium mb-2 inline-block" style={{ background: `${meta.color}18`, color: meta.color, fontFamily: 'Outfit' }}>{meta.icon} {bundle.region}</span>
            <h2 className="text-xl font-bold" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>{bundle.name}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.07)', color: '#94A3B8', fontSize: 14 }}>✕</button>
        </div>

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-3xl font-bold" style={{ color: '#E2E8F0', fontFamily: 'JetBrains Mono' }}>PKR {bundle.price.toLocaleString()}</span>
        </div>

        <div className="flex gap-3 mb-5">
          <div className="flex-1 rounded-2xl p-3.5" style={{ background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.18)' }}>
            <div className="text-xs mb-1" style={{ color: '#475569', fontFamily: 'Outfit' }}>Data</div>
            <div className="text-2xl font-bold" style={{ color: '#06B6D4', fontFamily: 'JetBrains Mono' }}>{bundle.data}</div>
          </div>
          <div className="flex-1 rounded-2xl p-3.5" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.22)' }}>
            <div className="text-xs mb-1" style={{ color: '#475569', fontFamily: 'Outfit' }}>Validity</div>
            <div className="text-2xl font-bold" style={{ color: '#F59E0B', fontFamily: 'JetBrains Mono' }}>{bundle.validityLabel}</div>
            <div className="text-xs mt-1" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}>Expires {ordinalDate(bundle.validityDays)}</div>
          </div>
        </div>

        {/* Applicable Countries - collapsible */}
        <div className="mb-4">
          <button className="w-full flex items-center justify-between py-3 px-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            onClick={() => setCountriesOpen(o => !o)}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#475569', fontFamily: 'Outfit' }}>Applicable Countries</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${meta.color}18`, color: meta.color, fontFamily: 'JetBrains Mono' }}>{bundle.countries.length}</span>
            </div>
            <span style={{ color: '#475569', fontSize: 16, transform: countriesOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
          </button>
          {countriesOpen && (
            <div className="mt-2 rounded-2xl p-4 fade-in" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {bundle.countries.length <= 5 ? (
                bundle.countries.map(c => (
                  <div key={c} className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                    <span className="text-sm" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}>{c}</span>
                  </div>
                ))
              ) : (
                <>
                  {displayCountries.map(c => (
                    <div key={c} className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                      <span className="text-sm" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}>{c}</span>
                    </div>
                  ))}
                  {hasMore && (
                    <button onClick={() => onViewCountries(bundle)} className="w-full pt-3 text-xs font-semibold text-center"
                      style={{ color: '#06B6D4', fontFamily: 'Outfit' }}>
                      See all {bundle.countries.length} countries →
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Terms & Conditions — collapsible */}
        <div className="mb-7">
          <button className="w-full flex items-center justify-between py-3 px-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            onClick={() => setTcOpen(o => !o)}>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#475569', fontFamily: 'Outfit' }}>Terms &amp; Conditions</span>
            <span style={{ color: '#475569', fontSize: 16, transform: tcOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
          </button>
          {tcOpen && (
            <div className="mt-2 rounded-2xl p-4 space-y-3 fade-in" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {TC_TEXT.map((t, i) => (
                <div key={i} className="flex gap-2 text-xs" style={{ color: '#475569', fontFamily: 'Inter', lineHeight: 1.6 }}>
                  <span className="flex-shrink-0 font-bold" style={{ color: meta.color }}>·</span>{t}
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => action === 'subscribe' ? setShowSubPayGw(true) : onConfirm()}
          className="w-full py-4 rounded-2xl text-base font-bold"
          style={{ background: '#06B6D4', color: '#070B14', fontFamily: 'Outfit' }}>
          {action === 'buy' ? `Confirm Purchase — PKR ${bundle.price.toLocaleString()}` : 'Confirm Subscription'}
        </button>
      </div>
    </BottomSheet>
  );
  // Note: payment gateway renders above the bottom sheet when open
  return (
    <>
      {sheet}
      {showSubPayGw && (
        <PaymentGateway
          targetAmount={bundle.price}
          onSuccess={() => { setShowSubPayGw(false); onConfirm(); }}
          onClose={() => setShowSubPayGw(false)} />
      )}
    </>
  );
}

// ─── Incentive Header (bundle info at top) ────────────────────────────────────

function BundleHeaderBadge({ activeBundles }: { activeBundles: Bundle[] }) {
  if (activeBundles.length === 0) {
    return (
      <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#475569' }} />
        <span className="text-xs font-semibold" style={{ color: '#475569', fontFamily: 'Outfit' }}>No Active Bundle — subscribe below to get started</span>
      </div>
    );
  }

  if (activeBundles.length === 1) {
    const b = activeBundles[0];
    const expiry = ordinalDate(b.validityDays);
    return (
      <div className="mb-4 px-3 py-3 rounded-2xl"
        style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full pulse-glow flex-shrink-0" style={{ background: '#10B981' }} />
            <div>
              <div className="text-sm font-bold" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>{b.name}</div>
              <div className="text-xs mt-0.5" style={{ color: '#475569', fontFamily: 'Outfit' }}>Active · {b.validityLabel}</div>
            </div>
          </div>
          <div className="text-right ml-3">
            <div className="text-xs font-semibold" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}>Expires On</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: '#F59E0B', fontFamily: 'JetBrains Mono' }}>{expiry}</div>
          </div>
        </div>
      </div>
    );
  }

  // Multiple bundles — compact stacked list
  return (
    <div className="mb-4 rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(6,182,212,0.2)' }}>
      <div className="px-3 py-2" style={{ background: 'rgba(6,182,212,0.1)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full pulse-glow" style={{ background: '#10B981' }} />
          <span className="text-xs font-bold" style={{ color: '#06B6D4', fontFamily: 'Outfit' }}>{activeBundles.length} Active Bundles</span>
        </div>
      </div>
      {activeBundles.map((b, i) => {
        const expiry = ordinalDate(b.validityDays);
        return (
          <div key={b.id + i} className="flex items-center justify-between px-3 py-2"
            style={{ background: 'rgba(6,182,212,0.04)', borderTop: '1px solid rgba(6,182,212,0.1)' }}>
            <div className="min-w-0 mr-3">
              <div className="text-xs font-semibold truncate" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>{b.name}</div>
              <div className="text-xs" style={{ color: '#475569', fontFamily: 'Outfit' }}>{b.data} · {b.validityLabel}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}>Expires</div>
              <div className="text-sm font-bold" style={{ color: '#F59E0B', fontFamily: 'JetBrains Mono' }}>{expiry}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Home Incentive Widget ────────────────────────────────────────────────────

interface ToggleState { paygBlocked: boolean; incomingSMS: boolean; dataRoaming: boolean; }
interface ToggleSetters { setPaygBlocked: (v: boolean) => void; setIncomingSMS: (v: boolean) => void; setDataRoaming: (v: boolean) => void; }

function CompactToggleRow({ ts, setters, hasBundles }: { ts: ToggleState; setters: ToggleSetters; hasBundles: boolean }) {
  const [openTip, setOpenTip] = useState<string | null>(null);

  const items = [
    {
      id: 'voice', label: 'Voice', desc: 'Pay-as-you-go voice rates apply abroad',
      active: !ts.paygBlocked, onChange: (v: boolean) => setters.setPaygBlocked(!v), locked: false,
    },
    {
      id: 'incoming', label: 'Incoming', desc: 'Receive calls and SMS abroad',
      active: ts.incomingSMS, onChange: setters.setIncomingSMS, locked: false,
    },
    {
      id: 'data', label: 'Data', desc: hasBundles ? 'Data roaming active via your bundle' : 'Subscribe to a bundle to activate data roaming',
      active: ts.dataRoaming, onChange: setters.setDataRoaming, locked: !hasBundles,
    },
  ];

  return (
    <div className="mb-3">
      <div className="flex gap-2">
        {items.map(item => (
          <div key={item.id} className="flex-1 flex flex-col gap-1">
            <button onClick={() => !item.locked && item.onChange(!item.active)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl"
              style={{
                background: item.locked ? 'rgba(255,255,255,0.02)' : item.active ? 'rgba(6,182,212,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${item.locked ? 'rgba(255,255,255,0.05)' : item.active ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.07)'}`,
                cursor: item.locked ? 'not-allowed' : 'pointer',
                opacity: item.locked ? 0.5 : 1,
              }}>
              <span className="text-xs font-semibold" style={{ color: item.locked ? '#334155' : item.active ? '#06B6D4' : '#475569', fontFamily: 'Outfit' }}>{item.label}</span>
              <div className="relative w-7 h-4 rounded-full ml-1.5 flex-shrink-0 transition-all duration-200"
                style={{ background: item.locked ? 'rgba(255,255,255,0.1)' : item.active ? '#06B6D4' : 'rgba(255,255,255,0.15)' }}>
                <div className="absolute top-0.5 w-3 h-3 rounded-full transition-all duration-200"
                  style={{ background: '#fff', left: item.active ? '14px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
              </div>
            </button>
            {/* ⓘ info button below each toggle */}
            <button onClick={() => setOpenTip(openTip === item.id ? null : item.id)}
              className="w-full flex items-center justify-center gap-1 py-0.5 rounded-lg"
              style={{ background: openTip === item.id ? 'rgba(6,182,212,0.07)' : 'transparent' }}>
              <span className="text-xs font-bold"
                style={{ color: openTip === item.id ? '#06B6D4' : '#334155', fontFamily: 'JetBrains Mono', fontSize: 10 }}>ⓘ</span>
              <span className="text-xs" style={{ color: openTip === item.id ? '#06B6D4' : '#334155', fontFamily: 'Outfit', fontSize: 10 }}>info</span>
            </button>
          </div>
        ))}
      </div>
      {openTip && (
        <div className="mt-2 px-3 py-2.5 rounded-xl fade-in"
          style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.18)' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#94A3B8', fontFamily: 'Inter' }}>
            {items.find(i => i.id === openTip)?.desc}
          </p>
        </div>
      )}
    </div>
  );
}

function IncentiveWidget({ onClick, activeBundles, ts, setters }: {
  onClick: () => void; activeBundles: Bundle[];
  ts: ToggleState; setters: ToggleSetters;
}) {
  if (activeBundles.length === 0) {
    return (
      <div>
        <CompactToggleRow ts={ts} setters={setters} hasBundles={activeBundles.length > 0} />
        <button onClick={onClick} className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5"
          style={{ background: 'rgba(14,24,40,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(71,85,105,0.2)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ color: '#475569', fontSize: 16 }}>📡</span>
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}>No Active Bundle</div>
            <div className="text-xs" style={{ color: '#475569', fontFamily: 'Outfit' }}>Subscribe below to get started</div>
          </div>
          <div className="flex items-center gap-1" style={{ color: '#475569' }}>
            <span className="text-xs" style={{ fontFamily: 'Outfit' }}>Settings</span>
            <span style={{ fontSize: 14 }}>›</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-5" style={{ background: 'linear-gradient(135deg,#0E1828 0%,#162036 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#475569', fontFamily: 'Outfit' }}>Remaining Incentive</div>
        <button onClick={onClick} className="flex items-center gap-1" style={{ color: '#06B6D4' }}>
          <span className="text-xs font-semibold" style={{ fontFamily: 'Outfit' }}>Settings</span>
          <span style={{ fontSize: 12 }}>›</span>
        </button>
      </div>
      <BundleHeaderBadge activeBundles={activeBundles} />
      <DataIncentive bundles={activeBundles} />
    </div>
  );
}

// ─── HOME VIEW ────────────────────────────────────────────────────────────────

function HomeView({ roaming, onRoamingChange, onOpenSettings, favs, onToggleFav,
  onBundleAction, onSubscribe, onViewCountries, userCreditLimit, onCreditLimitUpdate, activeBundles, ts, setters }: {
  roaming: boolean; onRoamingChange: (v: boolean) => void; onOpenSettings: () => void;
  favs: Set<string>; onToggleFav: (id: string) => void;
  onBundleAction: (b: Bundle, a: BundleAction | 'blocked') => void;
  onSubscribe: (b: Bundle) => void;
  onViewCountries: (b: Bundle) => void;
  userCreditLimit: number; onCreditLimitUpdate: (v: number) => void;
  activeBundles: Bundle[];
  ts: ToggleState; setters: ToggleSetters;
}) {
  const [query, setQuery] = useState('');
  const [selRegion, setSelRegion] = useState<Region | null>(null);
  const results = searchBundles(query);
  const showSearch = query.length > 0;
  const showRegion = selRegion !== null && !showSearch;
  const needsTopUp = userCreditLimit < MIN_CREDIT;

  function handleAction(b: Bundle, a: BundleAction) {
    needsTopUp ? onBundleAction(b, 'blocked') : onBundleAction(b, a);
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center justify-between mb-4">
          {showRegion
            ? <button onClick={() => setSelRegion(null)} className="flex items-center gap-2 text-sm" style={{ color: '#94A3B8', fontFamily: 'Outfit' }}><span style={{ fontSize: 18 }}>‹</span> Back</button>
            : <div className="text-xs" style={{ color: '#475569', fontFamily: 'Outfit' }}>Jazz Postpay</div>}
          <div className="text-right">
            <div className="text-xs" style={{ color: '#475569', fontFamily: 'Outfit' }}>International</div>
            <div className="text-sm font-bold" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>Roaming</div>
          </div>
        </div>

        {!showRegion && (
          <div className="flex justify-center mb-4">
            <ModeToggle active={roaming} onChange={onRoamingChange} disabled={needsTopUp} />
          </div>
        )}

        {!showRegion && needsTopUp && (
          <div className="mb-5 fade-in">
            <div className="flex items-start gap-3 rounded-2xl px-4 py-3 mb-3" style={{ background: 'rgba(245,158,11,0.09)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>🔒</span>
              <div>
                <div className="text-xs font-bold" style={{ color: '#F59E0B', fontFamily: 'Outfit' }}>Credit Limit Required</div>
                <div className="text-xs mt-0.5 leading-relaxed" style={{ color: '#94A3B8', fontFamily: 'Inter' }}>
                  Top-up your credit limit to <strong style={{ color: '#F59E0B' }}>PKR 5,000</strong> to enable International Roaming
                </div>
              </div>
            </div>
            <CreditLimitSection committedLimit={userCreditLimit} onUpdate={onCreditLimitUpdate} showTitle={false} payDifferential />
          </div>
        )}
      </div>

      {showRegion ? (
        <div className="flex-1 px-5 pb-6">
          <div className="flex items-center gap-3 mb-5">
            <span style={{ fontSize: 28 }}>{REGION_META[selRegion!].icon}</span>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>{selRegion} Bundles</h2>
              <div className="text-xs" style={{ color: '#475569', fontFamily: 'Outfit' }}>{REGION_META[selRegion!].desc}</div>
            </div>
          </div>
          <GroupedBundleList
            bundles={BUNDLES.filter(b => b.region === selRegion)}
            favs={favs} onToggleFav={onToggleFav}
            onSubscribe={b => handleAction(b, 'subscribe')}
            onViewCountries={onViewCountries} />
        </div>
      ) : (
        <>
          {roaming && (
            <div className="px-5 mb-4">
              <IncentiveWidget onClick={onOpenSettings} activeBundles={activeBundles} ts={ts} setters={setters} />
            </div>
          )}

          {/* Search bar */}
          <div className="px-5 mb-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base" style={{ color: '#475569' }}>🔍</span>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Where are you roaming to?"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm outline-none transition-all"
                style={{ background: '#0E1828', border: `1px solid ${query ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.08)'}`, color: '#E2E8F0', fontFamily: 'Inter' }} />
              {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.08)', color: '#94A3B8', fontSize: 12 }}>✕</button>}
            </div>
          </div>

          {showSearch ? (
            <div className="px-5 pb-6">
              {results.length > 0 ? (
                <>
                  <div className="text-xs mb-3" style={{ color: '#475569', fontFamily: 'Outfit' }}>{results.length} bundle{results.length !== 1 ? 's' : ''} found for "{query}"</div>
                  <GroupedBundleList bundles={results} favs={favs} onToggleFav={onToggleFav}
                    onSubscribe={b => (needsTopUp ? onBundleAction(b, 'blocked') : onSubscribe(b))}
                    onViewCountries={onViewCountries} />
                </>
              ) : (
                <div className="flex flex-col items-center py-10" style={{ color: '#475569' }}>
                  <span style={{ fontSize: 36 }}>🌐</span>
                  <div className="text-sm mt-3" style={{ fontFamily: 'Outfit' }}>No bundles found for "{query}"</div>
                </div>
              )}
            </div>
          ) : (
            <div className="px-5 pb-6">
              {/* Browse by Region */}
              <div className="text-xs mb-3 font-medium uppercase tracking-widest" style={{ color: '#475569', fontFamily: 'Outfit' }}>Browse by Region</div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {REGIONS.map(region => {
                  const meta = REGION_META[region];
                  const count = BUNDLES.filter(b => b.region === region).length;
                  return (
                    <button key={region} onClick={() => setSelRegion(region)} className="flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all" style={{ background: 'rgba(14,24,40,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${meta.color}15` }}>{meta.icon}</div>
                      <div><div className="text-sm font-semibold" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>{region}</div><div className="text-xs" style={{ color: '#475569', fontFamily: 'Outfit' }}>{count} bundle{count !== 1 ? 's' : ''}</div></div>
                      <span className="ml-auto text-sm" style={{ color: meta.color }}>›</span>
                    </button>
                  );
                })}
              </div>

              {/* Browse All */}
              <div className="text-xs mb-3 font-medium uppercase tracking-widest" style={{ color: '#475569', fontFamily: 'Outfit' }}>Browse All</div>
              <GroupedBundleList
                bundles={BUNDLES} favs={favs} onToggleFav={onToggleFav}
                onSubscribe={b => handleAction(b, 'subscribe')}
                onViewCountries={onViewCountries} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Connectivity Settings (formerly Roaming Centre) ─────────────────────────

function ConnectivitySettings({ onBack, userCreditLimit, onCreditLimitUpdate,
  activeBundles, ts, setters }: {
  onBack: () => void;
  userCreditLimit: number; onCreditLimitUpdate: (v: number) => void;
  activeBundles: Bundle[];
  ts: ToggleState; setters: ToggleSetters;
}) {
  const [tooltip, setTooltip] = useState<string | null>(null);

  const hasBundles = activeBundles.length > 0;
  const TOGGLES = [
    {
      id: 'payg',
      label: ts.paygBlocked ? 'Voice Roaming (Blocked)' : 'Voice Roaming',
      desc: 'Pay-as-you-go voice rates apply abroad; subscribe to a bundle for data',
      active: !ts.paygBlocked,
      onChange: (v: boolean) => setters.setPaygBlocked(!v),
      locked: false,
    },
    {
      id: 'incoming',
      label: 'Incoming Calls & SMS',
      desc: 'Receive calls and SMS abroad',
      active: ts.incomingSMS,
      onChange: setters.setIncomingSMS,
      locked: false,
    },
    {
      id: 'data',
      label: 'Data Roaming',
      desc: hasBundles ? 'Data roaming active via your subscribed bundle' : 'Subscribe to a bundle to activate data roaming',
      active: ts.dataRoaming,
      onChange: setters.setDataRoaming,
      locked: !hasBundles,
    },
  ];

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.07)', color: '#94A3B8', fontSize: 18 }}>‹</button>
        <div>
          <div className="text-xs" style={{ color: '#475569', fontFamily: 'Outfit' }}>Roaming</div>
          <div className="text-base font-bold" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>Connectivity Settings</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981' }} />
          <span className="text-xs" style={{ color: '#10B981', fontFamily: 'Outfit' }}>Active</span>
        </div>
      </div>

      {/* 1 — Incentive Dashboard */}
      <div className="px-5 mb-5">
        <div className="rounded-3xl p-5" style={{ background: 'linear-gradient(135deg,#0E1828 0%,#162036 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: '#475569', fontFamily: 'Outfit' }}>Remaining Incentive</div>
          <BundleHeaderBadge activeBundles={activeBundles} />
          <DataIncentive bundles={activeBundles} />
        </div>
      </div>

      {/* 2 — Roaming Controls */}
      <div className="px-5 mb-5">
        <div className="rounded-3xl p-5" style={{ background: '#0E1828', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="text-sm font-bold mb-4" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>Roaming Controls</div>
          {TOGGLES.map((ctrl, i, arr) => (
            <div key={ctrl.id} style={{ opacity: ctrl.locked ? 0.45 : 1 }}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>{ctrl.label}</span>
                    <button onClick={() => setTooltip(tooltip === ctrl.id ? null : ctrl.id)}
                      className="w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 text-xs font-bold"
                      style={{ background: tooltip === ctrl.id ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.08)', color: tooltip === ctrl.id ? '#06B6D4' : '#475569', fontFamily: 'JetBrains Mono' }}>
                      i
                    </button>
                    {ctrl.locked && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', fontFamily: 'Outfit', fontSize: 10 }}>
                        Bundle required
                      </span>
                    )}
                  </div>
                  {tooltip === ctrl.id && (
                    <div className="mt-2 px-3 py-2 rounded-xl text-xs leading-relaxed fade-in"
                      style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#94A3B8', fontFamily: 'Inter' }}>
                      {ctrl.desc}
                    </div>
                  )}
                </div>
                <div style={{ pointerEvents: ctrl.locked ? 'none' : 'auto' }}>
                  <ToggleSwitch active={ctrl.active} onChange={ctrl.onChange} />
                </div>
              </div>
              {i < arr.length - 1 && <div className="h-px my-4" style={{ background: 'rgba(255,255,255,0.05)' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* 3 — Credit Limit */}
      <div className="px-5">
        <CreditLimitSection committedLimit={userCreditLimit} onUpdate={onCreditLimitUpdate} />
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>('home');
  const [roaming, setRoaming] = useState(false);
  const [dataRoaming, setDataRoaming] = useState(false);
  const [userCreditLimit, setUserCreditLimit] = useState(3000);
  const [activeBundles, setActiveBundles] = useState<Bundle[]>([]);
  const [paygBlocked, setPaygBlocked] = useState(false);
  const [incomingSMS, setIncomingSMS] = useState(true);
  const [favs, setFavs] = useState<Set<string>>(new Set(['euro-10gb']));
  const [selBundle, setSelBundle] = useState<Bundle | null>(null);
  const [bundleAction, setBundleAction] = useState<BundleAction>('buy');
  const [toast, setToast] = useState<string | null>(null);
  const [showRoamingPopup, setShowRoamingPopup] = useState(false);
  const [showCreditBlockedPopup, setShowCreditBlockedPopup] = useState(false);
  const [showDataRoamingPopup, setShowDataRoamingPopup] = useState(false);
  const [countriesBundle, setCountriesBundle] = useState<Bundle | null>(null);

  function handleRoamingChange(v: boolean) {
    setRoaming(v);
    if (v) setShowRoamingPopup(true);
    if (!v) setDataRoaming(false);
  }

  function handleCreditLimitUpdate(v: number) {
    setUserCreditLimit(v);
    if (v >= MIN_CREDIT && !roaming) {
      setRoaming(true);
      setShowRoamingPopup(true);
    }
  }

  function handleBundleAction(b: Bundle, a: BundleAction | 'blocked') {
    if (a === 'blocked') { setShowCreditBlockedPopup(true); return; }
    setSelBundle(b); setBundleAction(a);
  }

  function handleSubscribeDirect(b: Bundle) {
    setSelBundle(b); setBundleAction('subscribe');
  }

  function handleConfirm() {
    const confirmed = selBundle;
    setSelBundle(null);
    if (confirmed) setActiveBundles(prev => [...prev, confirmed]);
    setDataRoaming(true);
    setView('home');
    setTimeout(() => setShowDataRoamingPopup(true), 200);
  }

  function toggleFav(id: string) {
    setFavs(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  return (
    <div className="size-full overflow-y-auto" style={{ background: '#070B14', maxWidth: 480, margin: '0 auto' }}>
      {toast && <Toast message={`✓ ${toast}`} onDone={() => setToast(null)} />}

      {/* Countries screen overlay */}
      {countriesBundle && <CountriesScreen bundle={countriesBundle} onClose={() => setCountriesBundle(null)} />}

      {/* Roaming activated popup */}
      {showRoamingPopup && (
        <OverlayModal>
          <div className="w-full max-w-sm rounded-3xl p-7 text-center fade-in"
            style={{ background: 'linear-gradient(160deg,#0E1828 0%,#162036 100%)', border: '1px solid rgba(6,182,212,0.3)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)' }}>
              <span style={{ fontSize: 28, color: '#10B981' }}>✓</span>
            </div>
            <div className="text-lg font-bold mb-2" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>International Roaming Activated</div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#94A3B8', fontFamily: 'Inter' }}>
              Voice Roaming enabled. Subscribe to a bundle to activate Data Roaming.
            </p>
            <button onClick={() => setShowRoamingPopup(false)} className="w-full py-3.5 rounded-2xl font-bold text-sm" style={{ background: '#06B6D4', color: '#070B14', fontFamily: 'Outfit' }}>Got it</button>
          </div>
        </OverlayModal>
      )}

      {/* Credit blocked popup */}
      {showCreditBlockedPopup && (
        <OverlayModal onBdClick={() => setShowCreditBlockedPopup(false)}>
          <div className="w-full max-w-sm rounded-3xl p-7 text-center fade-in"
            style={{ background: 'linear-gradient(160deg,#0E1828 0%,#162036 100%)', border: '1px solid rgba(245,158,11,0.35)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(245,158,11,0.12)', border: '2px solid rgba(245,158,11,0.35)' }}>
              <span style={{ fontSize: 26 }}>🔒</span>
            </div>
            <div className="text-base font-bold mb-2" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>Credit Limit Required</div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#94A3B8', fontFamily: 'Inter' }}>
              Top up your credit limit to <strong style={{ color: '#F59E0B' }}>PKR 5,000</strong> to enable International Roaming.
            </p>
            <button onClick={() => setShowCreditBlockedPopup(false)} className="w-full py-3.5 rounded-2xl font-bold text-sm" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.35)', fontFamily: 'Outfit' }}>Got it</button>
          </div>
        </OverlayModal>
      )}

      {/* Bundle subscribed confirmation */}
      {showDataRoamingPopup && (
        <OverlayModal onBdClick={() => setShowDataRoamingPopup(false)}>
          <div className="w-full max-w-sm rounded-3xl p-7 text-center fade-in"
            style={{ background: 'linear-gradient(160deg,#0E1828 0%,#162036 100%)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)' }}>
              <span style={{ fontSize: 28, color: '#10B981' }}>✓</span>
            </div>
            <div className="text-lg font-bold" style={{ color: '#E2E8F0', fontFamily: 'Outfit' }}>Bundle Subscribed</div>
            <button onClick={() => setShowDataRoamingPopup(false)} className="w-full mt-6 py-3.5 rounded-2xl font-bold text-sm" style={{ background: '#10B981', color: '#070B14', fontFamily: 'Outfit' }}>Done</button>
          </div>
        </OverlayModal>
      )}

      {view === 'home' && (
        <HomeView roaming={roaming} onRoamingChange={handleRoamingChange}
          onOpenSettings={() => setView('settings')}
          favs={favs} onToggleFav={toggleFav}
          onBundleAction={handleBundleAction}
          onSubscribe={handleSubscribeDirect}
          onViewCountries={setCountriesBundle}
          userCreditLimit={userCreditLimit} onCreditLimitUpdate={handleCreditLimitUpdate}
          activeBundles={activeBundles}
          ts={{ paygBlocked, incomingSMS, dataRoaming }}
          setters={{ setPaygBlocked, setIncomingSMS, setDataRoaming }} />
      )}

      {view === 'settings' && (
        <ConnectivitySettings onBack={() => setView('home')}
          userCreditLimit={userCreditLimit} onCreditLimitUpdate={handleCreditLimitUpdate}
          activeBundles={activeBundles}
          ts={{ paygBlocked, incomingSMS, dataRoaming }}
          setters={{ setPaygBlocked, setIncomingSMS, setDataRoaming }} />
      )}

      {selBundle && (
        <BundleModal bundle={selBundle} action={bundleAction}
          onClose={() => setSelBundle(null)}
          onConfirm={handleConfirm}
          onViewCountries={b => { setSelBundle(null); setTimeout(() => setCountriesBundle(b), 100); }} />
      )}
    </div>
  );
}
