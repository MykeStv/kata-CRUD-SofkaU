package com.myke.crudback.controller;

import com.myke.crudback.model.Todo;
import com.myke.crudback.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TodoController {

    @Autowired
    private TodoService todoService;

    //Obtener todos
    @GetMapping(path = "/todo")
    public Iterable<Todo> getTodos() {
        return this.todoService.getTodos();
    }

    //Obtener por id
    @GetMapping(path = "/todo/{id}")
    public Todo getTodo(@PathVariable("id") Long id) {
        return this.todoService.getTodo(id);
    }

    //Guardar
    @PostMapping(path = "/todo/add")
    public Todo saveTodo(@RequestBody Todo todo) {
        return this.todoService.saveTodo(todo);
    }

    //Update
    @PutMapping(path = "/todo/update")
    public Todo updateTodo(@RequestBody Todo todo) {
        if(todo.getId() != null) {
            return this.todoService.saveTodo(todo);
        }
        throw new RuntimeException("No existe el id para actualizar!");

    }

    //Eliminar
    @DeleteMapping(path = "/todo/delete/{id}")
    public void deleteTodo(@PathVariable("id") Long id) {
        this.todoService.deleteTodo(id);
    }

}
