
function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}
export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
// 请求封装
const host = 'http://192.168.101.14:5757/lm'
export { host }
export function request (url, method, data, header = {}) {
  wx.showLoading({
    title: 'Loading...'
  });
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json'
      },
      success (res) {
        wx.hideLoading();
        resolve(res.data)
      },
      fail (err) {
        wx.hideLoading();
        reject(err)
      },
      complete () {
        wx.hideLoading();
      }
    })
  })
}
export function get (url, data) {
  return request(url, 'GET', data)
}
export function post (url, data) {
  return request(url, 'POST', data)
}
export function mydelete (url, data) {
  return request(url, 'DELETE', data)
}

export default {
  formatNumber,
  formatTime
}
