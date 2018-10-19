// miniprogram/pages/orderDetail/index.js
const db = wx.cloud.database();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:'',
    imageList:[],
    isAdmin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onHandleGetDataFormID(options)
    this.onHandleGetAdmin()
  },
  onHandleGetDataFormID: function (options){
    let _that = this;
    db.collection('carOrder').doc(options.id).get({
      success:res=>{
        let timea = res.data.addTime.getFullYear()
        let timeb = parseInt(res.data.addTime.getMonth()) + 1
        let timec = res.data.addTime.getDate() > 9 ? res.data.addTime.getDate() : '0' + res.data.addTime.getDate()
        let timed = res.data.addTime.getHours()
        let timee = res.data.addTime.getMinutes() > 9 ? res.data.addTime.getMinutes() : '0' + res.data.addTime.getMinutes()
        let addTime = timea + '年' + timeb + '月' + timec + ' ' + timed + ':' + timee
        res.data.addTime = addTime
        _that.setData({data:res.data})
      }
    })
  },
  onHandleCallPhone: function () {
    wx.makePhoneCall({
      phoneNumber: '18715764633'
    })
  },
  onHandlePreview: function (e) {
    let _that = this;
    wx.previewImage({
      current: e.currentTarget.dataset.img,
      urls: _that.data.data.imagePath
    })
  },
  onHandleGetAdmin:function(){
    let _that = this;
    db.collection('admin').where({
      _openid: app.globalData.openid
    })
      .get({
        success: res => {
          if (res.data.length === 1) {
            _that.setData({isAdmin:true})
          }
        }
      })
  },
  onHandleOrderAccept:function(){
    let _that = this;
    let { data } = _that.data;
    wx.showModal({
      title: '确定接单',
      content: '真的要接受这个订单吗',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'accept',
            data: { _id: data._id }
          })
            .then((res) => {
              if (res.result.stats.updated > 0) {
                wx.showToast({
                  title: '成功',
                })
                data.actions = 1;
                _that.setData({ data })
              }
            })
        } else {
          wx.showToast({
            title: '网络错误，请稍后再试！',
          })
        }
      }
    })
  },
  onHandleOrderRefused:function(){
    let _that = this;
    let {data} = _that.data;
    wx.showModal({
      title: '确定拒绝',
      content: '真的要拒绝这个订单吗',
      success: res => {
        if (res.confirm){
          wx.cloud.callFunction({
            name: 'refused',
            data: { _id: data._id }
          })
            .then((res) => {
              if (res.result.stats.updated > 0) {
                wx.showToast({
                  title: '成功',
                })
                data.actions = -1;
                _that.setData({ data })
              }
            })
        }else{
          wx.showToast({
            title: '网络错误，请稍后再试！',
          })
        }
      }
    })
  },
  onHandleOrderFinish:function(){
    let _that = this;
    let { data } = _that.data;
    wx.showModal({
      title: '确定完成',
      content: '确定已经完成所有项目了吗？',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name:'finish',
            data:{_id:data._id}
          })
          .then((res)=>{
            if (res.result.stats.updated > 0) {
              wx.showToast({
                title: '成功',
              })
              data.actions = 2;
              _that.setData({ data })
            }
          })
        }
         else {
          wx.showToast({
            title: '网络错误，请稍后再试！',
          })
        }
      }
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