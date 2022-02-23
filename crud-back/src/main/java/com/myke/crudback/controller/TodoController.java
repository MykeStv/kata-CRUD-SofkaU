package com.myke.crudback.controller;

import com.myke.crudback.model.Todo;
import com.myke.crudback.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TodoController {

    @Autowired
    private TodoService todoService;

    //Obtener todos
    @GetMapping
    public Iterable<Todo> getTodos() {
        return this.todoService.getTodos();
    }

    //Obtener por id
    public Todo getTodo(Long id) {
        return this.todoService.getTodo(id);
    }

    //Guardar
    public Todo saveTodo(Todo todo) {
        return this.todoService.saveTodo(todo);
    }

    //Eliminar
    public void deleteTodo(Long id) {
        this.todoService.deleteTodo(id);
    }

}
