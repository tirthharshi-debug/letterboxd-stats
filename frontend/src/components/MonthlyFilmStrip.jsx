import { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';

const TMDB_IMG = 'https://image.tmdb.org/t/p/w342';

function PosterCard({ film }) {
    const [hovered, setHovered] = useState(false);
    if (!film.poster_path) return null;

    return (
        <div
            className="poster-card group relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderRadius: 4,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
                boxShadow: hovered
                    ? '0 8px 24px rgba(0,0,0,0.5)'
                    : '0 2px 8px rgba(0,0,0,0.3)',
            }}
        >
            <img
                src={`${TMDB_IMG}${film.poster_path}`}
                alt={film.title}
                loading="lazy"
                style={{
                    width: '100%',
                    aspectRatio: '2/3',
                    objectFit: 'cover',
                    display: 'block',
                }}
            />
            {/* Hover overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '8px 8px',
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.2s ease',
            }}>
                <p style={{
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 600,
                    lineHeight: 1.2,
                    marginBottom: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                }}>
                    {film.title}
                </p>
                {film.user_rating && (
                    <div className="flex items-center gap-0.5" style={{ color: '#ff8000' }}>
                        <Star size={10} fill="#ff8000" />
                        <span style={{ fontSize: 11, fontWeight: 700 }}>{film.user_rating}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MonthlyFilmStrip({ data }) {
    const [showAll, setShowAll] = useState(false);

    if (!data || data.length === 0) return null;

    const displayed = showAll ? data : data.slice(0, 6);

    return (
        <div className="space-y-5">
            {displayed.map((month, idx) => (
                <div
                    key={`${month.year}-${month.month}`}
                    className="card anim-fade-up"
                    style={{ animationDelay: `${idx * 0.05}s`, padding: 0, overflow: 'hidden' }}
                >
                    {/* Month header */}
                    <div className="flex items-center justify-between flex-wrap gap-2"
                        style={{
                            padding: '1rem 1.25rem',
                            borderBottom: '1px solid var(--color-border-subtle)',
                            background: 'var(--color-bg-elevated)',
                        }}>
                        <div className="flex items-center gap-3">
                            <h3 style={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: 'var(--color-text-hero)',
                            }}>
                                {month.month} {month.year}
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                                    {month.total_films} films
                                </span>
                                {month.avg_rating && (
                                    <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: 'var(--color-accent-orange)' }}>
                                        <Star size={11} fill="#ff8000" /> {month.avg_rating}
                                    </span>
                                )}
                            </div>
                        </div>
                        {month.max_films_in_day >= 3 && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded"
                                style={{ background: 'rgba(0,224,84,0.08)', color: 'var(--color-accent-green)', border: '1px solid rgba(0,224,84,0.12)' }}>
                                Peak: {month.max_films_in_day} in one day
                            </span>
                        )}
                    </div>

                    {/* Poster photo grid */}
                    {month.films && month.films.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(85px, 1fr))',
                            gap: '3px',
                            padding: '3px',
                        }}>
                            {month.films.filter(f => f.poster_path).map((film, fi) => (
                                <PosterCard key={`${film.title}-${fi}`} film={film} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm p-4" style={{ color: 'var(--color-text-muted)' }}>
                            No poster data available
                        </p>
                    )}
                </div>
            ))}

            {data.length > 6 && (
                <div className="text-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-sm font-semibold px-5 py-2 rounded flex items-center gap-1.5 mx-auto"
                        style={{
                            background: 'var(--color-bg-elevated)',
                            color: 'var(--color-accent-green)',
                            border: '1px solid var(--color-border-default)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.target.style.borderColor = 'rgba(0,224,84,0.2)'; }}
                        onMouseLeave={e => { e.target.style.borderColor = 'var(--color-border-default)'; }}
                    >
                        {showAll ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> Show All {data.length} Months</>}
                    </button>
                </div>
            )}
        </div>
    );
}
