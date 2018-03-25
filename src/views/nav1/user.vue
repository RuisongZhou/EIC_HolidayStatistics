<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUser">查询</el-button>
				</el-form-item>

			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="name" label="姓名" width="90" sortable>
			</el-table-column>
			<el-table-column prop="grade" label="年级" width="90" sortable>
			</el-table-column>
			<el-table-column prop="Class" label="班级" width="90" sortable>
			</el-table-column>
			<el-table-column prop="studentID" label="学号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="IfLeave" label="是否离校" min-width="50" :formatter="formatLeave" sortable>
			</el-table-column>
			<el-table-column prop="LeaveTime" label="离校时间" min-width="50" sortable>
			</el-table-column>
			<el-table-column prop="BackTime" label="返校时间" min-width="50" sortable>
			</el-table-column>
			<el-table-column prop="LeaveFor" label="离校去向" min-width="50" sortable>
			</el-table-column>
			<el-table-column prop="note" label="备注" min-width="50" sortable>
			</el-table-column>
			</el-table>
		</template>

	</section>
</template>
<script>
	import { getUserList } from '../../api/api';
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				loading: false,
				users: [
				]
			}
		},
		methods: {
			formatLeave: function (row, column) {
				return row.IfLeave == 1 ? '是' : row.IfLeave == 0 ? '否' : '未知';
			},
			//获取用户列表
			getUser: function () {
				let para = {
					name: this.filters.name
				};
				this.loading = true;
				//NProgress.start();
				getUserList(para).then((res) => {
					this.users = res.data.users;
					this.loading = false;
					//NProgress.done();
				});
			}
		},
		mounted() {
			this.getUser();
		}
	};

</script>

<style scoped>

</style>