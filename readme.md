# MyBatis开发学习记录

这个项目是使用Mybatis操作数据库的示例，本示例是只关于Mybatis的，不包括Mybatis和Spring整合的部分。

## 关于MyBatis中的一点东西

这一部分是记录MyBatis中的 `SqlSessionFactory` 及 `SqlSession` 的一点东西。

每个基于MyBatis的应用都是以一个 **`SqlSessionFactory `的实例**为核心的。`SqlSessionFactory` 的实例可以通过 `SqlSessionFactoryBuilder` 获得。

**构建SqlSessionFactory**

从 XML 文件中构建 `SqlSessionFactory` 的实例非常简单。

```java
String resource = "mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
```

**从SqlSessionFactory中创建SqlSession实例**

```java
SqlSession sqlSession = sqlSessionFactory.openSession();
```

**提交事务**

数据库的插入、删除、更新操作都需要在SQL操作之后提交事务，数据库的更新才会生效。

```java
sqlSession.commit(); // 不提交事务，数据库不会更新
```

**关闭事务**

```java
sqlSession.close();  // 每个SqlSession必须要关闭
```



## 开发框架搭建



## 编写核心配置

### MyBatis配置文件

MyBatis配置文件命名为 `mybatis-config.xml`，放在 `resources` 下。需要说明一点的是，mybatis配置文件中属性的放置位置是固定的，前后顺序不能改变。属性的顺序如下

```
properties?,settings?,typeAliases?,typeHandlers?,objectFactory?,objectWrapperFactory?,reflectorFactory?,plugins?,environments?,databaseIdProvider?,mappers?
```

比如，properties不能放在setting的后面，只能放在它前面。

 `mybatis-config.xml`的内容如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    <!-- Mybatis配置文件。属性放置的前后顺序是固定的 -->

    <!-- 加载.properties文件-->
    <properties resource="database.properties"/>

    <!-- 设置执行sql语句后打印结果 -->
    <settings>
        <setting name="logImpl" value="LOG4J"/>
    </settings>

    <!-- 配置数据源，交给 spring 去做-->
    <typeAliases>
        <!-- 批量扫描别名 -->
        <package name="com.withered.pojo"/>
    </typeAliases>

    <environments default="development">
        <environment id="development">
            <!-- 使用JDBC事务管理。如果使用 Spring + MyBatis，则没有必要配置事务管理器 -->
            <transactionManager type="JDBC"></transactionManager>
            <!-- 数据库连接池 -->
            <dataSource type="POOLED">  <!-- POOLED：这种数据源的实现利用“池”的概念将 JDBC 连接对象组织起来，避免了创建新的连接实例时所必需的初始化和认证时间。 -->
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
        <mapper resource="com/withered/mapper/UserMapper.xml"/>
    </mappers>

</configuration>
```

### 数据库配置文件

数据库配置文件命名为 `database.properties`，放在 `resources` 下。自己创建的数据库名为myweb，用户名和密码修改为自己数据库的用户名和密码。

```properties
# 数据库配置文件
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/myweb
jdbc.username=root
jdbc.password=123456
```

如果上面的 jdbc.url 连接失败，可以尝试修改以下的参数

```properties
jdbc.url=jdbc:mysql://localhost:3306/myweb?userSSL=false&userUnicode=true&characterEncoding=utf-8&serverTimeZone=UTC
```

### 日志配置文件

日志配置文件命名为 `log4j.properties`，放在 `resources` 下。不需要日志的可以不配置。

```properties
# 日志配置文件

# 全局日志设置
log4j.rootLogger=DEBUG, stdout
# console输出
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%5p [%t] - %m%n
```

写完项目所需要的配置，下面开始进行Mybatis对数据库的增删改查操作，以及相关测试。

## 编写实体类

这里以用户为例，创建实体类 `User`

```java
public class User {
    private String name;
    private int age;
    private String sex;
    
    // 无参和有参构造函数
    // 所有属性的get()和set()函数
}
```



## MyBatis中遇到的问题

**MalformedByteSequenceException: 2 字节的  UTF-8 序列的字节 2 无效。**

**错误原因**：pom.xml文件的编码格式与xml文件保存的编码格式不对应

**解决方法**：找到以下路径：setting ==>  Editor ==>  File Encoding。修改下图中的3个地方

![image-20210729215626685](https://gitee.com/withered-wood/picture/raw/master/20210729215628.png)



 **Cause: java.lang.ClassNotFoundException: Cannot find class: ${driver}**

mybatis配置文件（`mybatis-config.xml`）如下

![image-20210729221046687](https://gitee.com/withered-wood/picture/raw/master/20210729221055.png)

**错误原因**：没有加载 数据库配置文件，我写的数据库配置文件命名为 database.properties

**解决办法**：在mybatis配置文件（`mybatis-config.xml`）中，在最开头添加以下属性信息

```xml
<!-- 加载.properties文件-->
<properties resource="database.properties"/>
```