# MyBatis和Spring MVC整合学习记录

这个项目是关于Mybatis和Spring MVC整合的部分，包括测试。相比mybatis和Spring的整合，mybatis和Spring MVC的整合多了web层级的内容。

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
- 横切的包：aspectjweaver
- 日志：log4j

```xml
<!-- 添加依赖: junit5，数据库驱动，连接池，servlet，jsp，mybatis，mybatis-spring，spring，aspectjweaver，log4j -->
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

    <!-- 横切的包aspectjweaver -->
    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>1.9.6</version>
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
</configuration>
```

#### 2）Spring MVC配置文件

Spring MVC配置文件分成了4个文件，配置spring MVC的不同部分。这4个文件分别命名为 `applicationContext.xml`，`spring-dao.xml	` ， ` spring-service.xml` ，` spring-mvc.xml`，，放在 `resources` 下。

 `spring-dao.xml`的核心内容如下：

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
    <property name="acquireRetryAttempts" value="10"/>
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

 `spring-service.xml`的核心内容如下：

```xml
<import resource="classpath:spring-dao.xml"/>

<!-- 1. 扫描service下的包 -->
<context:component-scan base-package="com.withered.service"/>

<!-- 2. 声明式事务配置 -->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <!-- 注入数据源 -->
    <property name="dataSource" ref="dataSource"/>
</bean>

<!-- 3. aop 事务支持 -->
<!-- 配置事务通知 -->
<tx:advice id="txAdvice" transaction-manager="transactionManager">
    <!-- 给方法配置事务 -->
    <tx:attributes>
        <!-- 所有的增删改查操作 -->
        <tx:method name="*" propagation="REQUIRED"/>
    </tx:attributes>
</tx:advice>
<!-- 配置事务切入 -->
<aop:config>
    <aop:pointcut id="txPointCut" expression="execution(* com.withered.dao.*.*(..))"/>
    <aop:advisor advice-ref="txAdvice" pointcut-ref="txPointCut"/>
</aop:config>
```

 `spring-mvc.xml`的核心内容如下：

```xml
<!-- 1. 注解驱动-->
<mvc:annotation-driven/>
<!-- 2. 静态资源过滤-->
<mvc:default-servlet-handler/>
<!-- 3. 扫描包：controller -->
<context:component-scan base-package="com.withered.controller"/>
<!-- 4. 视图解析器 -->
<bean id="internalResourceViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/views/"/>
    <property name="suffix" value=".jsp"/>
</bean>
```

 `applicationContext.xml`的核心内容如下：

```xml
<!-- 使用配置将各层的配置文件注入到Spring中 ，也可以使用注解注入到Spring中-->
<import resource="classpath:spring-dao.xml"/>
<import resource="classpath:spring-service.xml"/>
<import resource="classpath:spring-mvc.xml"/>
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



一般在工程中配置完某个模块后，都会进行单元测试，保证每个模块都是可用的。写完项目所需要的配置，下面开始进行测试。

## 2. 测试

### 2.1 测试数据库连接情况

下面先测试数据库的连接情况。

在 `src/test/java` 下创建相关的测试类。先在 `com/withered` 下创建 `controller/service/dao` 及数据库连接等层级的测试包 `db` 以及 `db` 包下面的测试类 `DBConnectionTest` 。这个测试不需要创建各层级包下面的类。

数据库测试类名为 `DBConnectionTest` ，放在 `com/withered/db` 下。

```java
public class DBConnectionTest {
    // mybatis配置文件
    private String resource = "applicationContext.xml";
    private SqlSessionFactory sqlSessionFactory;
    private SqlSession sqlSession = null;
    
    // 测试数据库连接情况
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
```

运行测试用例，如果参数正确，在控制台会出现如下结果

```
MyBatis ==> 数据库连接成功！目前SQL配置数目：0
```

### 2.2 测试mybatis依赖注入及基本配置

同样在 `DBConnectionTest` 中添加测试方法 `testGetById` ，用来测试mybatis依赖注入及基本配置是否成功。这个测试方法需要创建 dao 层下的 `UserMapper.java` 和 `UserMapper.xml`  （如果要使用Spring的自动注入，这两个文件的名字要相同，且在同一个包下），以及实体类 `User` 。

1. **测试方法 testGetById()**

测试方法在编写完其他文件后编写，但这里以测试方法为重，所以先记录测试方法。测试方法核心内容如下（完整代码在工程中）。

```java
@Test
public void testGetById() {
    // 推荐使用getMapper，得到mapper之后再获取sql语句。需要先获实例sSession
	UserMapper mapper = this.getSqlSession().getMapper(UserMapper.class);
    User user = mapper.getById("张三");
    System.out.println("姓名：" + user.getName());
    System.out.println("年龄：" + user.getAge());
    System.out.println("性别：" + user.getSex());
}
```

运行测试用例，如果出现要查找的用户的信息，则说明mybatis依赖注入及基本配置是成功的。我的测试结果如下：

```java
姓名：张三
年龄：10
性别：男
```

在这里需要说明一点的是，这个测试方法需要dao的接口及mapper文件，我这里的命名为 `UserMapper.java` 和 `UserMapper.xml` 。测试类是放在 `src/test/java`  这个用于测试的结构下的，但是两个mapper文件放在 `src/test/java` 会出现错误，而放在 `src/main/java`  下正常。目前，没有找到是什么原因。出现的错误类型是绑定异常：**BindingException: Invalid bound statement (not found):com.withered.dao.UserMappergetById.**

<img src="https://gitee.com/withered-wood/picture/raw/master/20210801173748.png" alt="image-20210801173747370" style="zoom:50%;" />



2. **编写实体类 `User`**

在 `src/main/java`  下创建包 `com/withered/pojo`， 在该包下创建实体类 `User.java`。

```java
public class User {
    private String name;
    private int age;
    private String sex;
    
