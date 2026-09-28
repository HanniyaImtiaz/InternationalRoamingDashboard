import { useState, useRef, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Region = 'World' | 'Euro' | 'KSA' | 'UAE' | 'Ziyarat';
type View = 'home' | 'roamingCentre';
type IncentiveTab = 'data' | 'voice';
type BundleAction = 'buy' | 'subscribe';
type PayView = null | 'jc-amount' | 'jc-account' | 'jc-otp' | 'card-amount' | 'card-form' | 'scratch';

interface Bundle {
  id: string;
  name: string;
  region: Region;
  price: number;
  validity: string;
  data: string;
  dataGB: number;
  voice?: string;
  countries: string[];
  terms: string[];
}

// ─── Bundle Catalogue ─────────────────────────────────────────────────────────

const BUNDLES: Bundle[] = [
  { id: 'hajj-8gb', name: 'Hajj Offer', region: 'KSA', price: 6499, validity: '60 Days', data: '8 GB', dataGB: 8, voice: '50 Mins', countries: ['Saudi Arabia', 'Mecca', 'Medina'], terms: ['Valid during Hajj pilgrimage season only.', '2 GB WhatsApp bonus within 8 GB allocation.', '50 voice minutes to Pakistan included.', 'Activates on first international data session.', 'Non-transferable.'] },
  { id: 'saudi-2000', name: 'Saudi Roaming 2000', region: 'KSA', price: 2749, validity: '30 Days', data: '2 GB', dataGB: 2, countries: ['Saudi Arabia'], terms: ['Data-only bundle; voice at PAYG rates.', 'Valid in KSA only.', 'Unused data lapses on expiry.'] },
  { id: 'saudi-5000', name: 'Saudi Roaming 5000', region: 'KSA', price: 6872, validity: '45 Days', data: '6 GB', dataGB: 6, countries: ['Saudi Arabia'], terms: ['Data-only bundle; voice at PAYG rates.', 'Valid in KSA only.', 'Unused data lapses on expiry.'] },
  { id: 'hajj-takaful', name: 'Hajj Roaming + Travel Takaful', region: 'KSA', price: 5800, validity: '30 Days', data: '2 GB', dataGB: 2, countries: ['Saudi Arabia', 'Mecca', 'Medina'], terms: ['Includes Travel Takaful insurance.', 'Insurance activates on subscription.', 'Claims subject to separate Takaful T&Cs.'] },
  { id: 'uae-1gb', name: 'UAE Roaming 1 GB', region: 'UAE', price: 1374, validity: '7 Days', data: '1 GB', dataGB: 1, countries: ['UAE', 'Dubai', 'Abu Dhabi', 'Sharjah'], terms: ['Valid across all UAE network operators.', 'Data-only; voice at PAYG rates.', 'Expires 7 days from activation.'] },
  { id: 'uae-2gb', name: 'UAE Roaming 2 GB', region: 'UAE', price: 2473, validity: '15 Days', data: '2 GB', dataGB: 2, countries: ['UAE', 'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'], terms: ['Valid across all UAE network operators.', 'Data-only; voice at PAYG rates.', 'Expires 15 days from activation.'] },
  { id: 'uae-5gb', name: 'UAE Roaming 5 GB', region: 'UAE', price: 6183, validity: '30 Days', data: '5 GB', dataGB: 5, countries: ['UAE', 'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah'], terms: ['Valid across all UAE operators.', 'Data-only; voice at PAYG rates.', 'Renewable up to 3x per billing cycle.'] },
  { id: 'world-200mb', name: 'World Bundle 200MB', region: 'World', price: 1100, validity: '1 Day', data: '200 MB', dataGB: 0.2, countries: ['UK', 'USA', 'China', 'Turkey', 'Germany', 'France', 'Italy', 'Spain', 'Malaysia', 'Thailand', 'Singapore', 'UAE', 'Saudi Arabia', 'Iraq', 'Iran', '+80 countries'], terms: ['Valid for 24 hours from activation.', 'Covers 90+ countries worldwide.', 'Throttled to 512 kbps after quota exhaustion.'] },
  { id: 'world-500mb', name: 'World Bundle 500MB', region: 'World', price: 2474, validity: '7 Days', data: '500 MB', dataGB: 0.5, countries: ['UK', 'USA', 'China', 'Turkey', 'Germany', 'France', 'Italy', 'Spain', 'Malaysia', 'Thailand', 'Singapore', 'UAE', 'Saudi Arabia', 'Iraq', 'Iran', '+80 countries'], terms: ['Valid for 7 days from activation.', 'Covers 90+ countries worldwide.'] },
  { id: 'world-1gb', name: 'World Bundle 1GB', region: 'World', price: 4123, validity: '7 Days', data: '1 GB', dataGB: 1, countries: ['UK', 'USA', 'China', 'Turkey', 'Germany', 'France', 'Italy', 'Spain', 'Malaysia', 'Thailand', 'Singapore', 'UAE', 'Saudi Arabia', 'Iraq', 'Iran', '+80 countries'], terms: ['Valid for 7 days from activation.', 'Covers 90+ countries worldwide.'] },
  { id: 'world-3gb', name: 'World Bundle 3GB', region: 'World', price: 8934, validity: '30 Days', data: '3 GB', dataGB: 3, countries: ['UK', 'USA', 'China', 'Turkey', 'Germany', 'France', 'Italy', 'Spain', 'Malaysia', 'Thailand', 'Singapore', 'UAE', 'Saudi Arabia', 'Iraq', 'Iran', 'Syria', '+80 countries'], terms: ['Valid for 30 days from activation.', 'Covers 90+ countries worldwide.', 'LTE/4G speeds where available.'] },
  { id: 'world-5gb', name: 'World Bundle 5GB', region: 'World', price: 11682, validity: '90 Days', data: '5 GB', dataGB: 5, countries: ['UK', 'USA', 'China', 'Turkey', 'Germany', 'France', 'Italy', 'Spain', 'Malaysia', 'Thailand', 'Singapore', 'UAE', 'Saudi Arabia', 'Iraq', 'Iran', 'Syria', '+80 countries'], terms: ['Valid for 90 days from activation.', 'Covers 90+ countries worldwide.', 'LTE/4G speeds where available.', 'Best value for frequent travellers.'] },
  { id: 'euro-5gb', name: 'Euro Bundle 5 GB', region: 'Euro', price: 6872, validity: '30 Days', data: '5 GB', dataGB: 5, countries: ['UK', 'France', 'Germany', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria', 'Switzerland', 'Portugal', 'Greece', 'Poland', '+20 EU countries'], terms: ['Valid across 32 European countries.', 'Excludes Turkey and Russia.', 'Expires 30 days from activation.'] },
  { id: 'euro-10gb', name: 'Euro Bundle 10 GB', region: 'Euro', price: 10308, validity: '90 Days', data: '10 GB', dataGB: 10, countries: ['UK', 'France', 'Germany', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria', 'Switzerland', 'Portugal', 'Greece', 'Poland', '+20 EU countries'], terms: ['Valid across 32 European countries.', 'Excludes Turkey and Russia.', 'Expires 90 days from activation.'] },
  { id: 'ziyarat-5gb', name: 'Ziyarat Offer 5 GB', region: 'Ziyarat', price: 5497, validity: '30 Days', data: '5 GB', dataGB: 5, countries: ['Iraq', 'Iran', 'Syria', 'Saudi Arabia'], terms: ['For Ziyarat pilgrimage destinations.', 'Valid in Iraq, Iran, Syria, Saudi Arabia.', 'Data-only bundle.', 'Cannot combine with other Hajj/Saudi bundles.'] },
];

const REGIONS: Region[] = ['World', 'Euro', 'KSA', 'UAE', 'Ziyarat'];
const REGION_META: Record<Region, { icon: string; color: string; desc: string }> = {
  World:   { icon: '🌍', color: '#06B6D4', desc: '90+ countries' },
  Euro:    { icon: '🇪🇺', color: '#818CF8', desc: '32 EU countries' },
  KSA:     { icon: '🕌', color: '#F59E0B', desc: 'Saudi Arabia' },
  UAE:     { icon: '🏙️', color: '#34D399', desc: 'UAE & Emirates' },
  Ziyarat: { icon: '✨', color: '#FB7185', desc: 'Pilgrimage routes' },
};

const ACTIVE_BUNDLE = BUNDLES.find(b => b.id === 'euro-5gb')!;
const DATA_TOTAL = 5, DATA_USED = 1.8, DATA_REM = 3.2;
const VOICE_TOTAL = 50, VOICE_USED = 15, VOICE_REM = 35;
const MIN_CREDIT = 5000;

const COUNTRY_MAP: Record<string, Region[]> = {
  'saudi': ['KSA', 'World'], 'saudi arabia': ['KSA', 'World'], 'ksa': ['KSA', 'World'],
  'mecca': ['KSA', 'World'], 'medina': ['KSA', 'World'], 'riyadh': ['KSA', 'World'],
  'jeddah': ['KSA', 'World'], 'hajj': ['KSA'],
  'uae': ['UAE', 'World'], 'dubai': ['UAE', 'World'], 'abu dhabi': ['UAE', 'World'],
  'sharjah': ['UAE', 'World'], 'ajman': ['UAE', 'World'],
  'uk': ['Euro', 'World'], 'london': ['Euro', 'World'], 'france': ['Euro', 'World'],
  'paris': ['Euro', 'World'], 'germany': ['Euro', 'World'], 'italy': ['Euro', 'World'],
  'spain': ['Euro', 'World'], 'netherlands': ['Euro', 'World'], 'belgium': ['Euro', 'World'],
  'austria': ['Euro', 'World'], 'switzerland': ['Euro', 'World'], 'portugal': ['Euro', 'World'],
  'greece': ['Euro', 'World'], 'poland': ['Euro', 'World'],
  'usa': ['World'], 'america': ['World'], 'china': ['World'], 'turkey': ['World'],
  'malaysia': ['World'], 'thailand': ['World'], 'singapore': ['World'],
  'iraq': ['Ziyarat', 'World'], 'iran': ['Ziyarat', 'World'],
  'syria': ['Ziyarat', 'World'], 'ziyarat': ['Ziyarat'],
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

// ─── SVG Charts ──────────────────────────────────────────────────────────────

function CircularProgress({ pct, color, size = 180, strokeWidth = 14, children }: {
  pct: number; color: string; size?: number; strokeWidth?: number; children?: React.ReactNode;
}) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(pct, 100) / 100)} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color}99)` }} />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

function SplitDonut({ segments, size = 200, sw = 14 }: {
  segments: { pct: number; color: string }[]; size?: number; sw?: number;
}) {
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  let cum = 0;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
      {segments.map((s, i) => {
        const a = (s.pct / 100) * c;
        const off = -(cum / 100) * c;
        cum += s.pct;
        return <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={s.color} strokeWidth={sw}
          strokeDasharray={`${a} ${c - a}`} strokeDashoffset={off} strokeLinecap="butt"
          style={{ filter: `drop-shadow(0 0 6px ${s.color}88)` }} />;
      })}
    </svg>
  );
}

// ─── Overlay Modal (centred, blurred backdrop) ────────────────────────────────

function OverlayModal({ children, onBdClick }: { children: React.ReactNode; onBdClick?: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-5"
      style={{ background: 'rgba(7,11,20,0.65)', backdropFilter: 'blur(16px)' }}
      onClick={e => { if (e.target === e.currentTarget) onBdClick?.(); }}>
      {children}
    </div>
  );
}

// ─── Bottom Sheet (blurred backdrop) ─────────────────────────────────────────

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

  const fmtTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const fmtCard = (v: string) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const fmtExp  = (v: string) => { const d = v.replace(/\D/g,'').slice(0,4); return d.length>=2?d.slice(0,2)+'/'+d.slice(2):d; };

  const inputSt: React.CSSProperties = {
    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.12)',
    color:'#E2E8F0', fontFamily:'JetBrains Mono', borderRadius:16,
    padding:'14px 16px', fontSize:15, width:'100%', outline:'none',
  };
  const purpleBtn: React.CSSProperties = { background:'linear-gradient(135deg,#c026d3,#e11d48)', color:'#fff', fontFamily:'Outfit' };

  function otpInput(i: number, v: string) {
    const d = v.replace(/\D/g,'').slice(-1);
    const n=[...otp]; n[i]=d; setOtp(n);
    if (d && i<3) refs[i+1].current?.focus();
  }

  // Choose method
  if (!pv) return (
    <BottomSheet onBdClick={onClose}>
      <div className="px-5 pb-8 pt-2">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-xs" style={{color:'#475569',fontFamily:'Outfit'}}>Credit Limit</div>
            <div className="text-lg font-bold" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>Choose payment method</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{background:'rgba(255,255,255,0.07)',color:'#94A3B8',fontSize:14}}>✕</button>
        </div>
        <div className="rounded-2xl p-3.5 mb-6" style={{background:'rgba(6,182,212,0.08)',border:'1px solid rgba(6,182,212,0.2)'}}>
          <div className="text-sm" style={{color:'#94A3B8',fontFamily:'Inter'}}>
            Increase your credit limit to <span className="font-bold" style={{color:'#06B6D4',fontFamily:'JetBrains Mono'}}>PKR {targetAmount.toLocaleString()}</span>
          </div>
        </div>
        {[
          {icon:'💛',label:'JazzCash',desc:'Pay via JazzCash wallet',next:'jc-amount' as PayView},
          {icon:'💳',label:'Credit / Debit Card',desc:'Visa, Mastercard, UnionPay',next:'card-amount' as PayView},
          {icon:'🎫',label:'Scratch Card',desc:'Enter your 14-digit card code',next:'scratch' as PayView},
        ].map(o=>(
          <button key={o.label} onClick={()=>setPv(o.next)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl mb-3 text-left"
            style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)'}}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{background:'rgba(255,255,255,0.06)'}}>{o.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>{o.label}</div>
              <div className="text-xs mt-0.5" style={{color:'#475569',fontFamily:'Inter'}}>{o.desc}</div>
            </div>
            <span style={{color:'#475569',fontSize:18}}>›</span>
          </button>
        ))}
      </div>
    </BottomSheet>
  );

  const amtScreen = (icon:string, label:string, back:()=>void, next:()=>void, btnSt:React.CSSProperties) => (
    <BottomSheet onBdClick={onClose}>
      <div className="px-5 pb-8 pt-2">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={back} className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
            style={{background:'rgba(255,255,255,0.07)',color:'#94A3B8',fontSize:18}}>‹</button>
          <div className="flex items-center gap-2">
            <span style={{fontSize:18}}>{icon}</span>
            <span className="font-bold text-base" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>{label}</span>
          </div>
        </div>
        <div className="mb-2 text-sm font-medium" style={{color:'#94A3B8',fontFamily:'Outfit'}}>Enter Amount</div>
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold" style={{color:'#475569',fontFamily:'JetBrains Mono'}}>PKR</span>
          <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{...inputSt,paddingLeft:52}} placeholder="0" />
        </div>
        <button onClick={next} className="w-full py-4 rounded-2xl font-bold text-base" style={btnSt}>CONTINUE</button>
      </div>
    </BottomSheet>
  );

  if (pv==='jc-amount') return amtScreen('💛','Pay Via JazzCash',()=>setPv(null),()=>setPv('jc-account'),purpleBtn);

  if (pv==='jc-account') return (
    <BottomSheet onBdClick={onClose}>
      <div className="px-5 pb-8 pt-2">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={()=>setPv('jc-amount')} className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
            style={{background:'rgba(255,255,255,0.07)',color:'#94A3B8',fontSize:18}}>‹</button>
          <div className="flex items-center gap-2">
            <span style={{fontSize:18}}>💛</span>
            <span className="font-bold text-base" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>Pay Via JazzCash</span>
          </div>
        </div>
        <div className="mb-2 text-sm font-medium text-center" style={{color:'#94A3B8',fontFamily:'Outfit'}}>Enter JazzCash Account number</div>
        <input type="tel" value={jcAcct} onChange={e=>setJcAcct(e.target.value.replace(/\D/g,'').slice(0,11))}
          style={{...inputSt,textAlign:'center',fontSize:18,letterSpacing:2,marginBottom:24}} placeholder="03XX XXXXXXX" />
        <button onClick={()=>{setOtp(['','','','']);setTimer(120);setPv('jc-otp');}}
          className="w-full py-4 rounded-2xl font-bold text-base mb-5" style={purpleBtn}>CONTINUE</button>
        <p className="text-xs text-center" style={{color:'#475569',fontFamily:'Inter'}}>
          Don't have a JazzCash account?{' '}
          <span style={{color:'#06B6D4',textDecoration:'underline'}}>Download the JazzCash app</span>
        </p>
      </div>
    </BottomSheet>
  );

  if (pv==='jc-otp') return (
    <BottomSheet onBdClick={onClose}>
      <div className="px-5 pb-8 pt-2">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={()=>setPv('jc-account')} className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
            style={{background:'rgba(255,255,255,0.07)',color:'#94A3B8',fontSize:18}}>‹</button>
          <span className="font-bold text-base" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>Verification Code</span>
        </div>
        <p className="text-sm text-center mb-6" style={{color:'#475569',fontFamily:'Inter'}}>
          Check your SMS on <span style={{color:'#E2E8F0'}}>{jcAcct||'03XX XXXXXXX'}</span>
        </p>
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((d,i)=>(
            <input key={i} ref={refs[i]} type="text" inputMode="numeric" value={d} maxLength={1}
              onChange={e=>otpInput(i,e.target.value)}
              onKeyDown={e=>{if(e.key==='Backspace'&&!d&&i>0)refs[i-1].current?.focus();}}
              className="text-center text-xl font-bold rounded-2xl"
              style={{width:56,height:60,background:d?'rgba(6,182,212,0.12)':'rgba(255,255,255,0.04)',
                border:`2px solid ${d?'#06B6D4':'rgba(255,255,255,0.12)'}`,color:'#E2E8F0',fontFamily:'JetBrains Mono',outline:'none'}} />
          ))}
        </div>
        <div className="text-center text-sm mb-6" style={{color:'#475569',fontFamily:'JetBrains Mono'}}>{fmtTime(timer)}</div>
        <button onClick={onSuccess} className="w-full py-4 rounded-2xl font-bold text-base"
          style={{...purpleBtn,opacity:otp.every(d=>d)?1:0.4}}>Verify Number</button>
      </div>
    </BottomSheet>
  );

  if (pv==='card-amount') return amtScreen('💳','Credit / Debit Card',()=>setPv(null),()=>setPv('card-form'),{background:'#06B6D4',color:'#070B14',fontFamily:'Outfit'});

  if (pv==='card-form') return (
    <BottomSheet onBdClick={onClose}>
      <div className="px-5 pb-8 pt-2">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={()=>setPv('card-amount')} className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
            style={{background:'rgba(255,255,255,0.07)',color:'#94A3B8',fontSize:18}}>‹</button>
          <span className="font-bold text-base" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>Card Details</span>
        </div>
        <div className="space-y-4 mb-5">
          <div>
            <div className="text-xs mb-1.5 font-medium" style={{color:'#475569',fontFamily:'Outfit'}}>Card Number</div>
            <input type="text" value={cardNum} onChange={e=>setCardNum(fmtCard(e.target.value))} style={inputSt} placeholder="0000 0000 0000 0000" />
          </div>
          <div>
            <div className="text-xs mb-1.5 font-medium" style={{color:'#475569',fontFamily:'Outfit'}}>Name on Card</div>
            <input type="text" value={cardName} onChange={e=>setCardName(e.target.value)} style={{...inputSt,fontFamily:'Inter'}} placeholder="Full name" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="text-xs mb-1.5 font-medium" style={{color:'#475569',fontFamily:'Outfit'}}>Expiry Date</div>
              <input type="text" value={cardExp} onChange={e=>setCardExp(fmtExp(e.target.value))} style={inputSt} placeholder="MM/YY" />
            </div>
            <div className="flex-1">
              <div className="text-xs mb-1.5 font-medium" style={{color:'#475569',fontFamily:'Outfit'}}>CVV</div>
              <input type="text" value={cardCvv} onChange={e=>setCardCvv(e.target.value.replace(/\D/g,'').slice(0,4))} style={inputSt} placeholder="•••" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-6 p-3 rounded-xl"
          style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
          <span className="text-sm" style={{color:'#94A3B8',fontFamily:'Outfit'}}>Payment Amount</span>
          <span className="font-bold" style={{color:'#06B6D4',fontFamily:'JetBrains Mono'}}>PKR {parseInt(amount||'0').toLocaleString()}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-base"
            style={{background:'rgba(255,255,255,0.06)',color:'#94A3B8',border:'1px solid rgba(255,255,255,0.1)',fontFamily:'Outfit'}}>Cancel</button>
          <button onClick={onSuccess} className="flex-1 py-4 rounded-2xl font-bold text-base"
            style={{background:'#06B6D4',color:'#070B14',fontFamily:'Outfit'}}>Pay</button>
        </div>
      </div>
    </BottomSheet>
  );

  if (pv==='scratch') return (
    <BottomSheet onBdClick={onClose}>
      <div className="px-5 pb-8 pt-2">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={()=>setPv(null)} className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
            style={{background:'rgba(255,255,255,0.07)',color:'#94A3B8',fontSize:18}}>‹</button>
          <div className="flex items-center gap-2">
            <span style={{fontSize:18}}>🎫</span>
            <span className="font-bold text-base" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>Scratch Card</span>
          </div>
        </div>
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3"
            style={{background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.2)'}}>🎫</div>
          <div className="text-sm font-medium text-center" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>Enter your 14-digit scratch card number</div>
        </div>
        <input type="text" value={scratch} onChange={e=>setScratch(e.target.value.replace(/\D/g,'').slice(0,14))}
          style={{...inputSt,textAlign:'center',fontSize:18,letterSpacing:3,marginBottom:8}}
          placeholder="— — — — — — — — — — — — — —" maxLength={14} />
        <div className="text-xs text-center mb-6" style={{color:'#475569',fontFamily:'JetBrains Mono'}}>{scratch.length}/14 digits</div>
        <button onClick={onSuccess} disabled={scratch.length!==14}
          className="w-full py-4 rounded-2xl font-bold text-base"
          style={{background:scratch.length===14?'#06B6D4':'rgba(255,255,255,0.06)',color:scratch.length===14?'#070B14':'#475569',fontFamily:'Outfit'}}>
          Redeem Scratch Card
        </button>
      </div>
    </BottomSheet>
  );

  return null;
}

// ─── Credit Limit Section (shared between Home and Centre) ────────────────────

function CreditLimitSection({ committedLimit, onUpdate, showTitle = true }: {
  committedLimit: number; onUpdate: (v: number) => void; showTitle?: boolean;
}) {
  const [draft, setDraft] = useState(committedLimit);
  const [inputStr, setInputStr] = useState(committedLimit.toString());
  const [showPanel, setShowPanel] = useState(false);
  const [showGw, setShowGw] = useState(false);
  const [toast, setToast] = useState<string|null>(null);

  useEffect(() => { setDraft(committedLimit); setInputStr(committedLimit.toString()); setShowPanel(false); }, [committedLimit]);

  function slide(v: number) { setDraft(v); setInputStr(v.toString()); setShowPanel(v!==committedLimit); }
  function input(s: string) {
    setInputStr(s);
    const c = Math.max(1000, Math.min(50000, parseInt(s.replace(/,/g,''))||0));
    setDraft(c); setShowPanel(c!==committedLimit);
  }
  function exit() { setDraft(committedLimit); setInputStr(committedLimit.toString()); setShowPanel(false); setShowGw(false); }
  function paySuccess() { onUpdate(draft); setShowPanel(false); setShowGw(false); setToast(`Credit limit updated to PKR ${draft.toLocaleString()}`); }

  const pct = ((draft-1000)/49000)*100;

  return (
    <>
      {toast && <Toast message={`✓ ${toast}`} onDone={()=>setToast(null)} />}
      {showGw && <PaymentGateway targetAmount={draft} onSuccess={paySuccess} onClose={()=>setShowGw(false)} />}
      <div className="rounded-3xl p-5" style={{background:'#0E1828',border:'1px solid rgba(255,255,255,0.07)'}}>
        {showTitle && <>
          <div className="text-sm font-bold mb-1" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>Credit Limit Adjustment</div>
          <div className="text-xs mb-4" style={{color:'#475569',fontFamily:'Outfit'}}>Adjust your roaming credit ceiling</div>
        </>}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs" style={{color:'#94A3B8',fontFamily:'Outfit'}}>Current Limit</span>
          <span className="text-lg font-bold" style={{color:'#06B6D4',fontFamily:'JetBrains Mono'}}>PKR {committedLimit.toLocaleString()}</span>
        </div>
        <input type="range" min={1000} max={50000} step={500} value={draft}
          onChange={e=>slide(Number(e.target.value))} className="w-full mb-2"
          style={{background:`linear-gradient(to right,#06B6D4 ${pct}%,rgba(255,255,255,0.1) ${pct}%)`}} />
        <div className="flex justify-between text-xs mb-4" style={{color:'#475569',fontFamily:'JetBrains Mono'}}>
          <span>PKR 1,000</span><span>PKR 50,000</span>
        </div>
        {showPanel && (
          <div className="fade-in">
            <div className="text-xs mb-1.5 font-medium" style={{color:'#94A3B8',fontFamily:'Outfit'}}>Or enter a custom amount</div>
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold" style={{color:'#475569',fontFamily:'JetBrains Mono'}}>PKR</span>
              <input type="number" value={inputStr} onChange={e=>input(e.target.value)}
                className="w-full rounded-xl py-2.5 pl-12 pr-4 text-sm outline-none"
                style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(6,182,212,0.3)',color:'#E2E8F0',fontFamily:'JetBrains Mono'}} />
            </div>
            <div className="rounded-2xl p-4 mb-4" style={{background:'rgba(6,182,212,0.06)',border:'1px solid rgba(6,182,212,0.2)'}}>
              <div className="text-xs font-semibold mb-1" style={{color:'#06B6D4',fontFamily:'Outfit'}}>Choose your payment method to increase your credit limit to</div>
              <div className="text-xl font-bold" style={{color:'#E2E8F0',fontFamily:'JetBrains Mono'}}>PKR {draft.toLocaleString()}</div>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setShowGw(true)} className="flex-1 py-3 rounded-xl text-sm font-bold"
                style={{background:'#06B6D4',color:'#070B14',fontFamily:'Outfit'}}>Proceed to Payment</button>
              <button onClick={exit} className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{background:'rgba(255,255,255,0.06)',color:'#94A3B8',border:'1px solid rgba(255,255,255,0.1)',fontFamily:'Outfit'}}>Exit &amp; Keep Limit</button>
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
    <div className="flex flex-col items-center gap-2" style={{opacity:disabled?0.45:1,pointerEvents:disabled?'none':'auto'}}>
      <button onClick={()=>onChange(!active)}
        className="relative flex items-center rounded-full transition-all duration-300 select-none"
        style={{
          background:active?'rgba(6,182,212,0.12)':'rgba(255,255,255,0.06)',
          border:`1.5px solid ${active?'rgba(6,182,212,0.5)':'rgba(255,255,255,0.12)'}`,
          padding:'4px', boxShadow:active?'0 0 24px rgba(6,182,212,0.25)':'none',
        }}>
        <span className="text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300"
          style={{background:!active?'rgba(255,255,255,0.14)':'transparent',color:!active?'#E2E8F0':'#475569',fontFamily:'Outfit'}}>
          Local Mode
        </span>
        <span className="text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300"
          style={{background:active?'#06B6D4':'transparent',color:active?'#070B14':'#475569',fontFamily:'Outfit',fontWeight:active?700:500}}>
          Roaming Mode
        </span>
      </button>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{background:active?'#10B981':'#475569'}} />
        <span className="text-xs" style={{color:active?'#10B981':'#475569',fontFamily:'Outfit'}}>
          {disabled ? 'Requires credit limit ≥ PKR 5,000' : active ? 'International roaming enabled' : 'Roaming services off'}
        </span>
      </div>
    </div>
  );
}

