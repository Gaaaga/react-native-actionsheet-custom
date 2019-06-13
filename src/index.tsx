import React, {
  ComponentClass,
  PureComponent,
  ReactNode,
} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Easing,
  TouchableOpacity,
} from 'react-native';

export { ActionSheetItem } from './ActionSheetItem';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: 'transparent',
  },
  actionsheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#F3F3F3',
  },
  title: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  borderBottom: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  footer: {
    marginTop: 10,
  },
});
let setVisible: any;
interface IProps {
  title?: string | ReactNode;
  onPressBackDrop?: () => void;
  children: ReactNode;
  footer?: string;
}
export class ActionSheet extends PureComponent<IProps> {
  static defaultProps = {
    title: 'title',
    footer: 'cancel',
  };

  static show = () => {
    setVisible(true);
  };

  static hide = () => {
    setVisible(false);
  };

  height = 800;

  animateDuration = 200;

  animation = new Animated.Value(0);

  state = {
    visible: false,
  };

  componentDidMount() {
    setVisible = visible => {
      if (visible) {
        this.setState({ visible });
        this.handleOpen();
      } else {
        this.handleClose(() => this.setState({ visible }));
      }
    };
  }

  handleOpen = () => {
    Animated.timing(this.animation, {
      toValue: 1,
      duration: this.animateDuration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  handleClose = close => {
    console.log(this.animation);
    Animated.timing(this.animation, {
      toValue: 0,
      duration: this.animateDuration,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => close());
  };

  onPressBackDrop = () => {
    const { onPressBackDrop } = this.props;
    if (onPressBackDrop) {
      onPressBackDrop();
    }
  };

  setLayout = ({ nativeEvent: { layout } }) => {
    this.height = layout.height;
  };

  render() {
    const { title, children, footer } = this.props;
    const slideUp = {
      transform: [
        {
          translateY: this.animation.interpolate({
            inputRange: [0.1, 1],
            outputRange: [0, -this.height],
            extrapolate: 'clamp',
          }),
        },
      ],
    };
    return (
        <Modal visible={this.state.visible} transparent>
          <TouchableWithoutFeedback onPress={this.onPressBackDrop}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <Animated.View
              hardwareAccelerated
              onLayout={this.setLayout}
              style={[
                styles.actionsheet,
                slideUp,
                { bottom: -this.height },
              ]}
          >
            <View style={styles.title}>
              {typeof title === 'string' ? (
                  <Text style={{ color: '#808080' }}>{title}</Text>
              ) : (
                  title
              )}
            </View>
            {React.Children.map(children, (child, index) => {
              if (!React.isValidElement(child)) {
                return false;
              }
              const childType = child.type as ComponentClass<any>;
              if (
                  childType &&
                  index !== React.Children.count(children) - 1
              ) {
                return React.cloneElement<any>(child, {
                  style: [styles.borderBottom],
                });
              }
              return child;
            })}

            <TouchableOpacity
                activeOpacity={0.6}
                style={[styles.content, styles.footer]}
            >
              <Text>{footer}</Text>
            </TouchableOpacity>
          </Animated.View>
        </Modal>
    );
  }
}
