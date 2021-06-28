<template>
  <div class="hello">
    <el-dialog title="添加书籍信息" :visible.sync="dialogAdd.show">
      <el-form :model="formDate" ref="formAdd" label-width="100px" :rules="formrules">
        <el-form-item label="图书名称" prop="bookName">
          <el-input v-model="formDate.bookName"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="formDate.author"></el-input>
        </el-form-item>
        <el-form-item label="发行日期" prop="publicationDate">
          <el-date-picker
            v-model="formDate.publicationDate"
            type="datetime"
            style="float: left"
            placeholder="选择日期和时间"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="formDate.price"></el-input>
        </el-form-item>
        <el-form-item label="ISBN序列号" prop="isbn">
          <el-input v-model="formDate.isbn"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="categoryName">
          <el-input v-model="formDate.categoryName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogAdd.show = false">取消增加</el-button>
        <el-button icon="el-icon-check" type="success" @click="dialogFormAdd(formDate)">确定增加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import book from "@/network/book";

    export default {
    name: 'AddBook',
    props:{
      dialogAdd:Object
    },
    data () {
      return {
        pickerOptions: { //时间日期选择器快捷选项
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        formDate:{
          bookName:'',
          author:'',
          publicationDate:'',
          price:'',
          isbn:'',
          categoryName:'',
          flag:0 //添加后的图书默认添加后为未同步
        },
        formrules:{
          bookName:[{required:true,message:"书名不能为空",trigger:"blur"}],
          isbn:[{required:true,message:"ISBN序列号不能为空",trigger:"blur"}],
        }
      }
    },
    methods:{
      dialogFormAdd(formDate) { //填写完书籍信息后按下按钮调起
        book.addBook(formDate).then(response =>{
          this.dialogAdd.show = false;
          this.$parent.listBooks();
          this.$message.success('增加成功');
        })
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

