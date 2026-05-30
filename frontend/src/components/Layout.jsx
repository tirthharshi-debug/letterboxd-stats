import { useId } from 'react';
import { FaGithub } from 'react-icons/fa';

const LINKS = {
    letterboxd: 'https://boxd.it/8hpsV',
    github: 'https://github.com/tirthharshi-debug/CineStats',
};

const iconHoverClass = 'header-social-icon';

function LetterboxdLogo({ size = 20, ...props }) {
    const id = useId();
    const clip1Id = `lb-clip-1-${id}`.replace(/:/g, '-');
    const clip2Id = `lb-clip-2-${id}`.replace(/:/g, '-');
    const width = Math.round(size * (84 / 36));

    return (
        <svg
            viewBox="0 0 84 36"
            width={width}
            height={size}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                ...props.style
            }}
        >
            <defs>
                <clipPath id={clip1Id}>
                    <circle cx="18" cy="18" r="16" />
                </clipPath>
                <clipPath id={clip2Id}>
                    <circle cx="42" cy="18" r="16" />
                </clipPath>
            </defs>
            {/* Left circle: Orange */}
            <circle cx="18" cy="18" r="16" fill="#ff8000" />
            {/* Middle circle: Green */}
            <circle cx="42" cy="18" r="16" fill="#00e054" />
            {/* Right circle: Blue */}
            <circle cx="66" cy="18" r="16" fill="#40bcf4" />
            {/* Overlap 1 (Orange & Green) -> White */}
            <circle cx="42" cy="18" r="16" fill="#ffffff" clipPath={`url(#${clip1Id})`} />
            {/* Overlap 2 (Green & Blue) -> White */}
            <circle cx="66" cy="18" r="16" fill="#ffffff" clipPath={`url(#${clip2Id})`} />
        </svg>
    );
}

function SocialIcons({ size = 'md' }) {
    // Increase size of Letterboxd ~20% (Header: 20->24, Footer: 18->21)
    const s = size === 'md' ? { lb: 24, gh: 22 } : { lb: 21, gh: 20 };
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <a
                href={LINKS.letterboxd}
                target="_blank"
                rel="noopener noreferrer"
                className={`${iconHoverClass} social-letterboxd`}
                style={{ display: 'inline-flex', alignItems: 'center' }}
                aria-label="Letterboxd Profile"
            >
                <LetterboxdLogo size={s.lb} />
            </a>
            <a
                href={LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`${iconHoverClass} social-github`}
                style={{ display: 'inline-flex', alignItems: 'center' }}
                aria-label="GitHub Repository"
            >
                <FaGithub size={s.gh} />
            </a>
        </div>
    );
}

export function Header({ onLogoClick }) {
    return (
        <header
            className="site-header"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 200,
                padding: '0.85rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(11, 13, 15, 0.6)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--color-border-subtle)',
            }}
        >
            {/* Left: Favicon + Wordmark */}
            <div
                onClick={onLogoClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    cursor: onLogoClick ? 'pointer' : 'default',
                    userSelect: 'none',
                }}
            >
                <img
                    src="/favicon.svg"
                    alt="CineStats"
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 5,
                        flexShrink: 0,
                        opacity: 1,
                    }}
                />
                <span
                    className="gradient-text-cinema"
                    style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                    }}
                >
                    CineStats
                </span>
            </div>

            {/* Right: Social Icons */}
            <SocialIcons size="md" />
        </header>
    );
}

export function Footer() {
    return (
        <footer
            className="site-footer"
            style={{
                position: 'relative',
                zIndex: 10,
                padding: '1.5rem',
                borderTop: '1px solid var(--color-border-subtle)',
            }}
        >
            {/* Decorative line */}
            <div
                style={{
                    width: 120,
                    height: 1,
                    margin: '0 auto 1.25rem',
                    background: 'linear-gradient(90deg, transparent, rgba(0,224,84,0.15), transparent)',
                }}
            />

            <div
                style={{
                    maxWidth: '72rem',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                }}
            >
                {/* Left: Favicon + Attribution */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img
                        src="/favicon.svg"
                        alt=""
                        style={{
                            width: 45,
                            height: 45,
                            borderRadius: 4,
                            flexShrink: 0,
                            opacity: 1,
                        }}
                    />
                    <p
                        style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                            fontWeight: 500,
                            letterSpacing: '0.02em',
                        }}
                    >
                        Built with <span style={{ color: '#ee7752' }}>❤️</span> by a Cinephile, for Cinephiles.
                    </p>
                </div>

                {/* Right: Social Icons */}
                <SocialIcons size="sm" />
            </div>
        </footer>
    );
}
