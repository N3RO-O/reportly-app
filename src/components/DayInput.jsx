import React, { useEffect, useState } from 'react';
import { T } from '../styles/tokens';
import { isFutureDate, getDayOfWeek, getNextDay, generateAutoDay } from '../utils/helpers';

export default function DayInput({ 
  reportId,
  day, 
  dayIndex,
  nextDay,
  onUpdate, 
  onAutoGenerate,
  isMobile 
}) {
  const [hasChanges, setHasChanges] = useState(false);
  const isFuture = isFutureDate(day.date);
  const dayOfWeek = getDayOfWeek(day.date);
  const dateObj = new Date(day.date + 'T00:00:00');
  const dateNum = dateObj.getDate();

  const handleHoursChange = (hours) => {
    const updated = { ...day, hours: parseFloat(hours) || 0 };
    onUpdate(dayIndex, updated);
    setHasChanges(true);

    // Auto-generate next day if:
    // 1. User just entered hours (> 0)
    // 2. Next day doesn't exist
    // 3. Current day is not a holiday
    // 4. Next day is not in the future
    if (hours > 0 && !nextDay && !day.holiday && !isFutureDate(getNextDay(day.date))) {
      const newDay = generateAutoDay(getNextDay(day.date));
      onAutoGenerate(newDay);
    }
  };

  const handleTasksChange = (tasks) => {
    const updated = { ...day, tasks };
    onUpdate(dayIndex, updated);
    setHasChanges(true);
  };

  const handleHolidayChange = (holiday) => {
    const updated = { ...day, holiday };
    if (holiday) {
      updated.hours = 0;
      updated.tasks = '';
    }
    onUpdate(dayIndex, updated);
    setHasChanges(true);
  };

  return (
    <div
      style={{
        position: 'relative',
        padding: isMobile ? T.space.lg : T.space.lg,
        border: `1px solid ${T.border}`,
        borderRadius: isMobile ? T.radius.lg : T.radius.lg,
        background: T.bg.primary,
        boxShadow: T.shadow.sm,
        transition: T.transition,
        opacity: isFuture ? 0.6 : 1,
      }}
    >
      {isFuture && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: T.bg.overlay,
            borderRadius: T.radius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '28px' : '32px',
            zIndex: 10,
          }}
        >
          🔒
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: T.space.lg,
          gap: T.space.md,
        }}
      >
        <div>
          <div
            style={{
              fontSize: isMobile ? T.size.xxl : T.size.xxxl,
              fontWeight: 700,
              color: T.text.primary,
              lineHeight: 1,
            }}
          >
            {dateNum}
          </div>
          <div
            style={{
              fontSize: isMobile ? T.size.xs : T.size.sm,
              color: T.text.secondary,
              fontWeight: 500,
              marginTop: T.space.xs,
            }}
          >
            {dayOfWeek}
          </div>
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: T.space.sm,
            cursor: isFuture ? 'not-allowed' : 'pointer',
            fontSize: isMobile ? T.size.xs : T.size.sm,
            color: T.text.secondary,
            minHeight: T.touchTarget,
            minWidth: T.touchTarget,
            justifyContent: 'center',
            padding: T.space.sm,
          }}
        >
          <input
            type="checkbox"
            checked={day.holiday || false}
            onChange={(e) => handleHolidayChange(e.target.checked)}
            disabled={isFuture}
            style={{
              width: '18px',
              height: '18px',
              cursor: isFuture ? 'not-allowed' : 'pointer',
              accent: T.primary,
            }}
          />
          {!isMobile && 'Holiday'}
        </label>
      </div>

      {!day.holiday && (
        <>
          <div style={{ marginBottom: T.space.md }}>
            <label
              style={{
                display: 'block',
                fontSize: T.size.xs,
                fontWeight: 600,
                marginBottom: T.space.sm,
                color: T.text.primary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Hours Worked
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={day.hours || ''}
              onChange={(e) => handleHoursChange(e.target.value)}
              disabled={isFuture}
              placeholder="0"
              style={{
                width: '100%',
                padding: `${T.space.md} ${T.space.md}`,
                border: `1px solid ${T.border}`,
                borderRadius: T.radius.md,
                fontSize: isMobile ? T.size.md : T.size.base,
                transition: T.transition,
                backgroundColor: isFuture ? T.bg.tertiary : T.bg.primary,
                minHeight: isMobile ? T.touchTarget : 'auto',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: T.size.xs,
                fontWeight: 600,
                marginBottom: T.space.sm,
                color: T.text.primary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Tasks Completed
            </label>
            <textarea
              value={day.tasks || ''}
              onChange={(e) => handleTasksChange(e.target.value)}
              disabled={isFuture}
              placeholder="What did you work on?"
              style={{
                width: '100%',
                padding: `${T.space.md} ${T.space.md}`,
                border: `1px solid ${T.border}`,
                borderRadius: T.radius.md,
                fontSize: isMobile ? T.size.sm : T.size.sm,
                fontFamily: T.font.body,
                lineHeight: T.lineHeight.normal,
                minHeight: isMobile ? '100px' : '80px',
                resize: 'vertical',
                backgroundColor: isFuture ? T.bg.tertiary : T.bg.primary,
                color: isFuture ? T.text.tertiary : T.text.primary,
              }}
            />
          </div>
        </>
      )}

      {hasChanges && (
        <div
          style={{
            marginTop: T.space.md,
            fontSize: T.size.xs,
            color: T.accent,
            fontStyle: 'italic',
          }}
        >
          ⚡ Auto-saving...
        </div>
      )}
    </div>
  );
}
