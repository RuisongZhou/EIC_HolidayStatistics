import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'EIC',
    password: 'EIC',
    avatar: './src/image/EIC.png',
    name: '管理员'
  }
];

const Users = [];

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    grade:Mock.Random.integer(16, 17),
    Class:'1701',
    studentID:'U201713301',
    IfLeave:Mock.Random.integer(0, 1),
    LeaveTime: Mock.Random.date(),
    BackTime: Mock.Random.date(),
    LeaveFor:'回家',
    note:''
  }));
}

export { LoginUsers, Users };