// ─── Bundle Card ──────────────────────────────────────────────────────────────

function BundleCard({ bundle, isFav, onToggleFav, onAction }: {
  bundle: Bundle; isFav: boolean; onToggleFav: ()=>void; onAction: (a: BundleAction)=>void;
}) {
  const meta = REGION_META[bundle.region];
  return (
    <div className="relative flex flex-col rounded-2xl p-4 fade-in"
      style={{background:'#0E1828',border:'1px solid rgba(255,255,255,0.07)',minWidth:170}}>
      <button onClick={onToggleFav} className="absolute top-3 left-3 w-7 h-7 flex items-center justify-center rounded-full transition-all"
        style={{background:isFav?'rgba(251,113,133,0.15)':'rgba(255,255,255,0.06)'}}>
        <span style={{fontSize:13,color:isFav?'#FB7185':'#475569'}}>{isFav?'♥':'♡'}</span>
      </button>
      <div className="flex justify-end mb-1">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{background:`${meta.color}18`,color:meta.color,fontFamily:'Outfit'}}>{meta.icon} {bundle.region}</span>
      </div>
      <h3 className="text-sm font-semibold mt-1 mb-3 pl-1" style={{color:'#E2E8F0',fontFamily:'Outfit',lineHeight:1.3}}>{bundle.name}</h3>
      <div className="flex gap-3 mb-3 items-end">
        <div>
          <div className="text-xs mb-0.5" style={{color:'#475569',fontFamily:'Outfit'}}>Data</div>
          <div className="font-bold text-base" style={{color:'#06B6D4',fontFamily:'JetBrains Mono'}}>{bundle.data}</div>
        </div>
        {bundle.voice && <div>
          <div className="text-xs mb-0.5" style={{color:'#475569',fontFamily:'Outfit'}}>Voice</div>
          <div className="font-bold text-base" style={{color:'#F59E0B',fontFamily:'JetBrains Mono'}}>{bundle.voice}</div>
        </div>}
        <div className="ml-auto text-right">
          <div className="text-xs mb-0.5" style={{color:'#475569',fontFamily:'Outfit'}}>Valid</div>
          <div className="text-xs font-medium" style={{color:'#94A3B8',fontFamily:'Outfit'}}>{bundle.validity}</div>
        </div>
      </div>
      <div className="mb-4">
        <span className="font-bold text-xl" style={{color:'#E2E8F0',fontFamily:'JetBrains Mono'}}>PKR {bundle.price.toLocaleString()}</span>
      </div>
      <div className="flex gap-2">
        <button onClick={()=>onAction('buy')} className="flex-1 py-2 rounded-xl text-xs font-bold"
          style={{background:'#06B6D4',color:'#070B14',fontFamily:'Outfit'}}>Buy</button>
        <button onClick={()=>onAction('subscribe')} className="flex-1 py-2 rounded-xl text-xs font-semibold"
          style={{background:'rgba(6,182,212,0.1)',color:'#06B6D4',border:'1px solid rgba(6,182,212,0.25)',fontFamily:'Outfit'}}>Subscribe</button>
      </div>
    </div>
  );
}

