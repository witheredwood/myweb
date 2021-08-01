package com.withered.mapper;

import com.withered.mapper.UserMapper;
import com.withered.pojo.User;
import com.withered.utils.MybatisUtils;
import org.apache.ibatis.session.SqlSession;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

public class UserMapperTest {
    // 获取SqlSession对象
    SqlSession sqlSession = MybatisUtils.getSqlSession();
    // getMapper
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);

    @Test
    @AfterEach
    public void afterEach() {
        // 关闭SqlSession
        sqlSession.close();
    }

    @Test
    @DisplayName("插入")
    public void testInsert() {
        User user = new User("赵六", 10, "男");
        int res = mapper.insert(user);
        System.out.println(res);
        sqlSession.commit();  // 不提交不能更新到数据库
    }

    @Test
    @DisplayName("按值删除")
    public void testDeleteById() {
        int res = mapper.deleteById("赵六");
        System.out.println(res);
        sqlSession.commit();  // 不提交不能更新到数据库
    }

    @Test
    @DisplayName("修改")
    public void testUpdate() {
        User user = new User("张三", 20, "男");
        int res = mapper.update(user);
        System.out.println(res);
        sqlSession.commit();  // 不提交不能更新到数据库
    }

//    @Test
//    @DisplayName("按值查找")
//    public void testFind() {
//        Map<String, String> map = new HashMap<String, String>();
//        map.put("张三");
//        map.put("李四");
//        List<User> list =  mapper.find(map);
//        System.out.println(list);
//    }

    @Test
    @DisplayName("按值查找")
    public void testGetById() {
        User user = (User) mapper.getById("王五");
        System.out.println(user);
    }

    @Test
    public void testGetList() {
        List<User> list = mapper.getList();

        for (User user: list) {
            System.out.println(user);
        }
    }


}
