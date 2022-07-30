// pages/third-tab/feedback.js
import {
  post
} from "../../../utils/request";
import {


  XH
} from "../../../utils/shared-keys"
Page({

  /**
   * 页面的初始数据
   */
  data: {

    desc: '',
    contactInfo: '',


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  async submitFeedback() {
    if (!this.data.desc || this.data.desc == '') {
      wx.showToast({
        title: '请输入问题描述或建议',
        icon: "none"
      });
      return;
    }
    const data = {
      "content": this.data.desc,
      "contact": this.data.contactInfo,
      "xh": wx.getStorageSync(XH)
    };
    wx.showLoading({
      title: '正在发送'
    });
    const res = await post('/tools/feedback/submit', data);
    wx.hideLoading();


    if (res.success) {
      this.setData({
        desc: '',
        contactInfo: ''
      });
      wx.showToast({
        title: '反馈成功',
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: res.message,
        icon: 'error'
      });
    }
  },

  setDesc(e) {
    this.setData({
      desc: e.detail.value
    });
  },
  setContact(e) {
    this.setData({
      contactInfo: e.detail.value
    });
  },

})