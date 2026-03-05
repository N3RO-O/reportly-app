import { useEffect, useRef, useState } from 'react';
import { debounce } from '../utils/helpers';

export function useAutoSave(data, onSave, delay = 900) {
  const [saveStatus, setSaveStatus] = useState('idle');
  const saveTimeoutRef = useRef(null);

  const debouncedSave = useRef(
    debounce(async (dataToSave) => {
      setSaveStatus('saving');
      try {
        await onSave(dataToSave);
        setSaveStatus('saved');
        saveTimeoutRef.current = setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('idle');
      }
    }, delay)
  ).current;

  useEffect(() => {
    setSaveStatus('unsaved');
    debouncedSave(data);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, debouncedSave]);

  return saveStatus;
}
