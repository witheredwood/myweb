<%--
  Created by IntelliJ IDEA.
  User: 90618
  Date: 2021/5/28
  Time: 17:14
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>

<p>
    用户名： <input type="text" id="name">
    <span id="userInfo"></span>
</p>

<p>
    密 码： <input type="text" id="pwd">
    <span id="pwdInfo"></span>
</p>


<script src="http://code.jquery.com/jquery-3.6.0.min.js"></script>

<script>
    // $(function () {
        $("#name").blur(function () {
            console.log("name ==> blur ---------");
            console.log("${pageContext.request.contextPath}/a3");
            $.post({
                url: "${pageContext.request.contextPath}/a3",
                data: {"name": $("#name").val()},
                success: function (data) {
                    console.log("data ==> " + data);
                    if (data.toString() === 'ok') {
                        $("#userInfo").css("color", "green");
                    } else {
                        $("#userInfo").css("color", "red");
                    }
                    $("#userInfo").html(data);
                }
            })
        });
        $("#pwd").blur(function () {
            console.log("pwd-blur---------");
            $.post({
                url: "${pageContext.request.contextPath}/a3",
                data: {"pwd": $("#pwd").val()},
                success: function (data) {
                    if (data.toString() === 'ok') {
                        $("#pwdInfo").css("color", "green");
                    } else {
                        $("#pwdInfo").css("color", "red");
                    }
                    $("#pwdInfo").html(data);
                }
            })
        });

    // });

</script>

</body>
</html>
