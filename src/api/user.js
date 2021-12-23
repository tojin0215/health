import axios from "axios";
import { SERVER_URL } from "../const/settings";


export const getEnter = (fitness_no) => {
    return axios.get(SERVER_URL + "/customerenter", {params:{fitness_no: fitness_no}}).then(response => response.data)
}

export const getAssginExercise = (fitness_no, customer_no) => {
    return axios.get(SERVER_URL + "/assignexercise", {params:{
        fitness_no: fitness_no, member_no: customer_no, type: "member"}}).then(response => response.data)
}
