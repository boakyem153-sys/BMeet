import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  Settings,
  Shield,
  Globe,
  Heart,
  MessageCircle,
  Camera,
  Edit,
  MapPin,
  Star,
  Award,
  Users,
  LogOut,
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const settingsItems = [
  {
    icon: Shield,
    title: 'Privacy & Safety',
    subtitle: 'Control who can see your profile',
    hasSwitch: false,
  },
  {
    icon: Globe,
    title: 'Auto Translation',
    subtitle: 'Automatically translate messages',
    hasSwitch: true,
    value: true,
  },
  {
    icon: MessageCircle,
    title: 'Notifications',
    subtitle: 'Manage your notification preferences',
    hasSwitch: false,
  },
  {
    icon: Heart,
    title: 'Matching Preferences',
    subtitle: 'Update your matching criteria',
    hasSwitch: false,
  },
];

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [interests, setInterests] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [personality, setPersonality] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (profile) {
        setLoading(true);
        try {
          const [
            { data: interestData },
            { data: languageData },
            { data: personalityData },
          ] = await Promise.all([
            supabase.from('user_interests').select('interest').eq('user_id', profile.id),
            supabase.from('user_languages').select('language').eq('user_id', profile.id),
            supabase.from('user_personality_traits').select('trait').eq('user_id', profile.id),
          ]);
          
          setInterests(interestData?.map(i => i.interest) || []);
          setLanguages(languageData?.map(l => l.language) || []);
          setPersonality(personalityData?.map(p => p.trait) || []);

        } catch (error: any) {
          Alert.alert('Error fetching profile details', error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileDetails();
  }, [profile]);

  if (loading || !profile) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#667eea" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={24} color="#ffffff" />
            </TouchableOpacity>
            
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: profile.avatar_url || 'https://picsum.photos/400/400?random=100' }} style={styles.profileImage} />
              <View style={styles.verifiedBadge}>
                <Shield size={16} color="#ffffff" />
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color="#667eea" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.profileName}>{profile.full_name}, {profile.age}</Text>
            
            <View style={styles.locationRow}>
              <MapPin size={16} color="#ffffff80" />
              <Text style={styles.locationText}>{profile.location || 'Unknown location'}</Text>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>47</Text>
                <Text style={styles.statLabel}>Matches</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>23</Text>
                <Text style={styles.statLabel}>Chats</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={styles.ratingRow}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.statNumber}>4.8</Text>
                </View>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <TouchableOpacity style={styles.editButton}>
                <Edit size={16} color="#667eea" />
              </TouchableOpacity>
            </View>
            <Text style={styles.bio}>{profile.bio || 'No bio yet.'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.tagsContainer}>
              {interests.map((interest, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.tagsContainer}>
              {languages.map((language, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{language}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personality</Text>
            <View style={styles.tagsContainer}>
              {personality.map((trait, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{trait}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cultural Achievements</Text>
            <View style={styles.achievementsContainer}>
              <View style={styles.achievementItem}>
                <Award size={20} color="#FFD700" />
                <Text style={styles.achievementText}>Cultural Ambassador</Text>
              </View>
              <View style={styles.achievementItem}>
                <Users size={20} color="#667eea" />
                <Text style={styles.achievementText}>Community Builder</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {settingsItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity key={index} style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <IconComponent size={20} color="#667eea" />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  {item.hasSwitch ? (
                    <Switch
                      value={autoTranslate}
                      onValueChange={setAutoTranslate}
                      trackColor={{ false: '#f0f0f0', true: '#667eea' }}
                      thumbColor={autoTranslate ? '#ffffff' : '#f4f3f4'}
                    />
                  ) : (
                    <View style={styles.settingArrow}>
                      <Text style={styles.arrowText}>›</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <LogOut size={20} color="#ff6b6b" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 32,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  settingsButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 1,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 8,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 24,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff80',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff20',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#ffffff30',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff80',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
  },
  editButton: {
    padding: 4,
  },
  bio: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#667eea20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#667eea30',
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#667eea',
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  achievementText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#1a1a1a',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    backgroundColor: '#667eea20',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#999',
  },
  settingArrow: {
    padding: 4,
  },
  arrowText: {
    fontSize: 20,
    color: '#999',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b6b20',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginTop: 16,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#ff6b6b',
  },
});
