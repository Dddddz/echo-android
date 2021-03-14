import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  NativeModules,
  DeviceEventEmitter,
  FlatList,
  ToastAndroid
} from 'react-native';

import apis from '../apis';

const logs = [];
export default function Main({ navigation }) {
  const [log, setLog] = React.useState([]);
  const [clientId, setClientId] = React.useState('');
  const [ip, setIp] = React.useState('');
  const listener = (res) => {
    logs.unshift({ ...res });
    setLog([...logs]);
  }
  React.useEffect(() => {
    let emitter = null;
    apis.getStore().then(res => {
      if (res && res.apiToken) {
        apis.getStore('@storage_origin').then(o => {
          if (o && o.origin) {
            NativeModules.echoEngine.startEchoEngine(
              o.origin,
              res.userName,
              res.apiToken
            );
          }
        }).catch(() => { });
        NativeModules.echoEngine.openLogEvent('echoLogDetail');
        const clientId = NativeModules.echoEngine.echoClientId();
        clientId && apis.getIp({ clientId, token: res.apiToken })
          .then((res) => {
            if (res.status !== 0) {
              setIp(res.data);
              ToastAndroid.show(
                JSON.stringify(res),
                ToastAndroid.SHORT
              );
            } else {
              setIp('出口 IP 获取失败，请退出重进页面');
            }
          })
          .catch(() => { });
        setClientId(clientId || 'Client 获取失败，请退出重进页面');
        emitter = DeviceEventEmitter.addListener('echoLogDetail', listener);
      } else {
        navigation.replace('SignIn');
      }
    }).catch((e) => {
      console.log(e);
      navigation.replace('SignIn');
    });
    return () => {
      emitter && emitter.remove();
    }
  }, []);
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.title}>
        <Text style={styles.t1}>ClientId</Text>
        <Text style={styles.t2}>{clientId}</Text>
      </View>
      <View style={styles.title}>
        <Text style={styles.t1}>出口 IP</Text>
        <Text style={styles.t2}>{ip}</Text>
      </View>
      <Text style={styles.label}>日志</Text>
      <FlatList
        style={{ marginBottom: 30, backgroundColor: '#eee' }}
        inverted
        data={logs}
        renderItem={({ item }) => (
          <Text style={styles.logs}>{item.level}:{item.msg}</Text>
        )}
        keyExtractor={(item, index) => item.level + index}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 15
  },
  t1: {
    fontSize: 26,
    fontWeight: '500',
    color: '#263238'
  },
  t2: {
    fontSize: 18,
    color: '#546e7a'
  },
  label: {
    paddingHorizontal: 30,
    fontSize: 18,
    marginTop: 15,
    marginBottom: 5
  },
  logs: {
    paddingHorizontal: 30,
  },
});