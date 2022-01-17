import React from 'react';
import {
  HeaderButton,
  HeaderButtonProps,
} from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

const CustomHeaderButton = (props: HeaderButtonProps) => {
  return <HeaderButton {...props} IconComponent={Ionicons} iconSize={23} />;
};

export default CustomHeaderButton;
