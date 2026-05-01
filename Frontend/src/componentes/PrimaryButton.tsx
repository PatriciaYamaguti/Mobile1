import React from 'react';
import { Pressable, Text } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

type PrimaryButtonProps = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
};

export default function PrimaryButton({
  title,
  onPress,
  disabled,
  className = '',
  textClassName = '',
}: PrimaryButtonProps) {
  const buttonClassName = disabled ? 'bg-[#B0BEC5]' : 'bg-[#1976D2]';

  return (
    <Pressable
      className={`mt-1.5 h-10 items-center justify-center rounded-md ${buttonClassName} ${className}`}
      disabled={disabled}
      onPress={onPress}
    >
      <Text className={`text-base font-bold text-white ${textClassName}`}>{title}</Text>
    </Pressable>
  );
}
