import React, { PureComponent } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

const styles = StyleSheet.create({
  content: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});

interface IProps {
  onClick: () => void;
  style?: StyleProp<ViewStyle>;
}

export class ActionSheetItem extends PureComponent<IProps> {
  render() {
    const { onClick, children, style } = this.props;

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            onPress={onClick}
            style={[styles.content, style]}
        >
          <Text>{children}</Text>
        </TouchableOpacity>
    );
  }
}
