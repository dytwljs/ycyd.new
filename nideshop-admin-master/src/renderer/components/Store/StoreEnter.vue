<template>
    <div class="content-page">
        <div class="content-nav">
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>库存管理</el-breadcrumb-item>
                <el-breadcrumb-item>库存列表</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="operation-nav">
                <router-link to="/dashboard/storeEnter/add">
                    <el-button type="primary" icon="plus">商品入库</el-button>
                </router-link>
            </div>
        </div>
        <div class="content-main">
            <div class="filter-box">
                <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                    <el-form-item label="请输入查询">
                        <el-input v-model="filterForm.name" placeholder="请输入查询"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmitFilter">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="form-table-box">
                <el-table :data="tableData" style="width: 100%" border stripe row-key="id"  highlight-current-row  @row-click="rowClick">
                  <!-- <el-table-row @click="rowClick(scope.$index, scope.row)"> -->
                    <el-table-column prop="id" label="ID" width="100">
                    </el-table-column>
                    <el-table-column prop="title" label="标题">
                    </el-table-column>
                    <el-table-column label="操作" width="230">
                        <template scope="scope">
                            <el-button size="small" @click="InsertDetail(scope.$index, scope.row)">插入清单</el-button>
                            <el-button size="small" @click="handleRowEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="handleRowDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>

                  <!-- </el-table-row>  -->
                </el-table>
            </div>
            <div class="page-box">
                <el-pagination @current-change="handlePageChange" :current-page="page" :page-size="10" layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <div class="content-main">
          
            <div class="form-table-box">
                <el-table :data="tableDataDetail" style="width: 100%" border stripe row-key="id"  highlight-current-row >
                    <el-table-column prop="id" label="ID" width="100">
                    </el-table-column>
                    <el-table-column prop="goods_name" label="产品">
                    </el-table-column>
                    <el-table-column prop="number" label="数量">
                    </el-table-column>
                    <el-table-column prop="price" label="进货价">
                    </el-table-column>
                    <el-table-column prop="trade_price" label="批发价">
                    </el-table-column>
                    <el-table-column prop="retail_price" label="零售价">
                    </el-table-column>
                    <el-table-column label="操作" width="230">
                        <template scope="scope">
                            <el-button size="small" @click="EnterSale(scope.$index, scope.row)">生成二维码</el-button>
                           
                            <el-button size="small" @click="handleRowDetailEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="handleRowDetailDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>

                  <!-- </el-table-row>  -->
                </el-table>
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
        ,tableDataDetail:[]
      }
    },
    methods: {
      handlePageChange(val) {
        this.page = val;
        //保存到localStorage
        localStorage.setItem('storeEnter', this.page)
        localStorage.setItem('storeEnterFilterForm', JSON.stringify(this.filterForm));
        this.getList()
      },
      rowClick(row, event, column){
        console.log(row);
        const store_enter_id=row.id;
        this.axios.get('store/indexDetail', {
          params: {
            store_enter_id: store_enter_id
          }
        }).then((response) => {
          this.tableDataDetail = response.data.data
        })
      },
      EnterSale(index, row) {
        this.axios.get('store/EnterSale', {
          params: {
            id: row.id
            ,store_enter_id   :row.store_enter_id
            ,store_house_id   :row.store_house_id
            ,brand_id         :row.brand_id
            ,product_id       :row.product_id
            ,goods_id         :row.goods_id

            ,number:row.number
          }
        }).then((response) => {
          this.tableDataDetail = response.data.data
        })

      },
      InsertDetail(index, row) {
        this.$router.push({ name: 'storeEnterDetail_add', query: { store_enter_id: row.id } })
      },
      handleRowEdit(index, row) {
        this.$router.push({ name: 'storeEnter_add', query: { id: row.id } })
      },
      handleRowDelete(index, row) {

        this.$confirm('确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.axios.post('store/destory', { id: row.id }).then((response) => {
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
      handleRowDetailEdit(index, row) {
        this.$router.push({ name: 'storeEnterDetail_add', query: { id: row.id } })
      },
      handleRowDetailDelete(index, row) {

        this.$confirm('确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.axios.post('store/destoryDetail', { id: row.id }).then((response) => {
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
        this.axios.get('store', {
          params: {
            page: this.page,
            name: this.filterForm.name
          }
        }).then((response) => {
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

</style>
