<template>
    <div class="content-page">
        <div class="content-nav">
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商城运营</el-breadcrumb-item>
                <el-breadcrumb-item>{{infoForm.id ? '编辑专题' : '添加专题'}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="operation-nav">
                <el-button type="primary" @click="goBackPage" icon="arrow-left">返回列表</el-button>
            </div>
        </div>
        <div class="content-main">
            <div class="form-table-box">
                <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="infoForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="子标题" prop="subtitle">
                        <el-input type="textarea" v-model="infoForm.subtitle" :rows="3"></el-input>
                        <div class="form-tip"></div>
                    </el-form-item>
                    <el-form-item label="价格" prop="price_info">
                        <el-input v-model="infoForm.price_info"></el-input>
                    </el-form-item>
                    <el-form-item label="缩略图" prop="scene_pic_url">
                        <el-upload class="image-uploader" name="scene_pic_url"
                                   :action="axios.defaults.baseURL+'upload/topicThumb'" :show-file-list="false"
                                   :on-success="handleUploadImageSuccess" :headers="uploaderHeader">
                            <img v-if="infoForm.scene_pic_url" :src="infoForm.scene_pic_url" class="image-show">
                            <i v-else class="el-icon-plus image-uploader-icon"></i>
                        </el-upload>
                        <div class="form-tip">图片尺寸：750*415</div>
                    </el-form-item>
          
                    <!-- 图片上传组件辅助-->
                    <el-upload class="topic-uploader" name="topic_content_pic"
                            :action="axios.defaults.baseURL+'upload/topicContent'" :show-file-list="false"
                            :on-success="handleUploadImageSuccess" :headers="uploaderHeader" 
                            :before-upload="beforeUpload" :on-error="uploadError">
                    </el-upload>
                    <!-- 引用网络图片辅助-->
                    <el-form-item label="应用网络图片" class="item-url-image-fuzhu">
                        <el-input class='url-image-fuzhu'></el-input>
                        <el-button type="primary" @click="onLinkImageUrl">引用</el-button>
                        <div class="form-tip">引用网络图片辅助工具，先确定将图片插入商品详情的位置，让其获得焦点，然后复制网络图片地址到当前输入框，之后点击确定</div>
                    </el-form-item>
                    <el-form-item label="专题详情" prop="content">
                        <div class="edit_container">
                        <quill-editor v-model="infoForm.content"
                            ref="myTextEditor"
                            class="editer"
                            :options="editorOption" 
                            @blur="onEditorBlur($event)"
                            @focus="onEditorFocus($event)"
                            @ready="onEditorReady($event)">
                        </quill-editor>
                        </div>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input-number v-model="infoForm.sort_order" :min="1" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="启用">
                        <el-switch v-model="infoForm.is_show"></el-switch>
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
                            document.querySelector('.topic-uploader input').click()
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
                    title: "",
                    subtitle: '',
                    sort_order: 100,
                    is_show: true,
                    content:'',
                    scene_pic_url: ''
                },
                infoRules: {
                  title: [
                        { required: true, message: '请输入标题', trigger: 'blur' },
                    ],
                  subtitle: [
                        { required: true, message: '请输入子标题', trigger: 'blur' },
                    ],
                  scene_pic_url: [
                        { required: true, message: '请选择缩略图', trigger: 'blur' },
                    ],
                },
            }
        },
        methods: {
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
                        this.axios.post('topic/store', this.infoForm).then((response) => {
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
                        //专题图片
                        case 'scene_pic_url':
                          this.infoForm.scene_pic_url = res.data.fileUrl;
                            break;
                        case 'topic_content_pic_url':
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

                //加载专题详情
                let that = this
                this.axios.get('topic/info', {
                    params: {
                        id: that.infoForm.id
                    }
                }).then((response) => {
                    let resInfo = response.data.data;
                    resInfo.is_show = resInfo.is_show ? true : false;
                    that.infoForm = resInfo;
                })
            }

        },
        components: {quillEditor},
        computed: {
            editor() {
                return this.$refs.myTextEditor.quillEditor
            }
        },
        mounted() {
            this.infoForm.id = this.$route.query.id || 0;
            this.getInfo();
            console.log(api)
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
        width: 187px;
        height: 105px;
        line-height: 105px;
        text-align: center;
    }

    .image-uploader .image-show {
        width: 187px;
        height: 105px;
        display: block;
    }

    .image-uploader.new-image-uploader {
        font-size: 28px;
        color: #8c939d;
        width: 165px;
        height: 105px;
        line-height: 105px;
        text-align: center;
    }

    .image-uploader.new-image-uploader .image-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 165px;
        height: 105px;
        line-height: 105px;
        text-align: center;
    }

    .image-uploader.new-image-uploader .image-show {
        width: 165px;
        height: 105px;
        display: block;
    }

    .item-url-image-fuzhu .el-input{
        width: 260px;
    }
</style>
