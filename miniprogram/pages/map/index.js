// miniprogram/pages/map/index.js
// 引入SDK核心类
var QQMapWX = require('../qqmap-wx-jssdk.js');

// 实例化API核心类
var controlMap = new QQMapWX({
  key: 'ZG2BZ-XSY33-FOC3E-YIYEH-REYY3-3YFWE' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:[],
    latitude:'',
    longitude:'',
    markers: [],
    // covers: [{
    //   latitude: 30.41026,
    //   longitude: 103.81166,
    //   iconPath: '/images/icon/location.png'
    // }],
    polyline:[]
  },

  onReady: function (e) {
    
  },
  onHandleGetStorge:function(){
    let _that = this;
    wx.getStorage({
      key: 'address',
      success: function (res) {
        let latitude = res.data.addressInfo.location.lat
        let longitude = res.data.addressInfo.location.lng
        _that.setData({ 
          address: res.data ,
          markers: [{
            id: 1,
            latitude,
            longitude,
            iconPath: '/images/icon/location.png',
            name: '名车   名匠'
          }],
        })
        _that.driving()
      },
    })
  },
  onHandleGetLocation: function () {
    let _that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        // 调用接口
        _that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        _that.onHandleGetStorge()
      },
    })
  },

  //事件回调函数
  driving: function () {
    var _this = this;
    //网络请求设置
    let { latitude,longitude,address} = _this.data
    let toLatitude = address.addressInfo.location.lat
    let toLongitude = address.addressInfo.location.lng
    var opt = {
      //WebService请求地址，from为起点坐标，to为终点坐标，开发key为必填
      url:`https://apis.map.qq.com/ws/direction/v1/driving/?from=${latitude},${longitude}&to=${toLatitude},${toLongitude}&key=ZG2BZ-XSY33-FOC3E-YIYEH-REYY3-3YFWE`
,
      method: 'GET',
      dataType: 'json',
      //请求成功回调
      success: function (res) {
        var ret = res.data
        if (ret.status != 0) return; //服务异常处理
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        //设置polyline属性，将路线显示出来
        _this.setData({
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 2
          }]
        })
      }
    };
    wx.request(opt);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onHandleGetLocation()
  
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