import uri from './uri';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultPrefix = 'http://echonew.virjar.com';

let reqs = {
  origin: defaultPrefix,
  getStore: async (key = '@storage_Key') => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (e) {
      return {
        message: e.message
      };
    }
  },
  setStore: async (data, key = '@storage_Key') => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      return {
        message: e.message
      };
    }
  },
};

async function doGet(uri, params = '', route = false) {
  try {
    if (route) {
      uri += params ? ('/' + params) : '';
    } else {
      // 组装参数
      let p = [];
      for (let i of Object.keys({ ...params })) {
        p.push(`${i}=${params[i]}`);
      }
      if (p.length > 0) {
        uri += '?' + p.join('&');
      }
    }
    let user = await reqs.getStore();
    let prefix = await reqs.getStore('@storage_origin');
    let response = await axios({
      method: 'get',
      url: (prefix?.origin || defaultPrefix) + uri,
      headers: {
        token: user?.loginToken
      }
    });
    if (response?.data?.status === -3) {
      return;
    }
    return response?.data;
  } catch (error) {
    if (error?.response) {
      return error?.response?.data;
    }
  }
}

async function doPost(uri, data, query) {
  try {
    // 组装参数
    let p = [];
    for (let i of Object.keys({ ...data })) {
      p.push(`${i}=${data[i]}`);
    }
    let user = await reqs.getStore();
    let prefix = await reqs.getStore('@storage_origin');
    let response = await axios({
      method: 'post',
      url: (prefix?.origin || defaultPrefix) + uri,
      data: query ? p.join('&') : data,
      headers: {
        token: user?.loginToken
      }
    });
    if (response?.data?.status === -3) {
      return {};
    }
    return response?.data;
  } catch (error) {
    if (error.response) {
      return error?.response?.data;
    }
  }
}

for (let i of Object.keys(uri)) {
  const [url, method, query] = uri[i].split(' ');
  if (method === 'post') {
    reqs[i] = (body) => doPost(url, body, query);
  } else {
    reqs[i] = (params) => doGet(url, params, query);
  }
}

export default reqs;
