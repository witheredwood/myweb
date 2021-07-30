package com.withered.service;

import com.withered.mapper.UserMapper;

import java.io.Serializable;
import java.util.List;

public class UserServiceImpl implements UserService {
    private UserMapper userMapper;

    public void setUserMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public int insert(Object entity) {
        return userMapper.insert(entity);
    }

    public int deleteById(Serializable id) {
        return userMapper.deleteById(id);
    }

    public int update(Object entity) {
        return userMapper.update(entity);
    }

    public Object getById(Serializable id) {
        return userMapper.getById(id);
    }

    public List getList() {
        return userMapper.getList();
    }
}
