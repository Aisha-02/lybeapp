import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Animated, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import styles from '../styles/PrefereneStyles';

const Question = ({ title, type, options, selectedValues, onSelect, onPickImage }: any) => {
  const [focus, setFocus] = useState(false);
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
      outputRange: [Colors.background, Colors.buttonBackground|| '#000'],
    }),
    zIndex: 1,
  };

  const renderTextInputWithFloatingLabel = () => (
    <View style={{ position: 'relative', paddingTop: 24 }}>
      <Animated.Text style={labelStyle}>{title}</Animated.Text>
      <TextInput
        style={styles.input}
        value={selectedValues}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChangeText={onSelect}
        placeholder=""
        placeholderTextColor="#999"
      />
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
        style={styles.input}
        value={selectedValues}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChangeText={onSelect}
        placeholder={type === 'date' ? 'Select a date' : ''}
        placeholderTextColor="#999"
      />
    );
  };

  return (
    <View style={{ marginBottom: 24 }}>
      {type === 'text' || type === 'date'
        ? renderTextInputWithFloatingLabel()
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
