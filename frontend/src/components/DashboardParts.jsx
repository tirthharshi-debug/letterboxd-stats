import { Film, Star, Clock, Download, Target, Globe, Theater, Brain, MapPin, TrendingUp } from 'lucide-react';

export const TMDB_IMG = 'https://image.tmdb.org/t/p/w342';
export const TMDB_PROFILE = 'https://image.tmdb.org/t/p/w185';

export const GLOW = {
    green: { bg: 'rgba(0,224,84,0.06)', border: 'rgba(0,224,84,0.12)', text: '#00e054' },
    orange: { bg: 'rgba(255,128,0,0.06)', border: 'rgba(255,128,0,0.12)', text: '#ff8000' },
    blue: { bg: 'rgba(64,188,244,0.06)', border: 'rgba(64,188,244,0.12)', text: '#40bcf4' },
    dim: { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.06)', text: '#f4f4f5' },
};

export const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'monthly', label: 'Monthly', icon: Film },
    { id: 'community', label: 'You vs World', icon: Globe },
    { id: 'genres', label: 'Genres', icon: Theater },
    { id: 'people', label: 'People', icon: Star },
    { id: 'world', label: 'World', icon: MapPin },
    { id: 'insights', label: 'Insights', icon: Brain },
];

export const formatDate = (d) => {
    if (!d) return '—';
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
};

export const formatRuntime = (hours, days) => {
    if (!hours) return null;
    return `${Math.round(Number(hours)).toLocaleString()} hours (≈${Math.round(Number(days))} days)`;
};

export function StickyNav({ onDownloadPdf, downloading }) {
    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return (
        <nav className="sticky-nav">
            <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-3 max-w-7xl mx-auto">
                <Film size={16} className="mr-2" style={{ color: '#00e054' }} />
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    return (<button key={item.id} onClick={() => scrollTo(item.id)} className="nav-pill"><Icon size={13} /><span>{item.label}</span></button>);
                })}
                <div className="flex-1" />
                <button onClick={onDownloadPdf} disabled={downloading} className="pdf-btn">
                    <span className="flex items-center gap-1.5">
                        {downloading ? <><Clock size={13} /> Generating...</> : <><Download size={13} /> PDF</>}
                    </span>
                </button>
            </div>
        </nav>
    );
}

export function GlowStat({ value, label, icon: Icon, glow = GLOW.dim }) {
    return (
        <div className="glow-stat anim-fade-up" style={{ background: glow.bg, border: `1px solid ${glow.border}`, borderRadius: 6 }}>
            {Icon && <div className="mb-1.5" style={{ color: glow.text }}><Icon size={18} /></div>}
            <div className="stat-number" style={{ color: glow.text, fontSize: '1.6rem' }}>{value ?? '—'}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
}

export function SectionTitle({ children, sub, icon: Icon, id }) {
    return (
        <div className="mb-7 anim-fade-up" id={id}>
            <div className="flex items-center gap-2.5">
                {Icon && <Icon size={20} style={{ color: '#00e054' }} />}
                <h2 className="section-title">{children}</h2>
            </div>
            {sub && <p className="text-sm mt-1.5 font-medium" style={{ color: 'var(--color-text-muted)', marginLeft: Icon ? '2rem' : 0 }}>{sub}</p>}
            <div className="section-accent-line" style={{ marginLeft: Icon ? '2rem' : 0 }} />
        </div>
    );
}

export function ChartCard({ title, children, titleColor = '#99aabb' }) {
    return (
        <div className="card anim-fade-up">
            {title && <p className="text-xs font-bold uppercase tracking-wider mb-5" style={{ color: titleColor }}>{title}</p>}
            {children}
        </div>
    );
}

export function DataRow({ label, value, valueColor = '#f4f4f5' }) {
    return (
        <div className="data-row">
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
            <span className="text-sm font-bold" style={{ color: valueColor }}>{value ?? '—'}</span>
        </div>
    );
}

export function PersonCard({ name, count, profilePath, rank, avgRating, subtitle }) {
    const medals = ['🥇', '🥈', '🥉'];
    return (
        <div className="person-card anim-fade-up" style={{ border: rank < 3 ? `1.5px solid rgba(0,224,84,${0.3 - rank * 0.08})` : undefined }}>
            <div className="person-photo-wrap">
                {profilePath ? (
                    <img src={`${TMDB_PROFILE}${profilePath}`} alt={name} loading="lazy" className="person-photo" />
                ) : (
                    <div className="person-photo-fallback">👤</div>
                )}
                {rank !== undefined && rank < 3 && <span className="person-medal">{medals[rank]}</span>}
            </div>
            <p className="text-sm font-bold mt-2 truncate w-full text-center" style={{ color: '#fff' }}>{name}</p>
            {avgRating && <p className="text-xs font-bold" style={{ color: '#ff8000' }}>★ {avgRating}</p>}
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{subtitle || `${count} films`}</p>
        </div>
    );
}

export function ComparisonFilm({ film, isHigher }) {
    const color = isHigher ? '#00e054' : '#ee7752';
    const bg = isHigher ? 'rgba(0,224,84,0.04)' : 'rgba(238,119,82,0.04)';
    return (
        <div className="flex items-center gap-3 py-2 px-3 rounded-lg" style={{ background: bg, border: `1px solid ${isHigher ? 'rgba(0,224,84,0.08)' : 'rgba(238,119,82,0.08)'}` }}>
            {film.poster_path ? (
                <img src={`${TMDB_IMG}${film.poster_path}`} alt={film.title} loading="lazy"
                    style={{ width: 38, height: 57, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
            ) : <div style={{ width: 38, height: 57, borderRadius: 4, background: 'var(--color-bg-hover)', flexShrink: 0 }} />}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: '#fff' }}>{film.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs font-semibold" style={{ color: '#ff8000' }}>You: ★{film.user_rating}</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>World: ★{film.tmdb_rating}</span>
                </div>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: `${color}15`, color }}>{film.difference > 0 ? '+' : ''}{film.difference}</span>
        </div>
    );
}
