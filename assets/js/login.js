$(function(){
    // 点击 去注册账号的链接
    $('#link_reg').on('click', function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击 去登录账号的链接
    $('#link_login').on('click', function(){
        $('.reg-box').hide()
        $('.login-box').show()
    })


    // 从 layui 中获取 form 对象
    var form = layui.form
    // 从 layui 中获取 layer 对象
    var layer = layui.layer

    // 通过form.verify()函数自定义校验规则
    form.verify({
    // 自定义了pwd校验规则
     pwd: [
        /^[\S]{6,12}$/
        ,'密码必须6到12位，且不能出现空格'
      ],

      // 校验两次密码输入是否一致
      repwd: function (value){
          // 通过形参拿到的是确认密码框中的内容

          // 还需要拿到密码框中的内容
          //属性查找的方式
        //   var pwd =  $('.reg-box input').val()
          var pwd =  $('.reg-box [name=password]').val()

          // 然后进行移除等于的判断
          if(pwd !== value) {
          // 如果判断失败， 则return一个提示消息即可
          return '两次密码不一致'
        }
      }  
    })


    // 监听注册表单提交事件
    $('#form_reg').on('submit', function(e){
        // 1. 阻止默认提交行为
        e.preventDefault()

        // 2.发起ajax的post请求
        // var data =  { username: $(this).serialize(), 
        // password:$(this).serialize() }
        var data =  { username: $('#form_reg [name=username]').val(), 
        password:$('#form_reg [name=password]').val() }

        $.post('/api/reguser', data, 
        function(res){
            if(res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功, 请登录')
            
            // 模拟人的点击行为
            $('#link_login').click()
        })
    })



    // 监听登录表单的提交事件
    $('#form_login').submit(function(e){
        // 1. 阻止默认提交行为
        e.preventDefault()

        // 发起请求
        $.ajax({
            url:'/api/login',
            method: 'POST',
            // 快速获取表单中的数据.serialize()
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                // 将登录成功得到的 token 字符串 保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }

        })

    })

})