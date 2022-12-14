import tabbar from "../../../utils/tab-bar"
import {
  XH,
  HAS_GET_COURSE,
  COURSE_CURRENT_XN,
  COURSE_CURRENT_XQ,
  COURSE_CURRENT_WEEK,
  COURSE_LOCAL
} from '../../../utils/shared-keys'
// import PORTAL_LOGIN_URL from "../../../utils/routes-cst"
Page({

  /**
   * 组件的初始数据
   */
  data: {
    list: tabbar,
    // 是否登录过信息门户
    hasLoginPortal: false,
    // 用户学号
    xh: null,

    // 课程相关数据
    xnList: null,
    xqList: null,
    curXn: null,
    curXq: null,

    // 当前学年学期
    xnIndex: null,
    xqIndex: null,

    // 显示联系我
    displayContactMe: false,
  },

  onLoad: function (options) {
    this.initXnXqPicker();
    this.setXnXqStatus();

  },
  async onShow() {
    this.refreshStorage();
  },


  /**
   * 刷新课程
   */
  refreshCourse(e) {
    const val1 = wx.getStorageSync(COURSE_CURRENT_XN);
    if (!val1 || val1 == null) {
      wx.showToast({
        title: '请选择学年后刷新课程',
        icon: 'none'
      });
      return;
    }
    const val2 = wx.getStorageSync(COURSE_CURRENT_XQ);
    if (!val2 || val2 == null) {
      wx.showToast({
        title: '请选择学期后刷新课程',
        icon: 'none'
      });
      return;
    }
    // 重置为第一周
    wx.setStorageSync(COURSE_CURRENT_WEEK, 1);
    // 删除课程缓存
    wx.removeStorageSync(HAS_GET_COURSE);
    wx.removeStorageSync(COURSE_LOCAL);
    wx.navigateTo({
      url: "../../common/portal-login/portal-login?feature=JW&service=COURSE"
    });
  },

  /**
   * 清除所有数据
   */
  clearData() {
    wx.clearStorageSync();
    wx.showToast({
      title: '清除成功',
      icon: 'none'
    });
    this.refreshStorage();
  },


  /**
   * 刷新缓存
   */
  refreshStorage() {
    const that = this;
    wx.getStorage({
      key: XH,
      success(res) {
        that.setData({
          xh: res.data,
          hasLoginPortal: true
        });
      },
      fail() {
        that.setData({
          XH: '',
          hasLoginPortal: false,
        });
      }
    });
    getApp().globalData.clientInfo.clientId = null;
  },

  /**
   * 初始化学年 & 学期的下拉数据
   */
  initXnXqPicker() {
    if (this.xnList == null) {
      const curYear = new Date().getFullYear();
      const xnList = []
      for (let i = curYear - 5, j = 0; i < curYear + 5; i++, j++) {
        xnList[j] = {
          id: i,
          label: i + '-' + (i + 1)
        }
      }
      this.setData({
        xnList
      });
    }
    if (this.xqList == null) {
      this.setData({
        xqList: [{
          id: 1,
          label: '1学期'
        }, {
          id: 2,
          label: '2学期'
        }, {
          id: 3,
          label: '3学期'
        }]
      });
    }
  },

  /**
   * 设置学年 & 学期的下拉选择状态
   */
  setXnXqStatus() {
    const val1 = wx.getStorageSync(COURSE_CURRENT_XN);
    const val2 = wx.getStorageSync(COURSE_CURRENT_XQ);
    if (val1) {
      const xnIndex = this.data.xnList.findIndex(item => item.id == val1);
      if (xnIndex != -1) {
        this.setData({
          xnIndex
        });
      }
    }
    if (val2) {
      const xqIndex = this.data.xqList.findIndex(item => item.id == val2);
      if (xqIndex != -1) {
        this.setData({
          xqIndex
        });
      }
    }
  },



  bindXnChange: function (e) {
    const newXnIndex = parseInt(e.detail.value);
    const newXn = this.data.xnList[newXnIndex].id;
    this.setData({
      xnIndex: newXnIndex
    });
    wx.setStorageSync(COURSE_CURRENT_XN, newXn);
  },
  bindXqChange: function (e) {
    const newXqIndex = e.detail.value;
    const newXq = this.data.xqList[newXqIndex].id;

    this.setData({
      xqIndex: newXqIndex
    });
    wx.setStorageSync(COURSE_CURRENT_XQ, newXq);
  },

  /**
   * 展示联系我的方式
   */
  displayContactMe() {
    this.setData({
      displayContactMe: true
    });
  },


  /**
   * 拷贝联系我的方式
   * @param  e 
   */
  copy2Clipboard(e) {
    const text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success: function (e) {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        });
      }
    });
    this.setData({
      displayContactMe: false
    });
  },

  forwardFeedback() {
    wx.navigateTo({
      url: '../feedback/feedback'
    });
  },

  displayShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  onShareAppMessage: function (res) {
    return {
      title: '课程成绩一键查询, 快来南工程助手试试吧',
      path: "pages/first-tab/course/course",
      imageUrl: "https://iutr-media.oss-cn-hangzhou.aliyuncs.com/mnpmiao/mnpmiao-share.png"
    }
  }
})