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

/**
 *회원별 예약테이블
 */
export const getReservation_choice_client = (fitness_no, customer_name) => {
  return axios
    .get(SERVER_URL + '/reservation/select', {
      params: {
        fitness_no: fitness_no,
        customer_name: customer_name,
        type: 'client',
      },
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
export const deleteTrainer = (idx) => {
  return axios.delete(`${SERVER_URL}/trainer?idx=` + idx, {});
};
//강사테이블 update
export const updateTrainer = (idx, trainer_name, phone, ment, history) => {
  return axios
    .put(`${SERVER_URL}/trainer?idx=` + idx, {
      trainer_name: trainer_name,
      phone: phone,
      ment: ment,
      history: history,
    })
    .then((response) => response.data);
};
//강사테이블 select reservation에 fitness_no 가져오기 위해
export const selectTrainerReservation = (idx) => {
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
export const updateClient = (idc, client_name, phone, address) => {
  return axios.put(`${SERVER_URL}/client?idc=` + idc, {
    client_name,
    phone,
    address,
  });
};
// client, trainer update manager table phone, manager_name change
export const updateManagerClientTrainer = (joinNo, manager_name, id) => {
  return axios.put(`${SERVER_URL}/manager?joinNo=` + joinNo, {
    manager_name,
    id,
  });
};

// client delete
export const deleteClient = (idc) => {
  return axios
    .delete(`${SERVER_URL}/client?idc=` + idc, {})
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
//client search phone
export const searchPhone = (fitness_no, phone) => {
  return axios
    .get(`${SERVER_URL}/client`, {
      params: { type: 'searchPhone', fitness_no: fitness_no, phone: phone },
    })
    .then((response) => response.data);
};

//client search client_name
export const searchClientname = (fitness_no, client_name) => {
  return axios
    .get(
      `${SERVER_URL}/client?type=searchName` +
        `&fitness_no=` +
        fitness_no +
        `&client_name=` +
        client_name,
      {}
    )
    .then((response) => response.data);
};

//trainer search phone
export const searchTrainerPhone = (fitness_no, phone) => {
  return axios
    .get(`${SERVER_URL}/trainer`, {
      params: { type: 'searchPhone', fitness_no: fitness_no, phone: phone },
    })
    .then((response) => response.data);
};

//trainer search trainer_name
export const searchTrainername = (fitness_no, trainer_name) => {
  return axios
    .get(
      `${SERVER_URL}/trainer?type=searchName` +
        `&fitness_no=` +
        fitness_no +
        `&trainer_name=` +
        trainer_name,
      {}
    )
    .then((response) => response.data);
};

//select introduce
export const selectIntroduce = (fitness_no) => {
  return axios
    .get(`${SERVER_URL}/introduce`, {
      params: { fitness_no: fitness_no },
    })
    .then((response) => response.data);
};

//insert introduce
export const insertIntroduce = (fitness_no, manager_name, picture, story) => {
  const formData = new FormData();
  formData.append('fitness_no', fitness_no);
  formData.append('manager_name', manager_name);
  formData.append('picture', picture);
  formData.append('story', story);
  return axios.post(`${SERVER_URL}/introduce`, formData, {
    fitness_no,
    manager_name,
    story,
  });
};

//update introduce
export const updateIntroduce = (picture, story, idi) => {
  const formData = new FormData();
  formData.append('picture', picture);
  formData.append('story', story);
  return axios.put(`${SERVER_URL}/introduce?idi=` + idi, formData, {
    story,
  });
};

//delete introduce
export const deleteIntroduce = (idi) => {
  return axios.delete(`${SERVER_URL}/introduce?idi=` + idi, {});
};

//choiceLogin manager update
export const choiceLoginManager = (id, joinNo) => {
  return axios.put(`${SERVER_URL}/manager?type=choiceLogin` + `&id=` + id, {
    joinNo: joinNo,
  });
};

//choiceLogin trainer select
export const choiceLoginTrainer = (phone) => {
  return axios
    .get(`${SERVER_URL}/trainer`, {
      params: { type: 'choiceLogin', phone: phone },
    })
    .then((response) => response.data);
};

//choiceLogin client select
export const choiceLoginClient = (phone) => {
  return axios
    .get(`${SERVER_URL}/client`, {
      params: { type: 'choiceLogin', phone: phone },
    })
    .then((response) => response.data);
};

//choiceFitness manager select
export const choiceFitness = (fitness_no) => {
  return axios
    .get(`${SERVER_URL}/manager`, {
      params: { type: 'choiceFitness', fitness_no: fitness_no },
    })
    .then((response) => response.data);
};

//inbodies select member_no
export const inbodiesSelect = (fitness_no, member_no) => {
  return axios
    .get(`${SERVER_URL}/inbody`, {
      params: { type: 'client', fitness_no: fitness_no, member_no: member_no },
    })
    .then((response) => response.data);
};

//inbodies select calendar
export const clandarInbodies = (fitness_no, member_no, startDate, endDate) => {
  return axios
    .get(`${SERVER_URL}/inbody`, {
      params: {
        type: 'select',
        startDate: startDate,
        endDate: endDate,
        fitness_no: fitness_no,
        member_no: member_no,
      },
    })
    .then((response) => response.data);
};

//assignExercise select member_no=idc
export const allotAssignexercise = (fitness_no, member_no) => {
  return axios
    .get(`${SERVER_URL}/assignexercise`, {
      params: {
        type: 'allot',
        fitness_no: fitness_no,
        member_no: member_no,
      },
    })
    .then((response) => response.data);
};

//workout select
export const workoutSelect = (fitness_no, part) => {
  return axios
    .get(`${SERVER_URL}/workout`, {
      params: { fitness_no: fitness_no, part: part },
    })
    .then((response) => response.data);
};

//workout insert
export const workoutInsert = (
  fitness_no,
  workout,
  part,
  machine,
  default_set,
  default_count,
  default_rest,
  url
) => {
  return axios.post(`${SERVER_URL}/workout`, {
    fitness_no: fitness_no,
    workout: workout,
    part: part,
    machine: machine,
    default_set: default_set,
    //null이면 3세트
    default_count: default_count,
    //null이면 8회
    default_rest: default_rest,
    //null이면 30초
    url: url,
  });
};

//workout update1 (allot)
export const workoutUpdateAllot = (
  default_set,
  default_count,
  default_rest,
  idw,
  fitness_no
) => {
  return axios.put(
    `${SERVER_URL}/workout?type=allot&idw=` + idw + `&fitness_no=` + fitness_no,
    {
      default_set: default_set,
      default_count: default_count,
      default_rest: default_rest,
    }
  );
};

//workout update2
export const workoutUpdate = (
  workout,
  part,
  machine,
  default_set,
  default_count,
  default_rest,
  idw,
  fitness_no
) => {
  return axios.put(
    `${SERVER_URL}/workout?idw=` + idw + `&fitness_no=` + fitness_no,
    {
      workout: workout,
      part: part,
      machine: machine,
      default_set: default_set,
      default_count: default_count,
      default_rest: default_rest,
    }
  );
};
//workout delete
export const workoutDelete = (idw) => {
  return axios.delete(`${SERVER_URL}/workout?idw=` + idw, {});
};

//workoutAlloted select
export const workoutAllotedSelect = (fitness_no, client_no) => {
  return axios
    .get(
      `${SERVER_URL}/workoutAlloted?fitness_no=` +
        fitness_no +
        `&client_no=` +
        client_no
    )
    .then((response) => response.data);
};

//workoutAlloted insert
export const workoutAllotedInsert = (
  fitness_no,
  client_no,
  workout,
  region,
  machine,
  default_set,
  default_count,
  default_rest,
  url
) => {
  return axios
    .post(`${SERVER_URL}/workoutAlloted`, {
      fitness_no: fitness_no,
      client_no: client_no,
      workout: workout,
      region: region,
      machine: machine,
      default_set: default_set,
      default_count: default_count,
      default_rest: default_rest,
      url: url,
    })
    .then((response) => response.data);
};

//workoutAlloted delete
export const workoutAllotedDelete = (idwa) => {
  return axios.delete(`${SERVER_URL}/workoutAlloted?idwa=` + idwa, {});
};

//reservation class delete
export const reservationDataDelete = (
  exercise_name,
  date,
  fitness_no,
  time,
  trainer
) => {
  return axios.delete(`${SERVER_URL}/reservation/delete`, {
    params: {
      type: 'class',
      exercise_name: exercise_name,
      date: date,
      fitness_no: fitness_no,
      time: time,
      trainer: trainer,
    },
  });
};
