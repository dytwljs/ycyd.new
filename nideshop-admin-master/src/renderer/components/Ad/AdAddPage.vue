<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>广告管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{infoForm.id ? '编辑广告' : '添加广告'}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <el-button type="primary" @click="goBackPage" icon="arrow-left">返回列表</el-button>
      </div>
    </div>
    <div class="content-main">
      <div class="form-table-box">
        <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
          
          <el-form-item label="广告位ID" prop="ad_position_id">
            <el-input v-model="infoForm.ad_position_id"></el-input>
          </el-form-item>
          <el-form-item label="广告类型" prop="media_type">
            <el-input v-model="infoForm.media_type"></el-input>
          </el-form-item>
          <el-form-item label="广告图片" prop="image_url">
            <el-upload class="image-uploader" name="ad_pic"
                       :action="axios.defaults.baseURL+'upload/adPic'" :show-file-list="true"
                       :on-success="handleUploadImageSuccess" :headers="uploaderHeader">
              <img v-if="infoForm.image_url" :src="infoForm.image_url" class="image-show">
              <i v-else class="el-icon-plus image-uploader-icon"></i>
            </el-upload>
            <div class="form-tip">图片尺寸：1440*800</div>
          </el-form-item>
          <el-form-item label="广告名字" prop="name">
            <el-input v-model="infoForm.name"></el-input>
          </el-form-item>
          <el-form-item label="广告内容" prop="content">
            <el-input type="textarea" v-model="infoForm.content" :rows="10"></el-input>
            <div class="form-tip"></div>
          </el-form-item>
          <el-form-item label="广告链接" prop="link">
            <el-input v-model="infoForm.link"></el-input>
          </el-form-item>
          <el-form-item label="结束时间" prop="end_time">
            <el-input v-model="infoForm.end_time"></el-input>
          </el-form-item>
          <el-form-item label="测试时间">
            <el-date-picker type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="广告状态">
            <el-switch on-text="启用" off-text="禁用" on-value="1" off-value="0" v-model="infoForm.enabled"></el-switch>
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
  
  export default {
    data() {
      return {
        uploaderHeader: {
          'X-ycyd-Token': localStorage.getItem('token') || '',
        },
        infoForm: {
          id: 0,
          name: '',
          image_url: '',
          content: '',
          enabled: "1"
        },
        infoRules: {
          name: [
            { required: true, message: '请输入广告名称', trigger: 'blur' },
          ],
          image_url: [
            { required: true, message: '请输入广告图片', trigger: 'blur' },
          ],
          content: [
            { required: true, message: '请输入广告内容', trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      goBackPage() {
        this.$router.go(-1);
      },
      onSubmitInfo() {
        this.$refs['infoForm'].validate((valid) => {
          if (valid) {
            this.axios.post('ad/store', this.infoForm).then((response) => {
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
      handleUploadImageSuccess(res, file) {
        if (res.errno === 0) {
          switch (res.data.name) {
            //广告图片
            case 'ad_pic':
                this.infoForm.image_url = res.data.fileUrl;
                // this.$set('infoForm.image_url', res.data.fileUrl);
                break;
          }
        }
      },
      getInfo() {
        if (this.infoForm.id <= 0) {
          return false
        }

        //加载广告详情
        let that = this
        this.axios.get('ad/info', {
          params: {
            id: that.infoForm.id
          }
        }).then((response) => {
          let resInfo = response.data.data;
          resInfo.enabled = resInfo.enabled ? "1" : "0";
          that.infoForm = resInfo;
        })
      }

    },
    components: {
    },
    mounted() {
      this.infoForm.id = this.$route.query.id || 0;
      this.getInfo();
      console.log(api)
    }
  }

</script>
