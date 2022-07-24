import deviceUtil from "../../../dist/utils/device-util"
import tabbar from "../../../utils/tab-bar"
import {

  HAS_LOGIN,
  HAS_GET_COURSE,
  COURSE_LOCAL,
  COURSE_CURRENT_XN,
  COURSE_CURRENT_XQ,
  COURSE_CURRENT_WEEK,
  MAX_WEEK
} from '../../../utils/shared-keys'

import {
  get2,
  post
} from '../../../utils/request'
//获取应用实例
const app = getApp()

Page({
  getNavigationBarHeight() {
    const capsuleBarHeight = deviceUtil.getNavigationBarHeight()
    console.log(`CapsuleBar 的高度为${capsuleBarHeight}rpx`)
  },
  data: {

    list: tabbar,
    // 用户是否登录过
    hasLogin: false,
    // 是否获取过课程
    hasGetCourse: false,
    // 页面是否已经加载课程
    hasLoadCourse: false,

    // 当前展示的课程所属学年学期当前周
    pageXn: null,
    pageXq: null,
    pageWeek: null,
    weekIndex: null,
    weekList: null,

    // 底部展示课程详情
    displayCourseDetail: false,
    // 展示详情的课程
    displayCourse: {},


    // 用来保存课表的源码
    courseDataMap: {},

    showSix: false,
    showSeven: false,

    c11: {},
    c12: {},
    c13: {},
    c14: {},
    c15: {},
    c16: {},
    c17: {},

    c31: {},
    c32: {},
    c33: {},
    c34: {},
    c35: {},
    c36: {},
    c37: {},

    c51: {},
    c52: {},
    c53: {},
    c54: {},
    c55: {},
    c56: {},
    c57: {},


    c71: {},
    c72: {},
    c73: {},
    c74: {},
    c75: {},
    c76: {},
    c77: {},


    c91: {},
    c92: {},
    c93: {},
    c94: {},
    c95: {},
    c96: {},
    c97: {},


    c111: {},
    c112: {},
    c113: {},
    c114: {},
    c115: {},
    c116: {},
    c117: {},

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    // 0 本地直接打开, 1 通过登录后跳转到此页面
    let afterLogin = options.local == 0;
    console.log(afterLogin);



    this.getNavigationBarHeight();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  async onShow() {

    const hasGetCourse = this.getStorageSyncOrDefault(HAS_GET_COURSE);

    if (hasGetCourse) {
      // 是否已经加载课程
      if (this.data.hasLoadCourse) {
        return;
      }
      // 加载缓存课程
      this.loadStorageCourse(null);
      this.initWeekListPicker();

      return;
    }
    const hasLogin = this.getStorageSyncOrDefault(HAS_LOGIN);
    this.setData({
      hasLogin: hasLogin,
      hasGetCourse: hasGetCourse
    });
    if (!hasLogin) {
      return;
    }
    const clientAvail = await app.checkClientStatus('PORTAL');

    if (!clientAvail) {
      return;
    }
    wx.showLoading({
      title: '正在加载课程',
    });
    const xn = wx.getStorageSync(COURSE_CURRENT_XN);
    const xq = wx.getStorageSync(COURSE_CURRENT_XQ);
    const week = wx.getStorageSync(COURSE_CURRENT_WEEK);

    const res = await get2('/course/query?xn=' + xn + '&xq=' + xq + '&currentWeek=' + week, false);

    console.log(res);
    if (!res.success) {
      wx.hideLoading();
      wx.showToast({
        title: '课程加载失败',
        icon: 'error'
      });
      return;
    }
    this.handleCourseResponse(res);
    this.initWeekListPicker();

    wx.hideLoading();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 加载周选择器
   */
  initWeekListPicker() {
    const maxWeek = wx.getStorageSync(MAX_WEEK);
    if (!maxWeek) {
      return;
    }
    let arr = [];
    for (let i = 0; i < maxWeek; i++) {

      arr[i] = {
        id: i,
        label: '第' + (i + 1) + '周'
      }
    }
    this.setData({
      weekList: arr,
      weekIndex: this.getStorageSyncOrDefault(COURSE_CURRENT_WEEK, 1) - 1
    });
  },

  /**
   * 解析本地缓存中的课程
   * @param  week 当前周
   */
  async loadStorageCourse(week) {
    if (!week) {
      week = this.getStorageSyncOrDefault(COURSE_CURRENT_WEEK, 1);
    }
    const courseData = wx.getStorageSync(COURSE_LOCAL);
    const request = {
      courseQueryResult: courseData,
      currentWeek: week
    }
    wx.showLoading();
    const res = await post('/course/parse', JSON.stringify(request));
    wx.hideLoading();
    this.handleCourseResponse(res);
  },

  handleCourseResponse(res) {
    if (!res.success) {
      wx.showToast({
        title: '课程加载失败',
      });
      return;
    }
    this.setCourseData(res.data);
    wx.setStorageSync(HAS_GET_COURSE, true);
    wx.setStorageSync(COURSE_LOCAL, res.data.courseQueryResult);
    this.setData({
      hasGetCourse: true,
      hasLoadCourse: true
    });
  },

  getStorageSyncOrDefault(key, defaultVal) {
    const val = wx.getStorageSync(key);
    return val && val != null ? val : defaultVal;
  },


  /**
   * 设置课程表到页面
   * @param {*} courseReturnDTO 课表查询结果
   */
  setCourseData: function (courseReturnDTO) {

    wx.setStorageSync(MAX_WEEK, courseReturnDTO.maxWeek);
    const obj = courseReturnDTO.courseDataMap;

    console.log(obj);
    this.setData({
      c11: obj.c11,
      c12: obj.c12,
      c13: obj.c13,
      c14: obj.c14,
      c15: obj.c15,
      c16: obj.c16,
      c17: obj.c17,


      c31: obj.c31,
      c32: obj.c32,
      c33: obj.c33,
      c34: obj.c34,
      c35: obj.c35,
      c36: obj.c36,
      c37: obj.c37,


      c51: obj.c51,
      c52: obj.c52,
      c53: obj.c53,
      c54: obj.c54,
      c55: obj.c55,
      c56: obj.c56,
      c57: obj.c57,


      c71: obj.c71,
      c72: obj.c72,
      c73: obj.c73,
      c74: obj.c74,
      c75: obj.c75,
      c76: obj.c76,
      c77: obj.c77,


      c91: obj.c91,
      c92: obj.c92,
      c93: obj.c93,
      c94: obj.c94,
      c95: obj.c95,
      c96: obj.c96,
      c97: obj.c97,


      c111: obj.c111,
      c112: obj.c112,
      c113: obj.c113,
      c114: obj.c114,
      c115: obj.c115,
      c116: obj.c116,
      c117: obj.c117,
    })

    if (obj.c16 != null || obj.c36 != null || obj.c56 != null || obj.c76 != null || obj.c96 != null || obj.c116 != null) {
      this.setData({
        showSix: true
      })
    } else {
      this.setData({
        showSix: false
      })
    }
    if (obj.c17 != null || obj.c37 != null || obj.c57 != null || obj.c77 != null || obj.c97 != null || obj.c117 != null) {
      this.setData({
        showSeven: true
      })
    } else {
      this.setData({
        showSeven: false
      })
    }
    this.setData({
      courseDataMap: obj
    })
  },


  /**
   * 设置登录和获取课程状态
   */
  setLoginAndCourseStatus: function (hasLogin, hasGetCourse, updaetStorage) {
    this.setData({
      hasLogin: hasLogin,
      hasGetCourse: hasGetCourse
    });
    if (updaetStorage) {
      wx.setStorageSync(HAS_LOGIN, hasLogin);
      wx.setStorageSync(HAS_GET_COURSE, hasGetCourse);
    }
  },


  /**
   * 回调设置周变换
   * @param  e 点击事件
   */
  async bindWeekChange(e) {
    const newWeekIndex = parseInt(e.detail.value);
    this.setData({
      weekIndex: newWeekIndex
    });
    wx.setStorageSync(COURSE_CURRENT_WEEK, newWeekIndex + 1);

    await this.loadStorageCourse(newWeekIndex + 1);
  },

  /**
   * 显示课程详情
   * @param {*} e 
   */
  displayCourseDetail(e) {
    let obj = e.currentTarget.dataset;
    let idx = obj.idx;
    let map = this.objToStrMap(this.data.courseDataMap);
    let course = map.get(idx);
    if (!course) {
      return;
    }
    this.setData({
      displayCourse: course
    });
    this.setData({
      displayCourseDetail: true
    });

  },
  objToStrMap: function (obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  },

})