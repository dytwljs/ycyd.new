<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>入库清单项管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{infoForm.id ? '编辑入库清单项' : '添加入库清单项'}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <el-button type="primary" @click="goBackPage" icon="arrow-left">返回列表</el-button>
      </div>
    </div>
    <div class="content-main">
      <div class="form-table-box">
        <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
          <el-form-item label="选择产品" prop="brand_id">
             <el-select v-model="infoForm.product_id" value-key="id" filterable placeholder="请选择" @change="handleSelectChageProduct">
              <el-option
                v-for="item in infoForm.allCategory.product"
                :key="item.product_id"
                :label="item.goods_name"
                :value="item.product_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入库数量" prop="number">
            <el-input type="number"  v-model="infoForm.number"></el-input>
          </el-form-item>
                    <el-form-item label="进货价">
                      <el-breadcrumb-item  >{{infoForm.price}}</el-breadcrumb-item>
                    </el-form-item>
                    <el-form-item label="批发价">
                      <el-breadcrumb-item  >{{infoForm.trade_price}}</el-breadcrumb-item>
                    </el-form-item>
                    <el-form-item label="零售价">
                      <el-breadcrumb-item  >{{infoForm.retail_price}}</el-breadcrumb-item>
                    </el-form-item>

          <!-- <el-form-item label="进货价" prop="price">
            <el-input type="number"  v-model="infoForm.price"></el-input>
          </el-form-item>
          <el-form-item label="批发价" prop="trade_price">
            <el-input type="number"  v-model="infoForm.trade_price"></el-input>
          </el-form-item>
          <el-form-item label="零售价" prop="retail_price">
            <el-input type="number"  v-model="infoForm.retail_price"></el-input>
          </el-form-item> -->
          <el-form-item label="上架">
            <el-switch  v-model="infoForm.is_on_sale"></el-switch>
            <!-- <el-switch on-text="上架" off-text="下架" on-value="1" off-value="0" v-model="infoForm.is_on_sale"></el-switch> -->
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
          'X-ycyd-Token': localStorage.getItem('token') || '',
        },

        infoForm: {
          id  :0                         //bigint(20) NOT NULL,
          ,store_enter_id  :0             //bigint(20) NOT NULL,
          ,goods_id        :0             //int(11) DEFAULT NULL COMMENT '商量编号',
          ,product_id      :0             //int(11) DEFAULT NULL COMMENT '产品编号',
          ,qr_code         :''            //varchar(255) DEFAULT NULL COMMENT '二维码',
          ,wx_code         :''            //varchar(255) DEFAULT NULL COMMENT '微信二维码',
          ,ean_code        :''            //varchar(255) DEFAULT NULL COMMENT '条形码',
          ,enter_time      :''            //datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '时间',
          ,price       :0             //decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '进货价',
          ,trade_price  :0             //decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '司机进货价',
          ,retail_price    :0             //decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '零售价',
          ,is_on_sale      :1          // tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否销售',
          ,number    :0             //int(11) DEFAULT NULL COMMENT '数量',
          // ,allCategory     :{brand:[]  ,store_house:[],product:[]  };
          ,allCategory     :{}
          // ,brand_name      :''
        },
        infoRules: {
          // name: [
          //   { required: true, message: '请输入名称', trigger: 'blur' },
          // ],
          number: [
            {required: true, min:1, max:5,message: '请输入5位以下数字', trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      // handleSelectChageHouse(val){
      //   //下拉框选择内容改变后
      //   this.infoForm.store_house_id =val;
      //   console.log( this.infoForm.store_house_id );
      // },
      // handleSelectChageBrand(val){
      //   //下拉框选择内容改变后
      //   this.infoForm.brand_id =val;
      //   console.log( this.infoForm.brand_id );
      // },
      handleSelectChageProduct(val){
        //下拉框选择内容改变后
        this.infoForm.product_id =val;

        var product = this.infoForm.allCategory.product.filter(function (e) { return e.product_id == val; });

        this.infoForm.goods_id =product[0].goods_id;
        this.infoForm.price =product[0].price;
        this.infoForm.trade_price =product[0].trade_price;
        this.infoForm.retail_price =product[0].retail_price;
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
            this.axios.post('store/storeDetail', this.infoForm).then((response) => {
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

      getInfoDetail() {
        if (this.infoForm.id <= 0) {
          return false
        }

        //加载商品详情
        let that = this
        this.axios.get('store/infoDetail', {
          params: {
            id: that.infoForm.id
          }
        }).then((response) => {
          let resInfo = response.data.data;
          resInfo.is_on_sale = resInfo.is_on_sale ? "1" : "0";
          that.infoForm = resInfo;

          // 初始化 summernote
          // that.initSummerNote();
        })
      },
      // 获取属性列表
      getAttributes(){
        let that = this
        this.axios.get('store/GetProduct', {
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
      this.infoForm.store_enter_id=this.$route.query.store_enter_id || 0;
      this.getInfoDetail();
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
