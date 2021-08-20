package com.withered.myspringboot;

import com.withered.pojo.Person;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
class MyspringbootApplicationTests {
    @Autowired
    private Person person;
//    private Person person = new Person();

    @Test
    public void testPerson() {
        System.out.println(person);
    }

    @Test
    void contextLoads() {
    }

}
