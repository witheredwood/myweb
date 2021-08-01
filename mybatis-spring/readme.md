# MyBatis和spring整合学习记录

这个项目是关于Mybatis和Spring整合的部分，不包括spring mvc的相关内容。

## 关于MyBatis和Spring整合

Spring 是一款比较优秀的Java框架，它包含了控制反转、依赖注入与切面编程。在许多企业级web应用中，Spring往往扮演着管理容器的角色。Spring的优点有很多，它的控制反转和依赖注入降低了程序之间的耦合度，使用切面编程原理可以封装JDBC对事务的处理。在日常开发中，许多数据库持久层框架（如MyBatis）都会结合Spring框架进行开发。

MyBatis最重要的一个类就是 `SqlSessionFactory` ，它的任务是通过加载全局配置文件和 `mapper` 映射文件，初始化连接参数，创建会话实例类 `SqlSession` 。`SqlSession` 会话实例类是与数据库进行连接，执行 `mapper` 中配置的 SQL 映射语句的核心类。

在 Spring 与 MyBatis 的整合环境中，Spring 的作用是通过单例方式管理 `SqlSessionFactory` ，这样不仅节省连接和内存资源，而且不需要自己编写加载 `Factory` 的代码，从而统一了会话对象的产生源头。此外，Spring 也会对持久层的 `mapper `进行统一管理。Spring 还可以对数据库连接池、事务进行统一的管理。

## 1. 开发框架搭建

### 1.1 搭建Maven环境

1. **创建Maven工程**

在IDEA中创建一个Maven项目。

2. **导入依赖**

在 `pom.xml` 中添加需要的依赖和Maven资源过滤。

添加的依赖如下：

- 测试：junit5
- 数据库相关：数据库驱动，连接池
- servlet，jsp
- 框架：mybatis，spring
- 整合包：mybatis-spring
- 日志：log4j

```xml
<dependencies>
    <!-- junit5 -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>RELEASE</version>
        <scope>test</scope>
    </dependency>

    <!-- MySQL数据库驱动 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.24</version>
    </dependency>
    <!-- 数据库连接池c3p0 -->
    <dependency>
        <groupId>com.mchange</groupId>
        <artifactId>c3p0</artifactId>
        <version>0.9.5.5</version>
    </dependency>
    
    <!-- servlet - jsp -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>servlet-api</artifactId>
        <version>2.5</version>
    </dependency>
    <dependency>
        <groupId>javax.servlet.jsp</groupId>
        <artifactId>jsp-api</artifactId>
        <version>2.2</version>
    </dependency>
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>jstl</artifactId>
        <version>1.2</version>
    </dependency>


    <!-- Mybatis -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.7</version>
    </dependency>
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
        <version>2.0.6</version>
    </dependency>

    <!-- Spring -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.3.6</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>5.3.7</version>
    </dependency>

    <!-- 日志log4j -->
    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.12</version>
    </dependency>
</dependencies>
```

**Maven静态资源过滤**。防止资源导出失败的问题

```xml
<!-- Maven 资源过滤：防止资源导出失败的问题 -->
<build>
    <resources>
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/*.properties</include>
                <include>**/*.xml</include>
            </includes>
            <filtering>true</filtering>
        </resource>
        <resource>
            <directory>src/main/resources</directory>
            <includes>
                <include>**/*.properties</include>
                <include>**/*.xml</include>
            </includes>
            <filtering>true</filtering>
        </resource>
    </resources>
</build>
```



### 1.2 编写核心配置

#### 1）MyBatis配置文件

MyBatis配置文件命名为 `mybatis-config.xml`，放在 `resources` 下。需要说明一点的是，mybatis配置文件中属性的放置位置是固定的，前后顺序不能改变。属性的顺序如下

```
properties?,settings?,typeAliases?,typeHandlers?,objectFactory?,objectWrapperFactory?,reflectorFactory?,plugins?,environments?,databaseIdProvider?,mappers?
```

比如，`properties` 不能放在 `setting` 的后面，只能放在它前面。

 `mybatis-config.xml`的内容如下

