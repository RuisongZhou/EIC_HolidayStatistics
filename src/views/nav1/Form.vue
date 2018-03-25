<template>
	<el-form ref="form" :model="form" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="统计名单名称">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="对应时间">
			<el-col :span="11">
				<el-date-picker type="date" placeholder="选择日期" v-model="form.date" style="width: 100%;"></el-date-picker>
			</el-col>
		</el-form-item>
		<el-form-item label="备注">
			<el-input type="textarea" v-model="form.desc"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary">立即创建</el-button>
			<el-button @click.native.prevent>取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: '',
					region: '',
					date: '',
					desc: ''
				}
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			}
		}
	}

</script>