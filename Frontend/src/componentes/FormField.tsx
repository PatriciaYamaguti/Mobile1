import React from 'react';
import { View, Text, TextInput } from 'react-native';
import type { ComponentProps } from 'react';

type FormFieldProps = {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  inputClassName?: string;
  labelClassName?: string;
  containerClassName?: string;
} & Omit<ComponentProps<typeof TextInput>, 'value' | 'onChangeText'>;

export default function FormField({
  label,
  value,
  onChangeText,
  error,
  inputClassName = '',
  labelClassName = '',
  containerClassName = '',
  ...inputProps
}: FormFieldProps) {
  const inputStateClass = error ? 'border-[#d32f2f] bg-[#fff5f5]' : 'border-[#1976D2] bg-[#E8F1FF]';

  return (
    <View className={containerClassName}>
      {label ? <Text className={`mb-1.5 ml-1 text-base text-[#333] ${labelClassName}`}>{label}</Text> : null}
      <TextInput
        className={`mb-1.5 h-[46px] rounded-md border px-3 ${inputStateClass} ${inputClassName}`}
        value={value}
        onChangeText={onChangeText}
        {...inputProps}
      />
      {error ? <Text className="mb-2.5 ml-1 text-xs text-[#d32f2f]">{error}</Text> : null}
    </View>
  );
}
