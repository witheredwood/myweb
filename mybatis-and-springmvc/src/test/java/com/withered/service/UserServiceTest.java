package com.withered.service;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import com.withered.mapper.UserMapper;
import com.withered.pojo.User;

import java.util.List;

public class UserServiceTest {
    private ApplicationContext context = new ClassPathXmlApplicationContext("classpath:applicationContext.xml");;

//    @BeforeAll  // 执行本类所有测试方法之前先执行该方法
//    public void setup() throws Exception {
//         context = new ClassPathXmlApplicationContext("classpath:applicationContext.xml");
//    }

    @Test
    public void testGetList() {
        // 获取mapper对象
        UserMapper mapper = context.getBean("UserMapper", UserMapper.class);
        // 调用sql方法
        List<User> list = mapper.getList();
        System.out.println(list);
    }

}
