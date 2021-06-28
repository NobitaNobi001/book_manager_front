import {request} from './request'

export default {
  listBook(current, size) { //分页
    return request({
      url: '/book/list?current=' + current + '&size=' + size,
      method: 'get'
    })
  },

  updateBook(data) { //编辑书籍 更新信息
    return request({
      url: '/book/update',
      method: 'put',
      data
    })
  },

  addBook(data) {
    return request({
      url: '/book/add',
      method: 'post',
      data
    })
  },

  deleteBook(id) {
    return request({
      url: '/book/remove/' + id,
      method: 'delete',
    })
  },

  deleteMutiBook(id) {
    return request({
      url: '/book/remove',
      method: 'delete',
      data: {'bookId': id}
    })
  },

  getBookById(id) {
    return request({
      url: '/book/get?bookId=' + id,
      method: 'get',
    })
  },

   searchBookByName(current,size,bookName){//     这是写好了模糊查询接口的最新jar包 访问url是/book/search 参数的话是current size bookName 可以类别/book/list 接口
    return request({
      url:'/book/search?current=' + current + '&size=' + size + '&bookName=' + bookName,
      method: 'get',
    })
    },

    publishBook(){ //发布
    return request({
      url:'/book/publish',
      method:'get'
    })
  },

    syncBook(){ //更新(同步)
      return request({
        url:'/book/subscribe',
        method:'get'
      })
    }



}
