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
          <!-- <el-form-item label="商品ID" prop="id">
            <el-input v-model="infoForm.id"></el-input>
            <div class="form-tip">商品ID,如:1234567; 添加商品的时候手动填写，值同商品sn一致，<font color="red">修改商品信息时，请勿修改</font></div>
          </el-form-item> -->
          <el-form-item label="商品sn" prop="goods_sn">
            <el-input v-model="infoForm.goods_sn"></el-input>
            <div class="form-tip">商品sn,如:1234567; 添加商品的时候手动填写，值同商品ID一致，<font color="red">修改商品信息时，请勿修改</font></div>
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="infoForm.name"></el-input>
          </el-form-item>

          <el-form-item label="条件码" prop="ean_code">
            <el-input v-model="infoForm.ean_code"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="retail_price">
            <el-input v-model="infoForm.retail_price"></el-input>
          </el-form-item>
          <!-- <el-form-item label="所属分类">
            <el-cascader :options="options" placeholder="请选择分类" v-model="selectedOptions" @change="handleChange">
            </el-cascader>
          </el-form-item> -->
          <el-form-item label="所属分类" prop="category_id">
             <el-select v-model="infoForm.category_name" value-key="id" filterable placeholder="请选择" @change="handleSelectChage">
              <el-option
                v-for="item in infoForm.allCategory"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>

            <!-- <el-select v-model="infoForm.region" placeholder="请选择分类">
              <el-option label="长城" value="shanghai"></el-option>
              <el-option label="宝马" value="beijing"></el-option>
            </el-select> -->
          </el-form-item>

          <el-form-item label="商品单位" prop="category_id">
            <el-select v-model="infoForm.goods_unit" placeholder="商品单位">
              <el-option label="只" value="只"></el-option>
              <el-option label="件" value="件"></el-option>
            
            </el-select>

          </el-form-item>
          <el-form-item label="商品图片" prop="list_pic_url">
            <el-upload class="image-uploader-diy" name="brand_pic"
                       :action="axios.defaults.baseURL+'upload/brandPic'" :show-file-list="true"
                       :on-success="handleUploadImageSuccess" :headers="uploaderHeader">
              <img v-if="infoForm.list_pic_url" :src="axios.defaults.baseHOST+infoForm.list_pic_url" class="image-show">
              <!-- <img v-if="infoForm.list_pic_url" :src="infoForm.list_pic_url" class="image-show"> -->
              <i v-else class="el-icon-plus image-uploader-icon"></i>
            </el-upload>
            <div class="form-tip">图片尺寸：800*800</div>
          </el-form-item>
          <el-form-item label="商品简介" prop="goods_brief">
            <el-input type="textarea" v-model="infoForm.goods_brief" :rows="3"></el-input>
            <div class="form-tip"></div>
          </el-form-item>
          <!-- <el-form-item label="商品详情" prop="goods_desc">
            <div id="summernote">
            </div>
            <div class="form-tip"></div>
          </el-form-item> -->

          <!-- 图片上传组件辅助-->
          <el-upload class="avatar-uploader" name="goods_detail_pic"
                  :action="axios.defaults.baseURL+'upload/goodsDetailPic'" :show-file-list="false"
                  :on-success="handleUploadImageSuccess" :headers="uploaderHeader" 
                  :before-upload="beforeUpload" :on-error="uploadError">
          </el-upload>
          <!-- 引用网络图片辅助-->
          <el-form-item label="应用网络图片" class="item-url-image-fuzhu">
            <el-input class='url-image-fuzhu'></el-input>
            <el-button type="primary" @click="onLinkImageUrl">引用</el-button>
            <div class="form-tip">引用网络图片辅助工具，先确定将图片插入商品详情的位置，让其获得焦点，然后复制网络图片地址到当前输入框，之后点击确定</div>
          </el-form-item>
          
          <el-form-item label="商品详情" prop="goods_desc">
            <div class="edit_container">
              <quill-editor v-model="infoForm.goods_desc"
                  ref="myTextEditor"
                  class="editer"
                  :options="editorOption" 
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)">
              </quill-editor>
            </div>
          </el-form-item>
          <el-form-item label="规格/库存" prop="goods_number">
            <el-input type="number" v-model="infoForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="推荐类型">
            <el-checkbox-group v-model="infoForm.is_new">
              <el-checkbox label="新品" name="is_new" ></el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group v-model="infoForm.is_hot">
              <el-checkbox label="人气" name="is_hot"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="上架">
            <el-switch on-text="上架" off-text="下架" on-value="1" off-value="0" v-model="infoForm.is_on_sale"></el-switch>
          </el-form-item>
          <el-form-item label="排序" prop="sort_order">
            <el-input-number v-model="infoForm.sort_order" :min="1" :max="1000"></el-input-number>
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
  import { quillEditor } from 'vue-quill-editor' //调用富文本编辑器
  const toolbarOptions = [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image', 'video']
            ]
  export default {
    data() {
      return {
        uploaderHeader: {
          'X-Nideshop-Token': localStorage.getItem('token') || '',
        },
        editorOption: {
          modules: {
            toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  if (value) {
                    document.querySelector('.avatar-uploader input').click()
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            },
            syntax: {
              highlight: text => hljs.highlightAuto(text).value
            }
          }
        },

        infoForm: {
          id: 0,
          name: "",
          list_pic_url: '',
          goods_brief: '',
          goods_desc: '',
          is_on_sale: 0,
          pic_url: '',
          sort_order: 100,
          is_show: true,
          floor_price: 0,
          app_list_pic_url: '',
          is_new: false,
          is_hot: false,
          new_pic_url: "",
          new_sort_order: 10
          //g_add
          ,goods_unit:"只"
          ,primary_pic_url:""
        },
        infoRules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          goods_brief: [
            { required: true, message: '请输入简介', trigger: 'blur' },
          ],
          list_pic_url: [
            { required: true, message: '请选择商品图片', trigger: 'blur' },
          ],
          goods_number: [
            {required: true, min:1, max:8,message: '请输入8位数字', trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      onEditorReady(editor) {
        console.log('editor ready!', editor)
      },
      onEditorFocus(editor) {
        console.log('editor focus!', editor)
      },
      onEditorBlur(editor) {
        console.log('editor blur!', editor)
      },
      handleSelectChage(val){
        //下拉框选择内容改变后
        this.infoForm.category_id = val
      },
      beforeUpload() {
        // 显示loading动画
        this.quillUpdateImg = true
      },
      uploadError() {
        // loading动画消失
        this.quillUpdateImg = false
        this.$message.error('图片插入失败')
      },
      goBackPage() {
        this.$router.go(-1);
      },
      //富文本插入网络图片
      onLinkImageUrl(){
        var imageurl =  document.querySelector('.url-image-fuzhu input').value
        let quill = this.$refs.myTextEditor.quill
        let length = quill.getSelection().index;
        quill.insertEmbed(length, 'image', imageurl)
        quill.setSelection(length + 1)
      },
      onSubmitInfo() {
        this.$refs['infoForm'].validate((valid) => {
          if (valid) {
            this.infoForm.fileUrl=this.infoForm.fileName
            this.axios.post('goods/store', this.infoForm).then((response) => {
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
            //商品图片
            case 'brand_pic':
              // this.infoForm.list_pic_url = res.data.fileUrl;
              this.infoForm.list_pic_url = res.data.fileName;
              this.infoForm.fileName=res.data.fileName;
              // this.$set('infoForm.list_pic_url', res.data.fileUrl);
              break;
            case 'brand_new_pic':
              // this.infoForm.new_pic_url = res.data.fileUrl;
              this.infoForm.new_pic_url = res.data.fileName;
              this.infoForm.fileName=res.data.fileName;
              // this.$set('infoForm.new_pic_url', res.data.fileUrl);
              break;
            case 'goods_detail_pic':
              // res为图片服务器返回的数据
              // 获取富文本组件实例
              let quill = this.$refs.myTextEditor.quill
              // 如果上传成功
              // 获取光标所在位置
              let length = quill.getSelection().index;
              // 插入图片  res.info为服务器返回的图片地址
              quill.insertEmbed(length, 'image', res.data.fileUrl)
              // 调整光标到最后
              quill.setSelection(length + 1)
              
              // this.$message.error('图片插入失败')
              // loading动画消失
              this.quillUpdateImg = false
              break;
          }
        }
      },
      getInfo() {
        if (this.infoForm.id <= 0) {
          return false
        }

        //加载商品详情
        let that = this
        this.axios.get('goods/info', {
          params: {
            id: that.infoForm.id
          }
        }).then((response) => {
          let resInfo = response.data.data;
          resInfo.is_new = resInfo.is_new ? true : false;
          resInfo.is_show = resInfo.is_show ? true : false;
          resInfo.is_hot = resInfo.is_hot ? true : false;
          resInfo.is_on_sale = resInfo.is_on_sale ? "1" : "0";
          that.infoForm = resInfo;

          // 初始化 summernote
          // that.initSummerNote();
        })
      },
      // 获取所有分类
      getAllCategory(){
        let that = this
        this.axios.get('goods/getAllCategory', {
          params: {}
        }).then((response) => {
          that.infoForm.allCategory = response.data.data;
          // console.log(response.data.data);
          console.log("all category.......");
        })
      },
      // summernote 上传图片，返回链接
      sendFile(file){

      },
      // 初始化 summernote
      initSummerNote() {
        let that = this
        $('#summernote').summernote({
          lang:'zh-CN',
          placeholder: '请输入商品描述',
          height: 300,
          minHeight: 300,
          maxHeight: 400,
          focus: true,
          // toolbar:[
          //   ['style',['bold','italic','clear']],
          //   ['fontsize',['fontsize']],
          //   ['para',['ul','ol','paragraph']],
          //   ['insert',['picture','link']]
          // ],
          callbacks: {
            onBlur: function(e){
              console.log(" on blur ");
              console.log($('#summernote').summernote('code'));
              that.infoForm.goods_desc = $('#summernote').summernote('code');
              // that.infoForm.goods_desc = $('#summernote').summernote('code');
            },
            onImageUpload: function(files){
              console.log("onImageUpLoad...");
              that.sendFile(files[0]);
            }
          }
        }),
        // console.error(that.infoForm.goods_desc);
        $('#summernote').summernote('code',that.infoForm.goods_desc)
      }

    },
    components: {
      quillEditor
    },
    computed: {
      editor() {
        return this.$refs.myTextEditor.quillEditor
      }
    },
    mounted() {
      this.infoForm.id = this.$route.query.id || 0;
      this.getInfo();
      console.log(api);
      if(this.infoForm.id == 0){
        this.getAllCategory();
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
