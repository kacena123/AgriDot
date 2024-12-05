import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  containerStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, containerStyles, textStyles }) => {
  return (
    <TouchableOpacity style={[styles.button, containerStyles && StyleSheet.flatten(containerStyles)]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyles && StyleSheet.flatten(textStyles) ]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    backgroundColor: '#FD47B7', // Default color
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'DMSans',
  },
});

export default CustomButton;