import React from 'react';

interface ConceptIllustrationProps {
  illustrationId: string;
}

const ConceptIllustration: React.FC<ConceptIllustrationProps> = ({ illustrationId }) => {
  // Common colors
  const primary = 'var(--color-accent-primary)';
  const secondary = 'var(--color-accent-secondary)';
  const nodeFill = 'var(--color-bg-elevated)';
  const nodeStroke = 'var(--color-border-focus)';

  switch (illustrationId) {
    case 'intro':
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
          <svg viewBox="0 0 800 300" width="100%" height="100%">
            {/* Intro: Commit Tree */}
            <path d="M100 150 L300 150 L500 150 L700 150" stroke={primary} strokeWidth="4" fill="none" />
            <path d="M300 150 L400 50 L600 50" stroke={secondary} strokeWidth="4" fill="none" />
            
            {/* Master Nodes */}
            <circle cx="100" cy="150" r="16" fill={nodeFill} stroke={nodeStroke} strokeWidth="4" />
            <circle cx="300" cy="150" r="16" fill={nodeFill} stroke={nodeStroke} strokeWidth="4" />
            <circle cx="500" cy="150" r="16" fill={nodeFill} stroke={nodeStroke} strokeWidth="4" />
            <circle cx="700" cy="150" r="16" fill={nodeFill} stroke={nodeStroke} strokeWidth="4" />
            
            {/* Branch Nodes */}
            <circle cx="400" cy="50" r="16" fill={nodeFill} stroke={secondary} strokeWidth="4" />
            <circle cx="600" cy="50" r="16" fill={nodeFill} stroke={secondary} strokeWidth="4" />
            
            <text x="700" y="190" fill="var(--color-text)" fontSize="18" textAnchor="middle" fontWeight="bold">master</text>
            <text x="600" y="90" fill="var(--color-text)" fontSize="18" textAnchor="middle" fontWeight="bold">feature</text>
          </svg>
        </div>
      );
    case 'vcs':
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
          <svg viewBox="0 0 800 300" width="100%" height="100%">
            {/* Remote Central Repo */}
            <rect x="350" y="20" width="100" height="80" rx="10" fill={nodeFill} stroke={primary} strokeWidth="4" />
            <text x="400" y="65" fill="var(--color-text)" fontSize="16" textAnchor="middle" fontWeight="bold">Remote</text>

            {/* Local Repos */}
            <rect x="150" y="200" width="100" height="80" rx="10" fill={nodeFill} stroke={secondary} strokeWidth="4" />
            <text x="200" y="245" fill="var(--color-text)" fontSize="16" textAnchor="middle" fontWeight="bold">Alice</text>

            <rect x="550" y="200" width="100" height="80" rx="10" fill={nodeFill} stroke={secondary} strokeWidth="4" />
            <text x="600" y="245" fill="var(--color-text)" fontSize="16" textAnchor="middle" fontWeight="bold">Bob</text>

            {/* Connecting lines */}
            <path d="M380 100 L220 200" stroke="var(--color-text-muted)" strokeWidth="3" strokeDasharray="5,5" fill="none" />
            <path d="M420 100 L580 200" stroke="var(--color-text-muted)" strokeWidth="3" strokeDasharray="5,5" fill="none" />
            
            {/* Sync arrows */}
            <path d="M260 150 L270 140 L280 160 Z" fill="var(--color-text-muted)" />
            <path d="M540 150 L530 140 L520 160 Z" fill="var(--color-text-muted)" />
          </svg>
        </div>
      );
    case 'lifecycle':
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
          <svg viewBox="0 0 800 300" width="100%" height="100%">
            <rect x="50" y="100" width="150" height="100" rx="10" fill={nodeFill} stroke="var(--color-border-focus)" strokeWidth="4" />
            <text x="125" y="155" fill="var(--color-text)" fontSize="18" textAnchor="middle" fontWeight="bold">Workspace</text>

            <rect x="325" y="100" width="150" height="100" rx="10" fill={nodeFill} stroke="var(--color-border-focus)" strokeWidth="4" />
            <text x="400" y="155" fill="var(--color-text)" fontSize="18" textAnchor="middle" fontWeight="bold">Staging</text>

            <rect x="600" y="100" width="150" height="100" rx="10" fill={nodeFill} stroke="var(--color-border-focus)" strokeWidth="4" />
            <text x="675" y="155" fill="var(--color-text)" fontSize="18" textAnchor="middle" fontWeight="bold">Local Repo</text>

            <path d="M200 130 L325 130" stroke={primary} strokeWidth="4" fill="none" />
            <polygon points="315,120 325,130 315,140" fill={primary} />
            <text x="262" y="115" fill={primary} fontSize="14" textAnchor="middle" fontWeight="bold">add</text>

            <path d="M475 130 L600 130" stroke={secondary} strokeWidth="4" fill="none" />
            <polygon points="590,120 600,130 590,140" fill={secondary} />
            <text x="537" y="115" fill={secondary} fontSize="14" textAnchor="middle" fontWeight="bold">commit</text>

            <path d="M675 200 L675 250 L125 250 L125 200" stroke="var(--color-text-muted)" strokeWidth="4" fill="none" strokeDasharray="5,5" />
            <polygon points="115,210 125,200 135,210" fill="var(--color-text-muted)" />
            <text x="400" y="275" fill="var(--color-text-muted)" fontSize="14" textAnchor="middle" fontWeight="bold">checkout</text>
          </svg>
        </div>
      );
    case 'setup':
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
          <svg viewBox="0 0 800 300" width="100%" height="100%">
            <rect x="150" y="80" width="500" height="140" rx="10" fill="var(--color-bg-elevated)" stroke={primary} strokeWidth="4" />
            <circle cx="180" cy="110" r="8" fill="var(--color-accent-danger)" />
            <circle cx="210" cy="110" r="8" fill="var(--color-accent-warning)" />
            <circle cx="240" cy="110" r="8" fill="var(--color-accent-success)" />
            
            <text x="180" y="150" fill="var(--color-text)" fontSize="18" fontFamily="monospace">$ git config --global user.name "Alice"</text>
            <text x="180" y="180" fill="var(--color-text)" fontSize="18" fontFamily="monospace">$ git config --global user.email "..."</text>
          </svg>
        </div>
      );
    case 'branching':
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
          <svg viewBox="0 0 800 300" width="100%" height="100%">
            <path d="M100 150 L700 150" stroke={primary} strokeWidth="6" fill="none" />
            <circle cx="100" cy="150" r="16" fill={nodeFill} stroke={primary} strokeWidth="4" />
            <circle cx="300" cy="150" r="16" fill={nodeFill} stroke={primary} strokeWidth="4" />
            <circle cx="500" cy="150" r="16" fill={nodeFill} stroke={primary} strokeWidth="4" />
            <circle cx="700" cy="150" r="16" fill={nodeFill} stroke={primary} strokeWidth="4" />
            <text x="750" y="155" fill="var(--color-text)" fontSize="18" fontWeight="bold">main</text>

            <path d="M300 150 L400 50 L600 50 L700 150" stroke={secondary} strokeWidth="4" fill="none" strokeDasharray="5,5" />
            <circle cx="400" cy="50" r="12" fill={nodeFill} stroke={secondary} strokeWidth="4" />
            <circle cx="600" cy="50" r="12" fill={nodeFill} stroke={secondary} strokeWidth="4" />
            <text x="500" y="30" fill="var(--color-text-muted)" fontSize="16" textAnchor="middle">Feature Flag Integration</text>
          </svg>
        </div>
      );
    case 'remotes':
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
          <svg viewBox="0 0 800 300" width="100%" height="100%">
            <rect x="300" y="50" width="200" height="80" rx="10" fill="var(--color-bg-elevated)" stroke={primary} strokeWidth="4" />
            <text x="400" y="95" fill="var(--color-text)" fontSize="18" textAnchor="middle" fontWeight="bold">upstream (GitHub)</text>

            <rect x="100" y="200" width="200" height="80" rx="10" fill="var(--color-bg-elevated)" stroke={secondary} strokeWidth="4" />
            <text x="200" y="245" fill="var(--color-text)" fontSize="18" textAnchor="middle" fontWeight="bold">origin (Fork)</text>

            <rect x="500" y="200" width="200" height="80" rx="10" fill="var(--color-bg-elevated)" stroke="var(--color-border-focus)" strokeWidth="4" />
            <text x="600" y="245" fill="var(--color-text)" fontSize="18" textAnchor="middle" fontWeight="bold">local (Laptop)</text>

            <path d="M200 200 L300 130" stroke="var(--color-text-muted)" strokeWidth="4" fill="none" />
            <text x="180" y="160" fill="var(--color-text-muted)" fontSize="14">Pull Request</text>

            <path d="M600 200 L400 130" stroke="var(--color-text-muted)" strokeWidth="4" fill="none" strokeDasharray="5,5" />
            <text x="550" y="160" fill="var(--color-text-muted)" fontSize="14">git fetch upstream</text>
          </svg>
        </div>
      );
    case 'reflog':
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
          <svg viewBox="0 0 800 300" width="100%" height="100%">
            <rect x="150" y="50" width="500" height="200" rx="10" fill="var(--color-bg-elevated)" stroke={nodeStroke} strokeWidth="4" />
            <text x="180" y="100" fill="var(--color-text)" fontSize="18" fontFamily="monospace">ab1afef HEAD@{"{"}0{"}"}: commit: fix bug</text>
            <text x="180" y="140" fill="var(--color-text)" fontSize="18" fontFamily="monospace">1a410ef HEAD@{"{"}1{"}"}: reset: moving to HEAD~1</text>
            <text x="180" y="180" fill="var(--color-text-muted)" fontSize="18" fontFamily="monospace">c3d4e5f HEAD@{"{"}2{"}"}: commit: broke prod</text>
            <path d="M160 135 L480 135" stroke="var(--color-accent-danger)" strokeWidth="2" fill="none" />
          </svg>
        </div>
      );
    case 'rebase':
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
          <svg viewBox="0 0 800 300" width="100%" height="100%">
            {/* Main */}
            <path d="M100 200 L500 200" stroke={primary} strokeWidth="4" fill="none" />
            <circle cx="100" cy="200" r="16" fill={nodeFill} stroke={primary} strokeWidth="4" />
            <circle cx="300" cy="200" r="16" fill={nodeFill} stroke={primary} strokeWidth="4" />
            <circle cx="500" cy="200" r="16" fill={nodeFill} stroke={primary} strokeWidth="4" />
            
            {/* Rebased */}
            <path d="M500 200 L600 100 L700 100" stroke={secondary} strokeWidth="4" fill="none" />
            <circle cx="600" cy="100" r="16" fill={nodeFill} stroke={secondary} strokeWidth="4" />
            <circle cx="700" cy="100" r="16" fill={nodeFill} stroke={secondary} strokeWidth="4" />
            
            {/* Faded original branch */}
            <path d="M100 200 L200 100 L300 100" stroke="var(--color-text-muted)" strokeWidth="4" strokeDasharray="5,5" fill="none" />
            <circle cx="200" cy="100" r="16" fill="transparent" stroke="var(--color-text-muted)" strokeWidth="4" strokeDasharray="5,5" />
            <circle cx="300" cy="100" r="16" fill="transparent" stroke="var(--color-text-muted)" strokeWidth="4" strokeDasharray="5,5" />
            
            <text x="500" y="240" fill="var(--color-text)" fontSize="16" textAnchor="middle">New Base</text>
          </svg>
        </div>
      );
    case 'tools':
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
          <svg viewBox="0 0 800 300" width="100%" height="100%">
            {/* Tag */}
            <path d="M500 200 L700 200" stroke={primary} strokeWidth="4" fill="none" />
            <circle cx="500" cy="200" r="16" fill={nodeFill} stroke={primary} strokeWidth="4" />
            <circle cx="700" cy="200" r="16" fill={nodeFill} stroke={primary} strokeWidth="4" />
            <rect x="650" y="130" width="100" height="30" rx="4" fill="var(--color-accent-warning)" />
            <text x="700" y="150" fill="var(--color-bg-base)" fontSize="16" textAnchor="middle" fontWeight="bold">v1.0.0</text>
            <path d="M700 160 L700 184" stroke="var(--color-accent-warning)" strokeWidth="2" fill="none" />

            {/* Cherry-Pick */}
            <path d="M100 250 L300 250" stroke={secondary} strokeWidth="4" fill="none" />
            <circle cx="100" cy="250" r="16" fill={nodeFill} stroke={secondary} strokeWidth="4" />
            <circle cx="300" cy="250" r="16" fill={nodeFill} stroke="var(--color-accent-danger)" strokeWidth="4" />
            
            <circle cx="300" cy="100" r="16" fill={nodeFill} stroke="var(--color-accent-danger)" strokeWidth="4" />
            <path d="M300 230 C 400 150, 200 150, 300 116" stroke="var(--color-text-muted)" strokeWidth="3" strokeDasharray="5,5" fill="none" />
            <polygon points="295,125 300,116 305,125" fill="var(--color-text-muted)" />
          </svg>
        </div>
      );
    case 'interactive-staging':
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
          <svg viewBox="0 0 800 200" width="100%" height="100%">
            <rect x="200" y="30" width="400" height="140" rx="10" fill="var(--color-bg-elevated)" stroke={secondary} strokeWidth="4" />
            <text x="220" y="60" fill="var(--color-text)" fontSize="16" fontFamily="monospace">diff --git a/file.ts b/file.ts</text>
            <text x="220" y="90" fill="var(--color-accent-success)" fontSize="16" fontFamily="monospace">+ const feature = true;</text>
            <text x="220" y="120" fill="var(--color-accent-success)" fontSize="16" fontFamily="monospace">+ console.log(feature);</text>
            <text x="220" y="150" fill="var(--color-text-muted)" fontSize="14" fontFamily="monospace">Stage this hunk [y,n,q,a,d,/,e,?]? y</text>
          </svg>
        </div>
      );
    case 'advanced-search':
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
          <svg viewBox="0 0 800 200" width="100%" height="100%">
            <circle cx="200" cy="100" r="40" fill="transparent" stroke={primary} strokeWidth="6" />
            <path d="M230 130 L280 180" stroke={primary} strokeWidth="8" strokeLinecap="round" />
            <rect x="350" y="60" width="300" height="80" rx="10" fill="var(--color-bg-elevated)" stroke={nodeStroke} strokeWidth="4" />
            <text x="500" y="105" fill="var(--color-accent-warning)" fontSize="18" fontFamily="monospace" textAnchor="middle">git log -S "SECRET_KEY"</text>
          </svg>
        </div>
      );
    case 'rerere':
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
          <svg viewBox="0 0 800 200" width="100%" height="100%">
            <path d="M100 100 L300 100 M200 50 L300 100" stroke={primary} strokeWidth="4" fill="none" />
            <circle cx="300" cy="100" r="16" fill="var(--color-accent-danger)" stroke={primary} strokeWidth="4" />
            <text x="300" y="140" fill="var(--color-text-muted)" fontSize="14" textAnchor="middle">Conflict Recorded</text>
            
            <path d="M500 100 L700 100 M600 50 L700 100" stroke={secondary} strokeWidth="4" fill="none" strokeDasharray="5,5" />
            <circle cx="700" cy="100" r="16" fill="var(--color-accent-success)" stroke={secondary} strokeWidth="4" />
            <text x="700" y="140" fill="var(--color-text-muted)" fontSize="14" textAnchor="middle">Resolved Automatically!</text>
            
            <path d="M350 100 L450 100" stroke="var(--color-text-muted)" strokeWidth="3" fill="none" markerEnd="url(#arrow)" />
          </svg>
        </div>
      );
    case 'config-attributes':
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
          <svg viewBox="0 0 800 200" width="100%" height="100%">
            <rect x="150" y="30" width="200" height="140" rx="10" fill="var(--color-bg-elevated)" stroke={primary} strokeWidth="4" />
            <text x="250" y="60" fill="var(--color-text)" fontSize="16" fontWeight="bold" textAnchor="middle">~/.gitconfig</text>
            <text x="250" y="100" fill="var(--color-text-muted)" fontSize="14" fontFamily="monospace" textAnchor="middle">[user]</text>
            <text x="250" y="130" fill="var(--color-text-muted)" fontSize="14" fontFamily="monospace" textAnchor="middle">name = Pro</text>
            
            <rect x="450" y="30" width="200" height="140" rx="10" fill="var(--color-bg-elevated)" stroke={secondary} strokeWidth="4" />
            <text x="550" y="60" fill="var(--color-text)" fontSize="16" fontWeight="bold" textAnchor="middle">.gitattributes</text>
            <text x="550" y="100" fill="var(--color-text-muted)" fontSize="14" fontFamily="monospace" textAnchor="middle">*.png binary</text>
            <text x="550" y="130" fill="var(--color-text-muted)" fontSize="14" fontFamily="monospace" textAnchor="middle">* text=auto</text>
          </svg>
        </div>
      );
    case 'maintenance':
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
          <svg viewBox="0 0 800 200" width="100%" height="100%">
            <circle cx="200" cy="80" r="12" fill={nodeFill} stroke={nodeStroke} strokeWidth="3" strokeDasharray="3,3" />
            <circle cx="250" cy="120" r="12" fill={nodeFill} stroke={nodeStroke} strokeWidth="3" strokeDasharray="3,3" />
            <circle cx="150" cy="140" r="12" fill={nodeFill} stroke={nodeStroke} strokeWidth="3" strokeDasharray="3,3" />
            <text x="200" y="180" fill="var(--color-text-muted)" fontSize="14" textAnchor="middle">Dangling Objects</text>

            <path d="M350 100 L450 100" stroke="var(--color-accent-warning)" strokeWidth="4" fill="none" markerEnd="url(#arrow)" />
            <text x="400" y="90" fill="var(--color-accent-warning)" fontSize="14" fontFamily="monospace" textAnchor="middle">git gc</text>
            
            <rect x="550" y="50" width="100" height="100" rx="10" fill="var(--color-bg-elevated)" stroke={primary} strokeWidth="4" />
            <text x="600" y="105" fill="var(--color-text)" fontSize="14" textAnchor="middle">packfile</text>
            <text x="600" y="180" fill="var(--color-text-muted)" fontSize="14" textAnchor="middle">Compressed!</text>
          </svg>
        </div>
      );
    case 'internals':
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
          <svg viewBox="0 0 800 200" width="100%" height="100%">
            <rect x="150" y="50" width="120" height="100" rx="8" fill="var(--color-bg-elevated)" stroke={nodeStroke} strokeWidth="3" />
            <text x="210" y="105" fill="var(--color-text)" fontSize="14" textAnchor="middle">Commit</text>
            
            <path d="M270 100 L330 100" stroke="var(--color-text-muted)" strokeWidth="2" fill="none" />
            
            <rect x="330" y="50" width="120" height="100" rx="8" fill="var(--color-bg-elevated)" stroke={nodeStroke} strokeWidth="3" />
            <text x="390" y="105" fill="var(--color-text)" fontSize="14" textAnchor="middle">Tree</text>
            
            <path d="M450 100 L510 60" stroke="var(--color-text-muted)" strokeWidth="2" fill="none" />
            <path d="M450 100 L510 140" stroke="var(--color-text-muted)" strokeWidth="2" fill="none" />
            
            <rect x="510" y="20" width="120" height="70" rx="8" fill="var(--color-bg-elevated)" stroke={primary} strokeWidth="3" />
            <text x="570" y="60" fill="var(--color-accent-primary)" fontSize="14" textAnchor="middle">Blob (file1)</text>
            
            <rect x="510" y="110" width="120" height="70" rx="8" fill="var(--color-bg-elevated)" stroke={primary} strokeWidth="3" />
            <text x="570" y="150" fill="var(--color-accent-primary)" fontSize="14" textAnchor="middle">Blob (file2)</text>
          </svg>
        </div>
      );
    case 'hooks':
    case 'submodules':
    case 'bisect':
      // Fallback simple terminal representation for advanced tools
      return (
        <div style={{ width: '100%', padding: '20px', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', margin: 'var(--spacing-6) 0', border: '1px solid var(--color-border-default)' }}>
           <svg viewBox="0 0 800 200" width="100%" height="100%">
            <rect x="100" y="20" width="600" height="160" rx="10" fill="var(--color-bg-elevated)" stroke={nodeStroke} strokeWidth="4" />
            <circle cx="130" cy="50" r="8" fill="var(--color-accent-danger)" />
            <circle cx="160" cy="50" r="8" fill="var(--color-accent-warning)" />
            <circle cx="190" cy="50" r="8" fill="var(--color-accent-success)" />
            <text x="130" y="100" fill="var(--color-accent-primary)" fontSize="18" fontFamily="monospace">$ git {illustrationId}</text>
            <text x="130" y="140" fill="var(--color-text-muted)" fontSize="16" fontFamily="monospace">Executing automated DevOps pipeline...</text>
          </svg>
        </div>
      );
    default:
      return null;
  }
};

export default ConceptIllustration;
