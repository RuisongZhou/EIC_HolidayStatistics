/**
 * 绑定，删除事件
 * @param {obj对象}   elm       需要绑定事件的对象
 * @param {[type]}   evType     需要绑定的事件名称
 * @param {Function} fn         绑定事件的函数
 * @param {[type]}   useCapture true/false冒泡方式
 */
/**
 * 原生JS获取form中的信息
 * @param  {[type]} frmID [description]
 * @return {[type]}       [description]
 */
//考虑浏览器的兼容性，获取浏览器对象判断后进行声明
function addEvent(elm, evType, fn, useCapture) {
    if (elm.addEventListener) {
        elm.addEventListener(evType, fn, useCapture); //DOM2.0
        return true;
    } else if (elm.attachEvent) {
        var r = elm.attachEvent("on" + evType, fn); //IE5+
        return r;
    } else {
        elm['on' + evType] = fn; //DOM 0
    }
}

function forbiddenEvent(event) {
    event = event || window.event;
    if (event.stopPropagation) event.stopPropagation();
    else event.cancelBubble = true;
    if (event.preventDefault) event.preventDefault();
    else event.returnValue = false;

}

var xmlhttp;
if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
} else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}

//ajax请求数据
function getData(method, url, queryString, fnc) { //获取JSON数据
    //异步链接服务器，设置连接方式
    xmlhttp.open(method, url, true);
    //设置请求头
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    //发送request数据
    xmlhttp.send(queryString);
    //改变状态，调用函数
    xmlhttp.onreadystatechange = fnc;
}
//添加请求


getData("POST", "http://118.190.207.113:3030/students", JSON.stringify({'StudentID':window.location.hash.substr(1,10)}), function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                if (xmlhttp.responseText!='null'){
                    var data = JSON.parse(xmlhttp.responseText)
                    if (data.leave_school == 'N'){
                        document.getElementById('InputLeave_not').checked = true
                        document.getElementById('InputLeaveTime').disabled = true;
                        document.getElementById('InputBackTime').disabled = true;
                        document.getElementById('InputLeaveFor').disabled = true;
                        document.getElementById('InputReason').disabled = true;
                        document.getElementById('InputLeaveTime').required = false;
                        document.getElementById('InputBackTime').required = false;
                        document.getElementById('InputLeaveFor').required = false;
                        document.getElementById('InputReason').required = false;
                        document.getElementById('InputLeaveTime').value = null;
                        document.getElementById('InputBackTime').value = null;
                        document.getElementById('InputLeaveFor').value = null;
                        document.getElementById('InputReason').value = null;
                        leavereasonspan.style = null
                        leavetimespan.style = null
                        backtimespan.style = null
                        leaveforspan.style = null
                    }else{
                        document.getElementById('InputLeave_is').checked = true
                    }
                    document.getElementById('InputName').value = data.name;
                    document.getElementById('InputClass').value = data.class;
                    document.getElementById('InputGrade').value = data.grade;
                    document.getElementById('InputLeaveTime').value = data.leave_time;
                    document.getElementById('InputBackTime').value = data.back_time;
                    document.getElementById('InputLeaveFor').value = data.leave_for;
                    document.getElementById('InputReason').value = data.leave_reason;
                    document.getElementById('InputMessage').value = data.note;
                }
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
});


