// miniprogram/pages/map/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 28.915382,
    longitude: 105.429912,
    markers: [{
      id: 1,
      latitude: 28.915382,
      longitude: 105.429912,
      name: '名车   名匠'
    }],
    polyline: [{
      points: [{
        longitude: 105.429912,
        latitude: 28.915382
      }, {
          longitude: 0,
          latitude: 0
        }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
  },

  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
    this.getCenterLocation()
  },
  getCenterLocation: function () {
    let that = this
    wx.getLocation({
      type:'gcj02',
       success: function (res) {
        that.setData({
          polyline: [{
            points: [{
              longitude: 105.429912,
              latitude: 28.915382
            }, {
              longitude: res.longitude,
              latitude: res.latitude
            }],
            color: "#FF0000DD",
            width: 2,
            dottedLine: true
          }],
        })
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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