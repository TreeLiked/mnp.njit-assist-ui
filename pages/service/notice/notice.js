// pages/common/portal-login/portal-login.js
import {
  get2
} from '../../../utils/request';
Page({
  data: {

    pageNum: null,
    notices: []

  },

  async onLoad(options) {

    this.loadNotice(null);

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    const pt = this.data.pageNum - 1;
    await this.loadNotice(pt, false);
  },


  async loadNotice(pageNum) {

    wx.showLoading({
      title: '正在加载',
    });

    const res = await get2('/tools/notices?page=' + (pageNum == null ? '' : pageNum));

    const data = res.data;
    this.setData({
      notices: this.data.notices.concat(data.items),
      pageNum: pageNum == null ? data.pageCnt: pageNum
    });
    wx.hideLoading();
  },

  forwardNoticeDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: 'detail/detail?url=' + encodeURIComponent(item.contentUrl)
    });
  },

  async loadMore() {


  
  }





})