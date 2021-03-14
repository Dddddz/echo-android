import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Image
} from 'react-native';

import apis from '../apis';

export default function Origin({ navigation }) {
  const [origin, setOrigin] = React.useState('');
  React.useEffect(() => {
    apis.getStore('@storage_origin').then(res => {
      setOrigin(res.origin);
    });
  }, []);
  const saveOrigin = () => {
    apis.setStore({
      origin
    }, '@storage_origin').then(res => {
      if (res && res.message) {
        ToastAndroid.show(
          res.message,
          ToastAndroid.SHORT
        );
      } else {
        ToastAndroid.show(
          '保存成功',
          ToastAndroid.SHORT
        );
        navigation.goBack(-1);
      }
    });
  }
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.title}>
          <Text style={styles.t1}>设置域</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Scan', {
            setOrigin
          })}>
            <Image
              source={require('../assets/scanning.png')}
              style={styles.scan} />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="http://"
            multiline
            onChangeText={text => setOrigin(text)}
            value={origin}
          />
          <TouchableOpacity
            onPress={() => setOrigin(apis.origin)}
          >
            <Text style={styles.default}>使用默认域</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => saveOrigin()}
          >
            <Text style={styles.buttonText}>保存</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 30,
    paddingTop: 80,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  t1: {
    fontSize: 26,
    fontWeight: '500',
    color: '#263238'
  },
  scan: {
    width: 30,
    height: 30,
    tintColor: '#3f51b5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 30
  },
  input: {
    paddingHorizontal: 15,
    minHeight: 53,
    fontSize: 16,
    color: '#263238',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: 4,
    borderWidth: 1
  },
  default: {
    fontSize: 12,
    textAlign: 'center',
    color: '#3f51b5',
    marginTop: 10
  },
  button: {
    marginTop: 20,
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: '#3f51b5',
    paddingVertical: 15
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16
  }
});