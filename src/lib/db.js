import { supabase } from './supabase';

export async function createReport(userId, title) {
  const { data, error } = await supabase
    .from('reports')
    .insert([{
      user_id: userId,
      title,
      days: [],
      status: 'active',
      total_hours: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getReport(reportId) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserReports(userId) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateReport(reportId, updates) {
  const { data, error } = await supabase
    .from('reports')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reportId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteReport(reportId) {
  const { error } = await supabase
    .from('reports')
    .update({ status: 'archived' })
    .eq('id', reportId);

  if (error) throw error;
}

export async function addDayToReport(reportId, day) {
  const report = await getReport(reportId);
  const updatedDays = [...(report.days || []), day];
  const totalHours = updatedDays.reduce((sum, d) => sum + (d.hours || 0), 0);

  return updateReport(reportId, {
    days: updatedDays,
    total_hours: totalHours,
  });
}

export async function updateDayInReport(reportId, dayIndex, updatedDay) {
  const report = await getReport(reportId);
  const updatedDays = [...(report.days || [])];
  updatedDays[dayIndex] = updatedDay;
  const totalHours = updatedDays.reduce((sum, d) => sum + (d.hours || 0), 0);

  return updateReport(reportId, {
    days: updatedDays,
    total_hours: totalHours,
  });
}

export async function getSharedReport(shareId) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('share_id', shareId)
    .single();

  if (error) throw error;
  return data;
}
