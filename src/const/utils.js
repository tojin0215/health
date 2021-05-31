import { SERVER_URL } from './settings';

export function componentDidMount() {
  //컴포넌트 렌더링이 맨 처음 완료된 이후에 바로 세션확인
  // get cookie by name
  function getCookie(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // get loginData from cookie
  let loginData = getCookie('key');

  // if loginData is undefined, do nothing
  if (typeof loginData === 'undefined') {
    this.props.history.push('/');
    return;
  }

  // decode base64 & parse json
  loginData = JSON.parse(atob(loginData));

  // if not logged in, do nothing
  if (!loginData.isLoggedIn) {
    this.props.history.push('/');
    return;
  }

  // page refreshed & has a session in cookie,
  // check whether this cookie is valid or not
  this.props.getStatusRequest().then(() => {
    // if session is not valid
    if (!this.props.status.valid) {
      // logout the session
      loginData = {
        isLoggedIn: false,
        id: '',
      };

      document.cookie = 'key=' + btoa(JSON.stringify(loginData));

      // and notify
      alert('Your session is expired, please log in again');
    } else {
      this.cusFetch();
    }
  });
}

const CustomUtil = {
  componentDidMount: componentDidMount,
};

export function getExercise(callback, fitness_no) {
  let arr = [];
  const url =
     SERVER_URL + '/exercise?type=search&search=&fn=' + fitness_no;
  fetch(url, {
    method: 'GET',
    async: false,
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((res) => {
      for (let i = res.length - 1; i >= 0; i--) {
        let part = ', ';
        let part_num = Number(res[i].part);
        const t = new Array(8);

        console.log(part_num);
        if (part_num === 32) {
          part = '기타, ' + part;
          part_num = 0;
          t[5] = 1;
        }
        if (part_num >= 16) {
          part = '유산소, ' + part;
          part_num = part_num - 16;
          t[4] = 1;
        }
        if (part_num >= 8) {
          part = '코어, ' + part;
          part_num = part_num - 8;
          t[3] = 1;
        }
        if (part_num >= 4) {
          part = '전신, ' + part;
          part_num = part_num - 4;
          t[2] = 1;
        }
        if (part_num >= 2) {
          part = '하체, ' + part;
          part_num = part_num - 2;
          t[1] = 1;
        }
        if (part_num === 1) {
          part = '상체, ' + part;
          t[0] = 1;
        }
        part = part.slice(0, -2);

        arr.push({
          no: res[i].exercise_no,
          name: res[i].name,
          tool: res[i].machine,
          aa: part,
          set: res[i].default_set_count,
          bb: res[i].default_data,
          cc: res[i].default_rest_second,
          link: res[i].url,
          t: t,
        });
        console.log(arr);
        // return arr;
        callback(arr);
      }
    });

}

export default CustomUtil;
