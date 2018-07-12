<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{infoForm.id ? '编辑商品' : '添加商品'}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <el-button type="primary" @click="goBackPage" icon="arrow-left">返回列表</el-button>
      </div>
    </div>
    <div class="content-main">
      <div class="form-table-box">
        <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
  
          <el-form-item label="选择仓库" prop="store_house_id">
             <el-select v-model="infoForm.store_house_id" value-key="id" filterable placeholder="请选择" @change="handleSelectChageHouse">
              <el-option
                v-for="item in infoForm.allCategory.store_house"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择供货商" prop="brand_id">
             <el-select v-model="infoForm.brand_name" value-key="id" filterable placeholder="请选择" @change="handleSelectChageBrand">
              <el-option
                v-for="item in infoForm.allCategory.brand"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
 
          <el-form-item label="入库单编码" prop="no">
            <el-input type="number"  v-model="infoForm.no"></el-input>
          </el-form-item>
          <el-form-item label="供应商联系人" prop="brand_contactor">
            <el-input   v-model="infoForm.brand_contactor"></el-input>
          </el-form-item>
          <el-form-item label="供应商联系电话" prop="brand_phone">
            <el-input type="number"  v-model="infoForm.brand_phone"></el-input>
          </el-form-item>
          <el-form-item label="采购人" prop="purchaser">
            <el-input  v-model="infoForm.purchaser"></el-input>
          </el-form-item>
          <el-form-item label="采购人电话" prop="purchaser_phone">
            <el-input type="number"  v-model="infoForm.purchaser_phone"></el-input>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input   v-model="infoForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input  v-model="infoForm.content"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitInfo">确定保存</el-button>
            <el-button @click="goBackPage">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/config/api';
  import $ from 'jquery'
  export default {
    data() {
      return {
        uploaderHeader: {
          'X-Nideshop-Token': localStorage.getItem('token') || '',
        },

        infoForm: {

          id  :0                          //bigint(20) NOT NULL,
          ,no  :''                         //varchar(20) DEFAULT NULL COMMENT '编码',
          ,store_house_id  :0             //varchar(36) DEFAULT NULL COMMENT '仓库编号',
          ,brand_id        :0             //int(11) DEFAULT NULL COMMENT '供应商编号',
          ,title           :''            //varchar(200) DEFAULT NULL COMMENT '标题',
          ,content          :''           //varchar(2000) DEFAULT NULL COMMENT '内容',
          ,brand_contactor  :''           //varchar(50) DEFAULT NULL COMMENT '供应商联系人',
          ,brand_phone      :''           //varchar(50) DEFAULT NULL COMMENT '供应商电话',
          ,purchaser        :''           //varchar(50) DEFAULT NULL COMMENT '采购人',
          ,purchaser_phone  :''           //varchar(50) DEFAULT NULL COMMENT '采购人电话',
          // ,enter_time       :null         // datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '时间',
          // ,allCategory     :{brand:[]  ,store_house:[],product:[]  };
          ,allCategory     :{}
          // ,brand_name      :''
        },
        infoRules: {
          // name: [
          //   { required: true, message: '请输入名称', trigger: 'blur' },
          // ],
          enter_number: [
            {required: true, min:1, max:5,message: '请输入5位以下数字', trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      handleSelectChageHouse(val){
        //下拉框选择内容改变后
        this.infoForm.store_house_id =val;
        console.log( this.infoForm.store_house_id );
      },
      handleSelectChageBrand(val){
        //下拉框选择内容改变后
        this.infoForm.brand_id =val;
        console.log( this.infoForm.brand_id );
      },
      handleSelectChageProduct(val){
        //下拉框选择内容改变后
        this.infoForm.product_id =val;

        var product = this.infoForm.allCategory.product.filter(function (e) { return e.product_id == val; });

        this.infoForm.goods_id =product[0].goods_id;
        console.log( this.infoForm.product_id );
        console.log( this.infoForm.goods_id );
      },

      goBackPage() {
        this.$router.go(-1);
      },

      onSubmitInfo() {
        this.$refs['infoForm'].validate((valid) => {
          if (valid) {
            this.infoForm.fileUrl=this.infoForm.fileName
            this.axios.post('store/store', this.infoForm).then((response) => {
              if (response.data.errno === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
                this.$router.go(-1)
              } else {
                this.$message({
                  type: 'error',
                  message: '保存失败'
                })
              }
            })
          } else {
            return false;
          }
        });
      },

      getInfo() {
        if (this.infoForm.id <= 0) {
          return false
        }
        

        //加载商品详情
        let that = this
        this.axios.get('store/info', {
          params: {
            id: that.infoForm.id
          }
        }).then((response) => {
          // resInfo.is_on_sale = resInfo.is_on_sale ? "1" : "0";
          that.infoForm = response.data.data.data;

          // 初始化 summernote
          // that.initSummerNote();
        })
      },
      // 获取属性列表
      getAttributes(){
        let that = this
        this.axios.get('store/Attributes', {
          params: {}
        }).then((response) => {
          that.infoForm.allCategory = response.data.data;
          // console.log(response.data.data);
          console.log("all category.......");
        })
      },

    },
    components: {
      // quillEditor
    },
    computed: {
      // editor() {
      //   return this.$refs.myTextEditor.quillEditor
      // }
    },
    mounted() {

      this.infoForm.id = this.$route.query.id || 0;
      this.getInfo();
      console.log(api);
      if(this.infoForm.id == 0){
        this.getAttributes();
      }
    },
  }

</script>

<style>
  /* .edit_container{ */
  .ql-container{
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
  }
  .image-uploader-diy{
    height: 105px;
  }
  .image-uploader-diy .el-upload {
    border: 1px solid #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .image-uploader-diy .el-upload:hover {
    border-color: #20a0ff;
  }

  .image-uploader-diy .image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 187px;
    height: 105px;
    line-height: 105px;
    text-align: center;
  }

  .image-uploader-diy .image-show {
    width: 187px;
    height: 105px;
    display: block;
  }

  .image-uploader-diy .new-image-uploader {
    font-size: 28px;
    color: #8c939d;
    width: 165px;
    height: 105px;
    line-height: 105px;
    text-align: center;
  }

  .image-uploader-diy .new-image-uploader .image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 165px;
    height: 105px;
    line-height: 105px;
    text-align: center;
  }

  .image-uploader-diy .new-image-uploader .image-show {
    width: 165px;
    height: 105px;
    display: block;
  }
  .item-url-image-fuzhu .el-input{
    width: 260px;
  }
</style>
