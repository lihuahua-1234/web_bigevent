$(function () {
    // 导入
    var layer = layui.layer
    var form = layui.form

    initCate()
    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
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
                console.log(res)
                // layer.msg('获取文章分类列表成功')
                // 3.定义数据 4.调用template函数
                var htmlstr = template('fl-news', res)
                // console.log(htmlstr)
                // 5.渲染html结构
                $('[name="cate_id"]').html(htmlstr)
                // 通知layui 重新再渲染一次
                form.render()
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').click(function () {
        $('#coverFile').click()
    })

    // 为文件选择框注册 change 事件
    $('#coverFile').on('change', function (e) {
        // 获取用户选择的文件
        var files = e.target.files
        console.log(files)

        // 判断用户是否选择了图片
        if (files.length === 0) {
            return
            // layer.msg('请选择照片')
        }
        // 2.将文件，转化为路径
        var newImgURL = URL.createObjectURL(files[0])
        console.log(newImgURL)
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'

    // 为存为草稿按钮 绑定点击事件
    $('#btnSave2').click(function () {
        art_state = '草稿'
        console.log(art_state)
    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        // 阻止默认行为
        // console.log('submit')
        e.preventDefault()
        // console.log('你好')
        // 2.基于form表单， 快速创建一个 FormData 对象      
        var fd = new FormData($(this)[0]) // 把 jquey 转化为原生 Dom 对象
        // 3.将文件的发布状态， 追加到fd中 state 是服务器api要求名字
        fd.append('state', art_state) // ('state', art_state) 键值对

        // fd.forEach(function (v, k) {
        //     console.log(k, v)
        // })
        // 4.将封面裁剪过后，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象，存储到fd中
                fd.append('cover_img', blob)

                // 6.发起ajax数据请求
                publishArticle(fd)
            })
    })


    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:fd,
            // 注意。如果向服务器提交的是FormData 格式的数据
            // 必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res)
                if(res.status !== 0){
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                // 发布文章成功后， 跳转到文章列表页面
                //location.href = '/art_cate/art_list.html'
            }
        })
    }




})