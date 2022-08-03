$(function(){
// 调用 getUserInfo
getUserInfo()

var layer = layui.layer
// 退出按钮绑定点击事件
$('#btnLogout').click(function(){
    // console.log('ok')
    // 提示用户是否退出
    layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, 
    function(index){
        // console.log('ok')
        // 1.删除本地存储的token
        localStorage.removeItem('token')
        // 2.跳转到登录页
        location.href = '/login.html'
        layer.close(index);
      });
})
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
     method: 'GET',
     url: '/my/userinfo',
     // headers 就是请求头配置对象
    //  headers: {
    //     Authorization: localStorage.getItem('token') || '',
    //     },
    success: function(res) {
    //  console.log(res)
     if (res.status !== 0) {
         return layui.layer.msg('获取用户信息失败')
      }

      // 调用 renderAvatar 渲染用户头像
      renderAvatar(res.data)
      },

    //   // 不论成功还是失败都会调用 compete 回调函数
    //   complete: function(res) {
    //     // console.log('执行了 complete 函数')
    //     // console.log(res)

    //     // 在 complete 回调函数中， 可以使用 res.responseJSON 拿到服务器响应回来的数据
    //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //         // 1.强制清空token
    //         localStorage.removeItem('token')
    //         // 2.强制跳转大牌登录页面
    //         location.href = '/login.html'
    //     }
    //   }
    
   })
}


//渲染用户的头像
function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3.按需渲染用户头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()

        // 获取用户名的第一个字当作头像, .toUpperCase()转大写
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }

}