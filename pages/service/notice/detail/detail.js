import {
  get2
} from '../../../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    noticeItem: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {


    wx.showLoading({
      title: '加载中...',
    });
    const res = await get2('/tools/notice/detail?url=' + options.url);
    this.setData({
      noticeItem: res.data
    });
    wx.hideLoading();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})