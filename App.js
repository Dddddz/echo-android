import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';

import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import Main from './src/pages/Main';
import Origin from './src/pages/Origin';
import Scan from './src/pages/Scan';
import apis from './src/apis';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3f51b5',
    backgroundColor: '#ffffff',
  },
};

const Stack = createStackNavigator();

function App() {
  const logo = () => (
    <View style={{ paddingHorizontal: 15, paddingVertical: 12 }}>
      <Image
        source={require('./src/assets/logo.png')}
        style={{ width: 118, height: 30 }} />
    </View>
  );
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={Main}
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#3f51b5',
            },
            headerTitle: props => null,
            headerLeft: logo,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.replace('SignIn');
                  apis.setStore({});
                }}
                style={{ paddingHorizontal: 15, paddingVertical: 12 }}>
                <Text style={{ color: '#ffffff' }}>安全退出</Text>
              </TouchableOpacity>
            ),
          })} />
        <Stack.Screen
          name="Origin"
          component={Origin}
          options={{
            headerStyle: {
              backgroundColor: '#3f51b5'
            },
            headerTintColor: '#ffffff',
            headerTitle: "设置",
          }} />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#3f51b5',
            },
            headerTitle: props => null,
            headerLeft: logo,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Origin');
                }}
                style={{ paddingHorizontal: 15, paddingVertical: 12 }}>
                <Text style={{ color: '#ffffff' }}>设置</Text>
              </TouchableOpacity>
            ),
          })} />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#3f51b5',
            },
            headerTitle: props => null,
            headerLeft: logo,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Origin');
                }}
                style={{ paddingHorizontal: 15, paddingVertical: 12 }}>
                <Text style={{ color: '#ffffff' }}>设置</Text>
              </TouchableOpacity>
            ),
          })} />
        <Stack.Screen
          name="Scan"
          component={Scan}
          options={() => ({
            header: () => null
          })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;