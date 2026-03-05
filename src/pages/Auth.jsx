import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { T } from '../styles/tokens';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const isMobile = useIsMobile();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const { error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signupError) throw signupError;
        setMessage('Check your email to confirm your account');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        const { error: signinError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signinError) throw signinError;
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryHover} 100%)`,
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? T.space.lg : T.space.lg,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : '400px',
          background: T.bg.primary,
          borderRadius: isMobile ? T.radius.lg : T.radius.xl,
          padding: isMobile ? `${T.space.xxl} ${T.space.lg}` : T.space.xxxl,
          boxShadow: T.shadow.xl,
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? T.size.xxl : T.size.xxxl,
            fontWeight: 700,
            marginBottom: isMobile ? T.space.sm : T.space.md,
            color: T.text.primary,
            fontFamily: T.font.display,
            margin: 0,
            marginBottom: isMobile ? T.space.sm : T.space.md,
          }}
        >
          Reportly
        </h1>
        <p
          style={{
            fontSize: isMobile ? T.size.xs : T.size.sm,
            color: T.text.secondary,
            marginBottom: isMobile ? T.space.lg : T.space.xxxl,
            margin: 0,
            marginBottom: isMobile ? T.space.lg : T.space.xxxl,
          }}
        >
          {isSignup ? 'Create your account' : 'Sign in to your account'}
        </p>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? T.space.md : T.space.lg }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: isMobile ? T.size.xs : T.size.sm,
                fontWeight: 600,
                marginBottom: isMobile ? T.space.sm : T.space.sm,
                color: T.text.primary,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: `${isMobile ? T.space.md : T.space.md} ${T.space.lg}`,
                border: `1px solid ${T.border}`,
                borderRadius: T.radius.md,
                fontSize: isMobile ? T.size.md : T.size.base,
                transition: T.transition,
                minHeight: isMobile ? T.touchTarget : 'auto',
              }}
              onFocus={(e) => (e.target.style.borderColor = T.primary)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: isMobile ? T.size.xs : T.size.sm,
                fontWeight: 600,
                marginBottom: isMobile ? T.space.sm : T.space.sm,
                color: T.text.primary,
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: `${isMobile ? T.space.md : T.space.md} ${T.space.lg}`,
                border: `1px solid ${T.border}`,
                borderRadius: T.radius.md,
                fontSize: isMobile ? T.size.md : T.size.base,
                transition: T.transition,
                minHeight: isMobile ? T.touchTarget : 'auto',
              }}
              onFocus={(e) => (e.target.style.borderColor = T.primary)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
          </div>

          {isSignup && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: isMobile ? T.size.xs : T.size.sm,
                  fontWeight: 600,
                  marginBottom: isMobile ? T.space.sm : T.space.sm,
                  color: T.text.primary,
                }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: `${isMobile ? T.space.md : T.space.md} ${T.space.lg}`,
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radius.md,
                  fontSize: isMobile ? T.size.md : T.size.base,
                  transition: T.transition,
                  minHeight: isMobile ? T.touchTarget : 'auto',
                }}
                onFocus={(e) => (e.target.style.borderColor = T.primary)}
                onBlur={(e) => (e.target.style.borderColor = T.border)}
              />
            </div>
          )}

          {error && (
            <div
              style={{
                padding: isMobile ? T.space.md : T.space.md,
                background: '#fee2e2',
                color: T.error,
                borderRadius: T.radius.md,
                fontSize: isMobile ? T.size.xs : T.size.sm,
              }}
            >
              {error}
            </div>
          )}

          {message && (
            <div
              style={{
                padding: isMobile ? T.space.md : T.space.md,
                background: '#dcfce7',
                color: T.success,
                borderRadius: T.radius.md,
                fontSize: isMobile ? T.size.xs : T.size.sm,
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: `${isMobile ? T.space.md : T.space.md} ${T.space.lg}`,
              background: T.primary,
              color: T.text.inverse,
              border: 'none',
              borderRadius: T.radius.md,
              fontSize: isMobile ? T.size.md : T.size.base,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: T.transition,
              minHeight: isMobile ? T.touchTarget : 'auto',
            }}
            onMouseEnter={(e) => !loading && !isMobile && (e.target.style.background = T.primaryHover)}
            onMouseLeave={(e) => !isMobile && (e.target.style.background = T.primary)}
          >
            {loading ? 'Processing...' : isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div
          style={{
            marginTop: isMobile ? T.space.lg : T.space.xl,
            textAlign: 'center',
            borderTop: `1px solid ${T.border}`,
            paddingTop: isMobile ? T.space.lg : T.space.xl,
          }}
        >
          <p
            style={{
              fontSize: isMobile ? T.size.xs : T.size.sm,
              color: T.text.secondary,
              margin: 0,
              marginBottom: isMobile ? T.space.md : T.space.md,
            }}
          >
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
              setMessage('');
            }}
            style={{
              background: 'none',
              color: T.primary,
              fontSize: isMobile ? T.size.sm : T.size.base,
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              padding: isMobile ? T.space.sm : T.space.sm,
              minHeight: isMobile ? T.touchTarget : 'auto',
              minWidth: isMobile ? T.touchTarget : 'auto',
            }}
            onMouseEnter={(e) => !isMobile && (e.target.style.opacity = 0.7)}
            onMouseLeave={(e) => !isMobile && (e.target.style.opacity = 1)}
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
