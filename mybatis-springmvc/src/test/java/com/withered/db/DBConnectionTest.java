package com.withered.db;

import com.withered.dao.UserMapper;
import com.withered.pojo.User;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class DBConnectionTest {
    // spring配置文件
    private String resource = "applicationContext.xml";
    private SqlSessionFactory sqlSessionFactory;
    private SqlSession sqlSession = null;
    private UserMapper mapper;

    // 1. 测试数据库连接情况
    @Test
    public void testConnection() {
        // 获取Spring类加载配置对象
        ApplicationContext context = new ClassPathXmlApplicationContext(resource);
        // 从配置对象中创建会话工厂，并注入mybatis配置文件信息
        sqlSessionFactory = context.getBean(SqlSessionFactory.class);
        // 创建SqlSession实例
        sqlSession = sqlSessionFactory.openSession();
        if (sqlSession != null) {
            System.out.print("MyBatis ==> 数据库连接成功！目前SQL配置数目：");
            System.out.println(sqlSession.getConfiguration().getMappedStatements().size());
        } else {
            System.out.println("MyBatis ==> 数据库连接失败！");
        }
    }

    // 获取SqlSession实例
    public SqlSession getSqlSession() {
        // 获取Spring类加载配置对象
        ApplicationContext context = new ClassPathXmlApplicationContext(resource);
        // 从配置对象中创建会话工厂，并注入mybatis配置文件信息
        sqlSessionFactory = context.getBean(SqlSessionFactory.class);
        // 创建SqlSession实例
        sqlSession = sqlSessionFactory.openSession();
        return sqlSession;
    }

    // 2. 测试mybatis依赖注入及基本配置是否成功
    @Test
    public void testGetById() {
        mapper = this.getSqlSession().getMapper(UserMapper.class);
        User user = mapper.getById("张三");
        System.out.println("姓名：" + user.getName());
        System.out.println("年龄：" + user.getAge());
        System.out.println("性别：" + user.getSex());
    }
}
