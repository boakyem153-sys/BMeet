import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Clock, MapPin, Globe, Heart, X, Sparkles } from 'lucide-react-native';
import { faker } from '@faker-js/faker';

const { width } = Dimensions.get('window');

interface User {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  languages: string[];
  personality: string[];
  avatar: string;
  timeZone: string;
  isOnline: boolean;
  matchPercentage: number;
}

const generateUsers = (): User[] => {
  const interests = ['Travel', 'Music', 'Food', 'Art', 'Sports', 'Technology', 'Photography', 'Reading'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese'];
  const personalities = ['Adventurous', 'Creative', 'Outgoing', 'Thoughtful', 'Humorous', 'Intellectual'];
  
  return Array.from({ length: 10 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    age: faker.number.int({ min: 18, max: 35 }),
    location: `${faker.location.city()}, ${faker.location.country()}`,
    bio: faker.lorem.sentence(12),
    interests: faker.helpers.arrayElements(interests, { min: 2, max: 4 }),
    languages: faker.helpers.arrayElements(languages, { min: 1, max: 3 }),
    personality: faker.helpers.arrayElements(personalities, { min: 2, max: 3 }),
    avatar: `https://picsum.photos/400/400?random=${faker.number.int({ min: 1, max: 1000 })}`,
    timeZone: faker.location.timeZone(),
    isOnline: faker.datatype.boolean(),
    matchPercentage: faker.number.int({ min: 65, max: 98 }),
  }));
};

export default function DiscoverScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  useEffect(() => {
    setUsers(generateUsers());
  }, []);

  const handleLike = () => {
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    } else {
      // Reload more users
      setUsers(generateUsers());
      setCurrentUserIndex(0);
    }
  };

  const handlePass = () => {
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    } else {
      // Reload more users
      setUsers(generateUsers());
      setCurrentUserIndex(0);
    }
  };

  const currentUser = users[currentUserIndex];

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Finding new connections...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.timeZoneButton}>
            <Clock size={20} color="#667eea" />
            <Text style={styles.timeZoneText}>Same Time</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image source={{ uri: currentUser.avatar }} style={styles.cardImage} />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.cardOverlay}
          />

          <View style={styles.cardContent}>
            <View style={styles.matchBadge}>
              <Sparkles size={16} color="#ffffff" />
              <Text style={styles.matchText}>{currentUser.matchPercentage}% Match</Text>
            </View>

            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{currentUser.name}, {currentUser.age}</Text>
                {currentUser.isOnline && <View style={styles.onlineIndicator} />}
              </View>
              
              <View style={styles.locationRow}>
                <MapPin size={16} color="#ffffff80" />
                <Text style={styles.locationText}>{currentUser.location}</Text>
              </View>

              <Text style={styles.bio}>{currentUser.bio}</Text>

              <View style={styles.tagsContainer}>
                <Text style={styles.tagLabel}>Interests:</Text>
                <View style={styles.tagRow}>
                  {currentUser.interests.slice(0, 3).map((interest, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.tagsContainer}>
                <Text style={styles.tagLabel}>Languages:</Text>
                <View style={styles.tagRow}>
                  {currentUser.languages.slice(0, 2).map((language, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{language}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.passButton} onPress={handlePass}>
          <X size={32} color="#ff6b6b" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <Heart size={32} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.icebreakerContainer}>
        <TouchableOpacity style={styles.icebreakerButton}>
          <Globe size={20} color="#667eea" />
          <Text style={styles.icebreakerText}>Cultural Icebreaker</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#667eea',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#1a1a1a',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeZoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  timeZoneText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#667eea',
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  matchBadge: {
    position: 'absolute',
    top: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  matchText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#ffffff',
  },
  userInfo: {
    marginTop: 60,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    marginRight: 8,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff80',
  },
  bio: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff90',
    lineHeight: 22,
    marginBottom: 16,
  },
  tagsContainer: {
    marginBottom: 12,
  },
  tagLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#ffffff80',
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#ffffff20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffffff30',
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#ffffff',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 32,
  },
  passButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  likeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icebreakerContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  icebreakerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#667eea20',
  },
  icebreakerText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#667eea',
  },
});