// ─── Bundle Modal ─────────────────────────────────────────────────────────────

function BundleModal({ bundle, action, onClose, onConfirm }: {
  bundle: Bundle; action: BundleAction; onClose: ()=>void; onConfirm: ()=>void;
}) {
  const meta = REGION_META[bundle.region];
  return (
    <BottomSheet onBdClick={onClose}>
      <div className="px-5 pb-8 pt-2">
        <div className="flex items-start justify-between mb-5">
          <div>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium mb-2 inline-block"
              style={{background:`${meta.color}18`,color:meta.color,fontFamily:'Outfit'}}>{meta.icon} {bundle.region}</span>
            <h2 className="text-xl font-bold" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>{bundle.name}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full mt-1"
            style={{background:'rgba(255,255,255,0.07)',color:'#94A3B8',fontSize:14}}>✕</button>
        </div>
        <div className="flex items-baseline gap-3 mb-5">
          <span className="text-3xl font-bold" style={{color:'#E2E8F0',fontFamily:'JetBrains Mono'}}>PKR {bundle.price.toLocaleString()}</span>
          <span className="text-sm" style={{color:'#475569',fontFamily:'Outfit'}}>· {bundle.validity}</span>
        </div>
        <div className="flex gap-3 mb-5">
          <div className="flex-1 rounded-2xl p-3.5" style={{background:'rgba(6,182,212,0.07)',border:'1px solid rgba(6,182,212,0.18)'}}>
            <div className="text-xs mb-1" style={{color:'#475569',fontFamily:'Outfit'}}>Data Incentive</div>
            <div className="text-2xl font-bold" style={{color:'#06B6D4',fontFamily:'JetBrains Mono'}}>{bundle.data}</div>
          </div>
          {bundle.voice && <div className="flex-1 rounded-2xl p-3.5" style={{background:'rgba(245,158,11,0.07)',border:'1px solid rgba(245,158,11,0.18)'}}>
            <div className="text-xs mb-1" style={{color:'#475569',fontFamily:'Outfit'}}>Voice Incentive</div>
            <div className="text-2xl font-bold" style={{color:'#F59E0B',fontFamily:'JetBrains Mono'}}>{bundle.voice}</div>
          </div>}
        </div>
        <div className="mb-5">
          <h4 className="text-xs font-semibold mb-2.5 uppercase tracking-widest" style={{color:'#475569',fontFamily:'Outfit'}}>Applicable Countries</h4>
          <div className="flex flex-wrap gap-1.5">
            {bundle.countries.map(c=><span key={c} className="text-xs px-2.5 py-1 rounded-full"
              style={{background:'rgba(255,255,255,0.05)',color:'#94A3B8',fontFamily:'Outfit'}}>{c}</span>)}
          </div>
        </div>
        <div className="mb-7">
          <h4 className="text-xs font-semibold mb-2.5 uppercase tracking-widest" style={{color:'#475569',fontFamily:'Outfit'}}>Terms & Conditions</h4>
          <div className="rounded-2xl p-4 space-y-2.5" style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)'}}>
            {bundle.terms.map((t,i)=><div key={i} className="flex gap-2 text-sm" style={{color:'#94A3B8',fontFamily:'Inter'}}>
              <span className="flex-shrink-0 font-bold" style={{color:meta.color}}>·</span>{t}</div>)}
          </div>
        </div>
        <button onClick={onConfirm} className="w-full py-4 rounded-2xl text-base font-bold"
          style={{background:action==='buy'?'#06B6D4':'rgba(6,182,212,0.12)',color:action==='buy'?'#070B14':'#06B6D4',
            border:action==='subscribe'?'1px solid rgba(6,182,212,0.35)':'none',fontFamily:'Outfit'}}>
          {action==='buy'?`Confirm Purchase — PKR ${bundle.price.toLocaleString()}`:'Confirm Subscription'}
        </button>
      </div>
    </BottomSheet>
  );
}

