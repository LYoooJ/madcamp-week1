import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette, Shadows, Typography } from '@/constants/ui';

const members = [
  { id: 'me', name: '나', emoji: '😊' },
  { id: 'jimin', name: '지민', emoji: '🧑‍🎓' },
  { id: 'sejun', name: '서준', emoji: '👩‍💻' },
  { id: 'sua', name: '수아', emoji: '🧑‍🎨' },
  { id: 'minho', name: '민호', emoji: '👨‍🔬' },
] as const;
// 추후 백엔드 연동 후 DB 연결

type MemberId = (typeof members)[number]['id'];
type ReadingEntry = { date: string; title: string; note: string };

const memberReadingData: Record<MemberId, ReadingEntry[]> = {
  me: [
    { date: '2026-01-03', title: '일구팔사', note: '1부 시작' },
    { date: '2026-01-08', title: '일구팔사', note: '메모 공유' },
    { date: '2026-01-19', title: '사피엔스', note: '2장 완료' },
  ],
  jimin: [
    { date: '2026-01-05', title: '일구팔사', note: '밑줄 기록' },
    { date: '2026-01-12', title: '위대한 개츠비', note: '토론 메모' },
    { date: '2026-01-25', title: '사피엔스', note: '정리 완료' },
  ],
  sejun: [
    { date: '2026-01-08', title: '일구팔사', note: '챕터 요약' },
    { date: '2026-01-15', title: '사피엔스', note: '핵심 인사이트' },
  ],
  sua: [
    { date: '2026-01-03', title: '위대한 개츠비', note: '감상 기록' },
    { date: '2026-01-22', title: '사피엔스', note: '토론 준비' },
  ],
  minho: [
    { date: '2026-01-12', title: '일구팔사', note: '중간 체크' },
    { date: '2026-01-19', title: '위대한 개츠비', note: '감상문' },
  ],
};
// 추후 백엔드 연동 후 DB 연결

