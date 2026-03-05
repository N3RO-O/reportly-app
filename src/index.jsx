import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Auth from './pages/Auth';
import { supabase } from './lib/supabase';
import { T } from './styles/tokens';
import './styles/global.css';

function Root() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: T.bg.primary,
          fontFamily: T.font.body,
          fontSize: '14px',
          color: T.text.secondary,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: `2px solid ${T.border}`,
              borderTopColor: T.primary,
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 12px',
            }}
          />
          Loading...
        </div>
      </div>
    );
  }

  return session ? <App /> : <Auth />;
}

createRoot(document.getElementById('root')).render(<Root />);
