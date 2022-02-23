package com.myke.crudback.service;

import com.myke.crudback.model.Todo;
import com.myke.crudback.repository.ITodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TodoService {

    // Inyecta la interfaz repository
    @Autowired
    private ITodoRepository iTodoRepository;

    //Metodo para obtener los elementos
    public Iterable<Todo> getTodos() {
        return this.iTodoRepository.findAll();
    }

    //Metodo para guardar un elemento
    public Todo saveTodo(Todo todo) {
        return this.iTodoRepository.save(todo);
    }

    //Metodo para eliminar un elemento por id
    public void deleteTodo(Long id) {
        this.iTodoRepository.deleteById(id);
    }

    //Metodo para obtener un elemento
    public Todo getTodo(Long id) {
        return this.iTodoRepository.findById(id).orElseThrow();
        //si no encuentra el elemento, entonces muestres ese error .orElseThrow()
    }


}
