import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Globe, Music, ChefHat, Camera, BookOpen, Users, MapPin, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { faker } from '@faker-js/faker';

const { width } = Dimensions.get('window');

interface CulturalTopic {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'food' | 'music' | 'traditions' | 'language' | 'festivals' | 'art';
  country: string;
  contributors: number;
  isPopular: boolean;
}

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  image: string;
  isJoined: boolean;
}

const categories = [
  { key: 'all', label: 'All', icon: Globe },
  { key: 'food', label: 'Food', icon: ChefHat },
  { key: 'music', label: 'Music', icon: Music },
  { key: 'traditions', label: 'Traditions', icon: BookOpen },
  { key: 'festivals', label: 'Festivals', icon: Users },
  { key: 'art', label: 'Art', icon: Camera },
];

const generateTopics = (): CulturalTopic[] => {
  const titles = [
    'Traditional Japanese Tea Ceremony',
    'Flamenco Dance Origins',
    'Italian Pasta Making',
    'Brazilian Carnival Traditions',
    'Indian Holi Festival',
    'French Wine Culture',
    'Mexican Day of the Dead',
    'Chinese Calligraphy Art',
    'Thai Street Food Culture',
    'Irish Folk Music',
  ];

  const categoryKeys: CulturalTopic['category'][] = ['food', 'music', 'traditions', 'language', 'festivals', 'art'];

  return Array.from({ length: 10 }, (_, index) => ({
    id: faker.string.uuid(),
    title: titles[index] || faker.lorem.words(3),
    description: faker.lorem.sentence(8),
    image: `https://picsum.photos/400/300?random=${faker.number.int({ min: 1, max: 1000 })}`,
    category: faker.helpers.arrayElement(categoryKeys),
    country: faker.location.country(),
    contributors: faker.number.int({ min: 50, max: 500 }),
    isPopular: faker.datatype.boolean({ probability: 0.3 }),
  }));
};

const generateGroups = (): CommunityGroup[] => {
  const groupNames = [
    'Global Food Lovers',
    'Language Exchange Hub',
    'Cultural Photography',
    'Music Around the World',
    'Traditional Arts Circle',
    'Festival Celebrants',
  ];

  return Array.from({ length: 6 }, (_, index) => ({
    id: faker.string.uuid(),
    name: groupNames[index] || faker.company.name(),
    description: faker.lorem.sentence(6),
    members: faker.number.int({ min: 100, max: 5000 }),
    image: `https://picsum.photos/300/200?random=${faker.number.int({ min: 1, max: 1000 })}`,
    isJoined: faker.datatype.boolean(),
  }));
};

export default function CulturalScreen() {
  const router = useRouter();
  const [topics, setTopics] = useState<CulturalTopic[]>([]);
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setTopics(generateTopics());
    setGroups(generateGroups());
  }, []);

  const filteredTopics = topics.filter(topic =>
    selectedCategory === 'all' || topic.category === selectedCategory
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cultural Exchange</Text>
        <Text style={styles.headerSubtitle}>Discover traditions from around the world</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryItem,
                selectedCategory === category.key && styles.activeCategoryItem,
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <IconComponent
                size={20}
                color={selectedCategory === category.key ? '#ffffff' : '#667eea'}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.key && styles.activeCategoryText,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Topics</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.topicsContainer}
          >
            {filteredTopics.slice(0, 5).map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={styles.topicCard}
                onPress={() => router.push(`/cultural-exchange/${topic.id}`)}
              >
                <Image source={{ uri: topic.image }} style={styles.topicImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.topicOverlay}
                />
                <View style={styles.topicContent}>
                  {topic.isPopular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Popular</Text>
                    </View>
                  )}
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <View style={styles.topicMeta}>
                    <MapPin size={12} color="#ffffff80" />
                    <Text style={styles.topicCountry}>{topic.country}</Text>
                  </View>
                  <Text style={styles.topicContributors}>
                    {topic.contributors} contributors
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Groups</Text>
          {groups.map((group) => (
            <TouchableOpacity key={group.id} style={styles.groupCard}>
              <Image source={{ uri: group.image }} style={styles.groupImage} />
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupDescription}>{group.description}</Text>
                <Text style={styles.groupMembers}>{group.members.toLocaleString()} members</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.joinButton,
                  group.isJoined && styles.joinedButton,
                ]}
              >
                <Text
                  style={[
                    styles.joinButtonText,
                    group.isJoined && styles.joinedButtonText,
                  ]}
                >
                  {group.isJoined ? 'Joined' : 'Join'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Cultural Topics</Text>
          <View style={styles.topicsGrid}>
            {filteredTopics.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={styles.gridTopicCard}
                onPress={() => router.push(`/cultural-exchange/${topic.id}`)}
              >
                <Image source={{ uri: topic.image }} style={styles.gridTopicImage} />
                <View style={styles.gridTopicContent}>
                  <Text style={styles.gridTopicTitle} numberOfLines={2}>
                    {topic.title}
                  </Text>
                  <View style={styles.gridTopicMeta}>
                    <MapPin size={10} color="#999" />
                    <Text style={styles.gridTopicCountry}>{topic.country}</Text>
                  </View>
                  <View style={styles.gridTopicFooter}>
                    <Users size={12} color="#667eea" />
                    <Text style={styles.gridTopicContributors}>
                      {topic.contributors}
                    </Text>
                    <Heart size={12} color="#ff6b6b" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
  categoriesContainer: {
    paddingVertical: 16,
  },
  categoriesContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#667eea20',
  },
  activeCategoryItem: {
    backgroundColor: '#667eea',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#667eea',
  },
  activeCategoryText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  topicsContainer: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  topicCard: {
    width: width * 0.7,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  topicImage: {
    width: '100%',
    height: '100%',
  },
  topicOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  topicContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  popularBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: '#ffffff',
  },
  topicTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  topicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  topicCountry: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff80',
  },
  topicContributors: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff80',
  },
  groupCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  groupImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#999',
  },
  joinButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  joinedButton: {
    backgroundColor: '#f0f0f0',
  },
  joinButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#ffffff',
  },
  joinedButtonText: {
    color: '#666',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridTopicCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gridTopicImage: {
    width: '100%',
    height: 100,
  },
  gridTopicContent: {
    padding: 12,
  },
  gridTopicTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  gridTopicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  gridTopicCountry: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#999',
  },
  gridTopicFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gridTopicContributors: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#667eea',
    marginRight: 8,
  },
});
