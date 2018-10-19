// miniprogram/pages/control/index.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagePath:[],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onHandleGetCode()
  },
  onHandleGetCode:function(){
    let _that = this;
    db.collection('codeimg')
    .get()
    .then((res)=>{
      _that.setData({ imagePath:res.data})
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
                let _id = res._id;
                let _openid = 'oQHke0QGDoAtpzxO0JweKbDgeFX8';
                let imagePath = filePath[i];
                let data = [{ _id, _openid, imagePath, fileID}]
                _that.setData({
                  imagePath: _that.data.imagePath.concat(data),
                })
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
      path.push(imagePath[i].imagePath)
    } 
    wx.previewImage({
      current: e.currentTarget.dataset.img,
      urls: path
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
          db.collection('codeimg').doc(index).remove({
            success: function (res) {
              wx.cloud.deleteFile({
                fileList: [fileID]
              }).then(res => {
                console.log(res.fileList)
                imagePath.splice(index, 1)
                _that.setData({ imagePath })
              }).catch(error => {
                console.log('err')
              })
            }
          })
        }else if(res.cancel){
          console.log('cancel')
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
  onShareAppMessage: function () {

  }
})