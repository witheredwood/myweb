# Spring boot 学习记录(进行中)

javaweb：独立开发MVC网站

ssm：框架

war：tomcat运行





**约定大于配置**



微服务架构：把每个功能单独出来，把独立出来的功能元素动态的组合。打破了 all in one 的架构。



## 创建项目



![image-20210810091643848](https://gitee.com/withered-wood/picture/raw/master/20210810091645.png)



创建项目时需要勾选 `JDBC API` 和 `MySQL Driver ` ，用来连接数据库。 或者在 `pom.xml` 中引入依赖

```xml
<!-- JDBC -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<!-- MySQL -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```



## 自动装配原理

启动器：spring-boot-starter  

主程序

注解：

```java
@SpringBootConfiguration
	@Configuration
		@Component	组件


@EnableAutoConfiguration	自动配置
            
```

在了解自动装配的原理之后，有一点需要注意，自动配置类必须在一定条件下才能生效。只有 `@Conditonal` 指定的条件成立，才给容器中添加组件，配置里面的所有内容才能生效。

在配置文件 `application.yaml` 中能配置的东西，都有一个**规律**：

**配置文件 `application.yaml` 中能配置的东西，都有一个对应的 `xxxAutoConfiguration` 和 `xxxProperties` 文件。**

`xxxAutoConfiguration` ：自动配置类。有默认值。如果绑定配置文件，可以使用自定义配置。

`xxxProperties`：配置文件。

每一个 `xxxAutoConfiguration` 类都是容器中的一个组件，最后都加入到容器中，可以用他们来进行自动配置，每一个自动配置类都可以进行自动配置的功能。

根据当前不同的条件判断，决定找个配置类是否生效。一旦配置类生效，这个配置类就会给容器中添加各种组件。这些组件的属性从对应的 properties 类中获取，这些类中的每一个属性又是和配置文件绑定的。

### 自动装配的步骤(原理)

1. Springboot 启动会加载大量的自动配置类；

2. 然后看我们需要的功能是否在Springboot默认写好的自动配置类中；
3. 如果需要的功能在自动配置类中，再查看该自动配置类中配置了哪些组件。如果我们要用的组件在里面，就不需要手动配置了。
4. 给容器中的自动配置类添加组件的时候，会从properties类中获取某些属性。我们只需要在配置文件 `application.yaml` 中指定这些属性的值即可。

注：

- **`xxxAutoConfiguration`**：自动配置类。给容器中添加组件。

- **`xxxProperties`**：配置文件。封装配置文件中的相关属性。



## SpringApplication 类

做了4件事：

- 判断应用事普通的项目还是web项目
- 查找并加载所有可用的初始化器，设置到 `initializers` 属性中
- 找出所有的应用程序监听器，设置 `listeners` 属性中
- 判断并设置 `main` 方法的定义类，找到运行的主类。



run() 方法中有全局监听器，获取上下文，处理bean。



## Spring 配置

yaml 可以保存键值对、对象、数组，可以注入到配置类中。

properties 只能保存键值对。

```yaml
# 普通的key-value
name: zs

# 对象
student:
  name: zs
  age: 3

person: {name: zs,age: 3}

# 数组
pets:
  - dog
  - cat
  - pig

pet: [dog,cat,pig]
```

不同类型的数据赋值如下：

```yaml
person:
  name: zs
  age: 3
  ishappy: true
  birth: 2021/08/11
  maps: {k1: v1,k2: v2}
  lists: [a,b,c]
  dog:
    name: ls
    age: 3
```

application.properties 中的赋值方式如下：

```properties
student.name=zs
student.age=3
```



## JSR303 校验

```
@Validated  // 数据校验
```



## 资源加载路径

1.  `file:./config/`
2. `file:./`
3.  `classpath:/config/` 
4.  `classpath:/` ：默认。



Spring 多环境配置：

```yaml
server:
	port: 8080
spring:
	profiles:
		active: dev
---
server:
	port: 8081
spring:
	profiles: dev
	
---
server:
	port: 8082
spring:
	profiles: test
```



------

## Web开发

### 静态资源导入

可以在 `WebMvcAutoConfiuration.java` 中查看相应方案的源码。相关源码如下：

```java
public void addResourceHandlers(ResourceHandlerRegistry registry) {
	// 方案三：自定义路径。默认路径会失效。  
    if (!this.resourceProperties.isAddMappings()) {
        logger.debug("Default resource handling disabled");
        return;
    }
    // 方案一：使用webjars包。
    addResourceHandler(registry, "/webjars/**", "classpath:/META-INF/resources/webjars/");
    // 方案二：当前目录下的默认路径。
    addResourceHandler(registry, this.mvcProperties.getStaticPathPattern(), (registration) -> { registration.addResourceLocations(this.resourceProperties.getStaticLocations());
        if (this.servletContext != null) {
            ServletContextResource resource = new ServletContextResource(this.servletContext, SERVLET_LOCATION);
            registration.addResourceLocations(resource);
        }
    });
}
```

**方案一：导入 webjars 依赖。**以juqery为例。

webjars官网：https://www.webjars.org/

```xml
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>jquery</artifactId>
    <version>3.6.0</version>
</dependency>
```

**方案二：当前目录下的默认路径**

方案二所需的其他文件的源码如下。

`WebMvcPreoterties.java`相关源码（相关函数是按照查找顺序排放）：

```java
public String getStaticPathPattern() {
    return this.staticPathPattern;
}

// 当前目录下的所有东西都可以识别
private String staticPathPattern = "/**";
```

在 `WebMvcAutoConfiuration.java` 中查看关于 resource 的内容

```java
addResourceHandler(registry, this.mvcProperties.getStaticPathPattern(), (registration) -> {
		registration.addResourceLocations(this.resourceProperties.getStaticLocations());
    if (this.servletContext != null) {
        ServletContextResource resource = new ServletContextResource(this.servletContext, SERVLET_LOCATION);
        registration.addResourceLocations(resource);
    }
});
```

点击 `this.resourceProperties.getStaticLocations()` 中的 `getStaticLocations()` ，查看 `WebProperties.java` 文件。（相关函数是按照查找顺序排放）

```java
public String[] getStaticLocations() {
    return this.staticLocations;
}

private String[] staticLocations = CLASSPATH_RESOURCE_LOCATIONS;


// 这些路径下都可以作为静态资源的路径
private static final String[] CLASSPATH_RESOURCE_LOCATIONS = { 
    "classpath:/META-INF/resources/", "classpath:/resources/", 
    "classpath:/static/", "classpath:/public/" 
};
```

优先级顺序依次是：`resources` > `static`(默认) > `public` 。

 `/META-INF/resources` 是方案一中的路径。这4中路径是springboot的默认路径。

### 首页

**相关源码**。`WebMvcPreoterties.java` 中设置首页的相关源码如下：

```java
// 首页的映射
@Bean
public WelcomePageHandlerMapping welcomePageHandlerMapping(ApplicationContext applicationContext, FormattingConversionService mvcConversionService, ResourceUrlProvider mvcResourceUrlProvider) {
    WelcomePageHandlerMapping welcomePageHandlerMapping = new WelcomePageHandlerMapping(
        new TemplateAvailabilityProviders(applicationContext), applicationContext, getWelcomePage(),
        this.mvcProperties.getStaticPathPattern());
    welcomePageHandlerMapping.setInterceptors(getInterceptors(mvcConversionService, mvcResourceUrlProvider));
    welcomePageHandlerMapping.setCorsConfigurations(getCorsConfigurations());
    return welcomePageHandlerMapping;
}

// 获取首页
private Resource getWelcomePage() {
    // 获取首页的位置
    for (String location : this.resourceProperties.getStaticLocations()) {
        Resource indexHtml = getIndexHtml(location);
        if (indexHtml != null) {
            return indexHtml;
        }
    }
    ServletContext servletContext = getServletContext();
    if (servletContext != null) {
        // 获取首页页面
        return getIndexHtml(new ServletContextResource(servletContext, SERVLET_LOCATION));
    }
    return null;
}

// 在相应路径中获取 index.html。设置index.html就可以设置首页内容
private Resource getIndexHtml(Resource location) {
    try {
        Resource resource = location.createRelative("index.html");
        if (resource.exists() && (resource.getURL() != null)) {
            return resource;
        }
    }
    catch (Exception ex) {
    }
    return null;
}
```

**方案**。设置首页的方案如下：

在静态资源的默认路径（这里不配置自己的路径，只使用默认路径存放静态资源）下创建一个 `index.html` 文件，在 `index.html` 中编写首页内容。重启访问 `http:localhost:8080/` 就可以访问首页。



### thymeleaf 模板引擎

在 `templates` 下的页面必须通过 `controller` 才能访问。

**相关依赖**

在 `pom.xml` 中导入相关的依赖：

```xml
<!-- thymeleaf 模板引擎 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

**源码**

在 `ThymeleafProperties.java` 中查看相关源码：

```java
// 相当于视图解析器。在 /templates下存放页面，页面文件以 .html 结尾
public static final String DEFAULT_PREFIX = "classpath:/templates/";
public static final String DEFAULT_SUFFIX = ".html";
```

**测试**

在 测试页面的路径： `resources/templates/test.html` 。启动之后，输入 `http://localhost:8080/test` 既可以看到测试页面上的内容。



### MVC 配置原理

路径：`arc/main/java/com/withered/config/MymvcConfig.java`。如果需要自定义的功能，编写这个组件，然后将组件交给spring，springboot就会自动装配。

扩展 springmvc 的代码如下：

```java
// 扩展spring mvc。
@Configuration  // 该注解将一个类变成配置类
public class MymvcConfig implements WebMvcConfigurer {

    // 将自定义视图解析器注入到spring中
    @Bean
    public ViewResolver myViewResolver() {
        return new myViewResolver();
    }

    // 自定义视图解析器。实现了视图解析器接口的类，可以看作是一个视图解析器
    public static class myViewResolver implements ViewResolver {
        @Override
        public View resolveViewName(String s, Locale locale) throws Exception {
            return null;
        }
    }
}
```

**源码**

`ContentNegotiationConfigurer` 中的相关源码：

```java
// 重写resolveViewName方法
public View resolveViewName(String viewName, Locale locale) throws Exception {
    RequestAttributes attrs = RequestContextHolder.getRequestAttributes();
    Assert.state(attrs instanceof ServletRequestAttributes, "No current ServletRequestAttributes");
    List<MediaType> requestedMediaTypes = getMediaTypes(((ServletRequestAttributes) attrs).getRequest());
    if (requestedMediaTypes != null) {
        // 获取候选视图解析器
        List<View> candidateViews = getCandidateViews(viewName, locale, requestedMediaTypes);
        // 获取最好的视图
        View bestView = getBestView(candidateViews, requestedMediaTypes, attrs);
        if (bestView != null) {
            return bestView;
        }
    }

    String mediaTypeInfo = logger.isDebugEnabled() && requestedMediaTypes != null ?
        " given " + requestedMediaTypes.toString() : "";

    if (this.useNotAcceptableStatusCode) {
        if (logger.isDebugEnabled()) {
            logger.debug("Using 406 NOT_ACCEPTABLE" + mediaTypeInfo);
        }
        return NOT_ACCEPTABLE_VIEW;
    }
    else {
        logger.debug("View remains unresolved" + mediaTypeInfo);
        return null;
    }
}

```

### 格式化

**源码**

```java
// 日期格式化
public FormattingConversionService mvcConversionService() {
    Format format = this.mvcProperties.getFormat();
    WebConversionService conversionService = new WebConversionService(new DateTimeFormatters()
                                                                      .dateFormat(format.getDate()).timeFormat(format.getTime()).dateTimeFormat(format.getDateTime()));
    addFormatters(conversionService);
    return conversionService;
}
```

在 `WebMvcProperties.java` 中查看相关源码：

```java
public String getDateTime() {
    return this.dateTime;
}

/**
* Date-time format to use, for example `yyyy-MM-dd HH:mm:ss`.
*/
private String dateTime;

```

### springboot的默认配置

- springboot 在自动化配置很多组件的时候，先查看容器中是否有用户自己配置的。
- 如果有，就使用用户配置的；如果没有，就使用默认配置进行自动配置。
- 如果有些组件存在多个（例如视图解析器），就把用户和默认的结合起来。



## 数据库 Mysql（重点）

在项目中配置了MySql数据库，这里测试了使用JDBC连接和操作数据库。

**添加依赖**

在 `pom.xml` 中添加以下依赖

```xml
<!-- JDBC -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<!-- MySQL -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

**连接数据库**

在 `application.yaml` 中配置数据库连接的属性，如下：

```yaml
spring:
  datasource:
    username: root
    password: 123456
    url: jdbc:mysql://localhost:3306/myweb?useUnicode=true&characterEncoding=utf-8&serverTimezone=UTC
    driver-class-name: com.mysql.cj.jdbc.Driver
```

**测试连接**

```java
@Autowired
DataSource dataSource;

@Test
public void testConnection() throws SQLException {
    // 查看默认的数据源
    System.out.println(dataSource.getClass());  

    Connection connection = dataSource.getConnection();  // 获取数据库连接
    System.out.println(connection);

    connection.close();  // 关闭连接
}
```

`dataSource.getClass()` 输出结果为 `class com.zaxxer.hikari.HikariDataSource` ，默认使用 `hikari` 数据源 。

**增删改查操作**

以下示例是在没有实体类的情况下，实现数据库的操作。

```java
@RestController
public class JdbcController {
    @Autowired
    JdbcTemplate jdbcTemplate;
    
    // 查询数据库所有数据
    @GetMapping("/find")
    public List<Map<String, Object>> find() {
        String sql = "select * from myweb.user";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        return list;
    }

    @GetMapping("/add")
    public String add() {
        String sql = "insert into myweb.user(id, name, age, sex) values (6, '小明', 15, '男')";
        jdbcTemplate.update(sql);
        return "add ok";
    }
    
    // 只能修改数据库中已存在的数据
    @GetMapping("/update/{id}")  
    public String update(@PathVariable("id") int id) {
        String sql = "update myweb.user set name=?, age=?, sex=? where id = " + id;
        // 封装对象。将要设置的数据封装成对象传入
        Object[] objects = new Object[3];  // 要传递的参数
        objects[0] = "小红";
        objects[1] = 5;
        objects[2] = "女";
        jdbcTemplate.update(sql, objects);
        return "update ok";
    }
    
    @GetMapping("/delete/{id}")
    public String delete(@PathVariable("id") int id) {
        // 第一种方式
        String sql = "delete from myweb.user where id = " + id;
        jdbcTemplate.update(sql);
        // 第二种方式
        // String sql = "delete from myweb.user where id = ?";
        // jdbcTemplate.update(sql, id);
        return "delete ok";
    }
}
```

## 整合 Druid 数据源

查找依赖地址：[MavenRepositor](https://mvnrepository.com/) 。druid依赖地址：https://mvnrepository.com/artifact/com.alibaba/druid/1.2.6

### 导入依赖

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.2.6</version>
</dependency>
```

在 `application.yaml` 中设置数据源

```yaml
spring:
  datasource:
    username: root
    password: 1234567
    url: jdbc:mysql://localhost:3306/myweb?useUnicode=true&characterEncoding=utf-8&serverTimezone=UTC
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
```

到这，就可以使用Druid数据源了。重新测试数据库连接，可以看到使用的数据源是Druid数据源。

###  配置Druid数据源

此外，还可以在 `application.yaml` 中配置 Druid 数据源的专有配置，还可以配置druid的监控功能。

**Druid专有配置**

```yaml
    # druid 专有配置
    initialsize: 5
    minIdle: 5
    maxActive: 20
    maxwait: 60000
    timeBetweenEvictionRunsMillis: 6000
    eminEvictableIdleTimeMi1lis: 300000
    validationQuery: SELECT 1 FROM DUAL
    testwhileIdle: true
    testOnBorrow: false
    testOnReturn: false
    poolPreparedStatements: true
```

**Druid监控功能**

```yaml
    # 配置监控统计拦截的filters：stat(监控统计)、log4j(日志记录)、wall(防御sql注入)
    filters: stat,wall,log4j
    maxPoolPreparedStatementPerConnectionSize: 20
    useGlobalDataSourceStat: true
    connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=500
```

这个监控功能用到了 log4j ，所以需要导入 log4j 依赖

```xml
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>
```

### druid配置类

springboot 内置了servlet 容器，所以没有 `web.xml` ，可以用替代类。

```java
package com.withered.config;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.support.http.StatViewServlet;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.util.LinkedHashMap;
import java.util.Map;

@Configuration
public class DruidConfig {

    // 绑定yaml中的属性，需要以下两步。
    // 1. @Bean 
    // 2. @ConfigurationProperties(prefix = "spring.datasource")
    @ConfigurationProperties(prefix = "spring.datasource")
    @Bean
    public DataSource druidDataSource() {
        return new DruidDataSource();
    }

    // 后台监控功能
    @Bean
    public ServletRegistrationBean statViewServlet() {
        // 默认监控页面
        ServletRegistrationBean<StatViewServlet> bean = new ServletRegistrationBean<>(new StatViewServlet(), "/druid/*");
        
        // 后台需要有人登录，配置账户密码
        Map<String, String> initParameters = new HashMap<>();
        // 增加配置
        initParameters.put("LoginUsername", "admin");  // 登录key，是固定的LoginUsername
        initParameters.put("LoginPassword", "123456");  // 登录key，是固定LoginPassword
        // 允许谁能访问
        initParameters.put("allow", "");  // ""-允许所有人访问；"localhost"-允许本机访问
        // 禁止谁访问
        initParameters.put("someone", "xxx.xxx.xxx.xxx");  // xxx.xxx.xxx.xxx - ip地址

        bean.setInitParameters(initParameters);  // 初始化参数
        return bean;
    }
    
     
    // 过滤器filter。过滤掉一些请求，不进行统计
    public FilterRegistrationBean web() {
        FilterRegistrationBean bean = new FilterRegistrationBean<>();
        bean.setFilter(new WebStatFilter());

        // 过滤哪些请求
        Map<String, String> initParameters = new HashMap<>();
        initParameters.put("exclusions", "*.js,*.css,/druid/*");  // 这些不进行统计
        
        bean.setInitParameters(initParameters);
        return bean;
    }

}
```

启动项目，在浏览器中输入 `http://localhost/druid` ，就可以看到 druid 的监控页面。

<img src="https://gitee.com/withered-wood/picture/raw/master/20210918155806.png" alt="image-20210918155805127" style="zoom:80%;" />

## 整合Mybatis框架

### 导入整合包依赖

查询依赖地址：https://mvnrepository.com/artifact/org.mybatis.spring.boot/mybatis-spring-boot-starter/2.2.0

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.2.0</version>
</dependency>

```

