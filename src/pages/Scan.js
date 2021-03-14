import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  TouchableOpacity,
  Image,
  SafeAreaView
} from 'react-native';

import { RNCamera } from 'react-native-camera';

let ani = false;
const ScanScreen = ({ route, navigation }) => {
  const [result, setResult] = React.useState('');
  const moveAnim = React.useRef(new Animated.Value(-200)).current;

  const startAnimation = () => {
    ani = true;
    Animated.sequence([
      Animated.timing(
        moveAnim,
        {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.linear
        }
      ),
      Animated.timing(
        moveAnim,
        {
          toValue: -200,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.linear
        }
      )
    ]).start(() => ani && startAnimation());
  };

  React.useEffect(() => {
    startAnimation();
    return () => {
      ani = false;
    }
  }, []);

  // 识别二维码
  const onBarCodeRead = (res) => {
    if (!result || result !== res.data || !res.data) {
      setResult(res.data);
      route.params.setOrigin(res.data);
      navigation.goBack(-1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack(-1)}>
        <Image
          source={require('../assets/back.png')}
          style={styles.backImg} />
      </TouchableOpacity>
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        onBarCodeRead={onBarCodeRead}
      >
        <View style={styles.rectangleContainer}>
          <View style={styles.rectangle} />
          <Animated.View style={[
            styles.border,
            { transform: [{ translateY: moveAnim }] }]} />
          <Text style={styles.rectangleText}>将二维码放入框内，即可自动扫描</Text>
        </View>
      </RNCamera>
    </SafeAreaView>
  );
}

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    flex: 1
  },
  back: {
    position: 'absolute',
    zIndex: 99,
    top: 0,
    left: 0,
    padding: 15
  },
  backImg: {
    tintColor: '#ffffff',
    width: 24,
    height: 24,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  rectangle: {
    height: 200,
    width: 200,
    borderWidth: 1,
    borderColor: '#00FF00',
    backgroundColor: 'transparent'
  },
  rectangleText: {
    flex: 0,
    color: '#fff',
    marginTop: 10
  },
  border: {
    flex: 0,
    width: 200,
    height: 2,
    backgroundColor: '#00FF00',
  }
});