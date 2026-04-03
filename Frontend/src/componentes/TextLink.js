import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function TextLink({ children, onPress, style }) {
  return (
    <Text style={[styles.linkText, style]} onPress={onPress}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  linkText: {
    color: '#1976D2',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
