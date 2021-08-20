# Spring boot 学习记录(进行中)

javaweb：独立开发MVC网站

ssm：框架

war：tomcat运行





**约定大于配置**



微服务架构：把每个功能单独出来，把独立出来的功能元素动态的组合。打破了 all in one 的架构。



## 创建项目



![image-20210810091643848](https://gitee.com/withered-wood/picture/raw/master/20210810091645.png)



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
