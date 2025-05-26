import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Animated, TextStyle, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import styles from '../styles/PreferenceStyles';
import DateTimePicker from '@react-native-community/datetimepicker';

const Question = ({ title, type, options, selectedValues, onSelect, onPickImage }: any) => {
  const [focus, setFocus] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateError, setDateError] = useState('');
  const animatedLabel = useRef(new Animated.Value(selectedValues ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: focus || selectedValues ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focus, selectedValues]);

  const labelStyle: Animated.WithAnimatedObject<TextStyle> = {
    position: 'absolute',
    left: 10,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0], // float from center to top
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.buttonBackground, Colors.activity],
    }),
    zIndex: 1,
  };

  const validateBirthday = (date: Date) => {
    // Calculate age
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Validate age (13+ is a common requirement for social apps)
    if (age < 13) {
      setDateError('You must be at least 13 years old');
      return false;
    } else if (age > 120) {
      setDateError('Please enter a valid birth date');
      return false;
    } else {
      setDateError('');
      return true;
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (selectedDate) {
      if (validateBirthday(selectedDate)) {
        onSelect(selectedDate);
      } else {
        // If invalid, you might want to keep the old value or set to null
        Alert.alert("Invalid Date", dateError);
      }
    }
  };

  const renderTextInputWithFloatingLabel = () => (
    <View style={styles.floatingLabelContainer}>
      <Animated.Text style={labelStyle}>{title}</Animated.Text>
      <TextInput
        style={[styles.input, { color: Colors.text }]}
        value={selectedValues}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChangeText={onSelect}
        placeholder=""
        placeholderTextColor={Colors.ionIcon}
        multiline={type === 'text' && title.includes('bio')}
        keyboardType={title.includes('phone') ? 'phone-pad' : 'default'}
      />
    </View>
  );

  const renderDateInputWithFloatingLabel = () => (
    <View style={styles.floatingLabelContainer}>
      <Animated.Text style={labelStyle}>{title}</Animated.Text>
  
      <TouchableOpacity
        style={[styles.input, styles.dateInputContainer]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: selectedValues ? Colors.text : Colors.subText }}>
          {selectedValues ? selectedValues.toDateString() : 'Select date'}
        </Text>
      </TouchableOpacity>
  
      {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
  
      {showDatePicker && (
        <DateTimePicker
          value={selectedValues || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const isIOS = Platform.OS === 'ios';
  
            if (event.type === 'dismissed') {
              // User dismissed the picker
              setShowDatePicker(false);
              return;
            }
  
            if (selectedDate) {
              if (validateBirthday(selectedDate)) {
                onSelect(selectedDate);
              } else {
                Alert.alert("Invalid Date", dateError);
              }
            }
  
            // Hide picker after selection
            if (!isIOS) {
              setShowDatePicker(false);
            }
          }}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </View>
  );  

  const renderOptions = () => {
    if (type === 'image') {
      return (
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity style={styles.imagePlaceholder} onPress={onPickImage}>
            {selectedValues ? (
              <Image source={{ uri: selectedValues }} style={styles.image} />
            ) : (
              <Ionicons name="camera" size={32} color={Colors.icon} />
            )}
          </TouchableOpacity>
        </View>
      );
    }

    if (type === 'chip') {
      const isMultiSelect = Array.isArray(selectedValues);

      return (
        <View style={styles.chipContainer}>
          {options.map((option: string, index: number) => {
            const selected = isMultiSelect
              ? selectedValues.includes(option)
              : selectedValues === option;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => onSelect(option)}
                style={[
                  styles.chip,
                  selected && styles.chipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selected && styles.chipTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    return (
      <TextInput
        style={[styles.input, { color: Colors.text }]}
        value={selectedValues}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChangeText={onSelect}
        placeholder=""
        placeholderTextColor={Colors.ionIcon}
      />
    );
  };

  return (
    <View style={styles.questionContainer}>
      {type === 'text'
        ? renderTextInputWithFloatingLabel()
        : type === 'date'
        ? renderDateInputWithFloatingLabel()
        : (
          <>
            <Text style={styles.title}>{title}</Text>
            {renderOptions()}
          </>
        )}
    </View>
  );
};

export default Question;
