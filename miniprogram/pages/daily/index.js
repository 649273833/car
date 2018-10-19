// miniprogram/pages/daily/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls:[
      'https://682d-h-be98d5-1251967570.tcb.qcloud.la/itembg/5ad9e5a80001732c05400300-360-202.jpg?sign=5bf71aa491a9f161c7cd26df23d439ab&t=1538889076',
      'https://682d-h-be98d5-1251967570.tcb.qcloud.la/itembg/5a9f4c2e00010ce205400300-360-202.jpg?sign=25555d5f9ee71155e4f1cd5ecdf368e4&t=1538889145',
      'https://682d-h-be98d5-1251967570.tcb.qcloud.la/itembg/5b3204580001f28805400300-360-202.jpg?sign=e40ef1d49b2f4f0ce5f16896c13aa915&t=1538889162',
      'https://682d-h-be98d5-1251967570.tcb.qcloud.la/itembg/5b39eb5a00016c4205400300-360-202.jpg?sign=047d71f14fdef50e3d32d93189a58317&t=1538889178',
      'https://682d-h-be98d5-1251967570.tcb.qcloud.la/itembg/57bd5ec80001b0c405400300-360-202.jpg?sign=678ca5bf7f87636389a1ecc91fd7885b&t=1539150420'
    ]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onHandlePreview: function (e) {
    let _that = this;
    wx.previewImage({
      // current: e.currentTarget.dataset.img,
      urls: _that.data.imgUrls
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
 
})