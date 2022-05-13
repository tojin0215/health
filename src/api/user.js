import axios from "axios";
import { SERVER_URL } from "../const/settings";

export const getEnter = (fitness_no) => {
  return axios
    .get(SERVER_URL + "/customerenter", { params: { fitness_no: fitness_no } })
    .then((response) => response.data);
};

export const getAssginExercise = (fitness_no, customer_no) => {
  return axios
    .get(SERVER_URL + "/assignexercise", {
      params: {
        fitness_no: fitness_no,
        member_no: customer_no,
        type: "member",
      },
    })
    .then((response) => response.data);
};

export const getReservation = (fitness_no) => {
  return axios
    .get(SERVER_URL + "/reservation/select", {
      params: { fitness_no: fitness_no },
    })
    .then((response) => response.data);
};

export const getReservation_exercise = (fitness_no) => {
  return axios
    .get(SERVER_URL + "/reservation/select", {
      params: { fitness_no: fitness_no, type: "exercise_ASC" },
    })
    .then((response) => response.data);
};
/**
 * 강사정렬
 */
export const getReservation_trainer = (fitness_no) => {
  return axios
    .get(SERVER_URL + "/reservation/select", {
      params: { fitness_no: fitness_no, type: "trainer_ASC" },
    })
    .then((response) => response.data);
};
/**
 * 날짜정렬
 */
export const getReservation_date = (fitness_no) => {
  return axios
    .get(SERVER_URL + "/reservation/select", {
      params: { fitness_no: fitness_no, type: "date_ASC" },
    })
    .then((response) => response.data);
};
/**
 *강사별 예약테이블
 */
export const getReservation_choice_trainer = (fitness_no, trainer) => {
  return axios
    .get(SERVER_URL + "/reservation/select", {
      params: { fitness_no: fitness_no, trainer: trainer, type: "trainer" },
    })
    .then((response) => response.data);
};

const getCustomerBy = (type, search, fn) => {
  return axios
    .get(`${SERVER_URL}/customer`, { params: { type, search, fn } })
    .then((response) => response.data);
};

export const getCustomerByAll = (fitness_no) =>
  getCustomerBy("all", undefined, fitness_no);
// export const getCustomerByName = (search, fitness_no) =>
//   getCustomerBy("search0", search, fitness_no);
export const getCustomerByPhone = (search, fitness_no) =>
  getCustomerBy("search1", search, fitness_no);
export const getCustomerByManager = (search, fitness_no) =>
  getCustomerBy("search2", search, fitness_no);
export const getCustomerByResiNo = (search, fitness_no) =>
  getCustomerBy("search3", search, fitness_no);
export const getCustomerByProfileName = (search, fitness_no) =>
  getCustomerBy("search4", search, fitness_no);

export const getCustomerByMemberNo = (member_no, fn) => {
  return axios
    .get(`${SERVER_URL}/customer`, {
      params: { type: "select", member_no: member_no, fn: fn },
    })
    .then((response) => response.data);
};
export const getSalesTypeCustomerByMemberNo = (member_no, fn) => {
  return axios
    .get(`${SERVER_URL}/sales`, {
      params: { type: "customer", member_no: member_no, fn: fn },
    })
    .then((response) => response.data);
};

export const getReservationClassBy = (fitness_no) => {
  return axios
    .get(SERVER_URL + "/reservationClass/select", {
      params: { fitness_no: fitness_no },
    })
    .then((response) => response.data);
};
