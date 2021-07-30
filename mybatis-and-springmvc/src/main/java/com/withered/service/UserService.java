package com.withered.service;

import java.io.Serializable;
import java.util.List;

public interface UserService<T> {
    // 插入
    public int insert(T entity);

    // 按id删除一个数据。支持整型和字符类型id
    public int deleteById(Serializable id);

    // 批量删除
//    public void delete(Serializable[] ids);

    // 修改
    public int update(T entity);

    // 查询一个数据。通常用作修改
    public T getById(Serializable id);

    // 查询全部的书。根据条件查询多个结果
//    public List<T> find(Map map);

    // 查询全部数据
    public List<T> getList();
}
