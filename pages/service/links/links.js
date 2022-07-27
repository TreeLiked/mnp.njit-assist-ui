// pages/common/portal-login/portal-login.js
import {
  get2
} from '../../../utils/request';
const app = getApp();

Page({
  data: {

    links: []

  },

  async onLoad(options) {

    this.loadLinks();

  },

  async loadLinks() {

    wx.showLoading({
      title: '正在加载'
    })
    const res = await get2("/tools/links");
    this.setData({
      links: res.data
    });
    wx.hideLoading();
  },

  copy2Clipboard(e) {
    const link = e.currentTarget.dataset.item.link;
    wx.setClipboardData({
      data: link,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  }






})