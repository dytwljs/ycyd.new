<template>
	<div class="content-page">
		<div class="content-nav">
			<el-breadcrumb class="breadcrumb" separator="/">
				<el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>销售管理</el-breadcrumb-item>
				<el-breadcrumb-item>销售商管理</el-breadcrumb-item>
			</el-breadcrumb>
			<div class="operation-nav">
				<router-link to="/dashboard/sale/add">
					<el-button type="primary" icon="plus">添加销售商</el-button>
				</router-link>
			</div>
		</div>
            <div class="filter-box">
                <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                    <el-form-item label="商品名称">
                        <el-input v-model="filterForm.name" placeholder="商品名称"></el-input>
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
					<el-table-column prop="name" label="姓名">
						<template scope="scope">
              <div v-if="scope.row.layer==2" class="bg-gray">{{scope.row.name}}</div>
              <div v-if="scope.row.layer==3" class="bg-left">{{scope.row.name}}</div>
						</template>
					</el-table-column>
          <el-table-column prop="layer" label="级别" width="70">
          </el-table-column>
					
          <el-table-column prop="authorize" label="审核状态">
            <template scope="scope">
              <div v-if="scope.row.authorize==0" class="bg-gray">未审核</div>
              <div v-if="scope.row.authorize==1" class="bg-left">审核通过</div>
              <div v-if="scope.row.authorize==2" class="bg-gray">申请审核</div>
              <div v-if="scope.row.authorize==3" class="bg-gray">审核中</div>
              <div v-if="scope.row.authorize==9" class="bg-gray">不予授权</div>
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
          name: ''
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
        this.$router.push({ name: 'sale_add', query: { id: row.id } })
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
            name: this.filterForm.name
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
