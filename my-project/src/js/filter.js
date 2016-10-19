import Vue from 'vue'
import headerImgSrc  from '../images/default-touxiang.png'

Vue.filter('headerImg', function(value) {
	return value? value : headerImgSrc
})

Vue.filter('zip', function(value,zip) {
    if(zip && !/^data/.test(value)){
        return `${value}${zip}`
    }
    return value;
})

export default{
	install(){
		Vue.prototype.$$filter = {
			headerImg: () => {
				return Vue.headerImg
			}
		}
	}
}




