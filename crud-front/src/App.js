import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';

//Constante con el url del api a consumir
const HOST_API = "http://localhost:8080/api";

//Estados iniciales
const initialState = {
  list: [],
  item: {}
};

//Se define el stado del contexto
const Store = createContext(initialState);


//Componente del formulario
const Form = () => {

  const formRef = useRef(null);

  const { dispatch, state: {item } } = useContext(Store);
  const [state, setState] = useState({item}); //Estado interno

  const onAdd = (event) => {
    event.preventDefault();
    
    const request = {
      name: state.name,
      id: null,
      isCompleted: false
    };

    fetch(HOST_API+"/todo/add", {

      method: "POST",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }

    })
    .then(response => response.json())
    .then((todo) => {
      dispatch({ type: "add-item", item: todo });
      setState({ name: "" });
      formRef.current.reset();
    })

  };

  const onEdit = (event) => {
    event.preventDefault();
    
    const request = {
      name: state.name,
      id: item.id,
      isCompleted: item.isCompleted
    };

    fetch(HOST_API+"/todo/update", {

      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }

    })
    .then(response => response.json())
    .then((todo) => {
      dispatch({ type: "update-item", item: todo });
      setState({ name: "" });
      formRef.current.reset();
    })

  };

  return <form ref={formRef}>

    <input
      type='text'
      name='name'
      defaultValue={item.name}
      onChange={(event) => {
        setState({ ...state, name: event.target.value })
      }}
    />
    {/* <input
      type='text'
      name='description'
      onChange={(event) => {
        setState({ ...state, description: event.target.value })
      }}
    /> */}
    {
      item.id && <button onClick={onEdit}>Actualizar</button>
    }
    {
      !item.id && <button onClick={onAdd}>Agregar</button>
    }   

  </form>
};


//Componente de listas
const List = () => {

  const { dispatch, state } = useContext(Store);

  //Efecto : permite hacer una peticion despues que se cargue el componente
  useEffect(() => {
    fetch(HOST_API + "/todo")
      .then(response => response.json())
      .then((list) => {
        dispatch({type: "update-list", list})
      })
  }, [state.list.length, dispatch]); //parametros existan, para que el efecto no sea recurrente

  //Metodo para eliminar un elemento
  const onDelete = (id) => {
    fetch(HOST_API + "/todo/delete/" + id, {
      method: "DELETE"
    }).then((list) => {
      dispatch({ type: "delete-item", id });
    })
  };

  //Metodo para editar un elemento
  const onEdit = (todo) => {
    dispatch({ type: "edit-item", item: todo });
  };


  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Nombre</td>
            <td>??Esta completado?</td>
          </tr>
        </thead>
        <tbody>
          {
            state.list.map( (todo) => {
              return (
                <tr key={todo.id}>
                  <td>{todo.id}</td>
                  <td>{todo.name}</td>
                  <td>{todo.isCompleted === true ? "SI" : "NO"}</td>
                  <td>
                    <button onClick={() => onDelete(todo.id)}>Eliminar</button>
                  </td>
                  <td>
                    <button onClick={() => onEdit(todo)}>Editar</button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}

function reducer(state, action) {

  switch (action.type) {
    case 'update-item':
      const listUpdateEdit = state.list.map((item) => {
        if (item.id === action.item.id) {
          return action.item;
        }
        return item;
      });
      return { ...state, list: listUpdateEdit, item: {} }

    case 'delete-item':
      const listUpdate = state.list.filter((item) => {
        return item.id !== action.id;
      });
      return { ...state, list: listUpdate }
      
    case 'update-list':
      return { ...state, list: action.list }

    case 'edit-item':
      return { ...state, item: action.item }
    
    case 'add-item':
      const newList = state.list;
      newList.push(action.item);
      return { ...state, list: newList }
    
    default:
      return state;
  }

}

const StoreProvider = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  return <Store.Provider value={{ state, dispatch }} >
    {children}
  </Store.Provider>

};


function App() {
  return (
    <StoreProvider>
      <Form />
      <List />
    </StoreProvider>
  );
}

export default App;
