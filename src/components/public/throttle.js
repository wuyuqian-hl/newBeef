const throttle = function(fn, delay = 100) {
    //首先设定一个变量，在没有执行我们的定时器时为null
    var timer = null;
    return function () {
        //当我们发现这个定时器存在时，则表示定时器已经在运行中，需要返回
        if (timer) return;
        timer = setTimeout(() => {
            fn.apply(this, arguments);
            timer = null
        }, delay)
    }
}
// 搜索时节流
export default throttle