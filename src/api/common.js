import request from '@/utils/request'

//多枚举
export function fieldTable(query) {
  return request({
    url: '/system/baseEnum/multipleEnums',
    method: 'post',
    data: query
  })
}

//上传图片
export function UploadImage(query, config) {
  return request({
    url: '/common/upload',
    method: 'post',
    data: query,
    onUploadProgress: progressEvent => {
      // progressEvent.loaded:已上传文件大小
      // progressEvent.total:被上传文件的总大小
      // console.log( progressEvent.loaded)
      // console.log( progressEvent.total)
    }

  })
}
