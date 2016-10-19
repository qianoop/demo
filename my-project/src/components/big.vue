<template>
    <div>
        <div>{{activityName}}</div>
        <div>
          {{isEnd}}
        </div>
    </div>
</template>
<style scoped>
    body{
        background-color:#ffffff;
    }
</style>
<script>
    export default{
        data(){
            return{
                msg:'goodboy',
                isGood:true,
                activityName:"",
                activityStartTime:""
            }
        },
      created(){
          this.fetchData()
      },
      watch:{
        '$route': 'fetchData'
      },
      computed:{
            isEnd () {
                 let date1 = new Date(this.activityStartTime);
                  console.log(this.activityStartTime);
                 let  now = new Date();
                 if(date1>now){
                     return `${this.activityStartTime}报名结束了`;

                 }else{
                     return `${this.activityStartTime}报名正在进行`;

                 }
            }
       },
      methods:{
        fetchData(){
          let  id  = this.$route.query.id
          id = id || "未传参数"

          this.$http.get("http://item.haiziwang.com/item/commo2o?sku_id=376255&flag=1",{}).then((data)=>{
                  console.log(data);
          },(err)=>{
              console.log(err);
          })
          this.activityName ="活动"+id;
          this.activityStartTime=1476020934000;
        }
      }
    }
</script>
