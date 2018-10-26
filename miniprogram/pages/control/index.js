// miniprogram/pages/control/index.js
// 引入SDK核心类
var QQMapWX = require('../qqmap-wx-jssdk.js');

// 实例化API核心类
var controlMap = new QQMapWX({
  key: 'ZG2BZ-XSY33-FOC3E-YIYEH-REYY3-3YFWE' // 必填
});
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagePath:[],
    addressName:'',
    addressInfo:[],
    phone:'',
    _id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onHandleGetCode()
    this.onHandleGetConcatInfo()
  },
  onHandleGetCode:function(){
    let _that = this;
    db.collection('codeimg')
    .get()
    .then((res)=>{
      let fileID = [],_id=[];
      for(let i=0;i<res.data.length;i++){
        fileID.push(res.data[i].fileID)
        _id.push({ _id: res.data[i]._id})
      }
      wx.cloud.getTempFileURL({
        fileList: fileID,
        success: res => {
          let fileList = res.fileList
          for(let i=0;i<fileList.length;i++){
            fileList[i]._id=_id[i]._id
          }     
          _that.setData({ imagePath: fileList })
        },
        fail: err => {

        }
      })
    })
  },
  onHandleGetConcatInfo:function(){
    let _that = this;
    db.collection('concatinfo').get({
      success:res=>{
        let data = res.data[0]
        _that.setData({
          addressName: data.addressName,
          addressInfo: data.addressInfo,
          phone: data.phone,
          _id:data._id
        })
      }
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
        title: '最多上传9张图片',
      })
      return false
    }
    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths
        for(let i=0;i<filePath.length;i++){
          // 上传图片
          const cloudPath = _that.getNowFormatDate() + _that.RndNum(5) + filePath[i].match(/\.[^.]+?$/)[0]

          wx.cloud.uploadFile({
            cloudPath,
            filePath: filePath[i],
            success: res => {
              let fileID = res.fileID
              db.collection('codeimg').add({
                data: {
                  fileID,
                  imagePath: filePath[i]
                },
              })
              .then((res)=>{
                // let _id = res._id;
                // let _openid = 'oQHke0QGDoAtpzxO0JweKbDgeFX8';
                // let imagePath = filePath[i];
                // let data = [{ _id, _openid, imagePath, fileID}]
                // _that.setData({
                //   imagePath: _that.data.imagePath.concat(data),
                // })
                _that.onHandleGetCode()
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
  onHandlePreview: function (e) {
    let _that = this;
    let path = [];
    let { imagePath} = _that.data;
    for(let i=0;i<imagePath.length;i++){
      path.push(imagePath[i].tempFileURL)
    } 
    wx.previewImage({
      current: e.currentTarget.dataset.img,
      urls: path
    })
  },
  onHandleClose: function (e) {
    let _that = this;
    let fileID = e.currentTarget.dataset.fileid
    let _id = e.currentTarget.dataset.img
    console.log(_id)
    let { imagePath } = this.data
    wx.showModal({
      title: '删除二维码',
      content: '确定删除吗？',
      success:res=>{
        if(res.confirm){
          db.collection('codeimg').doc(_id).remove({
            success: function (res) {
              console.log(res)
              wx.cloud.deleteFile({
                fileList: [fileID]
              }).then(res => {
                imagePath.splice(fileID, 1)
                _that.onHandleGetCode()
              }).catch(error => {
                console.log('err')
              })
            },
            fail:()=>{
              wx.showToast({
                title: '删除失败，请重试！',
              })
            }
          })
        }else if(res.cancel){
          console.log('cancel')
        }
      }
    })
  },
  onHandleConcatInfo:function(e){
    let val = e.detail.value;
    let type = e.currentTarget.dataset.handleType;
    this.setData({ [type]: val })
  },
  isMobile:function(val){
    let reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
    return reg.test(val)
  },
  onHandleSubmitConcatInfo:function(){
    let _that = this;
    let {addressName,phone,_id} = _that.data;
    if (!_that.isMobile(phone)){
      wx.showToast({
        title: '这不是个手机号码！',
      })
    }else{
      controlMap.geocoder({
        address: addressName,
        success: function (res) {
          console.log(res.result)
          let result = res.result
          _that.setData({ addressInfo: res.result })
          db.collection('concatinfo').doc(_id).update({
            data: {
              addressName,
              addressInfo: result,
              phone
            },
            success: res => {
              if (res.stats.updated == 1) {
                wx.showToast({
                  title: '更新成功！',
                })
              } else if (res.stats.updated == 0) {
                wx.showToast({
                  title: '和上次没啥变化！',
                })
              }
            },
            fail: res => {
              wx.showToast({
                title: '错误，请重试！',
              })
            }
          })
        },
        fail: function (res) {
          wx.showModal({
            title: '错误',
            content: res.message,
          })
        },
      });
    }
  },
  onHandleGetLocation: function () {
    let _that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        // 调用接口
        controlMap.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            _that.setData({ addressName: res.result.address })
          },
          fail: function (res) {
            console.log(res);
          },
        });
      },
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

  }
})