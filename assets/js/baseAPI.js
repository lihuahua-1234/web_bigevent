// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候 会先调用 $.ajaxPrefilter 函数
// 在这个函数中， 可以拿到外面给 ajax 提供的配置对象
$.ajaxPrefilter(function (options) {

    // 在发起真正的 Ajax 请求之前， 统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    console.log(options.url)

    // 统一为又权限的接口， 设置 headers 请求头
    // indexOf：查找某个元素首次出现的索引值，找不到就是-1
    if (options.url.indexOf('/my') !== -1){
        options.headers = {
         Authorization: localStorage.getItem('token') || '',
      }
    }

    // 全局统一挂载 complete
    options.complete = function(res) {
        // console.log('执行了 complete 函数')
        // console.log(res)

        // 在 complete 回调函数中， 可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空token
            localStorage.removeItem('token')
            // 2.强制跳转大牌登录页面
            location.href = '/login.html'
        }
      }
})