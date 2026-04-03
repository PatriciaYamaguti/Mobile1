import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function FormField({
  label,
  value,
  onChangeText,
  error,
  inputStyle,
  labelStyle,
  containerStyle,
  ...inputProps
}) {
  return (
    <View style={containerStyle}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      <TextInput
        style={[styles.input, error ? styles.inputError : null, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        {...inputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
    marginLeft: 4,
  },
  input: {
    height: 46,
    borderColor: '#1976D2',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 6,
    backgroundColor: '#E8F1FF',
  },
  inputError: {
    borderColor: '#d32f2f',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginLeft: 4,
    marginBottom: 10,
  },
});
