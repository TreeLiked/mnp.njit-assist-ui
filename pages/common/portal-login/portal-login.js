// pages/common/portal-login/portal-login.js
import {
  get,
  post
} from '../../../utils/request';
import {

  HAS_LOGIN,
  XH,
  CLIENT_ID
} from '../../../utils/shared-keys'
const app = getApp();

Page({


  /**
   * 组件的初始数据
   */
  data: {

    xh: '',
    pwd: 'khl000403',
    code: '',
    codeBase64: '',
    disableInput: false,
    logining: false,

    // 目标服务
    serviceTyep: null,
    // 需要的服务特性
    targetFeature: null,
  },

  async onLoad(options) {


    // PORTAL、JW .etc
    const feature = options.feature;
    // course、grade、credit .etc
    const service = options.service;

    this.setData({
      'targetFeature': feature,
      'serviceTyep': service
    });

    const clientAvail = await app.checkClientStatus(feature);
    if (clientAvail) {
      this.forwardServicePage();
      return;
    }
    const xh = wx.getStorageSync(XH);
    if (xh) {
      this.setData({
        "xh": xh
      });
    }
    this.preLogin();
  },

  forwardServicePage() {
    let destPage;
    switch (this.data.serviceTyep) {

      case 'COURSE':
        destPage = '../../first-tab/course/course';
        wx.switchTab({
          url: destPage,
        });
        return;
      case 'GRADE':
        destPage = "../../service/grade/grade"
      default:
        break;
    }
    wx.redirectTo({
      url: destPage
    });
  },

  async preLogin() {


    const res = await get("/portal/preLogin");
    this.setData({
      codeBase64: 'data:image/png;base64,' + res.data
    });
    app.globalData.clientInfo.clientId = res.message;
    wx.setStorageSync(CLIENT_ID, res.message);
  },

  async refreshCode() {
    const res = await get("/portal/captcha");
    this.setData({
      codeBase64: 'data:image/png;base64,' + res.data
    });
  },

  async login() {

    if (!this.data.xh || !this.data.pwd || !this.data.code) {
      wx.showToast({
        title: '请输入必填项',
        icon: 'none'
      });
      return;
    }
    this.setData({
      "logining": true
    });
    const res = await post("/portal/login", {
      "xh": this.data.xh,
      "pwd": this.data.pwd,
      "verifyCode": this.data.code
    });
    console.log(res);
    this.setData({
      "logining": false
    });
    if (res.success) {
      wx.setStorageSync(XH, this.data.xh);
      wx.setStorageSync(HAS_LOGIN, true);
      this.forwardServicePage();
    } else {
      this.refreshCode();
    }
    // 跳转
  },


  setXh(e) {
    this.setData({
      "xh": e.detail.value
    })
  },
  setPwd(e) {
    this.setData({
      "pwd": e.detail.value
    })
  },
  setCode(e) {
    this.setData({
      "code": e.detail.value
    })
  }

})