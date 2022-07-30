import {
  get2
} from '../../../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    bookDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {


    wx.showLoading({
      title: '加载中...',
    });
    const res = await get2('/tools/book/detail?url=' + options.url);
    this.setData({
      bookDetail: res.data
    });
    wx.hideLoading();
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})