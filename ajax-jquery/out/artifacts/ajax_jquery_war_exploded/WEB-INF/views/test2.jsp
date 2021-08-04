<%--
  Created by IntelliJ IDEA.
  User: 90618
  Date: 2021/5/27
  Time: 22:03
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>

</head>
<body>

<input type="button" value="加载数据" id="btn">
<table>
    <tr>
        <td>姓名</td>
        <td>年龄</td>
        <td>性别</td>
    </tr>
    <tbody id="content">
    <%-- 数据：从后台获取 --%>

    </tbody>
</table>


<script src="http://libs.baidu.com/jquery/2.0.0/jquery.js"></script>
<script>
    $(function () {
        $("#btn").click(function () {
            $.post("${pageContext.request.contextPath}/a2", function (data) {
                let html = "";

                for (let i = 0; i < data.length; i++) {
                    html += "<tr>" +
                        "<td>" + data[i].name + "</td>" +
                        "<td>" + data[i].age + "</td>" +
                        "<td>" + data[i].sex + "</td>" +
                        "</tr>"
                }

                $("#content").html(html);
            });
        })
    });

</script>

</body>
</html>
