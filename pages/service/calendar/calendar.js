// pages/calendar/calendar.js

import {
  get2
} from '../../../utils/request';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    imgUrl: 'https://iutr-media.oss-cn-hangzhou.aliyuncs.com/mnpmiao/cal.jpeg?ts=' + new Date().getTime(),
    touch: {
      distance: 0,
      scale: 1,
      baseWidth: null,
      baseHeight: null,
      scaleWidth: null,
      scaleHeight: null
    },
    block: false,
    intro: '轻点查看图片，长按下载',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    // let that = this;
    // const res= await get2('/tools/calendar');
    // console.log(res);
    // const base64 = wx.arrayBufferToBase64(res.data);
    // this.setData({imgData: "data:image/png;base64,"+ base64})
    wx.showToast({
      title: '点击图片以进入缩放或保存',
      icon: 'none',
      duration: 3000
    });
  },

  displayImage: function (e) {
    if (this.data.lock) {
      return;
    }
    let url = this.data.imgUrl;
    wx.previewImage({
      current: url,
      urls: [url]
    })

  },
  touchend: function () {
    if (this.data.lock) {
      //开锁
      setTimeout(() => {
        this.setData({
          lock: false
        });
      }, 300);
    }
  },
  goCanendarChoice: function (e) {

    this.setData({
      lock: true
    });
    let url = this.data.imgUrl;
    wx.showActionSheet({
      itemList: ['保存到本地', '关闭'],
      success(res) {
        switch (res.tapIndex) {
          case 0:
            wx.showLoading({
              title: '正在下载，请稍候',
            })
            wx.downloadFile({
              url: url,
              success(res) {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function (res) {
                    wx.showToast({
                      title: '保存成功',
                      icon: 'success',
                      duration: 2000
                    });
                    wx.hideLoading();
                  },
                  fail: function (res) {
                    wx.showToast({
                      title: '保存失败',
                      icon: 'none',
                      duration: 1000
                    });
                    wx.hideLoading();
                  }
                });
              }
            });
            return;
          case 1:
            return;
        }
      },
      fail(res) {}
    })
  },
  touchstartCallback: function (e) {
    if (e.touches.length == 1) return
    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    this.setData({
      'touch.distance': distance,
    });
  },
  touchmoveCallback: function (e) {
    let touch = this.data.touch
    if (e.touches.length == 1) return
    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    let distanceDiff = distance - touch.distance;
    let newScale = touch.scale + 0.005 * distanceDiff
    if (newScale >= 2) {
      newScale = 2
    }
    if (newScale <= 0.6) {
      newScale = 0.6
    }
    let scaleWidth = newScale * touch.baseWidth
    let scaleHeight = newScale * touch.baseHeight
    // 赋值 新的 => 旧的
    this.setData({
      'touch.distance': distance,
      'touch.scale': newScale,
      'touch.scaleWidth': scaleWidth,
      'touch.scaleHeight': scaleHeight,
      'touch.diff': distanceDiff
    })
  },
  bindload: function (e) {
    // bindload 这个api是<image>组件的api类似<img>的onload属性
    this.setData({
      'touch.baseWidth': e.detail.width,
      'touch.baseHeight': e.detail.height,
      'touch.scaleWidth': e.detail.width,
      'touch.scaleHeight': e.detail.height
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})