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
    info.StudentID = location.search.substr(1,10);
    info.leave_school = form.leave_school.value;
    info.leave_reason = form.leave_reason.value;
    info.leave_for = form.leave_for.value;
    info.leave_time = form.leave_time.value;
    info.back_time = form.back_time.value;
    info.note = form.note.value;
    //POST表单json数据到服务器
    getData("POST", "http://localhost:3030/students", JSON.stringify(info), function() {
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