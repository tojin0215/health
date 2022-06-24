import { Component } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import Menu from '../../component/navigation/Menu';
import NewMenu from '../../component/navigation/NewMenu';
import { connect } from 'react-redux';
import { getStatusRequest } from '../../action/authentication';
import '../../styles/home/home.css';

// 리액트 부트스트랩 관련
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// import  { PC, Mobile } from '../../component/MediaQuery';
// import Menu from '../../component/navigation/Menu';

// 이미지 파일 관련
// import MainVisual1 from 'url(/src/img/mainVisual1.png)';
import MainVisual1 from '../../../src/img/mainVisual1.png';
import btnCustomer from '../../../src/img/btnCustomer.png';
import btnSetting from '../../../src/img/btnSetting.png';
import btnExercise from '../../../src/img/btnExercise.png';
import btnSales from '../../../src/img/btnSales.png';
import btnStatic from '../../../src/img/btnStatic.png';
import aboutManage from '../../../src/img/aboutManage.png';
import aboutProduct from '../../../src/img/aboutProduct.png';
import aboutExercise from '../../../src/img/aboutExercise.png';

import { SERVER_URL } from '../../const/settings';
import AlertToastComponent from '../../component/home/AlertToast';
import { choiceTest, clientSelect } from '../../api/user';

const ip = SERVER_URL;
//const ip = 'localhost:3000';

