package com.withered.controller;


import com.withered.pojo.User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController  // 不会走视图解析器
public class AjaxController {

    @RequestMapping("/t1")
    public String test1() {
        return "hello";  // 返回字符串，不是页面
    }

    @RequestMapping("/a1")
    public void a1(String name, HttpServletResponse response) throws IOException {
        System.out.println("a1.param=>" + name);
        if ("withered".equals(name)) {
            response.getWriter().print("true");
        } else {
            response.getWriter().print("false");
        }
    }

    @RequestMapping("/a2")
    public List<User> a2() {
        List<User> userList = new ArrayList<User>();

        userList.add(new User("java", 1, "男"));
        userList.add(new User("java2", 2, "男"));
        userList.add(new User("java3", 3, "男"));
        userList.add(new User("java3", 4, "男"));

        return userList;
    }

    @RequestMapping("/a3")
    public String a3(String name, String pwd) {
        System.out.println("name="+name);
        System.out.println("pwd="+pwd);
        String msg = "";
        if (name != null) {
            // admin 这些数据应该在数据库中查
            if ("admin".equals(name)) {
                msg = "ok";
            } else {
                msg = "用户名有误";
            }
        }
        if (pwd != null) {
            // 123456 这些数据应该在数据库中查
            if ("123456".equals(pwd)) {
                msg = "ok";
            } else {
                msg = "密码有误";
            }
        }
        System.out.println("msg ==> " + msg);
        return msg;
    }
}
