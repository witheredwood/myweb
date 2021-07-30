package com.withered.service;

import com.withered.dao.UserMapper;
import com.withered.pojo.User;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;

public class UserServiceTest {
    private static ApplicationContext context;
    private static UserMapper mapper;

    @BeforeAll  // 执行本类所有测试方法之前先执行该方法
    public static void setup() throws Exception {
        context = new ClassPathXmlApplicationContext("classpath:applicationContext.xml");
        // 获取mapper对象
        mapper = context.getBean(UserMapper.class);
    }

    @Test
    public void testGetList() {
        // 调用sql方法
        List<User> list = mapper.getList();
        System.out.println(list);
    }

    @Test
    public void testInsert() {
        User user = new User("孙七", 5, "男");
        // 调用sql方法
        int res = mapper.insert(user);
        System.out.println(res);
    }

    @Test
    public void testDeleteById() {
        // 调用sql方法
        int res = mapper.deleteById("孙七");
        System.out.println(res);
    }

    @Test
    public void testUpdate() {
        User user = new User("张三", 10, "男");
        // 调用sql方法
        int res = mapper.update(user);
        System.out.println(res);
    }

    @Test
    public void testGetById() {
        // 调用sql方法
        User user = (User) mapper.getById("张三");
        System.out.println(user);
    }

}