export default function CalendarScreen() {
  const [selectedMemberId, setSelectedMemberId] = useState<MemberId>('me');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(3);

  const year = currentMonth.getFullYear();
  const monthIndex = currentMonth.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startOffset = new Date(year, monthIndex, 1).getDay();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === monthIndex;
  const todayDate = isCurrentMonth ? today.getDate() : null;

  const calendarCells = Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - startOffset + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return { key: `empty-${index}`, day: null };
    }
    return { key: `day-${dayNumber}`, day: dayNumber };
  });

  const readingMap = useMemo(() => {
    const entries = memberReadingData[selectedMemberId] ?? [];
    const map = new Map<number, { title: string; note: string; count: number }>();
    entries.forEach((entry: ReadingEntry) => {
      const [entryYear, entryMonth, entryDay] = entry.date.split('-').map(Number);
      if (entryYear === year && entryMonth === monthIndex + 1) {
        const existing = map.get(entryDay);
        if (existing) {
          map.set(entryDay, { ...existing, count: existing.count + 1 });
        } else {
          map.set(entryDay, { title: entry.title, note: entry.note, count: 1 });
        }
      }
    });
    return map;
  }, [selectedMemberId, year, monthIndex]);

  const selectedEntry = selectedDay ? readingMap.get(selectedDay) : null;
  const monthLabel = `${year}년 ${monthIndex + 1}월`;

  const moveMonth = (direction: 'prev' | 'next') => {
    const nextMonth = direction === 'prev' ? monthIndex - 1 : monthIndex + 1;
    setCurrentMonth(new Date(year, nextMonth, 1));
    setSelectedDay(null);
  };

  const readingCount = readingMap.size;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>읽기 캘린더</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.memberRow}>
          {members.map((member) => {
            const isActive = member.id === selectedMemberId;
            return (
              <Pressable
                key={member.id}
                onPress={() => setSelectedMemberId(member.id)}
                style={styles.memberItem}
                accessibilityRole="button">
                <View
                  style={[
                    styles.memberAvatar,
                    isActive && styles.memberAvatarActive,
                    !isActive && styles.memberAvatarInactive,
                  ]}>
                  <Text style={[styles.memberInitial, isActive && styles.memberInitialActive]}>
                    {member.emoji}
                  </Text>
                </View>
                <Text style={[styles.memberName, isActive && styles.memberNameActive]}>
                  {member.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.monthRow}>
          <Pressable
            onPress={() => moveMonth('prev')}
            accessibilityRole="button"
            style={styles.monthNavButton}>
            <Text style={styles.monthNavText}>‹</Text>
          </Pressable>
          <Text style={styles.monthTitle}>{monthLabel}</Text>
          <Pressable
            onPress={() => moveMonth('next')}
            accessibilityRole="button"
            style={styles.monthNavButton}>
            <Text style={styles.monthNavText}>›</Text>
          </Pressable>
        </View>

        <View style={styles.weekRow}>
          {['일', '월', '화', '수', '목', '금', '토'].map((label) => (
            <Text key={label} style={styles.weekLabel}>
              {label}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {calendarCells.map((cell) => {
            if (!cell.day) {
              return <View key={cell.key} style={styles.dayCell} pointerEvents="none" />;
            }
            const entry = readingMap.get(cell.day);
            const isSelected = cell.day === selectedDay;
            const isToday = todayDate === cell.day;
            return (
              <Pressable
                key={cell.key}
                style={[
                  styles.dayCell,
                  isSelected && styles.dayCellSelected,
                ]}
                onPress={() => setSelectedDay(cell.day)}
                accessibilityRole="button">
                <View style={styles.dayHeader}>
                  {isToday ? (
                    <View style={styles.todayCircle}>
                      <Text
                        style={[
                          styles.dayText,
                          styles.dayTextToday,
                          isSelected && styles.dayTextSelected,
                        ]}>
                        {cell.day}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                      {cell.day}
                    </Text>
                  )}
                </View>
                <View style={styles.dayContent}>
                  {entry ? (
                    <View style={styles.readingBadge}>
                      <View style={styles.readingSlot}>
                        <Text style={styles.readingSlotText} numberOfLines={2}>
                          {entry.title}
                        </Text>
                      </View>
                      {entry.count > 1 && <View style={styles.readingStack} />}
                    </View>
                  ) : (
                    <View style={styles.emptyBadge} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>
            {selectedDay ? `${monthIndex + 1}월 ${selectedDay}일` : '날짜를 선택해 주세요'}
          </Text>
          {selectedEntry ? (
            <View style={styles.detailContent}>
              <Text style={styles.detailBook}>{selectedEntry.title}</Text>
              <Text style={styles.detailNote}>{selectedEntry.note}</Text>
            </View>
          ) : (
            <Text style={styles.detailEmpty}>선택한 날짜에 기록이 없어요.</Text>
          )}
        </View>

        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryTitle}>이번 달 기록</Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{readingCount}</Text>
                <Text style={styles.summaryLabel}>기록한 날</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>
                  {Math.max(1, Math.round(readingCount / 3))}
                </Text>
                <Text style={styles.summaryLabel}>참여한 책</Text>
              </View>
            </View>
          </View>
          <Text style={styles.summaryMonth}>{monthIndex + 1}월</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  container: {
    padding: 22,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 22,
  },
  memberRow: {
    paddingVertical: 2,
    paddingRight: 6,
    marginBottom: 22,
  },
  memberItem: {
    alignItems: 'center',
    marginRight: 10,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  memberAvatarInactive: {
    borderWidth: 1,
    borderColor: Palette.border,
  },
  memberAvatarActive: {
    borderWidth: 2,
    borderColor: Palette.accent,
    backgroundColor: Palette.accentSoft,
  },
  memberInitial: {
    fontSize: 18,
    color: Palette.textSecondary,
    fontWeight: '600',
  },
  memberInitialActive: {
    color: Palette.textPrimary,
  },
  memberName: {
    fontSize: 11,
    color: Palette.textTertiary,
  },
  memberNameActive: {
    color: Palette.textPrimary,
    fontWeight: '600',
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  monthNavButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  monthNavText: {
    fontSize: 18,
    color: Palette.textSecondary,
    fontWeight: '600',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  weekLabel: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 12,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 0.85,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
    borderRadius: 12,
    paddingTop: 6,
    paddingBottom: 6,
  },
  dayHeader: {
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellSelected: {
    backgroundColor: Palette.accentSoft,
  },
  dayText: {
    color: Palette.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  dayTextToday: {
    color: Palette.accent,
  },
  todayCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.accentSoft,
  },
  dayTextSelected: {
    color: Palette.accent,
    fontWeight: '600',
  },
  dayPlaceholder: {
    width: 20,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.border,
    opacity: 0.6,
  },
  readingBadge: {
    alignItems: 'center',
  },
  readingSlot: {
    width: 36,
    minHeight: 28,
    borderRadius: 8,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  readingSlotText: {
    fontSize: 8,
    color: Palette.textSecondary,
    textAlign: 'center',
    lineHeight: 10,
  },
  readingStack: {
    marginTop: 4,
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.accentSoft,
  },
  emptyBadge: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.border,
    opacity: 0.5,
  },
  detailCard: {
    marginTop: 14,
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.card,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  detailContent: {
    marginTop: 10,
  },
  detailBook: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  detailNote: {
    marginTop: 6,
    fontSize: 12,
    color: Palette.textSecondary,
  },
  detailEmpty: {
    marginTop: 8,
    fontSize: 12,
    color: Palette.textTertiary,
  },
  summaryCard: {
    marginTop: 28,
    backgroundColor: Palette.surface,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.card,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  summaryStats: {
    flexDirection: 'row',
    marginTop: 10,
  },
  summaryItem: {
    marginRight: 18,
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  summaryLabel: {
    ...Typography.caption,
  },
  summaryMonth: {
    fontSize: 12,
    color: Palette.textTertiary,
  },
});
