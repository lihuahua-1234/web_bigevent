$(function(){
    // 导入layui
    var form = layui.form
    var layer= layui.layer

    // 校验规则
    form.verify({
        // 所有密码
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        // 新密码
        samePwd: function(value) {
            if(value === $('[name="oldPwd"]').val()) {
                return '新旧密码不能相同!'
            }
        },

        // 确认密码
        rePwd: function(value) {
            if(value !== $('[name="newPwd"]').val()) {
                return '两次密码不一致!'
            }
        }


    })

    $('.layui-form').on('submit', function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            // headers 就是请求头配置对象
            //  headers: {
            //     Authorization: localStorage.getItem('token') || '',
            //     },

            data: $(this).serialize(),

            success: function(res) {
                if(res.status !== 0){
                    return layer.msg('更新密码失败')
                }
                console.log(res)
                layer.msg('更新密码成功')

                // 重置表单
                // jQuey 转换为原生 DOM元素, 清空表单reset()
                $('.layui-form')[0].reset()
            }

        })
    })
})