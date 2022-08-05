$(function () {
    // 导入
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    // 定义补零的函数
    function padZero(n) {
        return n < 10 ? '0' + n : n
    }
    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值， 默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据, 默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '', // 文章发布状态
    }

    initTable()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            // headers 就是请求头配置对象
            //  headers: {
            //     Authorization: localStorage.getItem('token') || '',
            //     },
            data: q,
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // layer.msg('获取文章列表成功')
                // 3.定义数据 4.调用template函数
                var htmlstr = template('tpl-news', res)
                // console.log(htmlstr)
                // 5.渲染html结构
                $('#news-item').html(htmlstr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }


    initCate()
    // 初化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // layer.msg('获取文章分类列表成功')
                // 3.分类定义数据 4.分类调用template函数
                var htmlstr = template('fl-news', res)
                // console.log(htmlstr)
                // 5.渲染html结构
                $('#fl').html(htmlstr)
                // 通知layui 重新再渲染一次
                form.render()
            }
        })
    }


    // 为筛选表单绑定submit事件
    $('#form-serch').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选择到的值
        var cate_id = $('[name="cate_id"]').val()
        var state = $('[name="state"]').val()

        // 为查询参数对象 q 中对应的属性赋值 
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        // 调用函数
        initTable()
    })


    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total)
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示的条数
            curr: q.pagenum, // 	设置默认被选中的分页
            // layout 自定义排版。可选值有：count（总条目输区域）、prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、refresh（页面刷新区域。注意：layui 2.3.0 新增） 、skip（快捷跳页区域）
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 指定每页条数的选择项。如果 layout 参数开启了 limit，则会出现每页条数的select选择框
            limits: [2, 4, 8, 10],
            // 分页发生切换的时候 触发 jump 回调
            // 触发 jump 回调的方式有两种: 
            // 1.点击页码的时候， 会触发 jump 回调
            // 2.只要调用了 laypage.render() 方法， 就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值 来判断是通过那种方式， 触发的 jump 回调
                // 如果 first 的值为 true， 证明是方式2触发的， 否则就是方式1触发的
                console.log(first)
                console.log(obj.curr) // 拿到最新的页码值
                // 把最新的页码值， 赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数， 赋值到 q 这个参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表， 并渲染表格
                // initTable()
                if (first !== true) {
                    initTable()
                }
            }
        })
    }


    // 通过代理的形式， 为删除按钮绑定点击事件处理函数
    $('body').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // console.log(len)
        // 获取到删除文章按钮的id
        var id = $(this).attr('data-id')
        // console.log('ok')
        // 询问用户是否要删除数据
        //eg1
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    //    console.log(res)
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败')
                    }
                    layer.msg('删除文章分类成功')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据如果没有剩余的数据了，则让页码值 -1 之后再重新调用 initTable() 方法
                    if (len === 1) {
                        // 如果 len 的值等于1， 证明删除完毕之后， 页码上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // 删除后 调用initTable()重新加载数据
                    initTable()
                }
            })

            layer.close(index);
        });
    })
})