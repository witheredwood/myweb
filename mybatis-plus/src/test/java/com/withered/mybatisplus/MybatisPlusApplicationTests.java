package com.withered.mybatisplus;

import com.withered.mapper.UserMapper;
import com.withered.pojo.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class MybatisPlusApplicationTests {
    private UserMapper userMapper;

    @Test
    public void testSelect() {
        System.out.println("----- selectAll method test ------");
        List<User> userList = userMapper.selectList(null);
        Assertions.assertEquals(5, userList.size());
        userList.forEach(System.out::println);
    }

    // 测试插入
    @Test
    public void testInsert() {
        System.out.println("----- selectAll method test ------");
        User user = new User("java", "男", 5);
        int res = userMapper.insert(user);  // 受影响的行数
        System.out.println(res);
        System.out.println(user);  // 发现，id会回填
    }

    // 测试更新
    @Test
    public void testUpdate() {
        System.out.println("----- selectAll method test ------");
        User user = new User();
        user.setId(6L);
        user.setName("javase");
        int res = userMapper.updateById(user);  // 受影响的行数
        System.out.println(res);
        System.out.println(user);  // 发现，id会回填
    }

}
