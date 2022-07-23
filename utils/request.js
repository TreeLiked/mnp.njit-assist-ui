// var BASE_API_PREFIX = 'https://mnpmiao.iutr.cn';
var BASE_API_PREFIX = 'http://192.168.101.17:20001/mnp/njit-assist';

import {
  CLIENT_ID
} from '../utils/shared-keys'
export const get = (url) => {
  return get2(url, true);
}


export const get2 = (url, filter) => {
  let clientId = getApp().globalData.clientInfo.clientId;
  if(clientId == null) {
    clientId = wx.getStorageSync(CLIENT_ID);
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_API_PREFIX + url,
      method: 'GET',
      dataType: 'json',
      header: {
        "content-type": "application/json;charset=UTF-8",
        "CLIENT_ID": clientId
      },
      success: function (res) {
        if (filter) {
          let resp = res.data;
          if(resp.code == "60001") {
            getApp().globalData.clientInfo.clientId = null;
            wx.removeStorageSync(CLIENT_ID);
          }
          if (resp.success != true) {
            wx.showToast({
              title: resp.message,
              icon: 'error'
            });
            return;
          }
        }
        resolve(res.data);
      },
      fail: function () {
        wx.showToast({
          title: '网络连接异常',
          icon: 'error'
        });
      },
    })
  })
}

export const post = (url, data) => {
  let clientId = getApp().globalData.clientInfo.clientId;
  if(clientId == null) {
    clientId = wx.getStorageSync(CLIENT_ID);
  }
    return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_API_PREFIX + url,
      method: 'POST',
      data: data,
      dataType: 'json',
      header: {
        "content-type": "application/json;charset=UTF-8",
        "CLIENT_ID": clientId
      },
      success: function (res) {
        let resp = res.data;
        if(resp.code == "60001") {
          getApp().globalData.clientInfo.clientId = null;
          wx.removeStorageSync(CLIENT_ID);
        }
        if (resp.success != true) {
          wx.showToast({
            title: resp.message,
            icon: 'error'
          });
        }
        resolve(resp);
      },
      fail: function () {
        wx.showToast({
          title: '网络连接异常',
          icon: 'error'
        });
      },
    })
  })
}

function showLoading() {
  wx.showLoading({
    title: '正在加载',
  });
}