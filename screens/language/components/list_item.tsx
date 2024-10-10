import React from 'react';
import {Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS} from '../../../constants/colors';
import {Icon} from 'react-native-paper';

interface ListItemProps {
  image: any;
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
  image,
  title,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.itemContainer,
        isSelected && {backgroundColor: COLORS.PimaryLight, borderColor: COLORS.PRIMARY,borderWidth:1},
      ]}>
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{title}</Text>

      <Icon
        source={isSelected ? 'radiobox-marked' : 'radiobox-blank'}
        size={24}
        color={COLORS.PRIMARY}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.4,
    borderColor: '#D3D3D3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 0.3, // Set the border width
    borderColor: 'black',
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
});

export default ListItem;
