import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Eye, EyeOff, Copy, Trash2 } from 'lucide-react-native';

export default function HistoryItemCard({
  entry,
  isVisible,
  onToggleVisibility,
  onCopy,
  onRemove,
}) {
  return (
    <View style={styles.entry}>
      <Text style={styles.entryAccount}>{entry.account || 'Sem finalidade'}</Text>
      <Text style={styles.entryPassword} selectable>
        {isVisible ? entry.password : '*'.repeat(Math.max(entry.password.length, 8))}
      </Text>
      <View style={styles.actionRow}>
        <Pressable onPress={onToggleVisibility} style={styles.iconButton}>
          {isVisible ? (
            <EyeOff color="#1976D2" width={22} height={22} />
          ) : (
            <Eye color="#1976D2" width={22} height={22} />
          )}
        </Pressable>
        <Pressable onPress={onCopy} style={styles.iconButton}>
          <Copy color="#1976D2" width={22} height={22} />
        </Pressable>
        <Pressable onPress={onRemove} style={styles.iconButton}>
          <Trash2 color="#D32F2F" width={22} height={22} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#1976D2',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  entryAccount: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  entryPassword: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  iconButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F0F8FF',
  },
});
