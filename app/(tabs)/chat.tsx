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
import { Search, Phone, Video, MoreHorizontal, Languages } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { faker } from '@faker-js/faker';

interface ChatPreview {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isTyping: boolean;
}

const generateChats = (): ChatPreview[] => {
  const messages = [
    "Hey! How's your day going?",
    "I love your photos from Japan!",
    "Would you like to practice Spanish together?",
    "That recipe you shared looks amazing!",
    "Let's plan that virtual museum tour!",
    "Your culture sounds so fascinating!",
    "Thanks for teaching me that phrase!",
    "I found a great documentary about your country",
  ];

  return Array.from({ length: 8 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    avatar: `https://picsum.photos/400/400?random=${faker.number.int({ min: 1, max: 1000 })}`,
    lastMessage: faker.helpers.arrayElement(messages),
    timestamp: faker.date.recent().toISOString(),
    unreadCount: faker.number.int({ min: 0, max: 5 }),
    isOnline: faker.datatype.boolean(),
    isTyping: faker.datatype.boolean({ probability: 0.2 }),
  }));
};

export default function ChatScreen() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setChats(generateChats());
  }, []);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Languages size={20} color="#667eea" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MoreHorizontal size={20} color="#667eea" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <View style={styles.quickActionIcon}>
            <Languages size={20} color="#667eea" />
          </View>
          <Text style={styles.quickActionText}>Translation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <View style={styles.quickActionIcon}>
            <Video size={20} color="#667eea" />
          </View>
          <Text style={styles.quickActionText}>Video Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <View style={styles.quickActionIcon}>
            <Phone size={20} color="#667eea" />
          </View>
          <Text style={styles.quickActionText}>Voice Call</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.chatsList} showsVerticalScrollIndicator={false}>
        {filteredChats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatItem}
            onPress={() => router.push(`/chat/${chat.id}`)}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: chat.avatar }} style={styles.avatar} />
              {chat.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{chat.name}</Text>
                <Text style={styles.timestamp}>{formatTimestamp(chat.timestamp)}</Text>
              </View>
              
              <View style={styles.messageRow}>
                <Text
                  style={[
                    styles.lastMessage,
                    chat.isTyping && styles.typingMessage,
                  ]}
                  numberOfLines={1}
                >
                  {chat.isTyping ? 'typing...' : chat.lastMessage}
                </Text>
                
                {chat.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>
                      {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.translateButton}>
        <Languages size={20} color="#ffffff" />
        <Text style={styles.translateButtonText}>Auto Translate</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  searchBox: {
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
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 16,
  },
  quickAction: {
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    backgroundColor: '#667eea20',
    borderRadius: 20,
    padding: 12,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#667eea',
  },
  chatsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  chatItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#999',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginRight: 8,
  },
  typingMessage: {
    color: '#667eea',
    fontStyle: 'italic',
  },
  unreadBadge: {
    backgroundColor: '#667eea',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#ffffff',
  },
  translateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#667eea',
    marginHorizontal: 24,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  translateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#ffffff',
  },
});
