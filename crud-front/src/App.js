import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';

//Constante con el url del api a consumir
const HOST_API = "http://localhost:8080/api";

//Estados iniciales
const initialState = {
  list: []
};

//Se define el stado del contexto
const Store = createContext(initialState);


//Componente del formulario
const Form = () => {

  const formRef = useRef(null);

  const { dispatch } = useContext(Store);
  const [state, setState] = useState({}); //Estado interno

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

  return <form ref={formRef}>

    <input
      type='text'
      name='name'
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
    <button onClick={onAdd}> 
      Agregar
    </button>

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


  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Nombre</td>
            <td>¿Esta completado?</td>
          </tr>
        </thead>
        <tbody>
          {
            state.list.map( (todo) => {
              return (
                <tr key={todo.id}>
                  <td>{todo.id}</td>
                  <td>{todo.name}</td>
                  <td>{todo.isCompleted}</td>
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
    case 'update-list':
      return { ...state, list: action.list }
    
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
