import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import MegaMenu from '../../component/navigation/Menu';
import UserSearch from '../../component/customer/UserSearch';
import { Col, Container, Tabs, Tab } from 'react-bootstrap';
import { TextField } from '@mui/material';
import Footer from '../../component/footer/Footer';
import { inbodiesSelect } from '../../api/user';
import moment from 'moment';
const InbodiesView = ({
  num,
  fitness_no,
  member_no,
  inbody_no,
  height,
  measurementDate,
  bodyMoisture,
  protein,
  mineral,
  bodyFat,
  muscleMass,
  bodyFatMass1,
  weight,
  skeletalMuscleMass,
  bodyFatMass2,
  BMI,
  PercentBodyFat,
}) => {
  const date = moment(measurementDate).format('yyyy년MM월DD일');
  return (
    <tr>
      <td>{date}</td>
      <td>{height}cm</td>
      <td>{weight}kg</td>
      <td>{bodyMoisture}kg</td>
      <td>{protein}kg</td>
      <td>{mineral}kg</td>
    </tr>
  );
};
const InbodiesView2 = ({
  num,
  fitness_no,
  member_no,
  inbody_no,
  height,
  measurementDate,
  bodyMoisture,
  protein,
  mineral,
  bodyFat,
  muscleMass,
  bodyFatMass1,
  weight,
  skeletalMuscleMass,
  bodyFatMass2,
  BMI,
  PercentBodyFat,
}) => {
  const date = moment(measurementDate).format('yyyy년MM월DD일');
  return (
    <tr>
      <td>{date}</td>
      <td>{height}cm</td>
      <td>{weight}kg</td>
      <td>{bodyMoisture}kg</td>
      <td>{protein}kg</td>
      <td>{mineral}kg</td>
      <td>{bodyFat}kg</td>
      <td>{muscleMass}kg</td>
      <td>{bodyFatMass1}kg</td>
    </tr>
  );
};
const InbodiesView3 = ({
  num,
  fitness_no,
  member_no,
  inbody_no,
  height,
  measurementDate,
  bodyMoisture,
  protein,
  mineral,
  bodyFat,
  muscleMass,
  bodyFatMass1,
  weight,
  skeletalMuscleMass,
  bodyFatMass2,
  BMI,
  PercentBodyFat,
}) => {
  const date = moment(measurementDate).format('yyyy년MM월DD일');
  return (
    <tr>
      <td>{date}</td>
      <td>{height}</td>
      <td>{weight}</td>
      <td>{skeletalMuscleMass}</td>
      <td>{bodyFatMass2}</td>
    </tr>
  );
};
const InbodiesView4 = ({
  num,
  fitness_no,
  member_no,
  inbody_no,
  height,
  measurementDate,
  bodyMoisture,
  protein,
  mineral,
  bodyFat,
  muscleMass,
  bodyFatMass1,
  weight,
  skeletalMuscleMass,
  bodyFatMass2,
  BMI,
  PercentBodyFat,
}) => {
  const date = moment(measurementDate).format('yyyy년MM월DD일');
  return (
    <tr>
      <td>{date}</td>
      <td>{height}</td>
      <td>{weight}</td>
      <td>{BMI}</td>
      <td>{PercentBodyFat}</td>
    </tr>
  );
};
class Inbodies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inbodiesList: [],
      open: false,
    };
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
      }
    });
  }
  inbodiesView = (idc) => {
    inbodiesSelect(
      this.props.userinfo.fitness_no,
      idc === undefined ? '' : idc
    ).then((result) => {
      const items = result.map((data, index, array) => {
        return (
          <InbodiesView
            num={data.num}
            fitness_no={data.fitness_no}
            member_no={data.member_no}
            height={data.height}
            measurementDate={data.measurementDate}
            bodyMoisture={data.bodyMoisture}
            protein={data.protein}
            mineral={data.mineral}
            bodyFat={data.bodyFat}
            muscleMass={data.muscleMass}
            bodyFatMass1={data.bodyFatMass1}
            weight={data.weight}
            skeletalMuscleMass={data.skeletalMuscleMass}
            bodyFatMass2={data.bodyFatMass2}
            BMI={data.BMI}
            PercentBodyFat={data.PercentBodyFat}
          />
        );
      });
      this.setState({ inbodiesList: items });
    });
  };
  inbodiesView2 = (idc) => {
    inbodiesSelect(
      this.props.userinfo.fitness_no,
      idc === undefined ? '' : idc
    ).then((result) => {
      const items = result.map((data, index, array) => {
        return (
          <InbodiesView2
            num={data.num}
            fitness_no={data.fitness_no}
            member_no={data.member_no}
            height={data.height}
            measurementDate={data.measurementDate}
            bodyMoisture={data.bodyMoisture}
            protein={data.protein}
            mineral={data.mineral}
            bodyFat={data.bodyFat}
            muscleMass={data.muscleMass}
            bodyFatMass1={data.bodyFatMass1}
            weight={data.weight}
            skeletalMuscleMass={data.skeletalMuscleMass}
            bodyFatMass2={data.bodyFatMass2}
            BMI={data.BMI}
            PercentBodyFat={data.PercentBodyFat}
          />
        );
      });
      this.setState({ inbodiesList2: items });
    });
  };
  inbodiesView3 = (idc) => {
    inbodiesSelect(
      this.props.userinfo.fitness_no,
      idc === undefined ? '' : idc
    ).then((result) => {
      const items = result.map((data, index, array) => {
        return (
          <InbodiesView3
            num={data.num}
            fitness_no={data.fitness_no}
            member_no={data.member_no}
            height={data.height}
            measurementDate={data.measurementDate}
            bodyMoisture={data.bodyMoisture}
            protein={data.protein}
            mineral={data.mineral}
            bodyFat={data.bodyFat}
            muscleMass={data.muscleMass}
            bodyFatMass1={data.bodyFatMass1}
            weight={data.weight}
            skeletalMuscleMass={data.skeletalMuscleMass}
            bodyFatMass2={data.bodyFatMass2}
            BMI={data.BMI}
            PercentBodyFat={data.PercentBodyFat}
          />
        );
      });
      this.setState({ inbodiesList3: items });
    });
  };
  inbodiesView4 = (idc) => {
    inbodiesSelect(
      this.props.userinfo.fitness_no,
      idc === undefined ? '' : idc
    ).then((result) => {
      const items = result.map((data, index, array) => {
        return (
          <InbodiesView4
            num={data.num}
            fitness_no={data.fitness_no}
            member_no={data.member_no}
            height={data.height}
            measurementDate={data.measurementDate}
            bodyMoisture={data.bodyMoisture}
            protein={data.protein}
            mineral={data.mineral}
            bodyFat={data.bodyFat}
            muscleMass={data.muscleMass}
            bodyFatMass1={data.bodyFatMass1}
            weight={data.weight}
            skeletalMuscleMass={data.skeletalMuscleMass}
            bodyFatMass2={data.bodyFatMass2}
            BMI={data.BMI}
            PercentBodyFat={data.PercentBodyFat}
          />
        );
      });
      this.setState({ inbodiesList4: items });
    });
  };
  handleUser = (client) => {
    const { idc, client_name } = client;
    // console.log(client_name);
    this.setState({
      client: client,
      client_name: client_name,
      idc: idc,
      open: false,
    });
    this.inbodiesView(idc);
    this.inbodiesView2(idc);
    this.inbodiesView3(idc);
    this.inbodiesView4(idc);
  };

  render() {
    console.log(this.props.userinfo);
    console.log(this.state.idc);
    return (
      <div className='inbody'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <MegaMenu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                새인바디
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='#'>새인바디</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </div>
        {/*.header */}
        <Container>
          <Col classNvame='text-center my-3'>
            {this.state.open ? (
              <UserSearch
                open={this.state.open}
                setOpen={(o) => this.setState({ open: o })}
                fitness_no={this.props.userinfo.fitness_no}
                loginWhether={this.props.userinfo.loginWhether}
                joinNo={this.props.userinfo.joinNo}
                handleUser={this.handleUser}
              />
            ) : (
              <TextField
                id='customer_name'
                label='회원 검색'
                variant='standard'
                onClick={() => this.setState({ open: true })}
                className='boxmorpsm h-100 w-100'
                InputProps={{ disableUnderline: true }}
                value={this.state.client_name}
                // onChange={this.handleChange}
              />
            )}
          </Col>
          <Tabs
            defaultActiveKey='home'
            id='uncontrolled-tab-example'
            className='mb-3'
          >
            <Tab eventKey='home' title='체성분'>
              {this.state.inbodiesList.length == 0 ? (
                <p>등록된 인바디가 없습니다.</p>
              ) : (
                <table>
                  {/* 체성분  */}
                  <thead>
                    <tr>
                      <th>측정일</th>
                      <th>키</th>
                      <th>체중</th>
                      <th>체수분</th>
                      <th>단백질</th>
                      <th>무기질</th>
                    </tr>
                  </thead>
                  <tbody>{this.state.inbodiesList}</tbody>
                </table>
              )}
            </Tab>
            <Tab eventKey='home2' title='체성분 상세'>
              {this.state.inbodiesList.length == 0 ? (
                <p>등록된 인바디가 없습니다.</p>
              ) : (
                <table>
                  {/* 체성분 상세 */}
                  <thead>
                    <tr>
                      <th>측정일</th>
                      <th>키</th>
                      <th>체중</th>
                      <th>체수분</th>
                      <th>단백질</th>
                      <th>무기질</th>
                      <th>체지방</th>
                      <th>근육량</th>
                      <th>체지방량1</th>
                    </tr>
                  </thead>
                  <tbody>{this.state.inbodiesList2}</tbody>
                </table>
              )}
            </Tab>
            <Tab eventKey='home3' title='골격근, 지방'>
              {this.state.inbodiesList.length == 0 ? (
                <p>등록된 인바디가 없습니다.</p>
              ) : (
                <table>
                  {/* 골격근, 지방 */}
                  <thead>
                    <tr>
                      <th>측정일</th>
                      <th>키</th>
                      <th>체중</th>
                      <th>골격근량</th>
                      <th>체지방량2</th>
                    </tr>
                  </thead>
                  <tbody>{this.state.inbodiesList3}</tbody>
                </table>
              )}
            </Tab>
            <Tab eventKey='home4' title='비만'>
              {this.state.inbodiesList.length == 0 ? (
                <p>등록된 인바디가 없습니다.</p>
              ) : (
                <table>
                  {/* 비만 */}
                  <thead>
                    <tr>
                      <th>측정일</th>
                      <th>키</th>
                      <th>체중</th>
                      <th>BMI</th>
                      <th>체지방률</th>
                    </tr>
                  </thead>
                  <tbody>{this.state.inbodiesList4}</tbody>
                </table>
              )}
            </Tab>
          </Tabs>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const InbodiesStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};
const InbodiesDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(InbodiesStateToProps, InbodiesDispatchToProps)(Inbodies);
