import React, { createContext, useContext, useMemo, useState } from 'react';
import { ImageSourcePropType } from 'react-native';

export type CalendarRecord = {
  date: string;
  title: string;
  note: string;
  cover: ImageSourcePropType;
};

type CalendarContextValue = {
  records: Record<string, CalendarRecord>;
  addRecord: (record: CalendarRecord) => void;
};

const CalendarContext = createContext<CalendarContextValue | undefined>(undefined);

export function CalendarRecordsProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<Record<string, CalendarRecord>>({});

  const addRecord = (record: CalendarRecord) => {
    setRecords((prev) => ({ ...prev, [record.date]: record }));
  };

  const value = useMemo(() => ({ records, addRecord }), [records]);

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendarRecords() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarRecords must be used within CalendarRecordsProvider');
  }
  return context;
}
