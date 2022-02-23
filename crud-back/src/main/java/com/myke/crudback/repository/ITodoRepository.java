package com.myke.crudback.repository;

import com.myke.crudback.model.Todo;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITodoRepository extends CrudRepository<Todo, Long> {
}
