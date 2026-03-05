import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { T } from '../styles/tokens';

export default function Header({ isMobile }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header
      style={{
        background: T.bg.primary,
        borderBottom: `1px solid ${T.border}`,
        padding: isMobile ? `${T.space.md} ${T.space.lg}` : `${T.space.lg} ${T.space.xl}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: T.shadow.sm,
        gap: T.space.md,
      }}
    >
      <h1
        style={{
          fontSize: isMobile ? T.size.lg : T.size.xl,
          fontWeight: 700,
          color: T.text.primary,
          fontFamily: T.font.display,
          margin: 0,
          flex: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {isMobile ? 'RL' : 'Reportly'}
      </h1>

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            width: isMobile ? T.touchTarget : '40px',
            height: isMobile ? T.touchTarget : '40px',
            borderRadius: '50%',
            background: T.bg.secondary,
            border: `1px solid ${T.border}`,
            cursor: 'pointer',
            fontSize: isMobile ? T.size.lg : T.size.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: T.transition,
            padding: 0,
          }}
          onMouseEnter={(e) => !isMobile && (e.target.style.background = T.bg.tertiary)}
          onMouseLeave={(e) => !isMobile && (e.target.style.background = T.bg.secondary)}
        >
          👤
        </button>

        {isMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: T.space.sm,
              background: T.bg.primary,
              border: `1px solid ${T.border}`,
              borderRadius: T.radius.md,
              boxShadow: T.shadow.lg,
              minWidth: isMobile ? 'calc(100vw - 32px)' : '200px',
              maxWidth: '280px',
              zIndex: 1000,
            }}
          >
            <button
              onClick={handleSignOut}
              style={{
                width: '100%',
                padding: `${T.space.md} ${T.space.lg}`,
                textAlign: 'left',
                background: 'transparent',
                border: 'none',
                borderRadius: T.radius.md,
                cursor: 'pointer',
                color: T.text.primary,
                fontSize: isMobile ? T.size.md : T.size.base,
                transition: T.transition,
                minHeight: T.touchTarget,
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => !isMobile && (e.target.style.background = T.bg.secondary)}
              onMouseLeave={(e) => !isMobile && (e.target.style.background = 'transparent')}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
