import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, MessageCircle, MapPin, Clock, Filter } from 'lucide-react-native';
import { faker } from '@faker-js/faker';

interface Match {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  interests: string[];
  lastSeen: string;
  isOnline: boolean;
  matchPercentage: number;
  commonInterests: string[];
}

const generateMatches = (): Match[] => {
  const interests = ['Travel', 'Music', 'Food', 'Art', 'Sports', 'Technology', 'Photography', 'Reading'];
  
  return Array.from({ length: 12 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    age: faker.number.int({ min: 18, max: 35 }),
    location: `${faker.location.city()}, ${faker.location.country()}`,
    avatar: `https://picsum.photos/400/400?random=${faker.number.int({ min: 1, max: 1000 })}`,
    interests: faker.helpers.arrayElements(interests, { min: 2, max: 4 }),
    lastSeen: faker.date.recent().toLocaleDateString(),
    isOnline: faker.datatype.boolean(),
    matchPercentage: faker.number.int({ min: 70, max: 98 }),
    commonInterests: faker.helpers.arrayElements(interests, { min: 1, max: 3 }),
  }));
};

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, online, recent

  useEffect(() => {
    setMatches(generateMatches());
  }, []);

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         match.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filterBy) {
      case 'online':
        return match.isOnline;
      case 'recent':
        return new Date(match.lastSeen) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      default:
        return true;
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Matches</Text>
        <Text style={styles.headerSubtitle}>{matches.length} people matched with you</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search matches..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#667eea" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterTabs}>
        {[
          { key: 'all', label: 'All' },
          { key: 'online', label: 'Online' },
          { key: 'recent', label: 'Recent' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.filterTab,
              filterBy === tab.key && styles.activeFilterTab,
            ]}
            onPress={() => setFilterBy(tab.key)}
          >
            <Text
              style={[
                styles.filterTabText,
                filterBy === tab.key && styles.activeFilterTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.matchesList} showsVerticalScrollIndicator={false}>
        {filteredMatches.map((match) => (
          <TouchableOpacity key={match.id} style={styles.matchCard}>
            <View style={styles.matchImageContainer}>
              <Image source={{ uri: match.avatar }} style={styles.matchImage} />
              {match.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            
            <View style={styles.matchInfo}>
              <View style={styles.matchHeader}>
                <Text style={styles.matchName}>{match.name}, {match.age}</Text>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchPercentage}>{match.matchPercentage}%</Text>
                </View>
              </View>
              
              <View style={styles.locationRow}>
                <MapPin size={14} color="#999" />
                <Text style={styles.locationText}>{match.location}</Text>
              </View>
              
              <View style={styles.commonInterests}>
                <Text style={styles.commonInterestsLabel}>Common interests:</Text>
                <Text style={styles.commonInterestsText}>
                  {match.commonInterests.join(', ')}
                </Text>
              </View>
              
              <View style={styles.lastSeenRow}>
                <Clock size={12} color="#999" />
                <Text style={styles.lastSeenText}>
                  {match.isOnline ? 'Online now' : `Last seen ${match.lastSeen}`}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.messageButton}>
              <MessageCircle size={20} color="#667eea" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#999',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#1a1a1a',
  },
  filterButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  activeFilterTab: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#999',
  },
  activeFilterTabText: {
    color: '#ffffff',
  },
  matchesList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  matchCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  matchImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  matchImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  matchInfo: {
    flex: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  matchName: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
  },
  matchBadge: {
    backgroundColor: '#667eea20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  matchPercentage: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#667eea',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#999',
  },
  commonInterests: {
    marginBottom: 6,
  },
  commonInterestsLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#999',
    marginBottom: 2,
  },
  commonInterestsText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#667eea',
  },
  lastSeenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastSeenText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#999',
  },
  messageButton: {
    backgroundColor: '#667eea20',
    borderRadius: 20,
    padding: 10,
    marginLeft: 12,
  },
});
