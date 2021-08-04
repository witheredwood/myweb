package com.withered.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {

    @RequestMapping("/login")
    public String login() {
        return "login";  // 转向login页面
    }

}
