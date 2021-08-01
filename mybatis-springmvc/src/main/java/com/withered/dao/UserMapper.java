package com.withered.dao;

import com.withered.pojo.User;

import java.util.List;

public interface UserMapper {
    User getById(String id);
//    User getById(Serializable id);

    List<User> getList();
}
