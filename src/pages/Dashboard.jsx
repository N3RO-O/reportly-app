import React, { useState, useEffect } from 'react';
import { T } from '../styles/tokens';
import { useIsMobile } from '../hooks/useIsMobile';
import Header from '../components/Header';
import { getUserReports, createReport, deleteReport } from '../lib/db';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [creatingReport, setCreatingReport] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadDashboard = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;
      setUser(currentUser);

      if (currentUser) {
        try {
          const userReports = await getUserReports(currentUser.id);
          setReports(userReports);
        } catch (error) {
          console.error('Failed to load reports:', error);
        }
      }

      setLoading(false);
    };

    loadDashboard();
  }, []);

  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!user || !newTitle.trim()) return;

    setCreatingReport(true);
    try {
      const report = await createReport(user.id, newTitle);
      setReports([report, ...reports]);
      setNewTitle('');
      window.location.href = `/report/${report.id}`;
    } catch (error) {
      console.error('Failed to create report:', error);
    } finally {
      setCreatingReport(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Delete this report?')) return;

    try {
      await deleteReport(reportId);
      setReports(reports.filter((r) => r.id !== reportId));
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header isMobile={isMobile} />
        <div style={{ padding: isMobile ? T.space.lg : T.space.xl }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: T.bg.secondary }}>
      <Header isMobile={isMobile} />

      <main style={{
        flex: 1,
        padding: isMobile ? `${T.space.lg} ${T.space.md}` : `${T.space.xl}`,
        maxWidth: isMobile ? '100%' : '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{ marginBottom: isMobile ? T.space.xl : T.space.xxxl }}>
          <h1 style={{
            fontSize: isMobile ? T.size.lg : T.size.xxxl,
            fontWeight: 700,
            marginBottom: isMobile ? T.space.lg : T.space.xl,
            color: T.text.primary,
            margin: 0,
            marginBottom: isMobile ? T.space.lg : T.space.xl,
          }}>
            Your Reports
          </h1>

          <form onSubmit={handleCreateReport} style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr auto' : '1fr auto',
            gap: isMobile ? T.space.sm : T.space.md,
            marginBottom: isMobile ? T.space.xl : T.space.xxl,
          }}>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Report name..."
              style={{
                padding: `${T.space.md} ${T.space.lg}`,
                border: `1px solid ${T.border}`,
                borderRadius: T.radius.md,
                fontSize: isMobile ? T.size.md : T.size.base,
                transition: T.transition,
                minHeight: isMobile ? T.touchTarget : 'auto',
                backgroundColor: T.bg.primary,
              }}
            />
            <button
              type="submit"
              disabled={creatingReport || !newTitle.trim()}
              style={{
                padding: isMobile ? `${T.space.md} ${T.space.lg}` : `${T.space.md} ${T.space.xl}`,
                background: T.primary,
                color: T.text.inverse,
                border: 'none',
                borderRadius: T.radius.md,
                fontSize: isMobile ? T.size.md : T.size.base,
                fontWeight: 600,
                cursor: creatingReport ? 'not-allowed' : 'pointer',
                opacity: creatingReport ? 0.7 : 1,
                transition: T.transition,
                minHeight: isMobile ? T.touchTarget : 'auto',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => !creatingReport && !isMobile && (e.target.style.background = T.primaryHover)}
              onMouseLeave={(e) => !isMobile && (e.target.style.background = T.primary)}
            >
              {isMobile ? '+' : '+ Create'}
            </button>
          </form>
        </div>

        {reports.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: isMobile ? `${T.space.xxl} ${T.space.lg}` : T.space.xxxl,
            color: T.text.secondary,
            background: T.bg.primary,
            borderRadius: T.radius.lg,
          }}>
            <div style={{ fontSize: isMobile ? T.size.lg : T.size.xl, marginBottom: T.space.md }}>
              No reports yet
            </div>
            <p style={{ fontSize: isMobile ? T.size.xs : T.size.sm }}>
              Create your first report to start tracking time
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: isMobile ? T.space.md : T.space.lg,
          }}>
            {reports.map((report) => (
              <div
                key={report.id}
                style={{
                  padding: isMobile ? T.space.md : T.space.lg,
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radius.lg,
                  background: T.bg.primary,
                  boxShadow: T.shadow.sm,
                  transition: T.transition,
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => !isMobile && (e.currentTarget.style.boxShadow = T.shadow.md)}
                onMouseLeave={(e) => !isMobile && (e.currentTarget.style.boxShadow = T.shadow.sm)}
                onClick={() => (window.location.href = `/report/${report.id}`)}
              >
                <h2 style={{
                  fontSize: isMobile ? T.size.md : T.size.lg,
                  fontWeight: 700,
                  marginBottom: isMobile ? T.space.sm : T.space.md,
                  color: T.text.primary,
                  flex: 1,
                  margin: 0,
                  marginBottom: isMobile ? T.space.sm : T.space.md,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {report.title}
                </h2>

                <div style={{
                  fontSize: isMobile ? T.size.xs : T.size.sm,
                  color: T.text.secondary,
                  marginBottom: isMobile ? T.space.md : T.space.md,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: isMobile ? T.space.sm : T.space.md,
                }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: T.space.xs }}>Hours</div>
                    <div style={{ fontSize: isMobile ? T.size.lg : T.size.lg, fontWeight: 700, color: T.text.primary }}>
                      {report.total_hours || 0}h
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: T.space.xs }}>Days</div>
                    <div style={{ fontSize: isMobile ? T.size.lg : T.size.lg, fontWeight: 700, color: T.text.primary }}>
                      {(report.days || []).length}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: isMobile ? T.size.xs : T.size.sm, color: T.text.tertiary, marginBottom: isMobile ? T.space.md : T.space.lg }}>
                  Updated {new Date(report.updated_at).toLocaleDateString()}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteReport(report.id);
                  }}
                  style={{
                    padding: isMobile ? `${T.space.sm} ${T.space.md}` : `${T.space.sm} ${T.space.md}`,
                    background: '#fee2e2',
                    color: T.error,
                    border: `1px solid #fecaca`,
                    borderRadius: T.radius.md,
                    fontSize: isMobile ? T.size.xs : T.size.sm,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: T.transition,
                    minHeight: isMobile ? T.touchTarget : 'auto',
                  }}
                  onMouseEnter={(e) => !isMobile && (e.target.style.background = '#fecaca')}
                  onMouseLeave={(e) => !isMobile && (e.target.style.background = '#fee2e2')}
                >
                  🗑️ {isMobile ? 'Delete' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
