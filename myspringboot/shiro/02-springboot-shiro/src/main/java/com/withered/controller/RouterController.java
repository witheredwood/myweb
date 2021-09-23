package com.withered.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RouterController {
    @RequestMapping({"/", "/index"})
    public String toLogin() {
        return  "index";
    }

    @RequestMapping("/user/add")
    public String add() {
        return  "user/add";
    }

    @RequestMapping("/user/update")
    public String update() {
        return  "user/update";
    }
    @RequestMapping("/login")
    public String login() {
        return  "login";
    }
}
