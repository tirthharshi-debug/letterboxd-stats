import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Film, Star, Sparkles, AlertCircle, Clock, BarChart3 } from 'lucide-react';
import { uploadZip, getProgress, getResults } from '../services/api';
import { LightRays } from './LightRays';

const ease = [0.16, 1, 0.3, 1];

export default function UploadPage({ onDataLoaded }) {
    const [dragOver, setDragOver] = useState(false);
    const [phase, setPhase] = useState('idle');
    const [uploadPct, setUploadPct] = useState(0);
    const [progress, setProgress] = useState({ status: 'idle', current: 0, total: 0 });
    const [error, setError] = useState(null);
    const pollRef = useRef(null);
    const jobIdRef = useRef(null);

    const startPolling = useCallback((jobId) => {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = setInterval(async () => {
            try {
                const p = await getProgress(jobId);
                setProgress(p);
                if (p.status === 'done') {
                    clearInterval(pollRef.current);
                    const results = await getResults(jobId);
                    onDataLoaded(results, jobId);
                } else if (p.status === 'error') {
                    clearInterval(pollRef.current);
                    setError(p.error || 'Processing failed.');
                    setPhase('idle');
                }
            } catch { }
        }, 1200);
    }, [onDataLoaded]);

    useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

    const handleFile = useCallback(async (file) => {
        if (!file || !file.name.endsWith('.zip')) {
            setError('Please upload a .zip file exported from Letterboxd.');
            return;
        }
        setError(null);
        setPhase('uploading');
        setUploadPct(0);
        try {
            const resp = await uploadZip(file, setUploadPct);
            const jobId = resp.job_id;
            jobIdRef.current = jobId;
            setPhase('processing');
            startPolling(jobId);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Upload failed.');
            setPhase('idle');
        }
    }, [startPolling]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
    }, [handleFile]);

    const statusText = {
        idle: 'Preparing…', extracting: 'Unwrapping your film diary…',
        parsing: 'Reading your watch history…', enriching: 'Fetching film data from TMDB…',
        computing: 'Crunching the numbers…', done: 'Your stats are ready!',
        error: 'Something went wrong',
    };

    const isProcessing = phase === 'uploading' || phase === 'processing';

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: 'var(--color-bg-void)' }}>
            <LightRays
                raysOrigin="top-center"
                raysColor="#006630"
                raysSpeed={0.3}
                lightSpread={1.2}
                rayLength={1.4}
                followMouse={true}
                mouseInfluence={0.08}
                noiseAmount={0.008}
                distortion={0.02}
                fadeDistance={0.7}
            />
            <div className="upload-bg" />
            <div className="film-grain" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease }}
                className="w-full max-w-lg relative z-10"
            >
                {/* Branding */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded"
                        style={{ background: 'rgba(0,224,84,0.06)', border: '1px solid rgba(0,224,84,0.1)' }}
                    >
                        <Film size={14} style={{ color: '#00e054' }} />
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#00e054' }}>Letterboxd Analytics</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15, ease }}
                        className="gradient-text-cinema"
                        style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
                    >
                        CineStats
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-3 text-base"
                        style={{ color: 'var(--color-text-secondary)', textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}
                    >
                        Your film diary, visualized
                    </motion.p>
                </div>

                {/* Upload Zone / Processing */}
                <AnimatePresence mode="wait">
                    {!isProcessing ? (
                        <motion.label
                            key="upload"
                            htmlFor="file-upload"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.4, ease }}
                            className={`drop-zone block ${dragOver ? 'active' : ''}`}
                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                        >
                            <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="mb-5 mx-auto"
                                style={{ width: 'fit-content' }}
                            >
                                <div style={{
                                    width: 64, height: 64, borderRadius: 6,
                                    background: 'var(--color-bg-elevated)',
                                    border: '1px solid var(--color-border-default)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Upload size={26} strokeWidth={1.5} style={{ color: 'var(--color-accent-green)' }} />
                                </div>
                            </motion.div>

                            <p className="text-lg font-bold mb-1.5" style={{ color: 'var(--color-text-hero)' }}>
                                Drop your Letterboxd export
                            </p>
                            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                                .zip file from your account settings
                            </p>

                            <div className="btn-green mx-auto">
                                <Film size={15} /> Choose File
                            </div>
                            <input id="file-upload" type="file" accept=".zip"
                                onChange={e => e.target.files[0] && handleFile(e.target.files[0])}
                                className="hidden" />
                        </motion.label>
                    ) : (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.4, ease }}
                            className="card"
                            style={{ padding: '3rem 2rem' }}
                        >
                            <div className="text-center mb-6">
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="mb-4 mx-auto" style={{ width: 'fit-content', color: 'var(--color-accent-green)' }}
                                >
                                    <Sparkles size={24} />
                                </motion.div>
                                <p className="text-lg font-bold" style={{ color: 'var(--color-text-hero)' }}>
                                    {phase === 'uploading' ? 'Uploading…' : (statusText[progress.status] || 'Processing…')}
                                </p>
                                <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
                                    This takes a minute or two
                                </p>
                            </div>

                            {phase === 'uploading' && (
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
                                        <span>Uploading</span><span>{uploadPct}%</span>
                                    </div>
                                    <div className="progress-track"><div className="progress-fill" style={{ width: `${uploadPct}%` }} /></div>
                                </div>
                            )}

                            {phase === 'processing' && progress.status === 'enriching' && progress.total > 0 && (
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
                                        <span>Fetching film data</span><span>{progress.current} / {progress.total}</span>
                                    </div>
                                    <div className="progress-track"><div className="progress-fill" style={{ width: `${Math.round((progress.current / progress.total) * 100)}%` }} /></div>
                                </div>
                            )}

                            {phase === 'processing' && progress.basic_stats && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="mt-6 pt-5" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                                    <p className="text-center text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--color-accent-green)' }}>
                                        Quick Preview
                                    </p>
                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        <div>
                                            <div className="stat-number" style={{ color: 'var(--color-text-hero)', fontSize: '1.5rem' }}>{progress.basic_stats.total_films}</div>
                                            <div className="stat-label">Films</div>
                                        </div>
                                        <div>
                                            <div className="stat-number" style={{ color: 'var(--color-accent-orange)', fontSize: '1.5rem' }}>★{progress.basic_stats.average_rating}</div>
                                            <div className="stat-label">Avg</div>
                                        </div>
                                        <div>
                                            <div className="stat-number" style={{ color: 'var(--color-text-hero)', fontSize: '1.5rem' }}>{progress.basic_stats.total_diary_entries}</div>
                                            <div className="stat-label">Diary</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            className="mt-4 p-4 rounded text-sm flex items-center gap-2.5"
                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444' }}>
                            <AlertCircle size={16} /> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    className="text-center text-xs mt-8" style={{ color: 'var(--color-text-muted)' }}>
                    Export your data at{' '}
                    <a href="https://letterboxd.com/data/export/" target="_blank" rel="noreferrer"
                        style={{ color: 'var(--color-accent-green)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                        letterboxd.com/data/export
                    </a>
                </motion.p>
            </motion.div>
        </div>
    );
}
