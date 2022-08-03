$(function (){
    //导入layui
    var form = layui.form
    var layer = layui.layer

    // 校验规则
    form.verify({

        nickname: function(value){
            if(value.length > 6) {
                return '昵称长度必须在 1 - 6 个字符'
            }
        }
    })
    // 调用
    initUserInfo()


    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url:'/my/userinfo',
            // headers 就是请求头配置对象
            //  headers: {
            //     Authorization: localStorage.getItem('token') || '',
            //     },
            success: function(res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res)
                // 调用 form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function(e){
        // 阻止默认
        e.preventDefault()
        initUserInfo()
    })
    
    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        // 发起 ajax 数据请求
        $.ajax({
            method: 'POST',
            url:'/my/userinfo',
            // 快速拿到表达填写的数据
            data:$(this).serialize(),
            success: function(res){
                // console.log(res)
                if(res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')

                // 调用父页面的方法,重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            
            }
        })
    })

   
})