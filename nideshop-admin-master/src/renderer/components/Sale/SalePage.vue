<template>
	<div class="content-page">
		<div class="content-nav">
			<el-breadcrumb class="breadcrumb" separator="/">
				<el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>销售管理</el-breadcrumb-item>
				<el-breadcrumb-item>销售商管理</el-breadcrumb-item>
			</el-breadcrumb>
			<div class="operation-nav">
				<router-link to="/dashboard/saleReg/add">
					<el-button type="primary" icon="plus">添加销售商</el-button>
				</router-link>
			</div>
		</div>
            <div class="filter-box">
                <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                    <el-form-item label="姓名">
                        <el-input v-model="filterForm.username" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmitFilter">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
		<div class="content-main">
			<div class="form-table-box">
				<el-table :data="tableData" style="width: 100%" border stripe>
          <el-table-column prop="mobile" label="手机" width="130">
          </el-table-column>
					<el-table-column prop="username" label="姓名">
						<template scope="scope">
              <div v-if="scope.row.layer==2" class="bg-gray">{{scope.row.username}}</div>
              <div v-if="scope.row.layer==3" class="bg-left">{{scope.row.username}}</div>
						</template>
					</el-table-column>
          <el-table-column prop="nickname" label="微信" width="130">
          </el-table-column>
          <el-table-column prop="layer" label="级别" width="70">
          </el-table-column>
					<!-- 0,未登录 1,已登录获取用户信息 2,获取电话号码,未登记电话 3,已登记电话,未审核 9,已登记,审核通过-->
          <el-table-column prop="authorize" label="审核状态">
            <template scope="scope">
              <div v-if="scope.row.authorize==0" class="bg-gray">未登录</div>
              <div v-if="scope.row.authorize==1" class="bg-left">已登录获取用户信息</div>
              <div v-if="scope.row.authorize==2" class="bg-gray">获取电话号码,未登记电话</div>
              <div v-if="scope.row.authorize==3" class="bg-gray">已登记电话,未审核</div>
              <div v-if="scope.row.authorize==9" class="bg-gray">审核通过</div>
            </template>
          </el-table-column>
<!-- 					<el-table-column prop="parent_id" label="上一级" width="80">
					</el-table-column> -->
					<el-table-column label="操作" width="140">
						<template scope="scope">
							<el-button size="small" @click="handleRowEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button size="small" type="danger" @click="handleRowDelete(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>

            <div class="page-box">
                <el-pagination @current-change="handlePageChange" :current-page="page" :page-size="10" layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
		</div>
	</div>
</template>

<script>
  export default {
    data() {
      return {
        page: 1,
        total: 0,
        filterForm: {
          username: ''
        },
        tableData: []
      }
    },
    methods: {
      handlePageChange(val) {
        this.page = val;
        //保存到localStorage
        localStorage.setItem('brandPage', this.page)
        localStorage.setItem('brandFilterForm', JSON.stringify(this.filterForm));
        this.getList()
      },
      handleRowEdit(index, row) {
        this.$router.push({ name: 'saleReg_add', query: { mobile: row.mobile } })
      },
      handleRowDelete(index, row) {

        this.$confirm('确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.axios.post('sale/destory', { id: row.id }).then((response) => {
            console.log(response.data)
            if (response.data.errno === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });

              this.getList();
            }
          })
        });
      },
      onSubmitFilter() {
        this.page = 1
        this.getList()
      },
      getList() {
        this.axios.get('sale', {
          params: {
            page: this.page,
            username: this.filterForm.username
          }
        }).then((response) => {
          // this.tableData = response.data.data
          this.tableData = response.data.data.data
          this.page = response.data.data.currentPage
          this.total = response.data.data.count
        })
      }
    },
    components: {

    },
    mounted() {
      this.getList();
    }
  }

</script>

<style scoped>
.sub-category .el-table__expanded-cell{
	padding: 0;
}
.bg-gray{
  /* background:gray; */
  color:red;
  font-weight: bold;
}
.bg-left{
  margin-left: 20px;
}
</style>