// ─── Incentive Widget ─────────────────────────────────────────────────────────

function IncentiveWidget({ tab, onTabChange, onClick }: { tab: IncentiveTab; onTabChange:(t:IncentiveTab)=>void; onClick:()=>void }) {
  const isData = tab==='data';
  const pct = isData?(DATA_REM/DATA_TOTAL)*100:(VOICE_REM/VOICE_TOTAL)*100;
  const color = isData?'#06B6D4':'#F59E0B';
  const rem = isData?`${DATA_REM} GB`:`${VOICE_REM} Min`;
  const tot = isData?`of ${DATA_TOTAL} GB`:`of ${VOICE_TOTAL} Min`;
  return (
    <div className="rounded-3xl p-4" style={{background:'linear-gradient(135deg,#0E1828 0%,#162036 100%)',border:'1px solid rgba(255,255,255,0.08)'}}>
      <div className="flex gap-2 mb-4">
        {(['data','voice'] as IncentiveTab[]).map(t=>(
          <button key={t} onClick={()=>onTabChange(t)} className="flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{background:tab===t?(t==='data'?'rgba(6,182,212,0.18)':'rgba(245,158,11,0.18)'):'rgba(255,255,255,0.04)',
              color:tab===t?(t==='data'?'#06B6D4':'#F59E0B'):'#475569',
              border:`1px solid ${tab===t?(t==='data'?'rgba(6,182,212,0.3)':'rgba(245,158,11,0.3)'):'transparent'}`,fontFamily:'Outfit'}}>
            {t==='data'?'📶 Data':'📞 Voice'}
          </button>
        ))}
      </div>
      <button onClick={onClick} className="w-full flex flex-col items-center">
        <CircularProgress pct={pct} color={color} size={160} strokeWidth={14}>
          <div className="flex flex-col items-center">
            <span className="font-bold text-2xl leading-none" style={{color,fontFamily:'JetBrains Mono'}}>{rem}</span>
            <span className="text-xs mt-1" style={{color:'#475569',fontFamily:'Outfit'}}>{tot}</span>
            <span className="text-xs mt-2 px-2 py-0.5 rounded-full" style={{background:'rgba(255,255,255,0.06)',color:'#64748B',fontFamily:'Outfit'}}>Remaining Incentive</span>
          </div>
        </CircularProgress>
        <div className="flex items-center gap-1.5 mt-3">
          <span className="text-xs" style={{color:'#475569',fontFamily:'Outfit'}}>Tap for</span>
          <span className="text-xs font-semibold" style={{color:'#06B6D4',fontFamily:'Outfit'}}>Roaming Connectivity Centre</span>
          <span style={{color:'#06B6D4',fontSize:10}}>›</span>
        </div>
      </button>
      <div className="flex items-center justify-between mt-3 pt-3" style={{borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full pulse-glow" style={{background:'#10B981'}} />
          <span className="text-xs" style={{color:'#94A3B8',fontFamily:'Outfit'}}>Active: {ACTIVE_BUNDLE.name}</span>
        </div>
        <span className="text-xs" style={{color:'#475569',fontFamily:'Outfit'}}>Exp. {ACTIVE_BUNDLE.validity}</span>
      </div>
    </div>
  );
}

