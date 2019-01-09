function userLogin(code, shareId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://www.paipa.xyz/register/wxReg`,
      data: { 'code': code, 'shareId': shareId },
      header: { 'Content-Type': 'json' },
      success: resolve,
      fail: reject
    })
  })
}

function find(type, page = 1, count = 20, search = '',userId = -1) {
  const params = { start: (page - 1) * count, count: count, city: getApp().data.currentCity, userId: userId }
  console.log(params)
  return fetchApi(type, search ? Object.assign(params, { q: search }) : params)
    .then(res => res.data)
}

function req(api, path, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${api}/${path}`,
      data: Object.assign({}, params),
      header: { 'Content-Type': 'json' },
      success: resolve,
      fail: reject
    })
  })
}


// const URI = 'https://douban.uieee.com/v2/movie'
const URI = 'https://www.paipa.xyz/wechat/friPhotos'


/**
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
function fetchApi(type, params) {
  return req(URI, type, params)
}


module.exports = { find, userLogin }