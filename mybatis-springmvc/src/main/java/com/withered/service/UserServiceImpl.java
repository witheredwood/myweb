package com.withered.service;

import com.withered.dao.UserMapper;
import com.withered.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