// ─── HOME VIEW ────────────────────────────────────────────────────────────────

function HomeView({ roaming, onRoamingChange, iTab, onITabChange, onOpenCentre,
  favs, onToggleFav, onBundleAction, userCreditLimit, onCreditLimitUpdate }: {
  roaming: boolean; onRoamingChange:(v:boolean)=>void;
  iTab: IncentiveTab; onITabChange:(t:IncentiveTab)=>void; onOpenCentre:()=>void;
  favs: Set<string>; onToggleFav:(id:string)=>void; onBundleAction:(b:Bundle,a:BundleAction|'blocked')=>void;
  userCreditLimit: number; onCreditLimitUpdate:(v:number)=>void;
}) {
  const [query, setQuery] = useState('');
  const [selRegion, setSelRegion] = useState<Region|null>(null);
  const results = searchBundles(query);
  const showSearch = query.length>0;
  const showRegion = selRegion!==null && !showSearch;
  const needsTopUp = userCreditLimit < MIN_CREDIT;

  function handleAction(b: Bundle, a: BundleAction) {
    if (needsTopUp) { onBundleAction(b,'blocked'); return; }
    onBundleAction(b, a);
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center justify-between mb-4">
          {showRegion
            ? <button onClick={()=>setSelRegion(null)} className="flex items-center gap-2 text-sm" style={{color:'#94A3B8',fontFamily:'Outfit'}}><span style={{fontSize:18}}>‹</span> Back</button>
            : <div className="text-xs" style={{color:'#475569',fontFamily:'Outfit'}}>Jazz Postpay</div>
          }
          <div className="text-right">
            <div className="text-xs" style={{color:'#475569',fontFamily:'Outfit'}}>International</div>
            <div className="text-sm font-bold" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>Roaming</div>
          </div>
        </div>

        {/* Credit top-up block — only when < 5000 */}
        {!showRegion && needsTopUp && (
          <div className="mb-5 fade-in">
            <div className="flex items-start gap-3 rounded-2xl px-4 py-3 mb-3"
              style={{background:'rgba(245,158,11,0.09)',border:'1px solid rgba(245,158,11,0.25)'}}>
              <span style={{fontSize:20,flexShrink:0}}>🔒</span>
              <div>
                <div className="text-xs font-bold" style={{color:'#F59E0B',fontFamily:'Outfit'}}>Credit Limit Required</div>
                <div className="text-xs mt-0.5 leading-relaxed" style={{color:'#94A3B8',fontFamily:'Inter'}}>
                  Top-up your credit limit to <strong style={{color:'#F59E0B'}}>PKR 5,000</strong> to enable International Roaming
                </div>
              </div>
            </div>
            <CreditLimitSection committedLimit={userCreditLimit} onUpdate={onCreditLimitUpdate} showTitle={false} />
          </div>
        )}

        {/* Mode toggle — centred, disabled if below limit */}
        {!showRegion && (
          <div className="flex justify-center mb-1">
            <ModeToggle active={roaming} onChange={onRoamingChange} disabled={needsTopUp} />
          </div>
        )}
      </div>

      {/* Region bundles */}
      {showRegion ? (
        <div className="flex-1 px-5 pb-6">
          <div className="flex items-center gap-3 mb-5">
            <span style={{fontSize:28}}>{REGION_META[selRegion!].icon}</span>
            <div>
              <h2 className="text-lg font-bold" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>{selRegion} Bundles</h2>
              <div className="text-xs" style={{color:'#475569',fontFamily:'Outfit'}}>{REGION_META[selRegion!].desc}</div>
            </div>
          </div>
          <div className="grid gap-4" style={{gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))'}}>
            {BUNDLES.filter(b=>b.region===selRegion).map(b=>(
              <BundleCard key={b.id} bundle={b} isFav={favs.has(b.id)}
                onToggleFav={()=>onToggleFav(b.id)} onAction={a=>handleAction(b,a)} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {roaming && !needsTopUp && (
            <div className="px-5 mb-4">
              <IncentiveWidget tab={iTab} onTabChange={onITabChange} onClick={onOpenCentre} />
            </div>
          )}

          {/* Search */}
          <div className="px-5 mb-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base" style={{color:'#475569'}}>🔍</span>
              <input type="text" value={query} onChange={e=>setQuery(e.target.value)}
                placeholder="Where are you roaming to?"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm outline-none transition-all"
                style={{background:'#0E1828',border:`1px solid ${query?'rgba(6,182,212,0.4)':'rgba(255,255,255,0.08)'}`,color:'#E2E8F0',fontFamily:'Inter'}} />
              {query && <button onClick={()=>setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full"
                style={{background:'rgba(255,255,255,0.08)',color:'#94A3B8',fontSize:12}}>✕</button>}
            </div>
          </div>

          {showSearch ? (
            <div className="px-5 pb-6">
              {results.length>0 ? (
                <>
                  <div className="text-xs mb-3" style={{color:'#475569',fontFamily:'Outfit'}}>{results.length} bundle{results.length!==1?'s':''} found for "{query}"</div>
                  <div className="grid gap-4" style={{gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))'}}>
                    {results.map(b=><BundleCard key={b.id} bundle={b} isFav={favs.has(b.id)}
                      onToggleFav={()=>onToggleFav(b.id)} onAction={a=>handleAction(b,a)} />)}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center py-10" style={{color:'#475569'}}>
                  <span style={{fontSize:36}}>🌐</span>
                  <div className="text-sm mt-3" style={{fontFamily:'Outfit'}}>No bundles found for "{query}"</div>
                </div>
              )}
            </div>
          ) : (
            <div className="px-5 pb-6">
              <div className="text-xs mb-3 font-medium uppercase tracking-widest" style={{color:'#475569',fontFamily:'Outfit'}}>Browse by Region</div>
              <div className="grid grid-cols-2 gap-3">
                {REGIONS.map(region=>{
                  const meta=REGION_META[region];
                  const count=BUNDLES.filter(b=>b.region===region).length;
                  return (
                    <button key={region} onClick={()=>setSelRegion(region)}
                      className="flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all"
                      style={{background:'rgba(14,24,40,0.9)',border:'1px solid rgba(255,255,255,0.07)'}}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{background:`${meta.color}15`}}>{meta.icon}</div>
                      <div>
                        <div className="text-sm font-semibold" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>{region}</div>
                        <div className="text-xs" style={{color:'#475569',fontFamily:'Outfit'}}>{count} bundle{count!==1?'s':''}</div>
                      </div>
                      <span className="ml-auto text-sm" style={{color:meta.color}}>›</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── ROAMING CONNECTIVITY CENTRE ─────────────────────────────────────────────

const ROLLOVER_PAIRS = [
  { from: 'Euro Bundle 5 GB', to: 'World Bundle 5GB', note: 'Full country compatibility' },
  { from: 'Euro Bundle 10 GB', to: 'World Bundle 5GB', note: 'Full country compatibility' },
  { from: 'World Bundle', to: 'World Bundle', note: 'Same region, same coverage' },
  { from: 'Saudi Roaming', to: 'World Bundle 3GB', note: 'KSA is covered by World Bundles' },
  { from: 'Ziyarat Offer', to: 'World Bundle 3GB', note: 'Iraq, Iran, Syria covered by World Bundle' },
];

function RoamingCentreView({ iTab, onITabChange, onBack, favs, onToggleFav, onBundleAction,
  userCreditLimit, onCreditLimitUpdate, dataRoaming, onDataRoamingChange }: {
  iTab: IncentiveTab; onITabChange:(t:IncentiveTab)=>void; onBack:()=>void;
  favs: Set<string>; onToggleFav:(id:string)=>void; onBundleAction:(b:Bundle,a:BundleAction|'blocked')=>void;
  userCreditLimit: number; onCreditLimitUpdate:(v:number)=>void;
  dataRoaming: boolean; onDataRoamingChange:(v:boolean)=>void;
}) {
  const [paygBlocked, setPaygBlocked] = useState(false);
  const [incomingBlocked, setIncomingBlocked] = useState(false);
  const [rolloverActive, setRolloverActive] = useState(false);
  const [rolledBundle, setRolledBundle] = useState<Bundle|null>(null);
  const [showRolloverModal, setShowRolloverModal] = useState(false);

  const isData = iTab==='data';
  const pct = isData?(DATA_REM/DATA_TOTAL)*100:(VOICE_REM/VOICE_TOTAL)*100;
  const color = isData?'#06B6D4':'#F59E0B';
  const rem = isData?`${DATA_REM} GB`:`${VOICE_REM} Min`;
  const tot = isData?`of ${DATA_TOTAL} GB`:`of ${VOICE_TOTAL} Min`;
  const rolledGB=DATA_REM, newGB=3, totalGB=rolledGB+newGB;

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full"
          style={{background:'rgba(255,255,255,0.07)',color:'#94A3B8',fontSize:18}}>‹</button>
        <div>
          <div className="text-xs" style={{color:'#475569',fontFamily:'Outfit'}}>Roaming</div>
          <div className="text-base font-bold" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>Connectivity Centre</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{background:'#10B981'}} />
          <span className="text-xs" style={{color:'#10B981',fontFamily:'Outfit'}}>Active</span>
        </div>
      </div>

      {/* 1 — Incentive Dashboard */}
      <div className="px-5 mb-5">
        <div className="rounded-3xl p-5" style={{background:'linear-gradient(135deg,#0E1828 0%,#162036 100%)',border:'1px solid rgba(255,255,255,0.08)'}}>
          <div className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{color:'#475569',fontFamily:'Outfit'}}>Remaining Incentive</div>
          <div className="flex gap-2 mb-5">
            {(['data','voice'] as IncentiveTab[]).map(t=>(
              <button key={t} onClick={()=>onITabChange(t)} className="flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{background:iTab===t?(t==='data'?'rgba(6,182,212,0.18)':'rgba(245,158,11,0.18)'):'rgba(255,255,255,0.04)',
                  color:iTab===t?(t==='data'?'#06B6D4':'#F59E0B'):'#475569',
                  border:`1px solid ${iTab===t?(t==='data'?'rgba(6,182,212,0.3)':'rgba(245,158,11,0.3)'):'transparent'}`,fontFamily:'Outfit'}}>
                {t==='data'?'📶 Data':'📞 Voice'}
              </button>
            ))}
          </div>
          {rolloverActive && iTab==='data' ? (
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center" style={{width:200,height:200}}>
                <SplitDonut segments={[{pct:(rolledGB/totalGB)*100,color:'#94A3B8'},{pct:(newGB/totalGB)*100,color:'#06B6D4'}]} size={200} sw={16} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-bold text-2xl leading-none" style={{color:'#06B6D4',fontFamily:'JetBrains Mono'}}>{totalGB.toFixed(1)} GB</span>
                  <span className="text-xs mt-1" style={{color:'#475569',fontFamily:'Outfit'}}>total available</span>
                </div>
              </div>
              <div className="flex gap-5 mt-4">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{background:'#94A3B8'}} /><span className="text-xs" style={{color:'#94A3B8',fontFamily:'Outfit'}}>Rolled {rolledGB} GB</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{background:'#06B6D4'}} /><span className="text-xs" style={{color:'#06B6D4',fontFamily:'Outfit'}}>New {newGB} GB</span></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <CircularProgress pct={pct} color={color} size={190} strokeWidth={16}>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-3xl leading-none" style={{color,fontFamily:'JetBrains Mono'}}>{rem}</span>
                  <span className="text-xs mt-1" style={{color:'#475569',fontFamily:'Outfit'}}>{tot}</span>
                </div>
              </CircularProgress>
              <div className="w-full mt-4 px-2">
                <div className="flex justify-between text-xs mb-1.5" style={{color:'#475569',fontFamily:'JetBrains Mono'}}>
                  <span>Used: {isData?`${DATA_USED} GB`:`${VOICE_USED} Min`}</span>
                  <span>Total: {isData?`${DATA_TOTAL} GB`:`${VOICE_TOTAL} Min`}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
                  <div className="h-full rounded-full" style={{width:`${100-pct}%`,background:color}} />
                </div>
              </div>
            </div>
          )}
          <div className="mt-4 pt-4 flex items-center justify-between" style={{borderTop:'1px solid rgba(255,255,255,0.06)'}}>
            <div>
              <div className="text-xs" style={{color:'#475569',fontFamily:'Outfit'}}>{rolloverActive?'Active Package':'Current Bundle'}</div>
              <div className="text-sm font-semibold" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>{rolloverActive?rolledBundle?.name:ACTIVE_BUNDLE.name}</div>
            </div>
            <div className="text-right">
              <div className="text-xs" style={{color:'#475569',fontFamily:'Outfit'}}>Validity</div>
              <div className="text-sm font-semibold" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>{rolloverActive?rolledBundle?.validity:ACTIVE_BUNDLE.validity}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2 — Roaming Controls (PAYG + Incoming + Data Roaming) */}
      <div className="px-5 mb-5">
        <div className="rounded-3xl p-5 space-y-4" style={{background:'#0E1828',border:'1px solid rgba(255,255,255,0.07)'}}>
          <div className="text-sm font-bold" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>Roaming Controls</div>
          {[
            { label: paygBlocked?'PAYG Roaming Blocked':'PAYG Roaming', sub:'Pay-as-you-go data & calls', active:!paygBlocked, onChange:(v:boolean)=>setPaygBlocked(!v) },
            { label: incomingBlocked?'Incoming Traffic Blocked':'Incoming Calls & Traffic', sub:'Receive calls and data internationally', active:!incomingBlocked, onChange:(v:boolean)=>setIncomingBlocked(!v) },
            { label: dataRoaming?'Data Roaming':'Data Roaming (Off)', sub:dataRoaming?'Mobile data enabled internationally':'Voice services only — enable to use data bundles', active:dataRoaming, onChange:onDataRoamingChange },
          ].map((ctrl,i,arr)=>(
            <div key={ctrl.label}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>{ctrl.label}</div>
                  <div className="text-xs mt-0.5" style={{color:'#475569',fontFamily:'Inter'}}>{ctrl.sub}</div>
                </div>
                <ToggleSwitch active={ctrl.active} onChange={ctrl.onChange} />
              </div>
              {i<arr.length-1&&<div className="h-px mt-4" style={{background:'rgba(255,255,255,0.05)'}} />}
            </div>
          ))}
        </div>
      </div>

      {/* 3 — Credit Limit */}
      <div className="px-5 mb-5">
        <CreditLimitSection committedLimit={userCreditLimit} onUpdate={onCreditLimitUpdate} />
      </div>

      {/* 4 — Resource Rollover */}
      <div className="px-5 mb-5">
        <div className="rounded-3xl p-5" style={{background:'#0E1828',border:'1px solid rgba(255,255,255,0.07)'}}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-bold" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>Resource Rollover</div>
              <div className="text-xs mt-0.5" style={{color:'#475569',fontFamily:'Outfit'}}>Transfer unused data to eligible bundles</div>
            </div>
            {!rolloverActive
              ? <button onClick={()=>setShowRolloverModal(true)} className="px-4 py-2 rounded-xl text-xs font-bold"
                  style={{background:'rgba(6,182,212,0.12)',color:'#06B6D4',border:'1px solid rgba(6,182,212,0.3)',fontFamily:'Outfit'}}>Activate</button>
              : <span className="flex items-center gap-1.5 text-xs font-semibold" style={{color:'#10B981',fontFamily:'Outfit'}}>● Active</span>
            }
          </div>
          <div className="text-xs mb-3 uppercase tracking-widest font-semibold" style={{color:'#475569',fontFamily:'Outfit'}}>Eligible Rollover Pairs</div>
          <div className="space-y-2.5">
            {ROLLOVER_PAIRS.map((p,i)=>(
              <div key={i} className="flex items-center gap-2 p-3 rounded-xl"
                style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.05)'}}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium" style={{color:'#94A3B8',fontFamily:'Outfit'}}>{p.from}</span>
                    <span style={{color:'#475569',fontSize:11}}>→</span>
                    <span className="text-xs font-semibold" style={{color:'#06B6D4',fontFamily:'Outfit'}}>{p.to}</span>
                  </div>
                  <div className="text-xs mt-0.5" style={{color:'#475569',fontFamily:'Inter'}}>{p.note}</div>
                </div>
                <span style={{color:'#10B981',fontSize:14,flexShrink:0}}>✓</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rollover modal */}
      {showRolloverModal && (
        <OverlayModal onBdClick={()=>setShowRolloverModal(false)}>
          <div className="w-full max-w-sm rounded-3xl p-6 fade-in"
            style={{background:'#0E1828',border:'1px solid rgba(255,255,255,0.1)'}}>
            <h3 className="text-lg font-bold mb-2" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>Activate Resource Rollover</h3>
            <p className="text-sm mb-5" style={{color:'#94A3B8',fontFamily:'Inter',lineHeight:1.6}}>
              Roll over <strong style={{color:'#06B6D4'}}>{DATA_REM} GB</strong> unused data from{' '}
              <strong style={{color:'#E2E8F0'}}>{ACTIVE_BUNDLE.name}</strong> to{' '}
              <strong style={{color:'#06B6D4'}}>World Bundle 3GB</strong>.
            </p>
            <div className="flex items-center gap-2 p-3.5 rounded-2xl mb-5"
              style={{background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)'}}>
              <span style={{fontSize:18}}>✅</span>
              <div className="text-xs" style={{color:'#10B981',fontFamily:'Outfit'}}>Compatibility confirmed — all Euro Bundle countries covered by World Bundle</div>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setShowRolloverModal(false)} className="flex-1 py-3 rounded-2xl font-semibold text-sm"
                style={{background:'rgba(255,255,255,0.06)',color:'#94A3B8',fontFamily:'Outfit'}}>Cancel</button>
              <button onClick={()=>{setRolledBundle(BUNDLES.find(b=>b.id==='world-3gb')!);setRolloverActive(true);setShowRolloverModal(false);}}
                className="flex-1 py-3 rounded-2xl font-bold text-sm"
                style={{background:'#06B6D4',color:'#070B14',fontFamily:'Outfit'}}>Confirm</button>
            </div>
          </div>
        </OverlayModal>
      )}

      {/* 5 — Explore compatible bundles */}
      <div className="px-5">
        <div className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{color:'#475569',fontFamily:'Outfit'}}>Explore Compatible Bundles</div>
        <div className="grid gap-3" style={{gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))'}}>
          {BUNDLES.filter(b=>b.region==='World').slice(0,4).map(b=>(
            <BundleCard key={b.id} bundle={b} isFav={favs.has(b.id)}
              onToggleFav={()=>onToggleFav(b.id)} onAction={a=>onBundleAction(b,a)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>('home');
  const [roaming, setRoaming] = useState(false);
  const [dataRoaming, setDataRoaming] = useState(false);
  const [userCreditLimit, setUserCreditLimit] = useState(3000); // demo: < 5000 triggers top-up flow
  const [iTab, setITab] = useState<IncentiveTab>('data');
  const [favs, setFavs] = useState<Set<string>>(new Set(['euro-10gb']));
  const [selBundle, setSelBundle] = useState<Bundle|null>(null);
  const [bundleAction, setBundleAction] = useState<BundleAction>('buy');
  const [toast, setToast] = useState<string|null>(null);
  const [showRoamingPopup, setShowRoamingPopup] = useState(false);
  const [showCreditBlockedPopup, setShowCreditBlockedPopup] = useState(false);
  const [showDataRoamingPopup, setShowDataRoamingPopup] = useState(false);

  function handleRoamingChange(v: boolean) {
    setRoaming(v);
    if (v) setShowRoamingPopup(true);
    if (!v) setDataRoaming(false);
  }

  function handleBundleAction(b: Bundle, a: BundleAction | 'blocked') {
    if (a === 'blocked') { setShowCreditBlockedPopup(true); return; }
    setSelBundle(b); setBundleAction(a);
  }

  function handleConfirm() {
    const name = selBundle?.name;
    setSelBundle(null);
    setToast(`${bundleAction==='buy'?'Purchased':'Subscribed to'}: ${name}`);
    if (roaming && !dataRoaming) setTimeout(()=>setShowDataRoamingPopup(true), 350);
  }

  function toggleFav(id: string) {
    setFavs(p=>{ const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  }

  return (
    <div className="size-full overflow-y-auto" style={{background:'#070B14',maxWidth:480,margin:'0 auto'}}>
      {toast && <Toast message={`✓ ${toast}`} onDone={()=>setToast(null)} />}

      {/* Roaming activated — centred overlay with blurred background */}
      {showRoamingPopup && (
        <OverlayModal>
          <div className="w-full max-w-sm rounded-3xl p-7 text-center fade-in"
            style={{background:'linear-gradient(160deg,#0E1828 0%,#162036 100%)',border:'1px solid rgba(6,182,212,0.3)'}}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{background:'rgba(16,185,129,0.15)',border:'2px solid rgba(16,185,129,0.4)'}}>
              <span style={{fontSize:28,color:'#10B981'}}>✓</span>
            </div>
            <div className="text-lg font-bold mb-2" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>International Roaming Activated</div>
            <p className="text-sm leading-relaxed mb-6" style={{color:'#94A3B8',fontFamily:'Inter'}}>
              You have successfully activated International Roaming Services. Subscribe to bundles below and manage your roaming service settings in the{' '}
              <span style={{color:'#06B6D4'}}>Connectivity Centre</span>.
            </p>
            <button onClick={()=>setShowRoamingPopup(false)}
              className="w-full py-3.5 rounded-2xl font-bold text-sm"
              style={{background:'#06B6D4',color:'#070B14',fontFamily:'Outfit'}}>Got it</button>
          </div>
        </OverlayModal>
      )}

      {/* Credit blocked — centred overlay */}
      {showCreditBlockedPopup && (
        <OverlayModal onBdClick={()=>setShowCreditBlockedPopup(false)}>
          <div className="w-full max-w-sm rounded-3xl p-7 text-center fade-in"
            style={{background:'linear-gradient(160deg,#0E1828 0%,#162036 100%)',border:'1px solid rgba(245,158,11,0.35)'}}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{background:'rgba(245,158,11,0.12)',border:'2px solid rgba(245,158,11,0.35)'}}>
              <span style={{fontSize:26}}>🔒</span>
            </div>
            <div className="text-base font-bold mb-2" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>Credit Limit Required</div>
            <p className="text-sm leading-relaxed mb-6" style={{color:'#94A3B8',fontFamily:'Inter'}}>
              Top up your credit limit to <strong style={{color:'#F59E0B'}}>PKR 5,000</strong> to enable International Roaming.
            </p>
            <button onClick={()=>setShowCreditBlockedPopup(false)}
              className="w-full py-3.5 rounded-2xl font-bold text-sm"
              style={{background:'rgba(245,158,11,0.15)',color:'#F59E0B',border:'1px solid rgba(245,158,11,0.35)',fontFamily:'Outfit'}}>
              Got it
            </button>
          </div>
        </OverlayModal>
      )}

      {/* Data roaming off — centred overlay */}
      {showDataRoamingPopup && (
        <OverlayModal onBdClick={()=>setShowDataRoamingPopup(false)}>
          <div className="w-full max-w-sm rounded-3xl p-7 text-center fade-in"
            style={{background:'linear-gradient(160deg,#0E1828 0%,#162036 100%)',border:'1px solid rgba(129,140,248,0.35)'}}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{background:'rgba(129,140,248,0.12)',border:'2px solid rgba(129,140,248,0.35)'}}>
              <span style={{fontSize:26}}>📶</span>
            </div>
            <div className="text-base font-bold mb-2" style={{color:'#E2E8F0',fontFamily:'Outfit'}}>Bundle Subscribed</div>
            <p className="text-sm leading-relaxed mb-6" style={{color:'#94A3B8',fontFamily:'Inter'}}>
              Activate <strong style={{color:'#818CF8'}}>Data Roaming</strong> in the Roaming Connectivity Centre to access your resources.
            </p>
            <div className="flex gap-3">
              <button onClick={()=>setShowDataRoamingPopup(false)}
                className="flex-1 py-3.5 rounded-2xl font-semibold text-sm"
                style={{background:'rgba(255,255,255,0.06)',color:'#94A3B8',fontFamily:'Outfit'}}>Dismiss</button>
              <button onClick={()=>{setShowDataRoamingPopup(false);setView('roamingCentre');}}
                className="flex-1 py-3.5 rounded-2xl font-bold text-sm"
                style={{background:'#818CF8',color:'#070B14',fontFamily:'Outfit'}}>Go to Centre</button>
            </div>
          </div>
        </OverlayModal>
      )}

      {view==='home' && (
        <HomeView roaming={roaming} onRoamingChange={handleRoamingChange}
          iTab={iTab} onITabChange={setITab} onOpenCentre={()=>setView('roamingCentre')}
          favs={favs} onToggleFav={toggleFav} onBundleAction={handleBundleAction}
          userCreditLimit={userCreditLimit} onCreditLimitUpdate={setUserCreditLimit} />
      )}

      {view==='roamingCentre' && (
        <RoamingCentreView iTab={iTab} onITabChange={setITab} onBack={()=>setView('home')}
          favs={favs} onToggleFav={toggleFav} onBundleAction={handleBundleAction}
          userCreditLimit={userCreditLimit} onCreditLimitUpdate={setUserCreditLimit}
          dataRoaming={dataRoaming} onDataRoamingChange={setDataRoaming} />
      )}

      {selBundle && (
        <BundleModal bundle={selBundle} action={bundleAction}
          onClose={()=>setSelBundle(null)} onConfirm={handleConfirm} />
      )}
    </div>
  );
}
