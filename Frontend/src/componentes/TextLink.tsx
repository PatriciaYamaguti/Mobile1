import React from 'react';
import { Text } from 'react-native';
import type { ReactNode } from 'react';
import type { GestureResponderEvent } from 'react-native';

type TextLinkProps = {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  className?: string;
};

export default function TextLink({ children, onPress, className = '' }: TextLinkProps) {
  return (
    <Text className={`font-bold text-[#1976D2] underline ${className}`} onPress={onPress}>
      {children}
    </Text>
  );
}
