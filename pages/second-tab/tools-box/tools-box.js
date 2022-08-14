// pages/second-tab/tools-box.js
import tabbar from "../../../utils/tab-bar"
import {
  getDateWithoutYear,
  getWeek,
  getTimeRan
} from '../../../utils/date'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: tabbar,
    // 顶部用户信息
    userInfo: {
      when: '',
      date: '',
      week: ''
    },
    insertAd: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 在页面onLoad回调事件中创建插屏广告实例
    this.initUserInfo();
    if (wx.createInterstitialAd) {
      this.data.insertAd = wx.createInterstitialAd({
        adUnitId: 'adunit-179f5640e39f2d2a'
      });
      this.data.insertAd.show();
    }
  },

  initUserInfo() {
    this.setData({
      userInfo: {
        date: getDateWithoutYear(),
        week: getWeek(),
        when: getTimeRan()
      }
    })
  },

  /**
   * 跳转到成绩查询页面
   */
  forwardGrade() {
    wx.navigateTo({
      // url: "../../common/portal-login/portal-login?feature=JW&service=GRADE"
      url: "../../service/grade/grade"

    });
  },
  forwardCalendar() {
    wx.navigateTo({
      url: "../../service/calendar/calendar"
    });
  },
  forwardLinks() {
    wx.navigateTo({
      url: "../../service/links/links"
    });
  },
  forwardNotices() {
    wx.navigateTo({
      url: "../../service/notice/notice"
    });
  },
  forwardLibBook() {
    wx.navigateTo({
      url: "../../service/book/book"
    });
  },
  forwardForbidden() {
    wx.showToast({
      title: '服务暂未开放',
      icon: 'none'
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

    return {
      title: '课程成绩一键查询, 快来南工程助手试试吧',
      path: "pages/first-tab/course/course",
      imageUrl: "https://iutr-media.oss-cn-hangzhou.aliyuncs.com/mnpmiao/mnpmiao-share.png"
    };

  }
})