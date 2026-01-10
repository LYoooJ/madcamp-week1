import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';

import { Palette, Shadows, Typography } from '@/constants/ui';
import { useProfile } from '@/contexts/profile-context';

const profileSections = [
  { id: 'profile', title: '프로필', detail: '내 정보 수정 및 공개 범위' },
  { id: 'friends', title: '친구 목록', detail: '함께 읽는 친구들 보기' },
  { id: 'insights', title: '독서 인사이트', detail: '기록 기반 요약 리포트' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { profile } = useProfile();
  const avatarLabel = profile.nickname ? profile.nickname.slice(0, 1) : '?';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>프로필</Text>
          <Link href="/login" style={styles.loginLink}>
            로그인
          </Link>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>{avatarLabel}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.nickname}</Text>
            <Text style={styles.profileMeta}>오늘도 한 페이지, 꾸준한 독서 중</Text>
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>18</Text>
                <Text style={styles.statLabel}>기록</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>6</Text>
                <Text style={styles.statLabel}>완독</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>친구</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>내 정보</Text>
          {profileSections.map((section) => {
            const isProfile = section.id === 'profile';
            return (
              <Pressable
                key={section.id}
                style={styles.sectionCard}
                onPress={() => {
                  if (isProfile) {
                    router.push('/profile-edit');
                  }
                }}
                accessibilityRole={isProfile ? 'button' : undefined}>
                <View>
                  <Text style={styles.sectionCardTitle}>{section.title}</Text>
                  <Text style={styles.sectionCardDetail}>{section.detail}</Text>
                </View>
                <Text style={styles.sectionCardArrow}>›</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>읽기 메모</Text>
          <View style={styles.memoCard}>
            <Text style={styles.memoTitle}>이번 주 목표</Text>
            <Text style={styles.memoBody}>
              토론 전에 2장까지 읽기, 인상 깊었던 문장 3개 기록하기.
            </Text>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  loginLink: {
    fontSize: 13,
    color: Palette.accent,
    fontWeight: '600',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: Palette.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.card,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Palette.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarEmoji: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textSecondary,
    letterSpacing: 1,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  profileMeta: {
    ...Typography.caption,
    marginTop: 4,
  },
  profileStats: {
    flexDirection: 'row',
    marginTop: 12,
  },
  statItem: {
    marginRight: 16,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.accent,
  },
  statLabel: {
    ...Typography.caption,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typography.sectionTitle,
    marginBottom: 10,
  },
  sectionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 12,
  },
  sectionCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  sectionCardDetail: {
    ...Typography.caption,
    marginTop: 4,
  },
  sectionCardArrow: {
    fontSize: 20,
    color: Palette.textTertiary,
  },
  memoCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  memoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
    marginBottom: 8,
  },
  memoBody: {
    ...Typography.body,
  },
});
