import Vue from 'vue'
import jsCookie from 'js-cookie'

function getUA(){
    let ua = navigator.userAgent
    let src = jsCookie("source")
    if(src === "ios"){
        return 'ios'
    }else if(src === "android"){
        return 'android'
    }else if(/MicroMessenger/i.test(ua)){
        return 'weixin'
    }else if(/Mobile/i.test(ua)){
        return 'mobile'
    }else{
        return 'other'
    }
}

function hostname(prev) {
    let hostname = location.hostname
    if (hostname.indexOf('haiziwang.com') > -1) {
        return `//${prev}.haiziwang.com`
    } else {
        return `//${prev}.cekid.com`
    }
}

function isLogin(){
    return new Promise((resolve, reject) => {
        let uid = jsCookie('uid')
        let skey = jsCookie('skey')
        let mobile = jsCookie('phone')
        let hostMatch = hostname('user')
        if (uid && skey && mobile){
            (new Vue()).$http.get(`${hostMatch}/user/CheckLogin`, {
                uid: uid,
                skey: skey,
                mobile: mobile
            }).then((res)=>{
                if(res.data.errno == 0){
                    resolve({
                        uid,
                        skey,
                        mobile
                    })
                }else{
                    reject()
                }
            }).catch((err) => {
                reject(err)
            })
        }else{
            reject()
        }
    })
}

function getWeixinJsPromise(){
    return new Promise( (resolve, reject) => {
        let script = document.createElement('script')
        let handler = () => {

        }
        script.setAttribute('type', 'text/javascript')
        script.setAttribute('url', '//res.wx.qq.com/open/js/jweixin-1.0.0.js')
        script.onload = handler
        script.onerror = handler
        document.body.appendChild(script);
    })
}

const checkLogin= function (jscookie) {
        return{
             install(Vue,jscookie){
               Vue.prototype.$myMethod= function (jscookie) {

               }
             }
        }
}

const auth = (router, jsCookie) => {
    return {
        install() {
            Vue.prototype.ensureLogin = function() {
                let hostMatchPassport = hostname('passport')
                let hostMatchHuodong = hostname('huodong')
                return new Promise((resolve, reject) => {
                    isLogin().then((res) => {
                        resolve(res)
                    }).catch(() => {
                        if(getUA(jsCookie) !== 'ios' && getUA(jsCookie) !== 'android'){
                            location.href = hostMatchPassport + '/passport/login?referer=' + encodeURIComponent(location.href);
                        }else{
                            location.href = hostMatchHuodong +'/login?cmd=login'

                            // router.go({
                            //     path: '/login',
                            //     query: {
                            //         cmd: 'login'
                            //     }
                            // })
                        }
                    })
                })
            }
        }
    }
}

const setting = {
    install() {
        Vue.prototype.settings = {
            url: hostname('ias') + '/ias-web/ifsia',
            aseUrl: hostname('ase') + '/ase-web/comment/queryMutilCommentReply.do',
            o2oUrl:hostname('apio2o') + '/api',
            o2ofeedsUrl: hostname('apidyn') + '/api/v1/feeds',
            cmtUrl:hostname('cmt')+ '/v1/activity',
        }
    }
}

const gethost = ()=>{
    return {
        install(){
            Vue.prototype.$$hostname = (prev)=>{
                return hostname(prev)
            }
        }
    }
}

const cookie = (jsCookie)=>{
    return {
        install(){
            Vue.prototype.cookie = jsCookie
        }
    }
}

const format = {
    install(){
        Vue.prototype.$$dateFormat = (time, flag) => {
            let t = time || ''
            var now
            if((typeof t) == 'number'){
                now = new Date(t*1000)
            }else {
                now = new Date(t.toString().replace(/-/g, '/'))
            }
            // console.log(now)
            let year = now.getFullYear()
            let month = now.getMonth()+1 < 10 ? ('0' + (now.getMonth()+1)) : now.getMonth()+1
            let date = now.getDate() < 10 ? ('0' + now.getDate()) : now.getDate()
            let hour = now.getHours() < 10 ? ('0' + now.getHours()) : now.getHours()
            let min = now.getMinutes() < 10 ? ('0' + now.getMinutes()) : now.getMinutes()
            let sec = now.getSeconds() < 10 ? ('0' + now.getSeconds()) : now.getSeconds()
            if(flag){
                return `${hour}:${min}:${sec}`
            }else{
                return `${year}-${month}-${date}`
            }
        }
    }
}

const ua = (jsCookie) => {
    return {
        install(){
            Vue.prototype.$$ua = (jsCookie) => {
                return getUA(jsCookie)
            }
        }
    }
}

const share = () => {
    return {
        install(){
            Vue.prototype.$$share = (config) => {
                let conf = config || {}
                let shareConfig = {
                    imgUrl: conf.imgUrl || '',
                    desc: conf.desc || '等你来参加',
                    link: conf.link || location.href,
                    title: conf.title || '孩子王精彩活动'
                }

                let UA = getUA(jsCookie)

                if(UA === 'android' || UA === 'ios'){
                    window.getAppShareInfo = function(){
                        return shareConfig
                    }
                    //window.appShareSuccess = conf.success;
                }else if(UA === 'weixin'){
                    if(document.getElementById('weixin-share')){
                        wechatShare.ready(shareConfig, 1)
                    }else{
                        let script = document.createElement('script')
                        script.setAttribute('type', 'text/javascript')
                        script.setAttribute('id', 'weixin-share')
                        script.setAttribute('src', '//st.haiziwang.com/vendor/wechatShare-1.0.js')
                        script.async = true
                        script.onload = function(){
                            wechatShare.ready(shareConfig, 1)
                        }
                        document.body.appendChild(script);
                    }
                }
            }
        }
    }
}

const title = ()=>{
    return {
        install(){
            Vue.prototype.$$title = (title) => {
                if(getUA() == 'weixin' || getUA() == 'ios' || getUA() == 'android'){
                    document.title = title;
                    var body = document.getElementsByTagName('body')[0];
                    document.title = title;
                    var iframe = document.createElement("iframe");
                    iframe.setAttribute("src", `//st.haiziwang.com/static/pc/common/favicon.ico`);
                    iframe.addEventListener('load', function() {
                        setTimeout(function() {
                            iframe.removeEventListener('load', false);
                            document.body.removeChild(iframe);
                        }, 0);
                    },false);
                    iframe.style.display = 'none'
                    document.body.appendChild(iframe);
                }else{
                    document.title = title
                }
            }
        }
    }
}

export {
    auth,
    setting,
    format,
    cookie,
    ua,
    share,
    gethost,
    title,
    checkLogin
}
