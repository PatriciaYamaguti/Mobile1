import React from 'react';
import { Text } from 'react-native';
import type { ReactNode } from 'react';

type PageTitleProps = {
  children: ReactNode;
  className?: string;
};

export default function PageTitle({ children, className = '' }: PageTitleProps) {
  return (
    <Text className={`mb-[30px] text-center text-[34px] font-bold text-[#1976D2] ${className}`}>
      {children}
    </Text>
  );
}
