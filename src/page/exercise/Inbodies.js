import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import Menu from '../../component/navigation/Menu';
import UserSearch from '../../component/customer/UserSearch';
import Footer from '../../component/footer/Footer';
import {
  clandarInbodies,
  inbodiesSelect,
  selectClientReservation,
  selectTrainerReservation,
} from '../../api/user';
import moment from 'moment';
import { SERVER_URL } from '../../const/settings';

// react-bootstrap
import { Row, Col, Container, Tabs, Tab, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
// mui
import TextField from '@mui/material/TextField';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
// react-icons
import { MdOutlineClose } from 'react-icons/md';
import { TbMoodSuprised } from 'react-icons/tb';
// react-apexcharts
import Chart from 'react-apexcharts';
import { height } from '@mui/system';

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
    <TableRow>
      <TableCell>{date}</TableCell>
      <TableCell className='inbodies__table--mobile'>
        <b>{height}</b> cm
      </TableCell>
      <TableCell className='inbodies__table--mobile'>
        <b>{weight}</b> kg
      </TableCell>
      <TableCell>
        <b>{bodyMoisture}</b> kg
      </TableCell>
      <TableCell>
        <b>{protein}</b> kg
      </TableCell>
      <TableCell>
        <b>{mineral}</b> kg
      </TableCell>
    </TableRow>
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
    <TableRow>
      <TableCell>{date}</TableCell>
      <TableCell className='inbodies__table--mobile'>
        <b>{height}</b> cm
      </TableCell>
      <TableCell className='inbodies__table--mobile'>
        <b>{weight}</b> kg
      </TableCell>
      <TableCell className='inbodies__table--mobile'>
        <b>{bodyMoisture}</b> kg
      </TableCell>
      <TableCell className='inbodies__table--mobile'>
        <b>{protein}</b> kg
      </TableCell>
      <TableCell className='inbodies__table--mobile'>
        <b>{mineral}</b> kg
      </TableCell>
      <TableCell>
        <b>{bodyFat}</b> kg
      </TableCell>
      <TableCell>
        <b>{muscleMass}</b> kg
      </TableCell>
      <TableCell>
        <b>{bodyFatMass1}</b> kg
      </TableCell>
    </TableRow>
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
    <TableRow>
      <TableCell>{date}</TableCell>
      <TableCell className='inbodies__table--mobile'>
        <b>{height}</b> cm
      </TableCell>
      <TableCell className='inbodies__table--mobile'>
        <b>{weight}</b> kg
      </TableCell>
      <TableCell>
        <b>{skeletalMuscleMass}</b> kg
      </TableCell>
      <TableCell>
        <b>{bodyFatMass2}</b> kg
      </TableCell>
    </TableRow>
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
    <TableRow>
      <TableCell>{date}</TableCell>
      <TableCell className='inbodies__table--mobile'>
        <b>{height}</b> cm
      </TableCell>
      <TableCell className='inbodies__table--mobile'>
        <b>{weight}</b> kg
      </TableCell>
      <TableCell>
        <b>{BMI}</b> %
      </TableCell>
      <TableCell>
        <b>{PercentBodyFat}</b> %
      </TableCell>
    </TableRow>
  );
};

