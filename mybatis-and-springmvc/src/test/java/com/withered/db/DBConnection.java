package com.withered.db;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class DBConnection {
    // mybatis配置文件
    private String resource = "applicationContext.xml";
    private SqlSessionFactory sqlSessionFactory;
    private SqlSession sqlSession = null;

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
}
