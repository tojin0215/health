import authenticationAction from '../action/index';

const {AUTH_LOGIN, AUTH_LOGIN_SUCCESS, AUTH_LOGIN_FAILURE, AUTH_GET_STATUS, AUTH_GET_STATUS_SUCCESS,AUTH_GET_STATUS_FAILURE, AUTH_LOGOUT} = authenticationAction.authentication;


const authentication = (state =
    {
      userinfo : {
        member_no:-1, manager_name:"", fitness_no:-1, fitness_name:""
      },
      login : {
        status: 'FAILURE'
      },
      status : {}
    }, action) => {
    switch (action.type) {
        case AUTH_LOGIN:
            return {
                ...state,
                login : {
                    status: 'WAITING'
                }
            }
        case AUTH_LOGIN_SUCCESS:
            return {
                ...state,
                userinfo:{
                  id:action.id,
                  fitness_no:action.fitness_no,
                  fitness_name:action.fitness_name,
                  manager_name:action.manager_name,
                },
                login: {
                    status: 'SUCCESS'
                },
                status: {
                    ...state.status,
                    isLoggedIn: true,
                    currentUser: action.id
                }
            }
        case AUTH_LOGIN_FAILURE:
            return {
                ...state,
                login:{
                    status: 'FAILURE'
                }
            }
        case AUTH_GET_STATUS:
                return {
                  ...state,
                  status: {
                    ...state.staus,
                    isLoggedIn: true
                  }
                }
        case AUTH_GET_STATUS_SUCCESS:
                return {
                  ...state,
                  userinfo:{
                    id:action.id,
                    fitness_no:action.fitness_no,
                    fitness_name:action.fitness_name,
                    manager_name:action.manager_name,
                  },
                  status: {
                    ...state.status,
                    valid: true,
                    currentUser: action.id
                  }
                }
        case AUTH_GET_STATUS_FAILURE:
              return {
                  ...state,
                  userinfo:{
                    id:'',
                    fitness_no:-1,
                    fitness_name:'',
                    manager_name:'',
                  },
                  status: {
                    ...state.status,
                    valid: false,
                    isLoggedIn: false
                  }
              }
          case AUTH_LOGOUT:
              return {
                    ...state,
                    userinfo:{
                      id:'',
                      fitness_no:-1,
                      fitness_name:'',
                      manager_name:'',
                    },
                    status: {
                      ...state.status,
                      isLoggedIn: false,
                      currentUser: ''
                    }
              }
        
        default:
            return state;
    }
}
export default authentication;
