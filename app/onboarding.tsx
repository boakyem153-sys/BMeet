import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const interests = [
  'Travel', 'Music', 'Food', 'Art', 'Sports', 'Technology',
  'Photography', 'Reading', 'Gaming', 'Fitness', 'Movies', 'Dancing',
  'Cooking', 'Nature', 'Fashion', 'Languages', 'History', 'Science',
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi',
  'Dutch', 'Swedish', 'Norwegian', 'Finnish', 'Turkish', 'Polish',
];

const personalityTraits = [
  'Adventurous', 'Creative', 'Outgoing', 'Thoughtful', 'Humorous',
  'Intellectual', 'Spontaneous', 'Artistic', 'Athletic', 'Caring',
  'Ambitious', 'Relaxed', 'Curious', 'Optimistic', 'Independent',
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bio: '',
    interests: [] as string[],
    languages: [] as string[],
    personality: [] as string[],
    location: '',
  });

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      if (!session) {
        Alert.alert('Error', 'You must be logged in to create a profile.');
        router.replace('/(auth)');
        return;
      }

      setLoading(true);
      try {
        // 1. Update the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.name,
            age: parseInt(formData.age) || null,
            bio: formData.bio,
            location: formData.location,
          })
          .eq('id', session.user.id);

        if (profileError) throw profileError;

        // 2. Clear existing associations
        await Promise.all([
          supabase.from('user_interests').delete().eq('user_id', session.user.id),
          supabase.from('user_languages').delete().eq('user_id', session.user.id),
          supabase.from('user_personality_traits').delete().eq('user_id', session.user.id),
        ]);

        // 3. Insert new associations
        const interestData = formData.interests.map(interest => ({ user_id: session.user.id, interest }));
        const languageData = formData.languages.map(language => ({ user_id: session.user.id, language }));
        const personalityData = formData.personality.map(trait => ({ user_id: session.user.id, trait }));

        const { error: interestError } = await supabase.from('user_interests').insert(interestData);
        if (interestError) throw interestError;

        const { error: languageError } = await supabase.from('user_languages').insert(languageData);
        if (languageError) throw languageError;

        const { error: personalityError } = await supabase.from('user_personality_traits').insert(personalityData);
        if (personalityError) throw personalityError;

        Alert.alert('Welcome to BMeet!', 'Your profile has been created successfully.', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') },
        ]);

      } catch (error: any) {
        Alert.alert('Error saving profile', error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      // Cannot go back from onboarding if logged in
    }
  };

  const toggleSelection = (item: string, field: 'interests' | 'languages' | 'personality') => {
    const currentItems = formData[field];
    if (currentItems.includes(item)) {
      setFormData({
        ...formData,
        [field]: currentItems.filter(i => i !== item),
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...currentItems, item],
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Tell us about yourself</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter your name"
                placeholderTextColor="#ffffff60"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.textInput}
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
                placeholder="Enter your age"
                placeholderTextColor="#ffffff60"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                placeholder="Enter your city, country"
                placeholderTextColor="#ffffff60"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.bio}
                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                placeholder="Tell us a bit about yourself..."
                placeholderTextColor="#ffffff60"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What are your interests?</Text>
            <Text style={styles.stepSubtitle}>Select all that apply</Text>
            <ScrollView style={styles.selectionContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.selectionGrid}>
                {interests.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    style={[
                      styles.selectionItem,
                      formData.interests.includes(interest) && styles.selectedItem,
                    ]}
                    onPress={() => toggleSelection(interest, 'interests')}
                  >
                    <Text
                      style={[
                        styles.selectionText,
                        formData.interests.includes(interest) && styles.selectedText,
                      ]}
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Languages you speak</Text>
            <Text style={styles.stepSubtitle}>Select your languages</Text>
            <ScrollView style={styles.selectionContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.selectionGrid}>
                {languages.map((language) => (
                  <TouchableOpacity
                    key={language}
                    style={[
                      styles.selectionItem,
                      formData.languages.includes(language) && styles.selectedItem,
                    ]}
                    onPress={() => toggleSelection(language, 'languages')}
                  >
                    <Text
                      style={[
                        styles.selectionText,
                        formData.languages.includes(language) && styles.selectedText,
                      ]}
                    >
                      {language}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Your personality</Text>
            <Text style={styles.stepSubtitle}>How would you describe yourself?</Text>
            <ScrollView style={styles.selectionContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.selectionGrid}>
                {personalityTraits.map((trait) => (
                  <TouchableOpacity
                    key={trait}
                    style={[
                      styles.selectionItem,
                      formData.personality.includes(trait) && styles.selectedItem,
                    ]}
                    onPress={() => toggleSelection(trait, 'personality')}
                  >
                    <Text
                      style={[
                        styles.selectionText,
                        formData.personality.includes(trait) && styles.selectedText,
                      ]}
                    >
                      {trait}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton} disabled={step === 1}>
            <ChevronLeft size={24} color={step === 1 ? '#ffffff50' : '#ffffff'} />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            {[1, 2, 3, 4].map((num) => (
              <View
                key={num}
                style={[
                  styles.progressDot,
                  step >= num && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {renderStep()}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#667eea" /> : (
              <>
                <Text style={styles.nextButtonText}>
                  {step === 4 ? 'Complete Profile' : 'Next'}
                </Text>
                <ChevronRight size={20} color="#667eea" />
              </>
            )}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff30',
  },
  progressDotActive: {
    backgroundColor: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepContainer: {
    flex: 1,
    paddingTop: 32,
  },
  stepTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff80',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#ffffff',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#ffffff20',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#ffffff30',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectionContainer: {
    flex: 1,
  },
  selectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 20
  },
  selectionItem: {
    backgroundColor: '#ffffff20',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff30',
  },
  selectedItem: {
    backgroundColor: '#ffffff',
  },
  selectionText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#ffffff',
  },
  selectedText: {
    color: '#667eea',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#667eea',
  },
});
