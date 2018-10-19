// miniprogram/pages/record/index.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    isMore:true,
    SKIP:0,
    LIMIT:10,
  },
  onHandleGetList:function(more,e){
    let _that = this;
    let { isMore, list, LIMIT} = _that.data;
    db.collection('carOrder')
    .count({
      success:(res)=>{
        let total = res.total
          wx.showLoading({
            title: '加载中...',
          })
          db.collection('carOrder')
            .orderBy('addTime', 'desc')
            .limit(LIMIT)
            .get({
              success: (res) => {
                if ((list.length + res.data.length) >= total) {
                  _that.setData({ isMore: false })
                }
                for (var i = 0; i < res.data.length; i++) {
                  let timea = res.data[i].addTime.getFullYear()
                  let timeb = parseInt(res.data[i].addTime.getMonth()) + 1
                  let timec = res.data[i].addTime.getDate() > 9 ? res.data[i].addTime.getDate() : '0' + res.data[i].addTime.getDate()
                  let timed = res.data[i].addTime.getHours()
                  let timee = res.data[i].addTime.getMinutes() > 9 ? res.data[i].addTime.getMinutes() : '0' + res.data[i].addTime.getMinutes()
                  let addTime = timea + '年' + timeb + '月' + timec + ' ' + timed + ':' + timee
                  res.data[i].addTime = addTime
                }
                _that.setData({ list: res.data, SKIP: res.data.length >= 10 ? _that.data.SKIP + LIMIT : res.data.length })
                wx.hideLoading()
              },
              fail: console.error
            })
      }
    })
  },

  onHandleDataMore: function (e) {
    let _that = this;
    let { isMore, list, SKIP, LIMIT } = _that.data;
    db.collection('carOrder')
    .count({
      success: (res) => {
        let total = res.total
        if (isMore) {
          wx.showLoading({
            title: '加载中...',
          })
          db.collection('carOrder')
            .orderBy('addTime', 'desc')
            .skip(SKIP)
            .limit(LIMIT)
            .get({
              success: (res) => {
                if ((list.length + res.data.length) >= total) {
                  _that.setData({ isMore: false })
                }
                for (var i = 0; i < res.data.length; i++) {
                  let timea = res.data[i].addTime.getFullYear()
                  let timeb = parseInt(res.data[i].addTime.getMonth()) + 1
                  let timec = res.data[i].addTime.getDate() > 9 ? res.data[i].addTime.getDate() : '0' + res.data[i].addTime.getDate()
                  let timed = res.data[i].addTime.getHours()
                  let timee = res.data[i].addTime.getMinutes() > 9 ? res.data[i].addTime.getMinutes() : '0' + res.data[i].addTime.getMinutes()
                  let addTime = timea + '年' + timeb + '月' + timec + ' ' + timed + ':' + timee
                  res.data[i].addTime = addTime
                }
                _that.setData({ list: _that.data.list.concat(res.data), SKIP: _that.data.list.length >= 10 ? _that.data.SKIP + LIMIT : _that.data.list.length })
                
                wx.hideLoading()
              },
              fail: console.error
            })
        } else {
          console.log('没有更多了')
        }
      }
    })
  },
  onHandleToDetail:function(e){
    let _id = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: "/pages/orderDetail/index?id=" + _id,
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
    this.onHandleGetList()
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