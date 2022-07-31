var BASE_API_PREFIX = 'https://mnp.njit-assist.iutr.tech/api/v1';
// var BASE_API_PREFIX = 'http://192.168.101.17:20001/api/v1';

import {
  CLIENT_ID,
  XH
} from '../utils/shared-keys'
export const get = (url) => {
  return get2(url, true);
}


export const get2 = (url, filter) => {
  let clientId = getApp().globalData.clientInfo.clientId;
  let xh = getApp().globalData.clientInfo.xh;
  if (clientId == null) {
    clientId = wx.getStorageSync(CLIENT_ID);
  }
  if (xh == null) {
    xh = wx.getStorageSync(XH);
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_API_PREFIX + url,
      method: 'GET',
      dataType: 'json',
      header: {
        "content-type": "application/json;charset=UTF-8",
        "CLIENT_ID": clientId,
        "XH": xh
      },
      success: function (res) {
        if (filter) {
          let resp = res.data;
          if (resp.code == "60001") {
            getApp().globalData.clientInfo.clientId = null;
            wx.removeStorageSync(CLIENT_ID);
          }
          wx.hideLoading();
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
        wx.hideLoading();
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
  if (clientId == null) {
    clientId = wx.getStorageSync(CLIENT_ID);
  }
  let xh = getApp().globalData.clientInfo.xh;
  if (xh == null) {
    xh = wx.getStorageSync(XH);
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_API_PREFIX + url,
      method: 'POST',
      data: data,
      dataType: 'json',
      header: {
        "content-type": "application/json;charset=UTF-8",
        "CLIENT_ID": clientId,
        "XH": xh
      },
      success: function (res) {
        let resp = res.data;
        if (resp.code == "60001") {
          getApp().globalData.clientInfo.clientId = null;
          wx.removeStorageSync(CLIENT_ID);
        }
        wx.hideLoading();
        if (resp.success != true) {
          wx.showToast({
            title: resp.message,
            icon: 'error'
          });
        }
        resolve(resp);
      },
      fail: function () {
        wx.hideLoading();
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