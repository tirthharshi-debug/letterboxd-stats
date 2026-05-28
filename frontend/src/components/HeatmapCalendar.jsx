import { useMemo } from 'react';

export default function HeatmapCalendar({ data }) {
    const { weeks, months, maxCount } = useMemo(() => {
        if (!data || Object.keys(data).length === 0) return { weeks: [], months: [], maxCount: 0 };

        const entries = Object.entries(data).sort();
        const firstDate = new Date(entries[0][0]);
        const lastDate = new Date(entries[entries.length - 1][0]);
        const lookup = Object.fromEntries(entries.map(([d, c]) => [d, c]));
        const max = Math.max(...Object.values(data));

        const start = new Date(firstDate);
        start.setDate(start.getDate() - start.getDay());
        const weeks = [];
        const monthLabels = [];
        let prevMonth = -1;

        const current = new Date(start);
        while (current <= lastDate || weeks.length < 52) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const key = current.toISOString().slice(0, 10);
                const count = lookup[key] || 0;
                if (current.getMonth() !== prevMonth) {
                    const mns = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    monthLabels.push({ index: weeks.length, name: mns[current.getMonth()] });
                    prevMonth = current.getMonth();
                }
                week.push({ date: key, count });
                current.setDate(current.getDate() + 1);
            }
            weeks.push(week);
            if (weeks.length >= 53) break;
        }
        return { weeks, months: monthLabels, maxCount: max };
    }, [data]);

    if (weeks.length === 0) return <p style={{ color: '#605850', fontSize: '0.85rem' }}>No viewing data available</p>;

    // Letterboxd green scale
    const getColor = (count) => {
        if (count === 0) return 'rgba(255,255,255,0.03)';
        const r = count / maxCount;
        if (r <= 0.25) return 'rgba(0,224,84,0.12)';
        if (r <= 0.5) return 'rgba(0,224,84,0.25)';
        if (r <= 0.75) return 'rgba(0,224,84,0.45)';
        return 'rgba(0,224,84,0.7)';
    };

    const sz = 11, gap = 2;

    return (
        <div className="overflow-x-auto">
            <div className="flex" style={{ gap: `${gap}px`, paddingLeft: '28px' }}>
                {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col" style={{ gap: `${gap}px` }}>
                        {week.map((day, di) => (
                            <div key={di}
                                title={`${day.date}: ${day.count} film${day.count !== 1 ? 's' : ''}`}
                                style={{
                                    width: sz, height: sz,
                                    backgroundColor: getColor(day.count),
                                    borderRadius: 3,
                                    transition: 'transform 0.15s, box-shadow 0.15s',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={e => {
                                    e.target.style.transform = 'scale(1.6)';
                                    e.target.style.boxShadow = '0 0 8px rgba(0,212,170,0.3)';
                                }}
                                onMouseLeave={e => {
                                    e.target.style.transform = 'scale(1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-1 mt-3" style={{ paddingLeft: '28px' }}>
                <span style={{ fontSize: 10, color: '#605850' }}>Less</span>
                {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
                    <div key={i} style={{ width: sz, height: sz, backgroundColor: getColor(r * (maxCount || 1)), borderRadius: 3 }} />
                ))}
                <span style={{ fontSize: 10, color: '#605850' }}>More</span>
            </div>
        </div>
    );
}
