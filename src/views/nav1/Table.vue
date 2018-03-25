<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="50">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="90" sortable>
			</el-table-column>
			<el-table-column prop="grade" label="年级" width="90"  sortable>
			</el-table-column>
			<el-table-column prop="Class" label="班级" width="90" sortable>
			</el-table-column>
			<el-table-column prop="studentID" label="学号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="IfLeave" label="是否离校" min-width="50" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="LeaveTime" label="离校时间" min-width="50" sortable>
			</el-table-column>
			<el-table-column prop="BackTime" label="返校时间" min-width="50" sortable>
			</el-table-column>
			<el-table-column prop="LeaveFor" label="离校去向" min-width="50" sortable>
			</el-table-column>
			<el-table-column prop="note" label="备注" min-width="50" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="年级">
					<el-input v-model="editForm.grade" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="班级">
					<el-input v-model="editForm.Class" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="学号">
					<el-input v-model="editForm.studentID" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否离校">
					<el-radio-group v-model="editForm.IfLeave">
						<el-radio class="radio" :label="1">是</el-radio>
						<el-radio class="radio" :label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="离校时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.LeaveTime"></el-date-picker>
				</el-form-item>
				<el-form-item label="返校时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.BackTime"></el-date-picker>
				</el-form-item>
				<el-form-item label="离校去向">
					<el-input type="textarea" v-model="editForm.LeaveFor"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="editForm.note"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="年级">
					<el-input v-model="editForm.grade" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="班级">
					<el-input v-model="editForm.Class" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="学号">
					<el-input v-model="editForm.studentID" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否离校">
					<el-radio-group v-model="editForm.IfLeave">
						<el-radio class="radio" :label="1">是</el-radio>
						<el-radio class="radio" :label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="离校时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.LeaveTime"></el-date-picker>
				</el-form-item>
				<el-form-item label="返校时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.BackTime"></el-date-picker>
				</el-form-item>
				<el-form-item label="离校去向">
					<el-input type="textarea" v-model="editForm.LeaveFor"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="editForm.note"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				// pastLoading: false,
				// sege: 1,
				// lils: [],//列表选中列
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					grade: '',
					Class:'',
					studentID:'',
					IfLeave:-1,
					LeaveTime:'',
					BackTime:'',
					LeaveFor:'',
					note:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					grade: '',
					Class:'',
					studentID:'',
					IfLeave:-1,
					LeaveTime:'',
					BackTime:'',
					LeaveFor:'',
					note:''
				}

			}
		},
		methods: {
			//离去显示转换
			formatSex: function (row, column) {
				return row.IfLeave == 1 ? '是' : row.sex == 0 ? '否' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					grade: '',
					Class:'',
					studentID:'',
					IfLeave:-1,
					LeaveTime:'',
					BackTime:'',
					LeaveFor:'',
					note:''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.LeaveTime = (!para.LeaveTime || para.LeaveTime == '') ? '' : util.formatDate.format(new Date(para.LeaveTime), 'yyyy-MM-dd');
							para.BackTime = (!para.BackTime || para.BackTime == '') ? '' : util.formatDate.format(new Date(para.BackTime), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.LeaveTime = (!para.LeaveTime || para.LeaveTime == '') ? '' : util.formatDate.format(new Date(para.LeaveTime), 'yyyy-MM-dd');
							para.BackTime = (!para.BackTime || para.BackTime == '') ? '' : util.formatDate.format(new Date(para.BackTime), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>