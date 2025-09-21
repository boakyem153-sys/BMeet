import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Globe, Heart, MessageCircle, Users } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const features = [
  {
    icon: Globe,
    title: 'Global Connections',
    description: 'Meet friends from every corner of the world',
  },
  {
    icon: Heart,
    title: 'Shared Interests',
    description: 'Connect through common hobbies and passions',
  },
  {
    icon: MessageCircle,
    title: 'Easy Communication',
    description: 'Built-in translation and icebreakers',
  },
  {
    icon: Users,
    title: 'Cultural Exchange',
    description: 'Learn about traditions, food, and music',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [currentFeature, setCurrentFeature] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>BMeet</Text>
            <Text style={styles.tagline}>Where Cultures Connect</Text>
          </View>

          <View style={styles.featureContainer}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <View
                  key={index}
                  style={[
                    styles.featureCard,
                    currentFeature === index && styles.activeFeatureCard,
                  ]}
                >
                  <IconComponent
                    size={48}
                    color={currentFeature === index ? '#667eea' : '#ffffff80'}
                  />
                  <Text
                    style={[
                      styles.featureTitle,
                      currentFeature === index && styles.activeFeatureTitle,
                    ]}
                  >
                    {feature.title}
                  </Text>
                  <Text
                    style={[
                      styles.featureDescription,
                      currentFeature === index && styles.activeFeatureDescription,
                    ]}
                  >
                    {feature.description}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={() => router.push('/(auth)')}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => router.push('/(auth)/sign-in')}
            >
              <Text style={styles.signInText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff90',
    marginTop: 8,
  },
  featureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureCard: {
    alignItems: 'center',
    position: 'absolute',
    opacity: 0.3,
  },
  activeFeatureCard: {
    opacity: 1,
  },
  featureTitle: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#ffffff80',
    marginTop: 16,
    textAlign: 'center',
  },
  activeFeatureTitle: {
    color: '#ffffff',
  },
  featureDescription: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff60',
    marginTop: 8,
    textAlign: 'center',
    maxWidth: width * 0.8,
  },
  activeFeatureDescription: {
    color: '#ffffff90',
  },
  footer: {
    marginBottom: 40,
  },
  getStartedButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#667eea',
  },
  signInButton: {
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff80',
  },
});
