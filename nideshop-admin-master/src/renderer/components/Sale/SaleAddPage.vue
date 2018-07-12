<template>
    <div class="content-page">
        <div class="content-nav">
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>销售商管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{infoForm.id ? '编辑销售商' : '添加销售商'}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="operation-nav">
                <el-button type="primary" @click="goBackPage" icon="arrow-left">返回列表</el-button>
            </div>
        </div>
        <div class="content-main">
            <div class="form-table-box">
                <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
                    <el-form-item label="上级销售商" prop="parent_id">
                        <el-select v-model="infoForm.parent_id" placeholder="请选择上级分类">
                            <el-option v-for="item in parentSale" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input type="number" v-model="infoForm.mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="销售商名称" prop="name">
                        <el-input v-model="infoForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="简短介绍" prop="desc">
                        <el-input type="textarea" v-model="infoForm.desc" :rows="3"></el-input>
                        <div class="form-tip"></div>
                    </el-form-item>
                    <el-form-item label="授权状态" prop="authorize">
                        <el-select v-model="infoForm.authorize" placeholder="请选择状态">
                            <el-option v-for="item in authorizeType" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
<!--                     <el-form-item label="图标" prop="wap_banner_url">
                        <el-upload class="image-uploader" name="wap_banner_pic"
                                   :action="axios.defaults.baseURL+'upload/categoryWapBannerPic'" :show-file-list="false"
                                   :on-success="handleUploadImageSuccess" :headers="uploaderHeader">
                            <img v-if="infoForm.wap_banner_url" :src="infoForm.wap_banner_url" class="image-show">
                            <i v-else class="el-icon-plus image-uploader-icon"></i>
                        </el-upload>
                        <div class="form-tip">图片尺寸：顶级分类为750*246，二级分类为250*250</div>
                    </el-form-item> -->
<!--                     <el-form-item label="排序">
                        <el-input-number v-model="infoForm.sort_order" :min="1" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="启用">
                        <el-switch v-model="infoForm.is_show"></el-switch>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" @click="onSubmitInfo">确定保存</el-button>
                        <el-button @click="goBackPage">取消</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-hidden v-model="infoForm.isRecordNew"></el-hidden>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
  var UUID = require('uuid');
  var moment =require('moment')
  import api from '@/config/api';
 // this.api = api;
  export default {
    data() {
      return {
        rootHost:this.axios.defaults.baseHOST,
        uploaderHeader: {
          'X-Nideshop-Token': localStorage.getItem('token') || '',
        },
        parentSale: [
          {
            // id: 0,
            // name: '平台商城'
          }
        ],
        //是否授权(0,未 1,已 2,已申请 3,审核中 9,不予授权
        authorizeType:[
          {id:0,
            name:'未审核'},
          {id:1,
            name:'审核通过'},
          {id:2,
            name:'申请审核'},
          {id:3,
            name:'审核中'},
          {id:9,
            name:'不予授权'}
        ],
        infoForm: {
          id: 0,
          name: "",
          parent_id: 0,
          desc: '',
          team_id: 0,
          layer: 3,
          authorize: 0,
          isRecordNew:true,
        },
        infoRules: {
          // mobile: [
          //   {required: true, min:11, max:11,message: '请输入11位数字手机号', trigger: 'blur' },
          // ],
          mobile: [
              { validator: validateMobile, trigger: 'blur' },
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
          ],
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          // desc: [
          //   { required: true, message: '请输入简介', trigger: 'blur' },
          // ],
          // wap_banner_url: [
          //   { required: true, message: '请选择分类图片', trigger: 'blur' },
          // ],
        },
      }
    },
    methods: {
      goBackPage() {
        this.$router.go(-1);
      },
      onSubmitInfo() {
       // var ID = UUID.v1();
        if(this.infoForm.parent_id==this.infoForm.id){
                this.$message({
                  type: 'error',
                  message: '上级经销商不能为自己'
                })
          return false;
        }
        this.$refs['infoForm'].validate((valid) => {
          if (valid) {
           // this.infoForm.wap_banner_url=this.infoForm.fileName;
           //取得销售商等级  
            let that =this;
             var sales=this.parentSale.filter(function(p){
              return p.id==that.infoForm.parent_id;
             });
             if(sales[0])
              this.infoForm.layer=sales[0].layer+1;
            if(this.infoForm.isRecordNew){
              this.infoForm.id=UUID.v1();
              this.infoForm.create_admin=JSON.parse(localStorage.userInfo).id;
              this.infoForm.create_time=moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            }

            this.axios.post('sale/store', this.infoForm).then((response) => {
              if (response.data.errno === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
                this.$router.go(-1)
              } else {
                console.log(response.data.errmsg);
                this.$message({
                  type: 'error',
                  message: '保存失败'
                })
              }
              // console.log(response);
            })
          } else {
            return false;
          }
        });
      },
      // handleUploadImageSuccess(res, file) {
      //   if (res.errno === 0) {
      //     switch (res.data.name) {
      //       //分类图片
      //       case 'wap_banner_url':
      //         // this.$set('infoForm.wap_banner_url', res.data.fileUrl);
      //         this.infoForm.wap_banner_url = res.data.fileUrl;
      //         this.infoForm.fileName = res.data.fileName;
      //         break;
      //     }
      //   }
      // },
      getParentSale() {
        this.axios.get('sale/parentSale').then((response) => {
          // this.parentSale = this.parentSale.concat(response.data.data);
          this.parentSale = response.data.data;
        })
      },
      getInfo() {
        if (this.infoForm.id <= 0) {
          return false
        }

        //加载分类详情
        let that = this
        this.axios.get('sale/info', {
          params: {
            id: that.infoForm.id
          }
        }).then((response) => {
          let resInfo = response.data.data;
          // resInfo.is_show = resInfo.is_show ? true : false;
          that.infoForm = resInfo;
          that.infoForm.isRecordNew=false;
          console.log(resInfo);
          console.log(that.rootHost);
          // that.infoForm.wap_banner_url=that.rootHost +that.infoForm.wap_banner_url;
        })
        // .catch(function (error) {
        //     console.log(error);
        // });
        .catch((error)=>{
          console.log(error);
        })
      }

    },
    components: {},
    mounted() {
      this.getParentSale();
      this.infoForm.id = this.$route.query.id || 0;
      this.getInfo();
    }
  }

</script>

<style>
    .image-uploader{
        height: 105px;
    }
    .image-uploader .el-upload {
        border: 1px solid #d9d9d9;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .image-uploader .el-upload:hover {
        border-color: #20a0ff;
    }

    .image-uploader .image-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        min-width: 105px;
        height: 105px;
        line-height: 105px;
        text-align: center;
    }

    .image-uploader .image-show {
        min-width: 105px;
        height: 105px;
        display: block;
    }

</style>
