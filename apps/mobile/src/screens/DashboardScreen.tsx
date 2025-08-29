import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'react-native-lottie';
import { useTheme } from '../hooks/useTheme';
import Logo from '../components/Logo';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }: any) => {
  const { colors } = useTheme();

  const quickStats = [
    { title: 'This Week', value: '5', unit: 'workouts', icon: '🏃‍♂️' },
    { title: 'Total Time', value: '2.5', unit: 'hours', icon: '⏱️' },
    { title: 'Calories', value: '1,250', unit: 'burned', icon: '🔥' },
    { title: 'Streak', value: '7', unit: 'days', icon: '🔥' },
  ];

  const recentAchievements = [
    { title: 'First Workout', description: 'Completed your first chair yoga session', icon: '🎉' },
    { title: 'Week Warrior', description: 'Worked out 5 days this week', icon: '💪' },
    { title: 'Mobility Master', description: 'Improved flexibility by 15%', icon: '🧘‍♀️' },
  ];

  const quickActions = [
    { title: 'Start Workout', icon: '🏃‍♂️', onPress: () => navigation.navigate('Workouts') },
    { title: 'AI Generator', icon: '🤖', onPress: () => navigation.navigate('AI Generator') },
    { title: 'Analytics', icon: '📊', onPress: () => navigation.navigate('Analytics') },
    { title: 'Goals', icon: '🎯', onPress: () => navigation.navigate('Goals') },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Logo variant="white" size="lg" />
          <Text style={styles.welcomeText}>Welcome to Fitness Freedom</Text>
          <Text style={styles.subtitleText}>
            Transform your daily routine with accessible exercises
          </Text>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.section}>
        <Title style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Quick Stats
        </Title>
        <View style={styles.statsGrid}>
          {quickStats.map((stat, index) => (
            <Card key={index} style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statUnit, { color: colors.textSecondary }]}>
                  {stat.unit}
                </Text>
                <Text style={[styles.statTitle, { color: colors.textSecondary }]}>
                  {stat.title}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Title style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Quick Actions
        </Title>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={action.onPress}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Achievements */}
      <View style={styles.section}>
        <Title style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Recent Achievements
        </Title>
        {recentAchievements.map((achievement, index) => (
          <Card key={index} style={[styles.achievementCard, { backgroundColor: colors.surface }]}>
            <Card.Content style={styles.achievementContent}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementText}>
                <Text style={[styles.achievementTitle, { color: colors.textPrimary }]}>
                  {achievement.title}
                </Text>
                <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
                  {achievement.description}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Motivation Section */}
      <View style={styles.section}>
        <Card style={[styles.motivationCard, { backgroundColor: colors.surface }]}>
          <Card.Content style={styles.motivationContent}>
            <Text style={styles.motivationIcon}>💪</Text>
            <Text style={[styles.motivationTitle, { color: colors.textPrimary }]}>
              Fitness Freedom
            </Text>
            <Text style={[styles.motivationText, { color: colors.textSecondary }]}>
              "The only bad workout is the one that didn't happen. Every chair, every moment, every movement counts toward your fitness goals."
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    padding: 15,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statUnit: {
    fontSize: 12,
    marginTop: 2,
  },
  statTitle: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 50) / 2,
    height: 100,
    marginBottom: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  achievementCard: {
    marginBottom: 10,
    elevation: 1,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
  },
  motivationCard: {
    elevation: 2,
  },
  motivationContent: {
    alignItems: 'center',
    padding: 20,
  },
  motivationIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  motivationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  motivationText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default DashboardScreen;
