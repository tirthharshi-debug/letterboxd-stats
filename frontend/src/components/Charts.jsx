import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';

const C = ['#00e054', '#ff8000', '#40bcf4', '#ee7752', '#00b548', '#5dadec', '#e09030', '#66bb88'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: '#1c1b28',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 6,
            padding: '10px 14px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6), 0 0 20px rgba(160,120,255,0.06)',
        }}>
            <p style={{ color: '#ff8000', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: '#f8f4ee', fontSize: 12 }}>
                    {p.name}: <b style={{ color: p.color || '#ff8000' }}>{p.value}</b>
                </p>
            ))}
        </div>
    );
};

const axTick = { fill: '#605850', fontSize: 11 };

export function RatingDistChart({ data }) {
    if (!data || Object.keys(data).length === 0) return null;
    const d = Object.entries(data).map(([r, c]) => ({ rating: `${r}★`, count: c }));
    return (
        <ResponsiveContainer width="100%" height={240}>
            <BarChart data={d} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="rating" tick={axTick} axisLine={false} tickLine={false} />
                <YAxis tick={axTick} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {d.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export function FilmsPerYearChart({ data }) {
    if (!data || Object.keys(data).length === 0) return null;
    const d = Object.entries(data).map(([y, c]) => ({ year: y, count: c }));
    return (
        <ResponsiveContainer width="100%" height={240}>
            <BarChart data={d} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="year" tick={axTick} axisLine={false} tickLine={false} />
                <YAxis tick={axTick} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {d.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export function GenrePieChart({ data }) {
    if (!data || Object.keys(data).length === 0) return null;
    const d = Object.entries(data).slice(0, 8).map(([n, v]) => ({ name: n, value: v }));
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={d} cx="50%" cy="50%" outerRadius={110} innerRadius={50}
                    dataKey="value" paddingAngle={3} strokeWidth={0}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    style={{ fontSize: '11px', fill: '#a09890' }}>
                    {d.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
}

export function RatingTrendChart({ data }) {
    if (!data || Object.keys(data).length === 0) return null;
    const d = Object.entries(data).map(([m, a]) => ({ month: m, avg: a }));
    return (
        <ResponsiveContainer width="100%" height={240}>
            <LineChart data={d} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ ...axTick, fontSize: 9 }} axisLine={false} tickLine={false}
                    interval={Math.max(0, Math.floor(d.length / 6))} />
                <YAxis domain={[0, 5]} tick={axTick} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="avg" stroke="url(#lineGrad)" strokeWidth={2.5} dot={false} />
                <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ee7752" />
                        <stop offset="50%" stopColor="#ff8000" />
                        <stop offset="100%" stopColor="#00e054" />
                    </linearGradient>
                </defs>
            </LineChart>
        </ResponsiveContainer>
    );
}

export function FrequencyBarChart({ data, color = '#00d4aa' }) {
    if (!data || Object.keys(data).length === 0) return null;
    const d = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 10)
        .map(([n, c]) => ({ name: n.length > 22 ? n.slice(0, 20) + '…' : n, count: c }));
    return (
        <ResponsiveContainer width="100%" height={Math.max(220, d.length * 32)}>
            <BarChart data={d} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                <XAxis type="number" tick={axTick} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={120} tick={axTick} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(160,120,255,0.06)' }} />
                <Bar dataKey="count" fill={color} radius={[0, 6, 6, 0]} fillOpacity={0.9} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function DecadeChart({ data }) {
    if (!data || Object.keys(data).length === 0) return null;
    const d = Object.entries(data).map(([dec, c]) => ({ decade: dec, count: c }));
    return (
        <ResponsiveContainer width="100%" height={240}>
            <BarChart data={d} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="decade" tick={axTick} axisLine={false} tickLine={false} />
                <YAxis tick={axTick} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(160,120,255,0.06)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {d.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export function HorizontalBarChart({ data, color = '#38b6ff' }) {
    if (!data || Object.keys(data).length === 0) return null;
    const d = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 8)
        .map(([n, v]) => ({ name: n.length > 24 ? n.slice(0, 22) + '…' : n, value: v }));
    return (
        <ResponsiveContainer width="100%" height={Math.max(200, d.length * 30)}>
            <BarChart data={d} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                <XAxis type="number" tick={axTick} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={130} tick={axTick} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(160,120,255,0.06)' }} />
                <Bar dataKey="value" fill={color} radius={[0, 6, 6, 0]} fillOpacity={0.9} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function GenreRatingRadar({ data }) {
    if (!data || Object.keys(data).length === 0) return null;
    const d = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 8)
        .map(([g, a]) => ({ genre: g, avg: a }));
    return (
        <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="60%" data={d}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="genre" tick={{ fill: '#a09890', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fill: '#605850', fontSize: 9 }} />
                <Tooltip content={<CustomTooltip />} />
                <Radar dataKey="avg" stroke="#00e054" fill="url(#radarGrad)" fillOpacity={0.15} strokeWidth={2} />
                <defs>
                    <linearGradient id="radarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00e054" />
                        <stop offset="100%" stopColor="#40bcf4" />
                    </linearGradient>
                </defs>
            </RadarChart>
        </ResponsiveContainer>
    );
}
