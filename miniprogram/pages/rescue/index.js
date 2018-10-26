// miniprogram/pages/index/rescue/index.js
// 引入SDK核心类
var QQMapWX = require('../qqmap-wx-jssdk.js');

// 实例化API核心类
var rescueMap = new QQMapWX({
  key: 'ZG2BZ-XSY33-FOC3E-YIYEH-REYY3-3YFWE' // 必填
});


const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carPlate:'',
    carModel:'',
    carPhone:'',
    carDetails:'',
    carAddress:'',
    imagePath: [],
  },
  onHandleRescue:function(e){
    let val = e.detail.value;
    let type = e.currentTarget.dataset.handleType;
    this.setData({[type]:val})
  },
  onHandleGetLocation:function(){
    let _that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        // 调用接口
        rescueMap.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            _that.setData({ carAddress: res.result.address})
          },
          fail: function (res) {
            console.log(res);
          },
        });
      },
    })
  },
  //获取一个n位的随机数
  RndNum: function (n) {
    var rnd = "";
    for (var i = 0; i < n; i++)
      rnd += Math.floor(Math.random() * 10);
    return rnd;
  },
  //获取当前日期
  getNowFormatDate: function () {
    var date = new Date();
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString();
    var strDate = date.getDate().toString();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + month + strDate;
    return currentdate;
  },
  onHandleUpload: function () {
    let _that = this;
    let { imagePath } = _that.data;
    if (imagePath.length > 8) {
      wx.showToast({
        title: '一次最多上传9张图片',
      })
      return false
    }
    // 选择图片
    wx.chooseImage({
      count: 9,
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths
        for (let i = 0; i < filePath.length; i++) {
          // 上传图片
          const cloudPath = _that.getNowFormatDate() + _that.RndNum(5) + filePath[i].match(/\.[^.]+?$/)[0]
          wx.cloud.uploadFile({
            cloudPath,
            filePath: filePath[i],
            success: res => {
              let fileID = res.fileID
              let imagePath =  filePath[i]
              let data = [{ fileID, imagePath}]
              _that.setData({
                imagePath: _that.data.imagePath.concat(data)
              })
              wx.hideLoading()
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
              wx.hideToast()
            },
            complete: () => {

            }
          })
        }
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  onHandlePreview: function(e) {
    let _that = this;
    wx.previewImage({
      current: e.currentTarget.dataset.img,
      urls: _that.data.imagePath.imagePath
    })
  },
  onHandleClose: function (e) {
    let _that = this;
    let index = e.currentTarget.dataset.img
    let fileID = e.currentTarget.dataset.fileid
    let { imagePath } = this.data
    wx.showModal({
      title: '删除二维码',
      content: '确定删除吗？',
      success:res=>{
        if(res.confirm){
          wx.cloud.deleteFile({
            fileList: [fileID]
          }).then(res => {
            imagePath.splice(index, 1)
            _that.setData({ imagePath })
          }).catch(error => {
            console.log('err')
          })
        }else if(res.cancel){
          console.log('cancel')
        }
      }
    })
  },
  onHandleSubmit: function () {
    let { carPlate, carModel, carDetails, carAddress, carPhone, imagePath} = this.data
    let fileList = [];
    for(let i=0;i<imagePath.length;i++){
      fileList.push(imagePath[i].fileID)
    }
    db.collection('carOrder').add({
      data:{
        carPlate,
        carModel,
        carPhone,
        carType:0,
        actions:0,
        carDetails,
        carAddress,
        fileList,
        addTime: db.serverDate()
      }
    })
    .then((res)=>{
      if (res.errMsg === "collection.add:ok"){
        wx.showModal({
          title: '提交成功',
          content: '如需加急，请拨打救援电话',
          confirmText:'拨打电话',
          success: function (res) {
            if (res.confirm) {
              wx.makePhoneCall({
                phoneNumber: '18715764633',
                complete: () => {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              })
            } else if (res.cancel) {
              wx.navigateBack({
                delta:1
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
    this.onHandleGetLocation()
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