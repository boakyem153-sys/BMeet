import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Mail, UserPlus } from 'lucide-react-native';

export default function AuthScreen() {
  const router = useRouter();

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
            <Text style={styles.title}>Join BMeet</Text>
            <Text style={styles.subtitle}>
              Start your journey to meet new friends and explore cultures from around the world.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/(auth)/sign-up')}
            >
              <UserPlus size={20} color="#667eea" />
              <Text style={styles.buttonText}>Sign Up with Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.signInButton]}
              onPress={() => router.push('/(auth)/sign-in')}
            >
              <Mail size={20} color="#ffffff" />
              <Text style={[styles.buttonText, styles.signInButtonText]}>
                Sign In with Email
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text style={styles.linkText}>Terms of Service</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff90',
    textAlign: 'center',
    maxWidth: '90%',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 30,
    gap: 12,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#667eea',
  },
  signInButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffffff80',
  },
  signInButtonText: {
    color: '#ffffff',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff80',
    textAlign: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});