addEvent(document.getElementById('infos'),"submit", function(event) {
    forbiddenEvent(event);
    //获取表单提交数据
    var form = document.getElementById('infos');
    var info = {
        name: '松松',
        class:'电信1701',
        grade: 'test@qq.com',
        ID: '12345678987',
        leave_school: 'Y',
        leave_reason: '无',
        leave_for: '河北邯郸',
        leave_time: '1',
        back_time: '1',
        note: '无'
    };
    info.name = form.name.value;
    info.class = form.class.value;
    info.grade = form.grade.value;
    info.StudentID = window.location.hash.substr(1,10);
    info.leave_school = form.leave_school.value;
    info.leave_reason = form.leave_reason.value;
    info.leave_for = form.leave_for.value;
    info.leave_time = form.leave_time.value;
    info.back_time = form.back_time.value;
    info.note = form.note.value;
    //POST表单json数据到服务器
    getData("POST", "http://118.190.207.113:3030/students", JSON.stringify(info), function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                alert("提交成功")
                form.name.focus();
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
}
, false);

addEvent(document.getElementById('InputName'),"input", function(event) {
    //namespan填写判断
    forbiddenEvent(event);
    var han = /^[\u4e00-\u9fa5]+$/;
    namespan = document.getElementById('namespan')
    InputName = document.getElementById('InputName')
    if (han.test(InputName.value)) {
        namespan.style = "background-color:rgb(27, 201, 149)"
    }else{
        namespan.style = null
    }
}
, false);

addEvent(document.getElementById('InputClass'),"input", function(event) {
    //classspan填写判断
    forbiddenEvent(event);
    classspan = document.getElementById('classspan')
    InputClass = document.getElementById('InputClass')
    if(InputClass.value!=null && InputClass.value!=''){
        classspan.style = "background-color:rgb(27, 201, 149)"
    }else{
        classspan.style = null
    }
}
, false);

addEvent(document.getElementById('InputGrade'),"input", function(event) {
    //gradespan填写判断
    forbiddenEvent(event);
    gradespan = document.getElementById('gradespan')
    InputGrade = document.getElementById('InputGrade')
    if(InputGrade.value!=null && InputGrade.value!=''){
        gradespan.style = "background-color:rgb(27, 201, 149)"
    }else{
        gradespan.style = null
    }
}
, false);

addEvent(document.getElementById('InputLeave_not'),"change", function(event) {
    //leavetimespan填写判断
    forbiddenEvent(event);
    InputLeave_not = document.getElementById('InputLeave_not')
    if (InputLeave_not.value == 'N'){
        document.getElementById('InputLeaveTime').disabled = true;
        document.getElementById('InputBackTime').disabled = true;
        document.getElementById('InputLeaveFor').disabled = true;
        document.getElementById('InputReason').disabled = true;
        document.getElementById('InputLeaveTime').required = false;
        document.getElementById('InputBackTime').required = false;
        document.getElementById('InputLeaveFor').required = false;
        document.getElementById('InputReason').required = false;
        document.getElementById('InputLeaveTime').value = null;
        document.getElementById('InputBackTime').value = null;
        document.getElementById('InputLeaveFor').value = null;
        document.getElementById('InputReason').value = null;
        leavereasonspan.style = null
        leavetimespan.style = null
        backtimespan.style = null
        leaveforspan.style = null
    }else{
        document.getElementById('InputLeaveTime').disabled = false;
        document.getElementById('InputBackTime').disabled = false;
        document.getElementById('InputLeaveFor').disabled = false;
        document.getElementById('InputReason').disabled = false;
        document.getElementById('InputLeaveTime').value = null;
        document.getElementById('InputBackTime').value = null;
        document.getElementById('InputLeaveFor').value = null;
        document.getElementById('InputReason').value = null;
    }
}
, false);
addEvent(document.getElementById('InputLeave_is'),"change", function(event) {
    //leavetimespan填写判断
    forbiddenEvent(event);
    InputLeave_is = document.getElementById('InputLeave_is')
    if (InputLeave_is.value == 'Y'){
        document.getElementById('InputLeaveTime').disabled = false;
        document.getElementById('InputBackTime').disabled = false;
        document.getElementById('InputLeaveFor').disabled = false;
        document.getElementById('InputReason').disabled = false;
        document.getElementById('InputLeaveTime').required = true;
        document.getElementById('InputBackTime').required = true;
        document.getElementById('InputLeaveFor').required = true;
        document.getElementById('InputReason').required = true;
    }else{
        document.getElementById('InputLeaveTime').disabled = true;
        document.getElementById('InputBackTime').disabled = true;
        document.getElementById('InputLeaveFor').disabled = true;
        document.getElementById('InputReason').disabled = true;
        document.getElementById('InputLeaveTime').value = null;
        document.getElementById('InputBackTime').value = null;
        document.getElementById('InputLeaveFor').value = null;
        document.getElementById('InputReason').value = null;
    }
}
, false);

addEvent(document.getElementById('InputLeaveTime'),"input", function(event) {
    //leavetimespan填写判断
    forbiddenEvent(event);
    leavetimespan = document.getElementById('leavetimespan')
    InputLeaveTime = document.getElementById('InputLeaveTime')
    if(InputLeaveTime.value!=null && InputLeaveTime.value!=''){
        leavetimespan.style = "background-color:rgb(27, 201, 149)"
    }else{
        leavetimespan.style = null
    }
}
, false);

addEvent(document.getElementById('InputBackTime'),"input", function(event) {
    //backtimespan填写判断
    forbiddenEvent(event);
    backtimespan = document.getElementById('backtimespan')
    InputBackTime = document.getElementById('InputBackTime')
    if(InputBackTime.value!=null && InputBackTime.value!=''){
        backtimespan.style = "background-color:rgb(27, 201, 149)"
    }else{
        backtimespan.style = null
    }
}
, false);

addEvent(document.getElementById('InputLeaveFor'),"input", function(event) {
    //leaveforspan填写判断
    forbiddenEvent(event);
    var han = /^[\u4e00-\u9fa5]+$/;
    leaveforspan = document.getElementById('leaveforspan')
    InputLeaveFor = document.getElementById('InputLeaveFor')
    if (han.test(InputLeaveFor.value)) {
        leaveforspan.style = "background-color:rgb(27, 201, 149)"
    }else{
        leaveforspan.style = null
    }
}
, false);

addEvent(document.getElementById('InputReason'),"input", function(event) {
    //leavereasonspan填写判断
    forbiddenEvent(event);
    leavereasonspan = document.getElementById('leavereasonspan')
    InputReason = document.getElementById('InputReason')
    if(InputReason.value!=null && InputReason.value!=''){
        leavereasonspan.style = "background-color:rgb(27, 201, 149)"
    }else{
        leavereasonspan.style = null
    }
}
, false);
addEvent(document.getElementById('InputMessage'),"input", function(event) {
    //notespan填写判断
    forbiddenEvent(event);
    notespan = document.getElementById('notespan')
    InputMessage = document.getElementById('InputMessage')
    if(InputMessage.value!=null && InputMessage.value!=''){
        notespan.style = "background-color:rgb(27, 201, 149)"
    }else{
        notespan.style = null
    }
}
, false);

function is_right() {

    namespan = document.getElementById('namespan')
    InputName = document.getElementById('InputName')
    if (InputName.value!=null) {
        namespan.style = "background-color:rgb(27, 201, 149)"
    }else{
        namespan.style = null
    }
    
    classspan = document.getElementById('classspan')
    InputClass = document.getElementById('InputClass')
    if(InputClass.value!=null){
        classspan.style = "background-color:rgb(27, 201, 149)"
    }else{
        classspan.style = null
    }
    
    gradespan = document.getElementById('gradespan')
    InputGrade = document.getElementById('InputGrade')
    if(InputGrade.value!=null){
        gradespan.style = "background-color:rgb(27, 201, 149)"
    }else{
        gradespan.style = null
    }

    leavetimespan = document.getElementById('leavetimespan')
    InputLeaveTime = document.getElementById('InputLeaveTime')
    if(InputLeaveTime.value!=null){
        leavetimespan.style = "background-color:rgb(27, 201, 149)"
    }else{
        leavetimespan.style = null
    }
    
    backtimespan = document.getElementById('backtimespan')
    InputBackTime = document.getElementById('InputBackTime')
    if(InputBackTime.value!=null){
        backtimespan.style = "background-color:rgb(27, 201, 149)"
    }else{
        backtimespan.style = null
    }
    
    leaveforspan = document.getElementById('leaveforspan')
    InputLeaveFor = document.getElementById('InputLeaveFor')
    if (InputLeaveFor.value!=null) {
        leaveforspan.style = "background-color:rgb(27, 201, 149)"
    }else{
        leaveforspan.style = null
    }
    
    leavereasonspan = document.getElementById('leavereasonspan')
    InputReason = document.getElementById('InputReason')
    if(InputReason.value!=null){
        leavereasonspan.style = "background-color:rgb(27, 201, 149)"
    }else{
        leavereasonspan.style = null
    }
    
    notespan = document.getElementById('notespan')
    InputMessage = document.getElementById('InputMessage')
    if(InputMessage.value!=null){
        notespan.style = "background-color:rgb(27, 201, 149)"
    }else{
        notespan.style = null
    }
}

is_right();
