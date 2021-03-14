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

export default function SignIn({ navigation }) {
  const [origin, setOrigin] = React.useState(true);
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      apis.getStore('@storage_origin').then(res => {
        setOrigin(!!(res && res.origin));
      }).catch(() => setOrigin(false));
    });
    return unsubscribe;
  }, [navigation]);
  const doLogin = () => {
    apis.login({
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
  const setDefaultOrigin = () => {
    apis.setStore({
      origin: apis.origin
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
        setOrigin(true);
      }
    });
  }
  if (!origin) {
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.title}>
            <Text style={styles.t1}>Echo-4G代理系统</Text>
            <Text style={styles.t3}>请点击右上角登录设置 origin</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setDefaultOrigin()}
            >
              <Text style={styles.buttonText}>使用默认域</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.title}>
          <Text style={styles.t1}>Echo-4G代理系统</Text>
          <Text style={styles.t2}>账号登录</Text>
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
            onPress={() => doLogin()}
          >
            <Text style={styles.buttonText}>登录</Text>
          </TouchableOpacity>
          <View style={styles.help}>
            <Text style={styles.mark}>没有账号？</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.primary}>立即注册</Text>
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
  t3: {
    fontSize: 18,
    marginTop: 10,
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