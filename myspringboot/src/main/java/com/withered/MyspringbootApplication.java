package com.withered;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
//@MapperScan("com.withered.mapper")
public class MyspringbootApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyspringbootApplication.class, args);
    }

}
