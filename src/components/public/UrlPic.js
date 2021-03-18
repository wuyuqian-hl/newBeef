// 图片前缀方法
export const prefix = (url) => {
  if (url && url.startsWith('http')) {
    return url
  } else {
    url = `https://www.huangkeyan.cn${url}`
    return url
  }
}