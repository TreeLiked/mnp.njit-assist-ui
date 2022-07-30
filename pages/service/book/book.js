// pages/common/portal-login/portal-login.js
import {
  get2
} from '../../../utils/request';
Page({
  data: {

    searchKey: '',
    books: [],
    currentPage: 1,
    maxPage: null

  },

  async onLoad(options) {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    const nextPage = this.data.currentPage + 1;
    if (this.data.maxPage) {
      if (nextPage > this.data.maxPage) {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        });
        return;
      }
    }
    await this.queryBooks(nextPage);
  },


  async queryBooks(pageNum) {

    const key = this.data.searchKey;
    if (!key || key.length == 0 || key.trim().length == 0) {
      wx.showToast({
        title: '请输入图书关键字',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '正在查询',
    });

    const res = await get2('/tools/books?key=' + this.data.searchKey + "&page=" + pageNum);

    const data = res.data;
    this.setData({
      books: this.data.books.concat(data.items),
      maxPage: data.maxPage,
      currentPage: pageNum
    });
    wx.hideLoading();
  },

  forwardBookDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: 'detail/detail?url=' + encodeURIComponent(item.detailUrl)
    });
  },

  setSearchKey(e) {
    this.setData({
      "searchKey": e.detail.value
    })
  },
  searchBooks(e) {
    const searchKey = e.detail.value;
    this.setData({
      searchKey: searchKey,
      books: [],
      currentPage: 1,
      maxPage: null
    });
    this.queryBooks(1);
  }

})