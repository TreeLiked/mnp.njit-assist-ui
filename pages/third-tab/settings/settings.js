import tabbar from "../../../utils/tab-bar"
import {
  XH,
  HAS_GET_COURSE,
  COURSE_CURRENT_XN,
  COURSE_CURRENT_XQ
} from '../../../utils/shared-keys'
// import PORTAL_LOGIN_URL from "../../../utils/routes-cst"
Component({
  pageLifetimes: {

    show() {

      console.log("settings on show");
      this.refreshStorage();
    }
  },
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
    xnIndex: 5,
    xqIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {


    onLoad: function () {
      this.initXnXqPicker();
      this.setXnXqStatus();
    },

    refreshCourse(e) {
      wx.navigateTo({
        url: "../../common/portal-login/portal-login?feature=JW&service=COURSE"
      });
      wx.removeStorageSync(HAS_GET_COURSE);
    },

    clearData() {
      wx.clearStorageSync();
      wx.showToast({
        title: '清除成功',
        icon: 'none'
      });
      this.refreshStorage();
    },


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

    initXnXqPicker() {
      console.log("!xnxq-----------");

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
    setXnXqStatus() {
      const val1 = wx.getStorageSync(COURSE_CURRENT_XN);
      const val2 = wx.getStorageSync(COURSE_CURRENT_XQ);
      if (val1) {
        const xnIndex = this.data.xnList.findIndex(item => item.id == val1);
        if (xnIndex != -1) {
          this.setData({xnIndex});
        }
      }
      if (val2) {
        const xqIndex = this.data.xqList.findIndex(item => item.id == val2);
        if (xqIndex != -1) {
          this.setData({xqIndex});
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


    }
  }
})