class Inbodies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inbodiesList: [],
      client_name:
        this.props.userinfo.loginWhether === 2
          ? this.props.userinfo.manager_name
          : '',
      series: [],
      inbodiesListChart: {
        chart: {
          type: 'line',
        },
        series: [{ name: '인바디', data: [0, 1, 2, 3, 4, 5, 6, 7] }],
        theme: {
          monochrome: {
            enabled: true,
            color: '#255aee',
            shadeTo: 'light',
            shadeIntensity: 0.65,
          },
        },
        xaxis: {
          categories: [
            '체중',
            '체수분',
            '단백질',
            '무기질',
            '체지방',
            '근육량',
            '체지방량1',
            '골격근량',
            '체지방량2',
            'BMI',
            '체지방률',
          ],
        },
        stroke: {
          width: 2,
          curve: 'smooth',
          dashArray: 0,
        },
        markers: {
          size: 6,
          hover: {
            sizeOffset: 6,
          },
        },
        colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
      },
      open: false,
      openChart: false,
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
        this.props.userinfo.loginWhether === 2
          ? this.inbodiesView(this.props.userinfo.joinNo)
          : '';
        this.props.userinfo.loginWhether === 2
          ? this.inbodiesView2(this.props.userinfo.joinNo)
          : '';
        this.props.userinfo.loginWhether === 2
          ? this.inbodiesView3(this.props.userinfo.joinNo)
          : '';
        this.props.userinfo.loginWhether === 2
          ? this.inbodiesView4(this.props.userinfo.joinNo)
          : '';
        this.props.userinfo.loginWhether === 2
          ? this.inbodiesViewChart(this.props.userinfo.joinNo)
          : '';
      }
    });
  }
  inbodiesView = (idc) => {
    selectClientReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((clientResult) => {
      selectTrainerReservation(
        this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
      ).then((trainerResult) => {
        const fitness_no =
          this.props.userinfo.loginWhether === 2
            ? clientResult[0].fitness_no
            : this.props.userinfo.loginWhether === 1
            ? trainerResult[0].fitness_no
            : this.props.userinfo.fitness_no;
        inbodiesSelect(fitness_no, idc === undefined ? '' : idc).then(
          (result) => {
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
            this.setState({ inbodiesList: items.reverse() });
          }
        );
      });
    });
  };
  inbodiesView2 = (idc) => {
    selectClientReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((clientResult) => {
      selectTrainerReservation(
        this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
      ).then((trainerResult) => {
        const fitness_no =
          this.props.userinfo.loginWhether === 2
            ? clientResult[0].fitness_no
            : this.props.userinfo.loginWhether === 1
            ? trainerResult[0].fitness_no
            : this.props.userinfo.fitness_no;
        inbodiesSelect(fitness_no, idc === undefined ? '' : idc).then(
          (result) => {
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
            this.setState({ inbodiesList2: items.reverse() });
          }
        );
      });
    });
  };
  inbodiesView3 = (idc) => {
    selectClientReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((clientResult) => {
      selectTrainerReservation(
        this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
      ).then((trainerResult) => {
        const fitness_no =
          this.props.userinfo.loginWhether === 2
            ? clientResult[0].fitness_no
            : this.props.userinfo.loginWhether === 1
            ? trainerResult[0].fitness_no
            : this.props.userinfo.fitness_no;
        inbodiesSelect(fitness_no, idc === undefined ? '' : idc).then(
          (result) => {
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
            this.setState({ inbodiesList3: items.reverse() });
          }
        );
      });
    });
  };
  inbodiesView4 = (idc) => {
    selectClientReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((clientResult) => {
      selectTrainerReservation(
        this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
      ).then((trainerResult) => {
        const fitness_no =
          this.props.userinfo.loginWhether === 2
            ? clientResult[0].fitness_no
            : this.props.userinfo.loginWhether === 1
            ? trainerResult[0].fitness_no
            : this.props.userinfo.fitness_no;
        inbodiesSelect(fitness_no, idc === undefined ? '' : idc).then(
          (result) => {
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
            this.setState({ inbodiesList4: items.reverse() });
          }
        );
      });
    });
  };
  inbodiesViewChart = (idc) => {
    selectClientReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((clientResult) => {
      selectTrainerReservation(
        this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
      ).then((trainerResult) => {
        const fitness_no =
          this.props.userinfo.loginWhether === 2
            ? clientResult[0].fitness_no
            : this.props.userinfo.loginWhether === 1
            ? trainerResult[0].fitness_no
            : this.props.userinfo.fitness_no;
        inbodiesSelect(fitness_no, idc === undefined ? '' : idc).then((res) => {
          let inbodyNum = [];
          let measurementDate = [];
          let weight = [];
          let height = [];
          let bodyMoisture = [];
          let protein = [];
          let mineral = [];
          let bodyFat = [];
          let muscleMass = [];
          let bodyFatMass1 = [];
          let skeletalMuscleMass = [];
          let bodyFatMass2 = [];
          let BMI = [];
          let PercentBodyFat = [];
          for (let i = 0; i < res.length; i++) {
            inbodyNum.push(
              // '측정일: ' +
              moment(res[i].measurementDate).format('yyyy년MM월DD일')
            );

            height.push(res[i].height);
            weight.push(res[i].weight);
            bodyMoisture.push(res[i].bodyMoisture);
            protein.push(res[i].protein);
            mineral.push(res[i].mineral);
            bodyFat.push(res[i].bodyFat);
            muscleMass.push(res[i].muscleMass);
            bodyFatMass1.push(res[i].bodyFatMass1);
            skeletalMuscleMass.push(res[i].skeletalMuscleMass);
            bodyFatMass2.push(res[i].bodyFatMass2);
            BMI.push(res[i].BMI);
            PercentBodyFat.push(res[i].PercentBodyFat);
          }
          let chartData = [
            { name: '체중', data: weight },
            // { name: '키', data: height },
            { name: '체수분', data: bodyMoisture },
            { name: '단백질', data: protein },
            { name: '무기질', data: mineral },
            { name: '체지방', data: bodyFat },
            { name: '근육량', data: muscleMass },
            { name: '체지방량1', data: bodyFatMass1 },
            { name: '골격근량', data: skeletalMuscleMass },
            { name: '체지방량2', data: bodyFatMass2 },
            { name: 'BMI', data: BMI },
            { name: '체지방률', data: PercentBodyFat },
          ];
          this.setState({
            series: chartData,
            inbodiesListChart: {
              chart: {
                type: 'line',
              },
              series: chartData,
              xaxis: {
                categories: inbodyNum,
              },
              colors: [
                '#E91E63',
                '#FF9800',
                '#FFFF00',
                '#00BF00',
                '#A3FF8C',
                '#00FFEB',
                '#2E93fA',
                '#0001FF',
                '#A468FF',
                '#FF7AC8',
                '#FFFFFF',
              ],
            },
          });
        });
      });
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
      height: height,
    });
    this.inbodiesView(idc);
    this.inbodiesView2(idc);
    this.inbodiesView3(idc);
    this.inbodiesView4(idc);
    this.inbodiesViewChart(idc);
  };

  clickOpen = () => {
    if (!this.state.client_name) {
      alert('회원을 선택해주세요');
    } else {
      this.setState({ openChart: true });
    }
  };
  clickclose = () => {
    this.setState({ openChart: false });
  };
  render() {
    // console.log(this.props.userinfo);
    // console.log(this.state.idc);
    // console.log(this.state.inbodiesList);
    // console.log(this.state.client_name);
    // console.log(this.props.userinfo.manager_name);

    return (
      <div className='wrap inbodies'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                인바디 정보
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='#'>인바디 정보</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </div>
        {/*.header */}
        <Container>
          <Row className=''>
            <Col md={6} className='text-center mb-2'>
              {this.props.userinfo.loginWhether === 2 ? (
                <TextField
                  id='customer_name'
                  label='선택된 회원'
                  disabled
                  variant='standard'
                  className='boxmorpsm h-100 w-100 text-center pb-2 px-5'
                  InputProps={{ disableUnderline: true }}
                  value={this.props.userinfo.manager_name}
                />
              ) : this.state.open ? (
                <div>
                  <UserSearch
                    open={this.state.open}
                    setOpen={(o) => this.setState({ open: o })}
                    fitness_no={this.props.userinfo.fitness_no}
                    loginWhether={this.props.userinfo.loginWhether}
                    joinNo={this.props.userinfo.joinNo}
                    handleUser={this.handleUser}
                  />
                </div>
              ) : (
                <div>
                  <TextField
                    id='customer_name'
                    label='회원 선택'
                    disabled
                    variant='standard'
                    onClick={() => this.setState({ open: true })}
                    className='boxmorpsm bg-white h-100 w-100 text-center pb-2 px-5'
                    InputProps={{ disableUnderline: true }}
                    value={this.state.client_name}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              )}
            </Col>
            <Col md={4} className='mb-2'>
              <Button className='w-100 h-100' onClick={this.clickOpen}>
                인바디 변화 보기
              </Button>
            </Col>
            <Col md={2} className='mb-2'>
              <Link
                to={{
                  pathname: '/inbodiesAdd',
                  state: {
                    inbody_no: this.state.inbody_no,
                    member_no:
                      this.props.userinfo.loginWhether == 2
                        ? this.props.userinfo.joinNo
                        : this.state.idc === undefined
                        ? 0
                        : this.state.idc,
                  },
                }}
              >
                <Button className='w-100 h-100' variant='outline-primary'>
                  인바디 추가
                </Button>
              </Link>
            </Col>
          </Row>
          {this.state.openChart ? (
            <div className='inbodies__chart--wrap'>
              <span className='fs-5 fw-bold'>{this.state.client_name}</span>님의
              인바디 변화 그래프
              <Chart
                height={400}
                options={this.state.inbodiesListChart}
                series={this.state.series}
                type='line'
              />
            </div>
          ) : null}
          <Row className='inbodies__user__information--mobile'>
            <Col>
              <h5>키</h5>
              <p>{this.state.height}cm</p>
            </Col>
            <Col>
              <h5>체중</h5>
              <p>{this.state.weight}kg</p>
            </Col>
          </Row>
          <Tabs
            defaultActiveKey='home'
            id='uncontrolled-tab-example'
            className='mb-3'
          >
            <Tab eventKey='home' title='체성분'>
              {this.state.inbodiesList.length == 0 ? (
                <div className='p-3 fs-5 fw-bold text-center text-dark'>
                  <TbMoodSuprised className='fs-3' />
                  <p>등록된 인바디 정보가 없습니다.</p>
                </div>
              ) : (
                <TableContainer>
                  <Table>
                    {/* 체성분  */}
                    <TableHead>
                      <TableRow>
                        <TableCell>측정일</TableCell>
                        <TableCell className='inbodies__table--mobile'>
                          키
                        </TableCell>
                        <TableCell className='inbodies__table--mobile'>
                          체중
                        </TableCell>
                        <TableCell>체수분</TableCell>
                        <TableCell>단백질</TableCell>
                        <TableCell>무기질</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{this.state.inbodiesList}</TableBody>
                  </Table>
                </TableContainer>
              )}
            </Tab>
            <Tab eventKey='home2' title='체성분 상세'>
              {this.state.inbodiesList.length == 0 ? (
                <div className='p-3 fs-5 fw-bold text-center text-dark'>
                  <TbMoodSuprised className='fs-3' />
                  <p>등록된 인바디 정보가 없습니다.</p>
                </div>
              ) : (
                <TableContainer>
                  <Table>
                    {/* 체성분 상세 */}
                    <TableHead>
                      <TableRow>
                        <TableCell>측정일</TableCell>
                        <TableCell className='inbodies__table--mobile'>
                          키
                        </TableCell>
                        <TableCell className='inbodies__table--mobile'>
                          체중
                        </TableCell>
                        <TableCell className='inbodies__table--mobile'>
                          체수분
                        </TableCell>
                        <TableCell className='inbodies__table--mobile'>
                          단백질
                        </TableCell>
                        <TableCell className='inbodies__table--mobile'>
                          무기질
                        </TableCell>
                        <TableCell>체지방</TableCell>
                        <TableCell>근육량</TableCell>
                        <TableCell>체지방량1</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{this.state.inbodiesList2}</TableBody>
                  </Table>
                </TableContainer>
              )}
            </Tab>
            <Tab eventKey='home3' title='골격근, 지방'>
              {this.state.inbodiesList.length == 0 ? (
                <div className='p-3 fs-5 fw-bold text-center text-dark'>
                  <TbMoodSuprised className='fs-3' />
                  <p>등록된 인바디 정보가 없습니다.</p>
                </div>
              ) : (
                <TableContainer>
                  <Table>
                    {/* 골격근, 지방 */}
                    <TableHead>
                      <TableRow>
                        <TableCell>측정일</TableCell>
                        <TableCell className='inbodies__table--mobile'>
                          키
                        </TableCell>
                        <TableCell className='inbodies__table--mobile'>
                          체중
                        </TableCell>
                        <TableCell>골격근량</TableCell>
                        <TableCell>체지방량2</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{this.state.inbodiesList3}</TableBody>
                  </Table>
                </TableContainer>
              )}
            </Tab>
            <Tab eventKey='home4' title='비만'>
              {this.state.inbodiesList.length == 0 ? (
                <div className='p-3 fs-5 fw-bold text-center text-dark'>
                  <TbMoodSuprised className='fs-3' />
                  <p>등록된 인바디 정보가 없습니다.</p>
                </div>
              ) : (
                <TableContainer>
                  <Table>
                    {/* 비만 */}
                    <TableHead>
                      <TableRow>
                        <TableCell>측정일</TableCell>
                        <TableCell className='inbodies__table--mobile'>
                          키
                        </TableCell>
                        <TableCell className='inbodies__table--mobile'>
                          체중
                        </TableCell>
                        <TableCell>BMI</TableCell>
                        <TableCell>체지방률</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{this.state.inbodiesList4}</TableBody>
                  </Table>
                </TableContainer>
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
