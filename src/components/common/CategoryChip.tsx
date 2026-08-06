import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../types';
import FinTrackedColors from '../../constants/Colors';

interface CategoryChipProps {
  category: Category;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  isSelected,
  onSelect,
}) => {
  return (
    <Pressable
      onPress={() => onSelect(category.id)}
      style={({ pressed }) => [
        styles.chip,
        isSelected && {
          backgroundColor: category.color + '26',
          borderColor: category.color,
        },
        pressed && { opacity: 0.8 },
      ]}
    >
      <View
        style={[
          styles.iconBg,
          { backgroundColor: isSelected ? category.color : FinTrackedColors.surfaceVariant },
        ]}
      >
        <Ionicons
          name={category.icon as any}
          size={16}
          color={isSelected ? '#FFFFFF' : category.color}
        />
      </View>
      <Text
        style={[
          styles.label,
          isSelected && { color: FinTrackedColors.textPrimary, fontWeight: '700' },
        ]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FinTrackedColors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginRight: 8,
    marginBottom: 8,
  },
  iconBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  label: {
    color: FinTrackedColors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
});
