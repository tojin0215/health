import React, { Component } from 'react';
import { connect } from 'react-redux';
import { complete, complete2 } from '../../action/todo';
import Todo from './TODO';

class TODOList extends Component {
  
  render() {
  	const {todos, onClick} = this.props;
    return (
      <ul>
    		{todos.map(todo =>
    			<Todo 
    				key={todo.id}
    				onClick={onClick}
    				{...todo}
    			/>
    		)}
      </ul>
    );
  }
}


const todolistStateToProps = (state) => {
  return {
    todos: state.todos
  }
}

const todolistDispatchToProps = (dispatch) => {
    return {
        onClick(data){ // 브라우저에서 이벤트가 발생한다
          //dispatch(complete2(data))
          dispatch(complete(data)) // 액션 메서드가 호출된다 -> store의 dispatch() 메서드가 호출된다
        }
    }
}
export default connect(todolistStateToProps,todolistDispatchToProps)(TODOList);