    // 无参和有参构造函数
    // 所有属性的get()和set()函数
}
```

3. **编写Dao层**

在 `src/main/java`  下创建包 `com/withered/dao`， 在该包下创建接口 `UserMapper.java` 以及 `UserMapper.xml`。

`UserMapper.java`：dao层接口，包括数据库的增删改查。这里以查询全部数据为例。

```java
public interface UserMapper {
    User getById(String id);
}
```

`UserMapper.xml`：对应相应的dao层接口，编写sql语句。

```xml
<mapper namespace="com.withered.dao.UserMapper">
    <select id="getById" parameterType="java.lang.String" resultType="User">
        select * from myweb.user where name = #{name};
    </select>
</mapper>
```

测试完数据库连接之后，测试Spring注入和切面功能是否配置成功。

### 2.3 测试Spring注入和切面功能是否配置成功

1）**编写dao层测试用例。**这里与第二个测试中的dao层内容相同。

```java
public interface UserMapper {
    User getById(String id);
}
```

2）**编写service层测试用例。**创建文件 `UserService.java` 和 `UserServiceImpl.java` ，放在  `com/withered/service` 下。这里同样以测试查询某个用户信息为例。

`UserService.java` 核心内容如下：

```java
public interface UserService {
    User getById(String id);
}
```

`UserServiceImpl.java` 核心内容如下：

```java
@Service
public class UserServiceImpl implements UserService {
    private UserMapper mapper;

    @Autowired
    public void setMapper(UserMapper mapper) {
        this.mapper = mapper;
    }

    public User getById(String id) {
        return mapper.getById(id);
    }
}
```

3）**编写controller层测试用例。**创建文件 `UserController.java`  ，放在  `com/withered/controller` 下。

`UserController.java` 核心内容如下：

```java
@Controller
public class UserController {
    private UserService userService;

    @Autowired
    public void setUserService(@Qualifier("userServiceImpl") UserService userService) {
        this.userService = userService;
    }

    @RequestMapping("/getUser")
    public String getUser(String id, Model model) {
        User user = userService.getById(id);
        model.addAttribute("msg", user);
        return "test";
    }
}
```

4）**编写前端显示页面。**前端显示页面命名为 `test.jsp` ，放在 `WEB-INF/views` 下。这里只是简单的显示了查询到的信息，没有做过多的页面设计。

```java
<%-- 在页面上显示后端查询的数据库信息 --%>
<h1>${msg}</h1>
```

5）**部署**

部署到Tomcat上，我的访问地址是：`http:localhost/getUser?id=张三` 。如果在页面上可以显示出"张三"的信息，则说明spring测试成功。

测试过程的请求处理过程如下：

- 请求通过了 Spring MVC 的前端处理器，然后通过处理器映射器找到处理器适配器，然后处理器适配器寻找含有 `/getUser` 请求的controller方法，找到之后，controller初始化引入service的注入bean，service也会在自身的实现中引入dao的注入bean。
- 然后请求去controller方法中，通过service的getUser方法获取用户信息，在dao层中获取了会话工厂 `SqlSessionFactory` 对象，通过会话工厂获得会话对象 `SqlSession`，之后调用 getById 方法获取mapper映射文件中的SQL配置并加载执行，获取姓名为关键字的结果集，然后由service返回给controller层。
- 最终controller返回一个视图字符串，前端控制器寻找视图解析器读取该路径，并在资源文件夹中获取相关视图文件，并编译加载，将model中的数据初始化至视图。

到此，工程环境的搭建及测试工作已经全部完成。



## 3. 遇到的问题

**MalformedByteSequenceException: 2 字节的 UTF-8 序列的字节 2 无效。**

**错误原因**：pom.xml文件的编码格式与xml文件保存的编码格式不对应

**解决方法**：找到以下路径：setting ==>  Editor ==>  File Encoding。修改下图中的3个地方。（这个错误，真是遇到很多次，也不知道为啥。有时候要重启IDEA，有时候重启也不管用，只能新建个工程，写代码前改了。）

![image-20210729215626685](https://gitee.com/withered-wood/picture/raw/master/20210729215628.png)



