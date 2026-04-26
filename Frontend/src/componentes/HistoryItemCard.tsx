import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Eye, EyeOff, Copy, Trash2 } from 'lucide-react-native';

type CardEntry = {
  id: number;
  account: string;
  password: string;
};

type HistoryItemCardProps = {
  entry: CardEntry;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onCopy: () => void;
  onRemove: () => void;
};

export default function HistoryItemCard({
  entry,
  isVisible,
  onToggleVisibility,
  onCopy,
  onRemove,
}: HistoryItemCardProps) {
  return (
    <View className="mb-2.5 w-[90%] rounded-md border border-[#1976D2] bg-white p-2.5">
      <Text className="mb-1 text-sm font-bold text-[#1976D2]">{entry.account || 'Sem finalidade'}</Text>
      <Text className="mb-2 text-base text-[#333]" selectable>
        {isVisible ? entry.password : '*'.repeat(Math.max(entry.password.length, 8))}
      </Text>
      <View className="flex-row justify-around border-t border-[#ddd] pt-1.5">
        <Pressable onPress={onToggleVisibility} className="rounded-md bg-[#F0F8FF] p-1.5">
          {isVisible ? (
            <EyeOff color="#1976D2" width={22} height={22} />
          ) : (
            <Eye color="#1976D2" width={22} height={22} />
          )}
        </Pressable>
        <Pressable onPress={onCopy} className="rounded-md bg-[#F0F8FF] p-1.5">
          <Copy color="#1976D2" width={22} height={22} />
        </Pressable>
        <Pressable onPress={onRemove} className="rounded-md bg-[#F0F8FF] p-1.5">
          <Trash2 color="#D32F2F" width={22} height={22} />
        </Pressable>
      </View>
    </View>
  );
}
