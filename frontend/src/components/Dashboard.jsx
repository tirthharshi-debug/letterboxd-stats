import { useState, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Film, Star, Sparkles, Trophy, Target, FileText, TrendingUp, Flame, Calendar, Clock, BarChart3, MapPin, Theater, Brain, Globe } from 'lucide-react';
import { RatingDistChart, FilmsPerYearChart, GenrePieChart, RatingTrendChart, FrequencyBarChart, DecadeChart, HorizontalBarChart, GenreRatingRadar } from './Charts';
import MonthlyFilmStrip from './MonthlyFilmStrip';
import { LightRays } from './LightRays';
import { GLOW, TMDB_IMG, StickyNav, GlowStat, SectionTitle, ChartCard, DataRow, PersonCard, ComparisonFilm, formatDate, formatRuntime } from './DashboardParts';

export default function Dashboard({ data, jobId }) {
    const [downloading, setDownloading] = useState(false);
    const { stats, meta } = data;
    const { basic, pro, patron, advanced, community_comparison, binge_stats, monthly_activity, decade_leaderboard } = stats;
    const ga = patron?.genre_analytics, da = patron?.director_analytics, aa = patron?.actor_analytics;
    const ra = patron?.runtime_analytics, ca = patron?.country_analytics, la = patron?.language_analytics;

    const handleDownloadPdf = useCallback(async () => {
        setDownloading(true);
        try {
            const pdfUrl = jobId ? `/api/export/pdf/${jobId}` : '/api/export/pdf';
            const resp = await axios.get(pdfUrl, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            const a = document.createElement('a'); a.href = url; a.download = 'CineStats_Report.pdf'; a.click();
            window.URL.revokeObjectURL(url);
        } catch (e) { console.error('PDF failed:', e); }
        finally { setDownloading(false); }
    }, [jobId]);

    return (
        <div className="min-h-screen" style={{ background: 'var(--color-bg-void)' }}>
            <LightRays raysOrigin="top-center" raysColor="#00804a" raysSpeed={0.4} lightSpread={1.8} rayLength={1.6} followMouse={true} mouseInfluence={0.1} noiseAmount={0.01} distortion={0.03} />
            <div className="cinema-bg" /><div className="film-grain" />
            <StickyNav onDownloadPdf={handleDownloadPdf} downloading={downloading} />

            {/* Hero */}
            <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 pt-14 pb-12 text-center">
                <h1 className="gradient-text-cinema" style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.04em', display: 'inline-block' }}>CineStats</h1>
                <p className="text-base mt-3" style={{ color: 'var(--color-text-secondary)' }}>Your film diary, visualized</p>
                <div className="flex justify-center gap-4 mt-5 flex-wrap">
                    <span className="text-sm font-bold px-3 py-1 rounded flex items-center gap-1.5" style={{ background: GLOW.green.bg, color: GLOW.green.text, border: `1px solid ${GLOW.green.border}` }}><Film size={13} /> {meta.total_unique_movies} films</span>
                    <span className="text-sm font-bold px-3 py-1 rounded flex items-center gap-1.5" style={{ background: GLOW.blue.bg, color: GLOW.blue.text, border: `1px solid ${GLOW.blue.border}` }}><FileText size={13} /> {meta.diary_entries} entries</span>
                    <span className="text-sm font-bold px-3 py-1 rounded flex items-center gap-1.5" style={{ background: GLOW.orange.bg, color: GLOW.orange.text, border: `1px solid ${GLOW.orange.border}` }}><Star size={13} /> ★{basic.average_rating} avg</span>
                </div>
                <div style={{ width: 160, height: 1, margin: '1.5rem auto 0', background: 'linear-gradient(90deg, transparent, rgba(0,224,84,0.2), transparent)' }} />
            </motion.header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-20">

                {/* OVERVIEW */}
                <section id="overview">
                    <SectionTitle icon={Target} sub="Your viewing at a glance" id="overview-title">Overview</SectionTitle>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                        <GlowStat icon={Film} value={basic.total_films} label="Films Watched" glow={GLOW.green} />
                        <GlowStat icon={FileText} value={basic.total_diary_entries} label="Diary Entries" glow={GLOW.dim} />
                        <GlowStat icon={Sparkles} value={basic.total_rewatches} label="Rewatches" glow={GLOW.dim} />
                        <GlowStat icon={Star} value={`★${basic.average_rating}`} label="Avg Rating" glow={GLOW.orange} />
                        <GlowStat icon={Flame} value={`${pro.longest_watch_streak}d`} label="Longest Streak" glow={GLOW.green} />
                    </div>

                    {binge_stats && binge_stats.multi_film_days > 0 && (
                        <div className="mb-10 anim-fade-up">
                            <p className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: '#ff8000' }}><Flame size={14} /> Binge Mode</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <GlowStat value={binge_stats.multi_film_days} label="Multi-Film Days" glow={GLOW.orange} />
                                <GlowStat value={binge_stats.max_films_in_day} label="Max in a Day" glow={GLOW.orange} />
                                <GlowStat value={binge_stats.avg_films_per_active_day} label="Avg Per Day" glow={GLOW.dim} />
                                <GlowStat value={formatDate(binge_stats.most_intense_day)} label="Most Intense" glow={GLOW.dim} />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        <div className="card anim-fade-up">
                            <p className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: GLOW.blue.text }}><Calendar size={13} /> Activity</p>
                            <DataRow label="Most Active Year" value={basic.most_active_year} valueColor={GLOW.blue.text} />
                            <DataRow label="Most Active Month" value={basic.most_active_month} valueColor={GLOW.blue.text} />
                            <DataRow label="Current Streak" value={`${pro.current_watch_streak} days`} valueColor={GLOW.orange.text} />
                            <DataRow label="Top Release Year" value={pro.most_watched_release_year} valueColor={GLOW.blue.text} />
                        </div>
                        <div className="card anim-fade-up">
                            <p className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: GLOW.orange.text }}><Trophy size={13} /> Milestones</p>
                            <DataRow label="First Watched" value={basic.first_watched?.title} valueColor={GLOW.orange.text} />
                            <DataRow label="Most Recent" value={basic.most_recent_watched?.title} valueColor={GLOW.orange.text} />
                            {pro.highest_rated_year && <DataRow label="Best Year" value={`${pro.highest_rated_year[0]} — ★${pro.highest_rated_year[1].average}`} valueColor="#00e054" />}
                            {pro.lowest_rated_year && <DataRow label="Worst Year" value={`${pro.lowest_rated_year[0]} — ★${pro.lowest_rated_year[1].average}`} valueColor="#ee7752" />}
                        </div>
                        <div className="card anim-fade-up">
                            <p className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: GLOW.dim.text }}><Clock size={13} /> Runtime</p>
                            <DataRow label="Total Watch Time" value={ra ? formatRuntime(ra.total_runtime_hours, ra.total_runtime_days) : null} />
                            <DataRow label="Avg Runtime" value={ra ? `${ra.average_runtime} min` : null} />
                            <DataRow label="Longest Film" value={ra?.longest_film ? `${ra.longest_film.title} (${ra.longest_film.runtime}m)` : null} />
                            <DataRow label="Shortest Film" value={ra?.shortest_film ? `${ra.shortest_film.title} (${ra.shortest_film.runtime}m)` : null} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <ChartCard title="Rating Distribution" titleColor={GLOW.orange.text}><RatingDistChart data={basic.rating_distribution} /></ChartCard>
                        <ChartCard title="Films Per Year" titleColor={GLOW.blue.text}><FilmsPerYearChart data={basic.films_per_year} /></ChartCard>
                    </div>
                </section>

                {/* MONTHLY */}
                {monthly_activity && monthly_activity.length > 0 && (
                    <section id="monthly">
                        <SectionTitle icon={Film} sub="Your poster collection, month by month" id="monthly-title">Monthly Film Strip</SectionTitle>
                        <MonthlyFilmStrip data={monthly_activity} />
                    </section>
                )}

                {/* YOU VS THE WORLD */}
                {community_comparison && (community_comparison.rated_higher?.length > 0 || community_comparison.rated_lower?.length > 0) && (
                    <section id="community">
                        <SectionTitle icon={Globe} sub="How your taste compares" id="community-title">You vs The World</SectionTitle>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="card anim-fade-up">
                                <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#00e054' }}>You Loved It More</p>
                                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                                    {(community_comparison.rated_higher || []).map((f, i) => <ComparisonFilm key={i} film={f} isHigher={true} />)}
                                    {(!community_comparison.rated_higher || community_comparison.rated_higher.length === 0) && <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No films found</p>}
                                </div>
                            </div>
                            <div className="card anim-fade-up">
                                <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#ee7752' }}>You Were Harsher</p>
                                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                                    {(community_comparison.rated_lower || []).map((f, i) => <ComparisonFilm key={i} film={f} isHigher={false} />)}
                                    {(!community_comparison.rated_lower || community_comparison.rated_lower.length === 0) && <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No films found</p>}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* GOLDEN ERAS */}
                {decade_leaderboard && decade_leaderboard.length > 0 && (
                    <section>
                        <SectionTitle icon={Trophy} sub="Your highest rated eras">Golden Eras</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {decade_leaderboard.map((d, i) => {
                                const medals = ['🥇', '🥈', '🥉'];
                                return (
                                    <div key={d.decade} className="card anim-fade-up">
                                        <div className="flex items-center gap-3 mb-3">
                                            {i < 3 ? <span className="text-2xl">{medals[i]}</span> : <span className="text-sm font-bold" style={{ color: 'var(--color-text-muted)' }}>#{i + 1}</span>}
                                            <div>
                                                <p className="text-lg font-bold" style={{ color: '#f4f4f5' }}>{d.decade}</p>
                                                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{d.film_count} films</p>
                                            </div>
                                        </div>
                                        <div className="stat-number mb-3" style={{ color: '#ff8000', fontSize: '1.4rem' }}>★ {d.avg_rating}</div>
                                        {d.top_posters && d.top_posters.length > 0 && (
                                            <div className="flex gap-1.5">
                                                {d.top_posters.map((p, pi) => (
                                                    <img key={pi} src={`${TMDB_IMG}${p.poster_path}`} alt="" loading="lazy"
                                                        style={{ width: 44, height: 66, borderRadius: 3, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.06)' }} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* TRENDS */}
                <section>
                    <SectionTitle icon={TrendingUp} sub="How your taste evolves">Trends</SectionTitle>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <ChartCard title="Rating Trend" titleColor={GLOW.blue.text}><RatingTrendChart data={pro.rating_trend_over_time} /></ChartCard>
                        <ChartCard title="Films By Decade" titleColor={GLOW.green.text}><DecadeChart data={pro.films_per_decade} /></ChartCard>
                    </div>
                </section>

                {/* GENRES */}
                {ga && (
                    <section id="genres">
                        <SectionTitle icon={Theater} sub="What you love to watch" id="genres-title">Genres</SectionTitle>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                            <GlowStat value={ga.most_watched_genre} label="Most Watched" glow={GLOW.green} />
                            <GlowStat value={ga.favorite_genre?.name || '—'} label="Favorite" glow={GLOW.green} />
                            <GlowStat value={ga.favorite_genre?.avg_rating ? `★${ga.favorite_genre.avg_rating}` : '—'} label="Fav Rating" glow={GLOW.orange} />
                            <GlowStat value={Object.keys(ga.genre_distribution || {}).length} label="Genres" glow={GLOW.dim} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <ChartCard title="Genre Distribution" titleColor={GLOW.green.text}><GenrePieChart data={ga.genre_distribution} /></ChartCard>
                            <ChartCard title="Rating By Genre" titleColor={GLOW.orange.text}><GenreRatingRadar data={ga.average_rating_per_genre} /></ChartCard>
                        </div>
                    </section>
                )}

                {/* PEOPLE */}
                <section id="people">
                    {da && (
                        <div className="mb-16">
                            <SectionTitle icon={Film} sub="The filmmakers behind your favorites" id="people-title">Directors</SectionTitle>
                            {da.director_frequency && (
                                <div className="flex flex-wrap gap-4 mb-8 justify-center">
                                    {Object.entries(da.director_frequency).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count], i) => {
                                        const info = da.director_profiles?.[name];
                                        return <PersonCard key={name} name={name} count={count} profilePath={info?.profile_path} rank={i} avgRating={da.director_vs_average?.[name]?.avg} subtitle={`${count} films`} />;
                                    })}
                                </div>
                            )}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <ChartCard title="Director Frequency" titleColor={GLOW.blue.text}><FrequencyBarChart data={da.director_frequency} color="#40bcf4" /></ChartCard>
                                <ChartCard title="Director vs Your Average" titleColor={GLOW.blue.text}>
                                    {da.director_vs_average && Object.keys(da.director_vs_average).length > 0 ? (
                                        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                                            {Object.entries(da.director_vs_average).map(([name, d]) => (
                                                <div key={name} className="flex items-center justify-between py-2 px-3 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                                    <span className="text-sm font-medium truncate mr-3" style={{ color: 'var(--color-text-primary)', maxWidth: '55%' }}>{name}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-bold" style={{ color: '#ff8000' }}>★{d.avg}</span>
                                                        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: d.diff >= 0 ? 'rgba(0,224,84,0.08)' : 'rgba(238,119,82,0.08)', color: d.diff >= 0 ? '#00e054' : '#ee7752' }}>{d.diff >= 0 ? '+' : ''}{d.diff}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Insufficient data</p>}
                                </ChartCard>
                            </div>
                        </div>
                    )}
                    {aa && (
                        <div>
                            <SectionTitle icon={Star} sub="Your most-seen performers">Actors</SectionTitle>
                            {aa.top_10_actors && (
                                <div className="flex flex-wrap gap-4 mb-8 justify-center">
                                    {aa.top_10_actors.slice(0, 8).map((a, i) => <PersonCard key={a.name} name={a.name} count={a.count} profilePath={a.profile_path} rank={i} subtitle={`${a.count} films`} />)}
                                </div>
                            )}
                            <ChartCard title="Top Actors" titleColor={GLOW.green.text}><FrequencyBarChart data={aa.actor_frequency_distribution} color="#00e054" /></ChartCard>
                        </div>
                    )}
                </section>

                {/* WORLD */}
                {(ca || la) && (
                    <section id="world">
                        <SectionTitle icon={MapPin} sub="Where your films come from" id="world-title">World Cinema</SectionTitle>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                            <GlowStat value={ca?.most_watched_country} label="Top Country" glow={GLOW.blue} />
                            <GlowStat value={la?.most_watched_language} label="Top Language" glow={GLOW.blue} />
                            <GlowStat value={Object.keys(ca?.country_distribution || {}).length} label="Countries" glow={GLOW.dim} />
                            <GlowStat value={Object.keys(la?.language_distribution || {}).length} label="Languages" glow={GLOW.dim} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <ChartCard title="Country Distribution" titleColor={GLOW.blue.text}><HorizontalBarChart data={ca?.country_distribution} color="#40bcf4" /></ChartCard>
                            <ChartCard title="Language Distribution" titleColor={GLOW.green.text}><HorizontalBarChart data={la?.language_distribution} color="#00e054" /></ChartCard>
                        </div>
                    </section>
                )}

                {/* INSIGHTS */}
                <section id="insights">
                    <SectionTitle icon={Brain} sub="Deep-dive analytics" id="insights-title">Insights</SectionTitle>
                    {advanced.taste_profile && (
                        <div className="card mb-8 anim-fade-up">
                            <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#00e054' }}>Your Taste Profile</p>
                            <div className="flex flex-wrap gap-2">
                                {advanced.taste_profile.map((t, i) => (
                                    <span key={i} className="text-sm px-4 py-2 rounded font-semibold" style={{ background: 'rgba(0,224,84,0.05)', color: '#00e054', border: '1px solid rgba(0,224,84,0.1)' }}>{t}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <GlowStat value={advanced.average_release_year} label="Avg Release Year" glow={GLOW.blue} />
                        <GlowStat value={advanced.oldest_film?.title || '—'} label={`Oldest (${advanced.oldest_film?.year || ''})`} glow={GLOW.dim} />
                        <GlowStat value={advanced.newest_film?.title || '—'} label={`Newest (${advanced.newest_film?.year || ''})`} glow={GLOW.dim} />
                        <GlowStat value={advanced.most_rewatched_film?.title || '—'} label={`×${advanced.most_rewatched_film?.rewatch_count || 0}`} glow={GLOW.orange} />
                    </div>
                    {advanced.rating_bias && (
                        <div className="card mb-8 anim-fade-up">
                            <div className="flex items-center gap-3 mb-5">
                                <p className="text-sm font-bold uppercase tracking-wider" style={{ color: '#ff8000' }}>Rating Bias</p>
                                <span className="text-xs font-bold px-2.5 py-1 rounded uppercase" style={{ background: GLOW.orange.bg, color: GLOW.orange.text, border: `1px solid ${GLOW.orange.border}` }}>{advanced.rating_bias.bias_label}</span>
                            </div>
                            <div className="grid grid-cols-5 gap-3 text-center">
                                {[
                                    { v: `★${advanced.rating_bias.average}`, l: 'Mean' },
                                    { v: `★${advanced.rating_bias.median}`, l: 'Median' },
                                    { v: `★${advanced.rating_bias.mode}`, l: 'Mode' },
                                    { v: `${advanced.rating_bias.high_rating_pct}%`, l: '≥4★' },
                                    { v: `${advanced.rating_bias.low_rating_pct}%`, l: '≤2★' },
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <div className="stat-number" style={{ fontSize: '1.3rem', color: '#f4f4f5' }}>{item.v}</div>
                                        <div className="stat-label">{item.l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {advanced.release_year_rating_correlation != null && (
                            <div className="card anim-fade-up">
                                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GLOW.blue.text }}>Year vs Rating Correlation</p>
                                <div className="stat-number mb-2" style={{ color: GLOW.blue.text }}>{advanced.release_year_rating_correlation}</div>
                                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{advanced.correlation_insight}</p>
                            </div>
                        )}
                        {advanced.most_common_genre_combo?.length > 0 && (
                            <div className="card anim-fade-up">
                                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GLOW.green.text }}>Top Genre Combos</p>
                                {advanced.most_common_genre_combo.map(([combo, count], i) => (
                                    <div key={i} className="data-row">
                                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{combo}</span>
                                        <span className="text-sm font-bold" style={{ color: GLOW.green.text }}>{count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <footer className="relative z-10 text-center py-10">
                <div style={{ width: 160, height: 1, margin: '0 auto 1rem', background: 'linear-gradient(90deg, transparent, rgba(0,224,84,0.15), transparent)' }} />
                <p className="text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                    <Film size={12} /> CineStats
                </p>
            </footer>
        </div>
    );
}
