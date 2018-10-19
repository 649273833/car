// miniprogram/pages/maintenance/index.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carPlate: '',
    carModel: '',
    carPhone:'',
    carDate: '',
    carTime: '',
    carType: 1,
  },
  onHandleRescue: function (e) {
    let val = e.detail.value;
    let type = e.currentTarget.dataset.handleType;
    this.setData({ [type]: val })
  },
  onHandleRadioChange: function (e) {
    this.setData({ carType: e.detail.value })
  },
  onHandleDateChange:function(e){
    this.setData({
      carDate: e.detail.value
    })
  },
  onHandleTimeChange: function (e) {
    this.setData({
      carTime: e.detail.value
    })
  },
  onHandleSubmit: function () {
    let { carPlate, carModel, carDate, carTime, carType, carPhone,} = this.data
    db.collection('carOrder').add({
      data: {
        carPlate,
        carModel,
        carPhone,
        carDate,
        carTime,
        carType,
        actions:0,
        addTime:db.serverDate()
      }
    })
      .then((res) => {
        console.log(res)
        if (res.errMsg === "collection.add:ok") {
          wx.showModal({
            title: '提交成功',
            content: '如需加急，请拨打电话',
            confirmText: '拨打电话',
            success: function (res) {
              if (res.confirm) {
                wx.makePhoneCall({
                  phoneNumber: '18715764633',
                  complete:()=>{
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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