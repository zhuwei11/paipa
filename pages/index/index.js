const app = getApp()
var uid = 0;
Page({
  onLoad(params) {
    console.log(params);
    if (params.shareId != null){
      this.data.suserId = params.shareId
      try {
        wx.setStorageSync('shareId', params.shareId)
      } catch (e) { }
    }
    
    console.log(this.data.suserId)
    app.wechat.login()
      .then(res => {
        if (res.code) {
          console.log('登录成功！' + app.data.name)
          console.log('登录成功！' + res.code)
          
          // this.data.userId = res.code
          if(app.data.userId == null) {
            const that = this
            app.wechat.userLogin(res.code, this.data.suserId != null ? this.data.suserId : 0)
              .then(res => {
                console.log(res.data.result)
                
                if (res.data.result != 0) {
                  console.error('paipa登录失败！' + res.data.message)
                }else {
                  uid = res.data.userId
                  that.setData({userId: res.data.userId})
                  app.wechat.setStorage('userId', res.data.userId);
                  console.log('登录成功！' + uid)
                }
            })
          }
        } else {
          console.error('获取用户登录态失败！' + res.errMsg)
        }
      })
  },

  /**
   * 页面的初始数据
   */
  data: {
    // https://picsum.photos/1080/1920/?image=302
    image: '/assets/background.png',
    result: null,
    result1: null,
    result2: null,
    userId: null,
    suserId: null, //分享来源id
    isCloseTip: true
  },

  detectImage1 (src) {
    wx.showLoading({ title: '分析中...' })

    const that = this

    wx.uploadFile({
      url: 'https://ai.qq.com/cgi-bin/appdemo_plateocr',
      filePath: src,
      name: 'image_file',
      success (res) {
        console.log(JSON.parse(res.data))
        const result = JSON.parse(res.data)
        
        // 检测失败
        if (result.ret !== 0) {
          that.setData({ image: '/assets/background.png' })
          wx.showToast({ icon: 'none', title: '找不到车牌哟！' })
          return false
        }

        that.setData({ result1: result.data.item_list[0],isCloseTip:false })
        wx.hideLoading()
      }
    })
  },
  //翻译
  detectImage2(src) {
    wx.showLoading({ title: '分析中...' })

    const that = this

    wx.uploadFile({
      url: 'https://ai.qq.com/cgi-bin/appdemo_imagetranslate',
      filePath: src,
      name: 'image_file',
      formData: {
        source: 'en',
        target:'zh',
        scene:'word'
      },
      success(res) {
       
        const result = JSON.parse(res.data)

        // 检测失败
        if (result.ret !== 0) {
          that.setData({ image: '/assets/background.png' })
          wx.showToast({ icon: 'none', title: '翻译失败！' })
          return false
        }
        var str = "";
        
        for (const aa in result.data.image_records) {
          console.log(aa)
          str += result.data.image_records[aa].source_text + "【" + result.data.image_records[aa].target_text+"】\n";
         
        }
        if(str == "") {
          that.setData({ image: '/assets/background.png' })
          wx.showToast({ icon: 'none', title: '找不到可翻译的内容！' })
          return false
        }
        that.setData({ result2: str, isCloseTip: false })
        wx.hideLoading()
      }
    })
  },
 


  detectImage(src) {
    wx.showLoading({ title: '分析中...' })

    const that = this

    wx.uploadFile({
      url: 'https://ai.qq.com/cgi-bin/appdemo_detectface',
      filePath: src,
      name: 'image_file',
      success(res) {
        const result = JSON.parse(res.data)

        // 检测失败
        if (result.ret !== 0) {
          that.setData({ image: '/assets/background.png' })
          wx.showToast({ icon: 'none', title: '找不到你的小脸蛋喽' })
          return false
        }
        console.log(result.data.face[0])
        wx.uploadFile({
          url: 'https://www.paipa.xyz/register/uploadImg',
          filePath: src,
          name: 'file',
          formData: { userId: uid, age: result.data.face[0].age, expression: result.data.face[0].expression, beauty: result.data.face[0].beauty, gender: result.data.face[0].gender, glass: result.data.face[0].glass},
          success(res) {
            console.log(res);
          }
        })
        app.wechat.setStorage('beauty', result.data.face[0].beauty);
        that.setData({ result: result.data.face[0],isCloseTip:false })
        wx.hideLoading()
      }
    })
  },

  getImage (type = 'camera',cc) {
    this.setData({ result: null, result1: null, result2: null})
   
    const that = this
    wx.chooseImage({
      sizeType: ['original'],
      sourceType: [type],
      success(res) {
        const image = res.tempFiles[0]

        // 图片过大
        if (image.size > 1024 * 3000) {
          wx.showToast({ icon: 'none', title: '图片大小不能超过3MB, 请重新拍张小的！' })
          return false
        }
        console.log(image.path);
        that.setData({ image: image.path })
        
        if(cc == '1') {
          that.detectImage1(image.path)
        } else if (cc == '2') {
          that.detectImage2(image.path)
        }else {
          that.detectImage(image.path)
        }
        
      }
    })
  },

  handleCamera () {
    this.getImage()
  },

  handleChoose () {
    this.getImage('album')
  },

  handleCamera1() {
    this.getImage('camera','1')
  },

  handleChoose1() {
    this.getImage('album','1')
  },

  handleCamera2() {
    this.getImage('camera', '2')
  },

  handleChoose2() {
    this.getImage('album', '2')
  },

  closeTip: function (e) {
    console.log(1111)
    this.setData({isCloseTip:true})
    this.setData({ image: '/assets/background.png'})
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(b) {
    wx.getStorageSync('key')
    var beauty = null
    try {
      beauty = wx.getStorageSync('beauty')
    }catch(e){
    }
    console.log("/" +this.route + "?shareId=" + uid)
    if (beauty) {
      return {
        title: `刚刚测了自己的颜值为【` + beauty + `】你也赶紧来试试吧！`, path: `/pages/index/index?shareId=` + uid, imageUrl: `/assets/timg.jpg` }
    }else {
      return {
        title: `刚刚测了自己的颜值，你也赶紧来试试吧！`, path: `/pages/index/index?shareId=` + uid, imageUrl: `/assets/timg.jpg` }
    }
  }
})