```xml
<configuration>
    <!-- Mybatis配置文件，仅需关注性能化配置 -->

    <!-- 加载.properties文件-->
    <properties resource="db.properties"/>


    <!-- 缓存的参数和日志 -->
    <settings>
        <!-- 打开延迟加载的开关 -->
        <setting name="lazyLoadingEnabled" value="true"/>
        <!-- 将积极加载改为消极加载（即按需加载） -->
        <setting name="aggressiveLazyLoading" value="false"/>
        <!-- 打开全局缓存开关（二级缓存），默认值是true -->
        <setting name="cacheEnabled" value="true"/>
        <!-- 设置执行sql语句后打印结果 -->
        <setting name="logImpl" value="LOG4J"/>
    </settings>

    <!-- 别名定义。该路径下的Java实体类都可以拥有一个别名（即首字母小写的别名） -->
    <typeAliases>
        <package name="com.withered.pojo"/>
    </typeAliases>

    <!-- 加载映射文件 -->
    <mappers>
        <!-- 批量加载mapper -->
        <package name="com.withered.dao"/>
    </mappers>

</configuration>
```

#### 2）spring配置文件

Spring配置文件命名为 `applicationContext.xml`，放在 `resources` 下。 `applicationContext.xml`的内容如下

```xml
<!-- 1. 关联数据库配置文件-->
<context:property-placeholder location="classpath:db.properties"/>

<!--  2. 连接池
    dbcp：半自动华操作，不能自动连接
    c3p0：自动化操作（自动化加载配置文件，并且可以自设置到对象中）
    druid：hikari
     -->
<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
    <property name="driverClass" value="${jdbc.driver}"/>
    <property name="jdbcUrl" value="${jdbc.url}"/>
    <property name="user" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>

    <!-- c3p0 连接池的私有属性 -->
    <property name="maxPoolSize" value="30"/>
    <property name="minPoolSize" value="10"/>
    <!-- 关闭连接后不自动commit -->
    <property name="autoCommitOnClose" value="false"/>
    <!-- 获取连接超时时间 -->
    <property name="checkoutTimeout" value="10000"/>
    <!-- 当获取连接失败重试次数 -->
    <property name="acquireRetryAttempts" value="2"/>
</bean>

<!-- 3. sqlSessionFactory -->
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="dataSource"/>
    <!-- 绑定 Mybatis 的配置文件 -->
    <property name="configLocation" value="classpath:mybatis-config.xml"/>
</bean>

<!-- spring：配置dao接口扫描包，动态的实现了Dao 接口可以注入到Spring容器中 -->
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
    <!-- 注入 sqlSessionFactory -->
    <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
    <!-- 要扫描的dao包 -->
    <property name="basePackage" value="com.withered.dao"/>
</bean>

```



#### 3）数据库配置文件

配置数据库之前需要先连接本地数据库。路径：Database ==> + ==> Data Source => MySQL => 添加本地已经建好的数据库。

数据库配置文件命名为 `db.properties`，放在 `resources` 下。自己创建的数据库名为 `myweb`，用户名和密码修改为自己数据库的用户名和密码。

```properties
# 数据库配置文件
jdbc.driver=com.mysql.jdbc.Driver
# mysql8.0 要多加一个时区设置serverTimeZone=UTC
jdbc.url=jdbc:mysql://localhost:3306/myweb?userSSL=true&userUnicode=true&characterEncoding=utf-8&serverTimeZone=UTC
jdbc.username=root
jdbc.password=123456
```

#### 4）日志配置文件

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



## 2. 编写实体类

在 `src/main/java`  下创建包 `com/com.withered/pojo`， 在该包下创建实体类 `User.java`。

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



## 3. 编写Dao层

在 `src/main/java`  下创建包 `com/com.withered/dao`， 在该包下创建接口 `UserMapper.java` 以及 `UserMapper.xml`。

`UserMapper.java`：dao层接口，包括数据库的增删改查。这里以查询全部数据为例。（这个接口中使用了模板 `T`， 因为之后想要创建一个dao层的公共接口，这样就不用每次都重新写一遍接口。）

```java
public interface UserMapper<T> {
    public List<T> getList();  // 查询全部数据
}
```

`UserMapper.xml`：对应相应的dao层接口，编写sql语句。

```xml
<mapper namespace="com.com.withered.dao.UserMapper">
    <select id="getList" resultType="User">
        select * from user;
    </select>
</mapper>
```



## 4. service层测试

在 `test/java` 下创建和 `src/main/java` 相同的结构，创建包 `com/withered/service` ，在该包下编写测试类 `UserServiceTest.java` ，测试是否能成功取到数据。

```java
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
}
```


