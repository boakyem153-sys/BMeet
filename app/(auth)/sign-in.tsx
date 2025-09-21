import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Mail, Lock } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Sign In Failed', error.message);
    }
    // On success, the AuthContext will handle redirection
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey.</Text>

          <View style={styles.inputContainer}>
            <Mail size={20} color="#ffffff80" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#ffffff60"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#ffffff80" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#ffffff60"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#667eea" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up')}>
            <Text style={styles.switchText}>
              Don't have an account? <Text style={styles.linkText}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    padding: 8,
  },
  content: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff90',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff20',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffffff30',
  },
  inputIcon: {
    paddingLeft: 16,
  },
  textInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#667eea',
  },
  switchText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff80',
    textAlign: 'center',
  },
  linkText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#ffffff',
  },
});