require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault('Asia/Seoul');

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCustomer: 0,
      totalClient: 0,
      todayCustomer: 0,
      monthSales: 0,
      todaySales: 0,
      admin: this.props.userinfo.manager_name,
    };
    this.cusFetch();
    // console.log(`${MainVisual1}`);
  }

  goLogin = () => {
    this.props.history.push('/');
  };
  componentDidMount() {
    //컴포넌트 렌더링이 맨 처음 완료된 이후에 바로 세션확인
    // get cookie by name
    function getCookie(name) {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + name + '=');
      if (parts.length == 2) return parts.pop().split(';').shift();
    }

    // get loginData from cookie
    let loginData = getCookie('key');
    // if loginData is undefined, do nothing
    if (typeof loginData === 'undefined') {
      this.props.history.push('/');
      return;
    }
    // console.log('get cookie by name / get loginData from cookie : ', loginData);
    //eyJpc0xvZ2dlZEluIjp0cnVlLCJpZCI6InRvamluIn0=

    // decode base64 & parse json
    loginData = JSON.parse(atob(loginData));
    // if not logged in, do nothing
    if (!loginData.isLoggedIn) {
      this.props.history.push('/');
      return;
    }
    // console.log(
    //   'get loginData from cookie / decode base64 & parse json : ',
    //   loginData
    // );
    //{isLoggedIn:true, id:"tojin"}

    // page refreshed & has a session in cookie,
    // check whether this cookie is valid or not
    this.props.getStatusRequest().then(() => {
      // console.log('????', this.props.status.valid);
      // if session is not valid -->logout
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

  cusFetch = () => {
    // fetch(ip + '/customer?type=all&fn=' + this.props.userinfo.fitness_no, {
    //   method: 'GET',
    //   headers: {
    //     'Content-type': 'application/json',
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((res) => {
    //     //alert(res.length)
    //     this.setState({ totalCustomer: res.length });
    //     // let arr = [];
    //     // for(let i=(res.length-1) ; i>=0 ; i--){
    //     //     let sor = res[i].solar_or_lunar===true?"양":"음";
    //     //     let s = res[i].sex===true?"남":"여";
    //     //     arr.push({"no":res[i].member_no, "name":res[i].name, "sex":s, "phone":res[i].phone, "in_charge":res[i].in_charge,"start_date":moment(res[i].start_date).format("YYYY/MM/DD")+"~ ("+res[i].period+"개월)", "resi_no":res[i].resi_no+ " ("+sor+")" })
    //     // }
    //     // this.setState({customerList : arr});
    //   });
    clientSelect(this.props.userinfo.fitness_no).then((result) => {
      this.setState({ totalClient: result.length });
    });
    fetch(ip + '/sales?type=all&fitness_no=' + this.props.userinfo.fitness_no, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((res) => {
        let sum = 0;
        for (let i = 0; i < res.length; i++) {
          sum =
            Number(sum) +
            Number(res[i].lockerPrice) +
            Number(res[i].sportswearPrice) +
            Number(res[i].exercisePrice);
        }
        this.setState({ todaySales: sum });
      });

    let today = new Date();
    let startTime = new Date(today.getFullYear(), today.getMonth(), 1);
    let endTime = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    //alert(today)
    fetch(
      ip +
        '/sales?type=select&startDate=' +
        startTime +
        '&endDate=' +
        endTime +
        '&fitness_no=' +
        this.props.userinfo.fitness_no,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((res) => {
        let sum = 0;
        for (let i = 0; i < res.length; i++) {
          sum =
            Number(sum) +
            Number(res[i].lockerPrice) +
            Number(res[i].sportswearPrice) +
            Number(res[i].exercisePrice);
        }
        this.setState({ monthSales: sum });
      });
    // 금일 방문 고객
    fetch(ip + '/customerenter?fitness_no=' + this.props.userinfo.fitness_no, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((res) => {
        this.setState({ todayCustomer: res.length });
      });
  };

  fommat = (num) => {
    if (Number(num) >= 1000) {
      return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return num;
    }
  };

  render() {
    const { userinfo } = this.props;
    // console.log('userinfo : ');
    // console.log(userinfo); // 나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음
    // console.log('오늘매출', this.state.todaySales);
    // console.log(userinfo.joinNo);
    console.log(this.props.userinfo);
    return (
      <div className='wrap home'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
          <NewMenu />
          {this.props.userinfo.loginWhether === 2 ? (
            ''
          ) : this.props.userinfo.loginWhether === 1 ? (
            ''
          ) : (
            <div className='localNavigation'>
              <div className='container'>
                {/* <Menu /> */}
                <Row className='dashboard' xs={2}>
                  <Col className='homeDashLeft h-100' xs={2}>
                    <label>
                      {/* <p>오늘 방문고객</p> */}
                      {/* <span>{this.fommat(this.state.todayCustomer)}</span> */}
                    </label>
                    <label>
                      <p>등록된 회원</p>
                      <span>{this.fommat(this.state.totalClient)}</span>
                    </label>
                  </Col>
                  <Col className='homeDashRight' xs={2}>
                    <label>
                      <p className=''>당일 매출</p>
                      <span>{this.fommat(this.state.todaySales)}</span>
                    </label>
                    <label>
                      <p className=''>월 매출</p>
                      <span>{this.fommat(this.state.monthSales)}</span>
                    </label>
                  </Col>
                </Row>
                <div></div>
                {/*.dashboard */}
              </div>
              {/*.container */}
            </div>
          )}
          {/*.localNavigation */}
        </div>
        {/*.header */}
        <div className='container'>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {
              <AlertToastComponent
                fitness_no={this.props.userinfo.fitness_no}
              />
            }
          </div>
          <div
            className='mainVisual'
            style={{
              backgroundImage: `url(${MainVisual1})`,
            }}
          >
            메인 이미지
          </div>
          <Row xs={5}>
            <Col>
              <Image thumbnail src={btnCustomer}></Image>
              <h5>고객</h5>
            </Col>
            <Col>
              <Image thumbnail src={btnSetting}></Image>
              <h5>수업</h5>
            </Col>
            <Col>
              <Image thumbnail src={btnExercise}></Image>
              <h5>운동 설정</h5>
            </Col>
            <Col>
              <Image thumbnail src={btnSales}></Image>
              <h5>운동 배정</h5>
            </Col>
            <Col>
              <Image thumbnail src={aboutManage}></Image>
              <h5>상품 매출</h5>
            </Col>
          </Row>
          <Row xs={5}>
            <Col>
              <Card className='text-center'>
                <Card.Img variant='top' src={btnCustomer} />
                <Card.Body>
                  <Card.Title>고객</Card.Title>
                  <Card.Text></Card.Text>
                  <Button variant='primary'>Go somewhere</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className='text-center'>
                <Card.Img variant='top' src={btnSetting} />
                <Card.Body>
                  <Card.Title>고객</Card.Title>
                  <Card.Text></Card.Text>
                  <Button variant='primary'>Go somewhere</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className='text-center'>
                <Card.Img variant='top' src={btnExercise} />
                <Card.Body>
                  <Card.Title>고객</Card.Title>
                  <Card.Text></Card.Text>
                  <Button variant='primary'>Go somewhere</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className='text-center'>
                <Card.Img variant='top' src={btnSales} />
                <Card.Body>
                  <Card.Title></Card.Title>
                  <Card.Text></Card.Text>
                  <Button variant='primary'>회원 관리</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className='text-center'>
                <Card.Img variant='top' src={aboutManage} />
                <Card.Body>
                  <Card.Title>Card Title</Card.Title>
                  <Button variant='primary'>Go somewhere</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className='homeIcon'>
            <ul>
              <li>
                <Link
                  to='/customer'
                  className='btnCustomerNew btnCustomer'
                  style={{
                    backgroundImage: `url(${btnCustomer})`,
                  }}
                ></Link>
                <p>고객</p>
              </li>
              <li>
                <Link
                  to='/exercise'
                  className='btnCustomerNew btnSetting'
                  style={{
                    backgroundImage: `url(${btnSetting})`,
                  }}
                ></Link>
                <p>운동 설정</p>
              </li>
              <li>
                <Link
                  to='/assign'
                  className='btnCustomerNew btnExercise'
                  style={{
                    backgroundImage: `url(${btnExercise})`,
                  }}
                ></Link>
                <p>운동 배정</p>
              </li>
              <li>
                <Link
                  to='/sales'
                  className='btnCustomerNew btnSales'
                  style={{
                    backgroundImage: `url(${btnSales})`,
                  }}
                ></Link>
                <p>상품매출</p>
              </li>
              <li>
                <Link
                  to='/statistics'
                  className='btnCustomerNew btnStatic'
                  style={{
                    backgroundImage: `url(${btnStatic})`,
                  }}
                ></Link>
                <p>통계</p>
              </li>
              {userinfo.fitness_no === 1 ? (
                <li>
                  <Link
                    to='/statistics'
                    className='btnCustomerNew btnStatic'
                    style={{
                      backgroundImage: `url(${aboutManage})`,
                    }}
                  ></Link>
                  <p>관리자</p>
                </li>
              ) : null}
            </ul>
          </div>
          <section className='homeAbout'>
            <h3>
              <div className='parallelogram'></div>
              About 헬스케어CRM
            </h3>
            <section className='aboutExplain'>
              <p>
                헬스 회원 스마트 관리 시스템으로 기존 회원 관리 방식에서
                탈피하여 쉬운 회원관리, 스마트한 서비스를 제공합니다.
              </p>
              {/* <Button variant='outline-primary border-0 px-5'>
								자세히보기
							</Button> */}
            </section>
            <section className='aboutList'>
              <ul>
                <li>
                  <div
                    className='imageBox'
                    style={{
                      backgroundImage: `url(${aboutProduct})`,
                    }}
                  ></div>
                  <h5>상품</h5>
                  <p>
                    헬스, 필라테스 등의 운동상품과 함께 운동복, 사물함 등의
                    상품도 함께 등록하고 매출을 관리할 수 있습니다.
                  </p>
                  {/* <Button variant='outline-primary border-0 px-5'>
										더보기
									</Button> */}
                </li>
                <li>
                  <div
                    className='imageBox'
                    style={{
                      backgroundImage: `url(${aboutExercise})`,
                    }}
                  ></div>
                  <h5>운동</h5>
                  <p>
                    센터의 전문가가 사용자와 상담하고 적합한 운동 리스트를
                    배정해 줄 수 있습니다.
                  </p>
                  {/* <Button variant='outline-primary border-0 px-5'>
										더보기
									</Button> */}
                </li>
                <li>
                  <div
                    className='imageBox'
                    style={{
                      backgroundImage: `url(${aboutManage})`,
                    }}
                  ></div>
                  <h5>회원관리</h5>
                  <p>
                    회원을 쉽게 등록하고 수정할 수 있으며, 회원의 인바디 정보,
                    운동 정보 등도 함께 관리할 수 있습니다.
                  </p>
                  {/* <Button variant='outline-primary border-0 px-5'>
										더보기
									</Button> */}
                </li>
              </ul>
            </section>
          </section>
        </div>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const HomeStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};
const HomeDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(HomeStateToProps, HomeDispatchToProps)(Home);
