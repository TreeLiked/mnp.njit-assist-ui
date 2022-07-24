// pages/common/portal-login/portal-login.js
import {
  get2
} from '../../../utils/request';
const app = getApp();

Page({
  data: {

    pickerArray: [
      [],
      []
    ],
    // 默认当前年，第一学期
    pickerIndex: [5, 1],
    // 
    gradeList: []

  },

  async onLoad(options) {

    this.initPickerData();

  },


  async bindMultiPickerChange(e) {

    wx.showLoading({
      title: '正在查询',
    });

    const clientAvail = await app.checkClientStatus('PORTAL');
    if (!clientAvail) {
      wx.hideLoading();
      wx.redirectTo({
        url: "../../common/portal-login/portal-login?feature=JW&service=GRADE"
      });
      return;
    }

    let xnIndex = e.detail.value[0];
    let xqIndex = e.detail.value[1];

    this.setData({
      pickerIndex: e.detail.value
    });

    let xnArg = this.data.pickerArray[0][xnIndex].id;
    let xqArg = this.data.pickerArray[1][xqIndex].id;

    const res = await get2('/grade/query?xn=' + xnArg + (xqArg == 0 ? '' : '&xq=' + xqArg));

    console.log(res);
    this.setData({
      gradeList: res.data
    });
    wx.hideLoading();
  },

  /**
   * 加载下拉框
   */
  initPickerData() {
    const curYear = new Date().getFullYear();
    const xnList = []
    for (let i = curYear - 5, j = 0; i < curYear + 5; i++, j++) {
      xnList[j] = {
        id: i,
        label: i + '-' + (i + 1) + ' 学年'
      }
    }
    const xqList = [{
      id: 0,
      label: '全部'
    }, {
      id: 1,
      label: '1 学期'
    }, {
      id: 2,
      label: '2 学期'
    }, {
      id: 3,
      label: '3 学期'
    }];
    this.setData({
      pickerArray: [
        xnList, xqList
      ]
    })
  }





})