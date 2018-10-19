//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      
    }
  }
})
  // ,
  // "tabBar": {
  //   "color": "#333",
  //   "selectedColor": "#1296db",
  //   "borderStyle": "white",
  //   "list": [
  //     {
  //       "pagePath": "pages/index/index",
  //       "text": "首页",
  //       "iconPath": "images/icon/tabbar-home-gray.png",
  //       "selectedIconPath": "images/icon/tabbar-home-blue.png"
  //     },
  //     {
  //       "pagePath": "pages/user/index",
  //       "text": "个人",
  //       "iconPath": "images/icon/tabbar-personal-gray.png",
  //       "selectedIconPath": "images/icon/tabbar-personal-blue.png"
  //     }
  //   ]
  // }