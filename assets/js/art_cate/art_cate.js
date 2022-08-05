$(function () {
    // 导入
    var layer = layui.layer
    var form = layui.form

    initArCateList()
    // 获取文章分类方法
    function initArCateList() {
        // 发起ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            // headers 就是请求头配置对象
            //  headers: {
            //     Authorization: localStorage.getItem('token') || '',
            //     },
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                // 3.定义数据 4.调用template函数
                var htmlstr = template('tpl-news', res)
                // console.log(htmlstr)
                // 5.渲染html结构
                $('#news-item').html(htmlstr)
            }
        })
    }

    //为添加类别按钮注册点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。 若你采用layer.open({type: 1})方式调用
            type: 1,
            // 宽高
            area: ['500px', '250px'],
            title: '添加文章分类'
                // script模板写html
                ,
            content: $('#dialog-add').html()
        })

    })


    // 通过代理的形式， 为 form-add 表单绑定 submit 事件 事件委托
    $('body').on('submit','#form-add', function (e) {
        // 阻止默认
        e.preventDefault()
        // console.log('ok')

        // 发请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('新增分类失败！')
              }
              console.log(res)
              initArtCateList()
              layer.msg('新增分类成功！')
              // 根据索引，关闭对应的弹出层
              layer.close(indexAdd)
            }

        })
    })


    // 编辑弹出框 通过事件委托 为 btn-edit 按钮注册点击事件
    var indexEdit = null
    $('tbody').on('click','.btn-edit', function(e){
        // console.log('ok')
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。 若你采用layer.open({type: 1})方式调用
            type: 1,
            // 宽高
            area: ['500px', '250px'],
            title: '修改文章分类',
            // script模板写html
            content: $('#dialog-edit').html()
        })


        // 拿到属性名的id
        var id = $(this).attr('data-id')
        // console.log(id)
        // 发请求获取对应分类的数据
        $.ajax({
            type: 'GET', // 用 method: 'GET' 两随便都可以
            url:'/my/article/cates/' + id,
            success: function(res) {
              // console.log(res)
              // 拿到res.data 数据, 快速填充表单
              form.val('form-edit', res.data)
            }
        })
    })



    // 通过事件委托 为 btn-edit 按钮注册点击事件
    $('body').on('submit', '#form-edit', function(e){
        e.preventDefault()
        console.log('ok')
        $.ajax({
            type:'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                // 调用函数 获取修改后的值
                initArCateList()
            }
        })
    })



    // 删除事件 通过事件委托 为 btn-delete 按钮注册点击事件
    $('tbody').on('click', '.btn-delete', function(e){
        // console.log('ok')
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            
            $.ajax({
                type:'GET',
                url:'/my/article/deletecate/' + id,
                success: function(res){
                    if(res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    layer.close(index);
                    // 调用函数 重新获取
                    initArCateList()
                }
            })
        });
    })

})