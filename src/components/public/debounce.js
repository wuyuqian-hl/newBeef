const debounce=function(fn, delay){
    let timer = null
    return function(){
        let content = this;
        let args = arguments;
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(()=>{
            fn.apply(content,args)
        }, delay)
    }
}
// 点击防抖，避免多次提交
export default debounce