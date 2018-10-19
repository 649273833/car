// miniprogram/pages/index/index.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagePath:[],
    isAdmin:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onHandleLaunch()
    this.onHandleGetCode()
  },
  onHandleGetCode: function () {
    let _that = this;
    db.collection('codeimg')
      .get()
      .then((res) => {
        _that.setData({ imagePath: res.data })
      })
  },
  onHandleLaunch:function(){
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        wx.hideLoading()
        db.collection('admin').where({
          _openid: res.result.openid
        })
          .get({
            success: res => {
              if (res.data.length === 1) {
                that.setData({ isAdmin : true })
              } else if (res.data.length === 0) {
                that.setData({ isAdmin: false })
              }
            }
          })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  onHandleNavGo:function(e){
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  onHanleGetUserInfo: function () {
    // 获取用户信息
    let _that = this;
    wx.showLoading({
      title: '正在用户鉴权',
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              _that.onGetOpenid()
            }
          })
        }
      }
    })
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        wx.hideLoading()
        db.collection('admin').where({
          _openid: res.result.openid
        })
          .get({
            success: res => {
              if (res.data.length === 1){
                wx.navigateTo({
                  url: "/pages/admin/index",
                })
              } else if (res.data.length === 0){
                wx.navigateTo({
                  url: "/pages/record/index",
                })
              }
            }
          })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  onHandleCallPhone:function(){
    wx.makePhoneCall({
      phoneNumber: '18715764633' 
    })
  },
  onHandlePreview: function (e) {
    let _that = this;
    let path = [];
    let { imagePath } = _that.data;
    for (let i = 0; i < imagePath.length; i++) {
      path.push(imagePath[i].imagePath)
    }
    wx.previewImage({
      current: e.currentTarget.dataset.img,
      urls: path
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
    return {
      title: '名车 名匠',
      imageUrl: '/images/wx_h_20181005091244.jpg'
    }
  }
})