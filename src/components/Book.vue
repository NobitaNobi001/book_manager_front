<!--<script src="../network/book.js"></script>-->
<template>
  <div class="Book">
    <h1>基于Web Service的分布式图书管理系统</h1>
    <el-row>
      <el-col :span="20" :push='2'>
        <div>
          <el-form :inline="true">
            <el-form-item style="float: left">
              <el-input v-model="bookName" size="large" placeholder="请输入图书名称" prefix-icon="el-icon-search" @keyup.enter.native="handleSearch(bookName)"></el-input>
            </el-form-item>
            <el-form-item style="float: left">
              <el-button style="float: left;margin-bottom: 5px" type="primary" size="large" icon="el-icon-search" @click="handleSearch(bookName)">搜索</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" size="large" icon="el-icon-download" @click="handleSync()">更新</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" size="large" icon="el-icon-upload" @click="handlePublish()">发布</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="danger" size="large" icon="el-icon-close" @click="handleMutiDeleteBook(booksId)">删除
              </el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" size="large" icon="el-icon-plus" @click="dialogAdd.show = true">增加
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="table"><!--:data="searchBookInfo(bookName)"-->
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            @selection-change="selsChange"><!--把定义好的方法，绑定到data,因为这个方法会返回一个新的数组-->
            <el-table-column
              align="center"
              type="selection"
              width="50">
            </el-table-column> <!--选定组件 用于多选-->
            <el-table-column
              label="序号"
              type="index"
              align="center"
              width="50">
            </el-table-column> <!--表格自增序号 注意这里不是书籍id-->
            <el-table-column
              label="图书名称"
              prop="bookName"
              align="center"
              width="250">
            </el-table-column>
            <el-table-column
              prop="author"
              label="作者"
              align="center"
              width="125">
            </el-table-column>
            <el-table-column
              label="发行日期"
              align="center"
              width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.publicationDate | moment}}</span> <!--引入时间格式化插件-->
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="价格"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              prop="isbn"
              label="ISBN序列号"
              align="center"
              width="150">
            </el-table-column>
            <el-table-column
              prop="categoryName"
              label="类别"
              align="center"
              width="150">
            </el-table-column>
            <el-table-column
              label="状态"
              align="center"
              width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.flag1 ? '已同步':'未同步' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  @click="handleEdit(scope.row.bookId)">编辑
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.row.bookId)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="float: right"
                         @current-change="listBooks"
                         :current-page.sync="currentPage"
                         :page-size="pageSize"
                         layout="total, prev, pager, next"
                         :total="totalRecord">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <AddBook :dialogAdd="dialogAdd"></AddBook>
    <EditBook :form="form" :dialogEdit="dialogEdit"></EditBook>
  </div>
</template>

<script>
  import AddBook from './AddBook.vue'
  import EditBook from './EditBook.vue'
  import book from '@/network/book'

  export default {
    name: 'Book',
    data() {
      return {
        tableData: [],
        currentPage: 1,
        pageSize: 5,
        totalRecord: 0,
        booksId: [], //抽取被选中书籍条目的bookId
        bookId: 0,
        dialogEdit: { //默认关闭编辑书籍信息对话框 当按下编辑按钮才打开
          show: false,
        },
        dialogAdd: { //默认关闭添加书籍信息对话框 当按下增加按钮才打开
          show: false
        },
        bookName: "",
        form: {
          bookId: '',
          bookName: '',
          author: '',
          publicationDate: '',
          price: '',
          isbn: '',
          categoryName: '',
          flag: ''
        },
      }
    },
    methods: {
      handleSearch(bookName){
        book.searchBookByName(this.currentPage, this.pageSize,bookName).then(response => {
          let data = response.data;
          console.log(data);
          this.currentPage = data.current;
          this.pageSize = data.size;
          this.tableData = data.records;
          this.totalRecord = data.total
        })
      },

      listBooks() {
        book.listBook(this.currentPage, this.pageSize).then(response => {
          if (response.code == 100) {
            // debugger
            let data = response.data;
            console.log(data);
            this.currentPage = data.current;
            this.pageSize = data.size;
            this.tableData = data.records;
            this.totalRecord = data.total
          }
        })
      },

      handleEdit(id) {  //编辑
        this.dialogEdit.show = true; //显示弹窗
        book.getBookById(id).then(response => {
          let data = response.data;
          console.log(data)
          this.form = data
        })
      },

      handleMutiDeleteBook(booksId) {
        let temp = []
        if(booksId !==undefined && booksId.length > 0){ //首先判断是否选中了书籍
        booksId.forEach(function (item, index) {
          temp.push(item.bookId)
        })
        this.$confirm('此操作将删除选中图书, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }, book.deleteMutiBook(temp)).then(response => {
          this.listBooks();
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });}
        else  this.$message({
          showClose: true,
          message: '未选中任何图书 请重试',
          type: 'error'
        });
      },

      selsChange(sels) {
        this.booksId = sels
      },

      handleSync(){
        book.syncBook().then(response => {
          if(response.code == 100){
            this.listBooks()
            this.$message.success('更新成功')
          }
          else this.$message.error('更新失败')
        })
      },

      handlePublish(){
        book.publishBook().then(response => {
          if(response.code == 100){
            this.listBooks()
            this.$message.success('发布成功')
          }
          else this.$message.error('发布失败')
        })
      },

      handleDelete(id) {
        this.$confirm('此操作将删除该图书信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }, book.deleteBook(id)).then(response => {
          this.listBooks();
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    created() { //created钩子函数时就载入图书信息
      this.listBooks()
    },
    components: {
      AddBook,
      EditBook
    }
  }
</script>

<style scoped>
  h1 {
    font-size: 30px;
    color: #333;
    text-align: center;
    margin: 0 auto 50px;
    padding-bottom: 5px;
    border-bottom: 2px solid #409EFF;
    width: 600px;
  }
</style>
