import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';

import apis from '../apis';

export default function SignUp({ navigation }) {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const doRegister = () => {
    apis.register({
      userName,
      password,
    }).then(res => {
      if (res.status !== 0) {
        ToastAndroid.show(
          res.errorMessage || res.message,
          ToastAndroid.SHORT
        );
      } else {
        apis.setStore(res.data);
        navigation.navigate('Main');
      }
    }).catch((e) => {
      ToastAndroid.show(
        e.message,
        ToastAndroid.SHORT
      );
    });
  }
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.title}>
          <Text style={styles.t1}>Echo-4G代理系统</Text>
          <Text style={styles.t2}>账号注册</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.label}>账号</Text>
          <TextInput
            style={styles.input}
            placeholder="账号"
            onChangeText={text => setUserName(text)}
            value={userName}
          />
          <Text style={styles.label}>密码</Text>
          <TextInput
            style={styles.input}
            placeholder="密码"
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
            value={password}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => doRegister()}
          >
            <Text style={styles.buttonText}>注册</Text>
          </TouchableOpacity>
          <View style={styles.help}>
            <Text style={styles.mark}>已有账号？</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={styles.primary}>去登录</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 30,
    paddingTop: 80,
    paddingBottom: 15
  },
  t1: {
    fontSize: 26,
    fontWeight: '500',
    color: '#263238'
  },
  t2: {
    fontSize: 14,
    color: '#546e7a'
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 30
  },
  label: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 5
  },
  input: {
    paddingHorizontal: 15,
    height: 53,
    fontSize: 16,
    color: '#263238',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: 4,
    borderWidth: 1
  },
  button: {
    marginTop: 20,
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: '#3f51b5',
    paddingVertical: 15
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16
  },
  help: {
    flexDirection: 'row',
    marginTop: 15,
  },
  mark: {
    fontSize: 14,
    color: '#546e7a'
  },
  primary: {
    color: '#3f51b5'
  }
});