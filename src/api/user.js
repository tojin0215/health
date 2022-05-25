import axios from 'axios';
import { SERVER_URL } from '../const/settings';

export const getEnter = (fitness_no) => {
  return axios
    .get(SERVER_URL + '/customerenter', { params: { fitness_no: fitness_no } })
    .then((response) => response.data);
};

export const getAssginExercise = (fitness_no, customer_no) => {
  return axios
    .get(SERVER_URL + '/assignexercise', {
      params: {
        fitness_no: fitness_no,
        member_no: customer_no,
        type: 'member',
      },
    })
    .then((response) => response.data);
};

export const getReservation = (fitness_no) => {
  return axios
    .get(SERVER_URL + '/reservation/select', {
      params: { fitness_no: fitness_no },
    })
    .then((response) => response.data);
};

export const getReservation_exercise = (fitness_no) => {
  return axios
    .get(SERVER_URL + '/reservation/select', {
      params: { fitness_no: fitness_no, type: 'exercise_ASC' },
    })
    .then((response) => response.data);
};
/**
 * 강사정렬
 */
export const getReservation_trainer = (fitness_no) => {
  return axios
    .get(SERVER_URL + '/reservation/select', {
      params: { fitness_no: fitness_no, type: 'trainer_ASC' },
    })
    .then((response) => response.data);
};
/**
 * 날짜정렬
 */
export const getReservation_date = (fitness_no) => {
  return axios
    .get(SERVER_URL + '/reservation/select', {
      params: { fitness_no: fitness_no, type: 'date_ASC' },
    })
    .then((response) => response.data);
};
/**
 *강사별 예약테이블
 */
export const getReservation_choice_trainer = (fitness_no, trainer) => {
  return axios
    .get(SERVER_URL + '/reservation/select', {
      params: { fitness_no: fitness_no, trainer: trainer, type: 'trainer' },
    })
    .then((response) => response.data);
};

const getCustomerBy = (type, search, fn) => {
  return axios
    .get(`${SERVER_URL}/customer`, { params: { type, search, fn } })
    .then((response) => response.data);
};

export const getCustomerByAll = (fitness_no) =>
  getCustomerBy('all', undefined, fitness_no);
export const getCustomerByName = (search, fitness_no) =>
  getCustomerBy('search0', search, fitness_no);
export const getCustomerByPhone = (search, fitness_no) =>
  getCustomerBy('search1', search, fitness_no);
export const getCustomerByManager = (search, fitness_no) =>
  getCustomerBy('search2', search, fitness_no);
export const getCustomerByResiNo = (search, fitness_no) =>
  getCustomerBy('search3', search, fitness_no);
export const getCustomerByProfileName = (search, fitness_no) =>
  getCustomerBy('search4', search, fitness_no);

export const getCustomerByMemberNo = (member_no, fn) => {
  return axios
    .get(`${SERVER_URL}/customer`, {
      params: { type: 'select', member_no: member_no, fn: fn },
    })
    .then((response) => response.data);
};
export const getSalesTypeCustomerByMemberNo = (member_no, fn) => {
  return axios
    .get(`${SERVER_URL}/sales`, {
      params: { type: 'customer', member_no: member_no, fn: fn },
    })
    .then((response) => response.data);
};

export const getReservationClassBy = (fitness_no) => {
  return axios
    .get(SERVER_URL + '/reservationClass/select', {
      params: { fitness_no: fitness_no },
    })
    .then((response) => response.data);
};
//강사테이블 delete
export const deleteTrainer = (phone, fitness_no) => {
  return axios
    .delete(
      `${SERVER_URL}/trainer?phone=` + phone + `&fitness_no=` + fitness_no,
      {}
    )
    .then((response) => response.data);
};
//강사테이블 update
export const updateTrainer = (
  phone,
  fitness_no,
  trainer_name,
  ment,
  history
) => {
  return axios
    .put(`${SERVER_URL}/trainer?phone=` + phone + `&fitness_no=` + fitness_no, {
      trainer_name: trainer_name,
      ment: ment,
      history: history,
    })
    .then((response) => response.data);
};
//강사테이블 select reservation에 fitness_no 가져오기 위해
export const selectReservation = (idx) => {
  return axios
    .get(`${SERVER_URL}/trainer`, {
      params: { type: 'reservation', idx: idx },
    })
    .then((response) => response.data);
};
//강사테이블 select
export const selectTrainer = (fitness_no) => {
  return axios
    .get(`${SERVER_URL}/trainer`, {
      params: { fitness_no: fitness_no },
    })
    .then((response) => response.data);
};
//강사테이블에 insert
export const insertTrainer = (
  phone,
  birth,
  trainer_name,
  fitness_no,
  ment,
  history,
  sex,
  joinNo
) => {
  return axios.post(`${SERVER_URL}/trainer`, {
    phone,
    birth,
    trainer_name,
    fitness_no,
    ment,
    history,
    sex,
    joinNo,
  });
};
//매니저테이블에 trainer insert(trainer login)
export const trainerManager = (id, password, manager_name, joinNo) => {
  return axios
    .post(`${SERVER_URL}/manager?type=trainer`, {
      id,
      password,
      manager_name,
      joinNo,
    })
    .then((response) => response.data);
};

//Client select
export const clientSelect = (fitness_no) => {
  return axios
    .get(`${SERVER_URL}/client`, {
      params: { fitness_no: fitness_no },
    })
    .then((response) => response.data);
};

//매니저 테이블에 client insert(client login)
export const clientManager = (id, password, manager_name, joinNo) => {
  return axios
    .post(`${SERVER_URL}/manager?type=client`, {
      id,
      password,
      manager_name,
      joinNo,
    })
    .then((response) => response.data);
};
//회원테이블(client)에 insert
export const insertClient = (
  fitness_no,
  client_name,
  phone,
  birth,
  sex,
  join_route,
  address
) => {
  return axios.post(`${SERVER_URL}/client`, {
    fitness_no,
    client_name,
    phone,
    birth,
    sex,
    join_route,
    address,
  });
};
//client update
export const updateClient = (phone, fitness_no, client_name, address) => {
  return axios.put(
    `${SERVER_URL}/client?phone=` + phone + `&fitness_no=` + fitness_no,
    {
      client_name,
      address,
    }
  );
};
// client delete
export const deleteClient = (phone, fitness_no) => {
  return axios
    .delete(
      `${SERVER_URL}/client?phone=` + phone + `&fitness_no=` + fitness_no,
      {}
    )
    .then((response) => response.data);
};
//회원테이블 select reservation에 fitness_no 가져오기 위해
export const selectClientReservation = (idc) => {
  return axios
    .get(`${SERVER_URL}/client`, {
      params: { type: 'reservation', idc: idc },
    })
    .then((response) => response.data);
};
