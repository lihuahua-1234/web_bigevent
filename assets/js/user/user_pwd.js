//入口函数
$(()=>{
    //导入；layui中的form
var form = layui.form

//自定义校验规则
form.verify({
pwd:[/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],

//自定义新输入密码的校验规则
samePwd:function(value){
    //新的密码框的value值,和原密码框的value跟原密码
    //vlaue新密码,原密码的value $('[name=oldPwd]').val()
    if(value === $('[name=oldPwd]').val())
    {
        return '新旧密码不能相同'
   }

},
rePwd:function(value){
    if(value !== $('[name=newPwd]').val())
    {
        return '与新密码输入不一致'
    }
}
})


//绑定.on(submit)事件
$('.layui-form').on('submit',function(e){
    //  e.preventDefault()阻止表单的默认重置行为
    e.preventDefault()
    $.ajax({
        method:'POST',
        url:'/my/updatepwd',
        //this代表当前。layui-form表单, serialize()快速拿到表单内容
        data:$(this).serialize(),
        //success:成功回调函数
        success: function(res){
            if(res.status !== 0){
                return layui.layer.msg('更新失败')

            }
            layui.layer.msg('更新密码成功')
            //重置表单或叫清空表单,在form表单有一个方法叫.reset()清空表单
            //[0]把 $('.layui-form')[0]转换为原生dome元素
            $('.layui-form')[0].reset()

        }
    })
})
})