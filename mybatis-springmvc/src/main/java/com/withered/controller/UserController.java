package com.withered.controller;

import com.withered.pojo.User;
import com.withered.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

// 3. 测试Spring注入和切面功能是否配置成功
@Controller
public class UserController {
    private UserService userService;

    @Autowired
    public void setUserService(@Qualifier("userServiceImpl") UserService userService) {
        this.userService = userService;
    }

    @RequestMapping("/getUser")
    public String getUser(String id, Model model) {
        User user = userService.getById(id);
        model.addAttribute("msg", user);
        return "test";
    }
}
