import { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';

import {
  clientSelect,
  deleteClient,
  searchClientname,
  searchPhone,
  selectClientReservation,
  selectTrainerReservation,
  updateClient,
  updateManagerClientTrainer,
  voucherSelect,
  voucherSelect2,
  voucherUpdate,
  voucherUpdate2,
} from '../../api/user';

// 컴포넌트
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import Menu from '../../component/navigation/Menu';
import Footer from '../../component/footer/Footer';
import CustomerCalendarComponent from '../../component/customer/CustomerCalendarComponent';
import Dropdown from 'react-dropdown';
// moment
import moment from 'moment';
// Bootstrap
import Form from 'react-bootstrap/Form';
import {
  Container,
  Modal,
  Row,
  Col,
  FloatingLabel,
  Tabs,
  Tab,
} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
// MUI 테이블
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

// css
import '../../styles/client/client.css';
import { TablePagination } from '@mui/material';

// react icons
import { TbMoodSuprised } from 'react-icons/tb';
// MUI icons
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const options = ['이름', '핸드폰', '사물함번호'];
/* 기능추가 : 사물함검색 */
const ClientPhone = ({
  joinNo,
  fitness_no,
  client_name,
  phone,
  birth,
  sex,
  join_route,
  address,
  start_date,
  lockerNumber,
  sportswear,
  idc,
  viewClient,
  loginWhether,
}) => {
  const newDate = moment(start_date).format('YYYY년 MM월 DD일');
  const [showModal, setShowModal] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [client_name_input, setClient_name_input] = useState('');
  const [address_input, setAddress_input] = useState('');
  const [phone_input, setPhone_input] = useState('');
  const [locker_input, setLocker_input] = useState(lockerNumber);
  const [wear_input, setWear_input] = useState(sportswear);
  const [voucher, setVoucher] = useState([]);
  const [voucher2, setVoucher2] = useState([]);
  const [viewModal, setViewModal] = useState(false);

  const modalClose = () => {
    setShowModal(false);
    setClient_name_input(client_name);
    setAddress_input(address);
    setPhone_input(phone);
    setShowUpdate(false);
  };
  const modalOnClick = () => {
    setShowModal(true);
    vocherView();
  };
  const modalUpdate = () => {
    setShowUpdate(true);
    setClient_name_input(client_name);
    setAddress_input(address);
    setPhone_input(phone);
  };

  const deleteCompleted = (idc) => {
    deleteClient(idc).then(() => {
      modalClose();
      setShowUpdate(false);
      viewClient();
    });
  };

  const viewModalOnclick = () => {
    setViewModal(true);
    vocherView2();
  };
  const viewModalClose = () => {
    setViewModal(false);
  };

  const updateCompleted = (idc) => {
    if (client_name_input === '') {
      alert('이름을 입력해주세요.');
    } else if (phone_input === '') {
      alert('연락처를 입력해주세요.');
    } else if (address_input === '') {
      alert('주소를 입력해주세요.');
    } else {
      updateClient(
        idc,
        client_name_input,
        phone_input,
        address_input,
        locker_input,
        wear_input
      ).then(() => {
        updateManagerClientTrainer(idc, client_name_input, phone_input).then(
          () => {}
        );
        modalClose();
        setShowUpdate(false);
        viewClient();
      });
    }
  };

  const updateChange1 = (e) => {
    setClient_name_input(e.target.value);
  };
  const updateChange2 = (e) => {
    setAddress_input(e.target.value);
  };
  const updateChange3 = (e) => {
    setPhone_input(e.target.value);
  };
  const updateChange4 = (e) => {
    setLocker_input(e.target.value);
  };
  const handleWear = () => {
    setWear_input('미사용');
  };
  const handleWear2 = () => {
    setWear_input('사용');
  };

  const VoucherView = ({
    kind,
    paidMembership,
    paidMembership2,
    paymentDate,
    salesDays,
    salesStart_date,
  }) => {
    const date1 = moment(paymentDate).format('YYYY년 MM월 DD일');
    const date2 = moment(salesStart_date).format('YYYY년 MM월 DD일');
    const date3 = moment(salesStart_date)
      .add(salesDays, 'days')
      .subtract(1, 'days')
      .format('YYYY년 MM월 DD일');
    const date4 = moment(salesStart_date).add(salesDays, 'days');
    const endDays =
      moment().diff(date4, 'days') == 0 ? '-Day' : moment().diff(date4, 'days');
    const today = moment(new Date()).format('YYYY년 MM월 DD일');
    const date3plus1 = moment(salesStart_date)
      .add(salesDays, 'days')
      .add(1, 'days')
      .subtract(1, 'days')
      .format('YYYY년 MM월 DD일');
    // console.log(today);
    // console.log(date3plus1);
    // console.log(client_name, fitness_no, kind);
    const paidControl = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate(client_name, kind, res[0].paidMembership2 - 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '이용권이 차감됩니다. 잔여 이용권은' +
                    (res[0].paidMembership2 - 1) +
                    '회 입니다.'
                );
              }
            );
          }
        });
      });
    };

    const paidControl2 = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate(client_name, kind, res[0].paidMembership2 + 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '이용권이 증가됩니다. 잔여 이용권은' +
                    (res[0].paidMembership2 + 1) +
                    '회 입니다.'
                );
              }
            );
          }
        });
      });
    };
    //salesControl 비활성화
    const salesControl = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate2(client_name, kind, res[0].salesDays + 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '기간권이 증가됩니다. D - ' +
                    (res[0].salesDays + 1)
                );
              }
            );
          }
        });
      });
    };

    const salesControl2 = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate2(client_name, kind, res[0].salesDays - 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '기간권이 차감됩니다. D - ' +
                    (res[0].salesDays - 1)
                );
              }
            );
          }
        });
      });
    };

    return (
      //paidMembership: 이용권, salesDays: 기간권
      //기간권 이용권 보다 보기좋게 구분
      <>
        {date3plus1 <= today ? (
          ''
        ) : paidMembership ? (
          paidMembership2 === 0 ? (
            ''
          ) : (
            <Row className='client-infomation__detail--membership'>
              <Col xs={12}>
                <h4>{kind}</h4>
              </Col>
              <Col xs={12} sm={8}>
                <p>
                  이용권: {paidMembership2}/{paidMembership}
                </p>
                <p>이용권 결제일: {date1}</p>
              </Col>
              <Col xs={12} sm={4}>
                <div className='text-end'>
                  <Button
                    variant='outline-danger'
                    size='sm'
                    onClick={paidControl}
                  >
                    <RemoveIcon />
                    이용권 차감하기
                  </Button>
                </div>
                <div className='text-end'>
                  <Button
                    variant='outline-success'
                    size='sm'
                    onClick={paidControl2}
                  >
                    <AddIcon />
                    이용권 증가하기
                  </Button>
                </div>
              </Col>
            </Row>
          )
        ) : (
          <Row className='client-infomation__detail--membership'>
            <Col xs={12} sm={8}>
              <h4>{kind}</h4>
              기간권: {salesDays}일 권 [ D{endDays} ]
              <br />
              기간권 결제일: {date2}
              <br />
              기간권 마감일: {date3}
            </Col>
            <Col xs={12} sm={4}>
              {/* <Button onClick={salesControl}>+기간권 기간 증가</Button>
            <Button onClick={salesControl2}>-기간권 기간 차감</Button> */}
            </Col>
          </Row>
        )}
      </>
    );
  };

  const vocherView = () => {
    voucherSelect(client_name, fitness_no).then((res) => {
      // console.log(res);
      const items = res.map((data, index, array) => {
        return (
          <VoucherView
            kind={data.kind}
            paidMembership={data.paidMembership}
            paidMembership2={data.paidMembership2}
            paymentDate={data.paymentDate}
            salesDays={data.salesDays}
            salesStart_date={data.salesStart_date}
            salesEnd_date={data.salesEnd_date}
          />
        );
      });
      setVoucher(items);
    });
  };

  const VoucherView2 = ({
    kind,
    paidMembership,
    paidMembership2,
    paymentDate,
    salesDays,
    salesStart_date,
  }) => {
    const date1 = moment(paymentDate).format('YYYY년 MM월 DD일');
    const date2 = moment(salesStart_date).format('YYYY년 MM월 DD일');
    const date3 = moment(salesStart_date)
      .add(salesDays, 'days')
      .subtract(1, 'days')
      .format('YYYY년 MM월 DD일');
    const date4 = moment(salesStart_date).add(salesDays, 'days');
    const endDays =
      moment().diff(date4, 'days') == 0 ? '-Day' : moment().diff(date4, 'days');

    return (
      //paidMembership: 이용권, salesDays: 기간권
      <>
        {/* paidMembership= true면 이용권 아니면 기간권 */}
        {paidMembership ? (
          <Row className='client-infomation__detail--membership'>
            <Col xs={12}>
              <h4>{kind}</h4>
            </Col>
            <Col xs={12} sm={8}>
              <p>
                이용권: {paidMembership2}/{paidMembership}
              </p>
              <p>이용권 결제일: {date1}</p>
            </Col>
          </Row>
        ) : (
          <Row className='client-infomation__detail--membership'>
            <Col xs={12} sm={8}>
              <h4>{kind}</h4>
              기간권: {salesDays}일 권 [ D{endDays} ]
              <br />
              기간권 결제일: {date2}
              <br />
              기간권 마감일: {date3}
            </Col>
          </Row>
        )}
      </>
    );
  };

  const vocherView2 = () => {
    voucherSelect(client_name, fitness_no).then((res) => {
      // console.log(res);
      const items = res.map((data, index, array) => {
        return (
          <VoucherView2
            kind={data.kind}
            paidMembership={data.paidMembership}
            paidMembership2={data.paidMembership2}
            paymentDate={data.paymentDate}
            salesDays={data.salesDays}
            salesStart_date={data.salesStart_date}
            salesEnd_date={data.salesEnd_date}
          />
        );
      });
      setVoucher2(items);
    });
  };

  return (
    // 3 연락처-검색 페이지
    <TableRow>
      <TableCell onClick={modalOnClick}>{client_name}</TableCell>
      <TableCell onClick={modalOnClick}>{sex == 1 ? '남' : '여'}</TableCell>
      <TableCell onClick={modalOnClick}>{phone}</TableCell>
      <TableCell onClick={modalOnClick}>{newDate}</TableCell>
      <TableCell onClick={modalOnClick}>{lockerNumber}</TableCell>
      <Modal
        className='client_modal'
        show={showModal}
        onHide={modalClose}
        size='xl'
      >
        <Modal.Header className='mb-3'>
          <Modal.Title>회원 상세 정보</Modal.Title>
          {showUpdate ? (
            <Button onClick={modalClose} variant='outline-light'>
              <CloseIcon />
            </Button>
          ) : (
            <Button
              className='border-0'
              onClick={modalClose}
              variant='outline-light'
            >
              <CloseIcon fontSize='large' />
            </Button>
          )}
        </Modal.Header>
        <Modal.Body className='mw-100'>
          <div>
            <CustomerCalendarComponent customer_no={idc} />
          </div>
          <Row className='mt-3 client__modal--information'>
            <Col xs={2}>
              <h5 className='mb-1'>이름</h5>
            </Col>
            {showUpdate ? (
              <Col xs={10}>
                <Form.Control
                  className='w-50'
                  value={client_name_input}
                  onChange={updateChange1}
                />
              </Col>
            ) : (
              <Col xs={10}>{client_name}</Col>
            )}
            <Col xs={2}>
              <h5 className='mb-1'>생년월일</h5>
            </Col>
            <Col xs={10}>{birth}</Col>
            <Col xs={2} className='mb-2'>
              <h5 className='mb-1'>연락처</h5>
            </Col>
            {showUpdate ? (
              <Col xs={10}>
                <Form.Control
                  className='w-50'
                  value={phone_input}
                  onChange={updateChange3}
                />
              </Col>
            ) : (
              <Col xs={10}>{phone}</Col>
            )}
            <Col xs={2} className='mb-2'>
              <h5 className='mb-1'>주소</h5>
            </Col>
            {showUpdate ? (
              <Col xs={10}>
                <Form.Control value={address_input} onChange={updateChange2} />
              </Col>
            ) : (
              <Col xs={10}>{address}</Col>
            )}
            <Col xs={2} className='mb-3'>
              <h5>메모</h5>
            </Col>
            {/* 기능추가:메모로 변경해야함 */}
            {showUpdate ? (
              <Col>
                <Form.Control
                  value={client_name_input}
                  onChange={updateChange1}
                />
              </Col>
            ) : (
              <Col xs={10}>{client_name}</Col>
            )}
            <div className='d-flex justify-content-between'>
              <div className='d-flex justify-content'>
                <h5 className='me-4'>운동복</h5>
                {showUpdate ? (
                  <Form.Group>
                    <Form.Check inline>
                      <Form.Check.Label htmlFor='route1'>
                        미사용
                      </Form.Check.Label>
                      <Form.Check.Input
                        className='mt-3'
                        type='radio'
                        checked={wear_input === '미사용'}
                        onChange={() => setWear_input('미사용')}
                      />
                    </Form.Check>
                    <Form.Check inline>
                      <Form.Check.Label htmlFor='route1'>사용</Form.Check.Label>
                      <Form.Check.Input
                        className='mt-3'
                        type='radio'
                        checked={wear_input === '사용'}
                        onChange={() => setWear_input('사용')}
                      />
                    </Form.Check>
                  </Form.Group>
                ) : (
                  <p>{sportswear}</p>
                )}
              </div>
              <div className='d-flex justify-content mb-3'>
                <h5 className='me-3'>사물함번호</h5>
                {showUpdate ? (
                  <Col xs={2}>
                    <Form.Control
                      type='number'
                      value={locker_input}
                      onChange={updateChange4}
                    />
                  </Col>
                ) : (
                  <p>{lockerNumber}</p>
                )}
              </div>
              <div className='d-flex justify-content'>
                <h5 className='me-3'>가입경로</h5>
                <p>{join_route}</p>
              </div>
            </div>
          </Row>
          <Row>
            <div className='voucher'>
              <div className='d-flex justify-content-between mt-4'>
                <h4>현재 사용중인 이용권</h4>
                <p className='text-primary more' onClick={viewModalOnclick}>
                  + 이용권 전체보기
                </p>
              </div>
              <div>{voucher}</div>
              <div>
                {/* 이용권&기간권 더보기 Modal d-flex justify-content-between */}
                <Modal
                  className='client_modal'
                  show={viewModal}
                  onHide={viewModalClose}
                >
                  <Modal.Header className='p-0'>
                    <Modal.Title>이용권 전체보기</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{voucher2}</Modal.Body>
                </Modal>
              </div>
            </div>
            <div className='text-end text-danger mt-4'>
              {showUpdate ? (
                loginWhether === 1 ? (
                  ''
                ) : (
                  <div>
                    <span className='m-2'>
                      삭제시 되돌릴 수 없습니다 한번 더 확인해주세요
                    </span>
                    <Button
                      variant='outline-danger'
                      onClick={() =>
                        // eslint-disable-next-line no-restricted-globals
                        confirm(
                          client_name +
                            ' 회원을 탈퇴하시겠습니까? \n회원 삭제 시 되돌릴 수 없습니다. \n한번 더 확인해주세요.'
                        ) == true
                          ? deleteCompleted(idc)
                          : alert(client_name + '회원 탈퇴를 취소 하였습니다.')
                      }
                    >
                      삭제
                    </Button>
                  </div>
                )
              ) : (
                ''
              )}
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-center'>
          {showUpdate ? (
            <Button onClick={modalClose} variant='primary-dark'>
              취소
            </Button>
          ) : (
            <Button onClick={modalClose} variant='primary-dark'>
              닫기
            </Button>
          )}
          {showUpdate ? (
            <Button onClick={() => updateCompleted(idc)} variant='primary'>
              완료하기
            </Button>
          ) : (
            <Button onClick={modalUpdate} variant='primary'>
              수정하기
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </TableRow>
  );
};
const ClientName = ({
  joinNo,
  fitness_no,
  client_name,
  phone,
  birth,
  sex,
  join_route,
  address,
  start_date,
  lockerNumber,
  sportswear,
  idc,
  viewClient,
  loginWhether,
}) => {
  const newDate = moment(start_date).format('YYYY년 MM월 DD일');
  const [showModal, setShowModal] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [client_name_input, setClient_name_input] = useState('');
  const [address_input, setAddress_input] = useState('');
  const [phone_input, setPhone_input] = useState('');
  const [locker_input, setLocker_input] = useState(lockerNumber);
  const [wear_input, setWear_input] = useState(sportswear);
  const [voucher, setVoucher] = useState([]);
  const [voucher2, setVoucher2] = useState([]);
  const [viewModal, setViewModal] = useState(false);

  const modalClose = () => {
    setShowModal(false);
    setClient_name_input(client_name);
    setAddress_input(address);
    setPhone_input(phone);
    setShowUpdate(false);
  };
  const modalOnClick = () => {
    setShowModal(true);
    vocherView();
  };
  const modalUpdate = () => {
    setShowUpdate(true);
    setClient_name_input(client_name);
    setAddress_input(address);
    setPhone_input(phone);
  };

  const deleteCompleted = (idc) => {
    deleteClient(idc).then(() => {
      modalClose();
      setShowUpdate(false);
      viewClient();
    });
  };

  const viewModalOnclick = () => {
    setViewModal(true);
    vocherView2();
  };
  const viewModalClose = () => {
    setViewModal(false);
  };

  const updateCompleted = (idc) => {
    if (client_name_input === '') {
      alert('이름을 입력해주세요.');
    } else if (phone_input === '') {
      alert('연락처를 입력해주세요.');
    } else if (address_input === '') {
      alert('주소를 입력해주세요.');
    } else {
      updateClient(
        idc,
        client_name_input,
        phone_input,
        address_input,
        locker_input,
        wear_input
      ).then(() => {
        updateManagerClientTrainer(idc, client_name_input, phone_input).then(
          () => {}
        );
        modalClose();
        setShowUpdate(false);
        viewClient();
      });
    }
  };

  const updateChange1 = (e) => {
    setClient_name_input(e.target.value);
  };
  const updateChange2 = (e) => {
    setAddress_input(e.target.value);
  };
  const updateChange3 = (e) => {
    setPhone_input(e.target.value);
  };
  const updateChange4 = (e) => {
    setLocker_input(e.target.value);
  };
  const handleWear = () => {
    setWear_input('미사용');
  };
  const handleWear2 = () => {
    setWear_input('사용');
  };

  const VoucherView = ({
    kind,
    paidMembership,
    paidMembership2,
    paymentDate,
    salesDays,
    salesStart_date,
  }) => {
    const date1 = moment(paymentDate).format('YYYY년 MM월 DD일');
    const date2 = moment(salesStart_date).format('YYYY년 MM월 DD일');
    const date3 = moment(salesStart_date)
      .add(salesDays, 'days')
      .subtract(1, 'days')
      .format('YYYY년 MM월 DD일');
    const date4 = moment(salesStart_date).add(salesDays, 'days');
    const endDays =
      moment().diff(date4, 'days') == 0 ? '-Day' : moment().diff(date4, 'days');
    const today = moment(new Date()).format('YYYY년 MM월 DD일');
    const date3plus1 = moment(salesStart_date)
      .add(salesDays, 'days')
      .add(1, 'days')
      .subtract(1, 'days')
      .format('YYYY년 MM월 DD일');
    // console.log(today);
    // console.log(date3plus1);
    // console.log(client_name, fitness_no, kind);
    const paidControl = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate(client_name, kind, res[0].paidMembership2 - 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '이용권이 차감됩니다. 잔여 이용권은' +
                    (res[0].paidMembership2 - 1) +
                    '회 입니다.'
                );
              }
            );
          }
        });
      });
    };

    const paidControl2 = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate(client_name, kind, res[0].paidMembership2 + 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '이용권이 증가됩니다. 잔여 이용권은' +
                    (res[0].paidMembership2 + 1) +
                    '회 입니다.'
                );
              }
            );
          }
        });
      });
    };
    //salesControl 비활성화
    const salesControl = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate2(client_name, kind, res[0].salesDays + 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '기간권이 증가됩니다. D - ' +
                    (res[0].salesDays + 1)
                );
              }
            );
          }
        });
      });
    };

    const salesControl2 = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate2(client_name, kind, res[0].salesDays - 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '기간권이 차감됩니다. D - ' +
                    (res[0].salesDays - 1)
                );
              }
            );
          }
        });
      });
    };

    return (
      //paidMembership: 이용권, salesDays: 기간권
      //기간권 이용권 보다 보기좋게 구분
      <>
        {date3plus1 <= today ? (
          ''
        ) : paidMembership ? (
          paidMembership2 === 0 ? (
            ''
          ) : (
            <Row className='client-infomation__detail--membership'>
              <Col xs={12}>
                <h4>{kind}</h4>
              </Col>
              <Col xs={12} sm={8}>
                <p>
                  이용권: {paidMembership2}/{paidMembership}
                </p>
                <p>이용권 결제일: {date1}</p>
              </Col>
              <Col xs={12} sm={4}>
                <div className='text-end'>
                  <Button
                    variant='outline-danger'
                    size='sm'
                    onClick={paidControl}
                  >
                    <RemoveIcon />
                    이용권 차감하기
                  </Button>
                </div>
                <div className='text-end'>
                  <Button
                    variant='outline-success'
                    size='sm'
                    onClick={paidControl2}
                  >
                    <AddIcon />
                    이용권 증가하기
                  </Button>
                </div>
              </Col>
            </Row>
          )
        ) : (
          <Row className='client-infomation__detail--membership'>
            <Col xs={12} sm={8}>
              <h4>{kind}</h4>
              기간권: {salesDays}일 권 [ D {endDays} ]
              <br />
              기간권 결제일: {date2}
              <br />
              기간권 마감일: {date3}
            </Col>
            <Col xs={12} sm={4}>
              {/* <Button onClick={salesControl}>+기간권 기간 증가</Button>
            <Button onClick={salesControl2}>-기간권 기간 차감</Button> */}
            </Col>
          </Row>
        )}
      </>
    );
  };

  const vocherView = () => {
    voucherSelect(client_name, fitness_no).then((res) => {
      // console.log(res);
      const items = res.map((data, index, array) => {
        return (
          <VoucherView
            kind={data.kind}
            paidMembership={data.paidMembership}
            paidMembership2={data.paidMembership2}
            paymentDate={data.paymentDate}
            salesDays={data.salesDays}
            salesStart_date={data.salesStart_date}
            salesEnd_date={data.salesEnd_date}
          />
        );
      });
      setVoucher(items);
    });
  };

  const VoucherView2 = ({
    kind,
    paidMembership,
    paidMembership2,
    paymentDate,
    salesDays,
    salesStart_date,
  }) => {
    const date1 = moment(paymentDate).format('YYYY년 MM월 DD일');
    const date2 = moment(salesStart_date).format('YYYY년 MM월 DD일');
    const date3 = moment(salesStart_date)
      .add(salesDays, 'days')
      .subtract(1, 'days')
      .format('YYYY년 MM월 DD일');
    const date4 = moment(salesStart_date).add(salesDays, 'days');
    const endDays =
      moment().diff(date4, 'days') == 0 ? '-Day' : moment().diff(date4, 'days');

    return (
      //paidMembership: 이용권, salesDays: 기간권
      <>
        {/* paidMembership= true면 이용권 아니면 기간권 */}
        {paidMembership ? (
          <Row className='client-infomation__detail--membership'>
            <Col xs={12}>
              <h4>{kind}</h4>
            </Col>
            <Col xs={12} sm={8}>
              <p>
                이용권: {paidMembership2}/{paidMembership}
              </p>
              <p>이용권 결제일: {date1}</p>
            </Col>
          </Row>
        ) : (
          <Row className='client-infomation__detail--membership'>
            <Col xs={12} sm={8}>
              <h4>{kind}</h4>
              기간권: {salesDays}일 권 [ D{endDays} ]
              <br />
              기간권 결제일: {date2}
              <br />
              기간권 마감일: {date3}
            </Col>
          </Row>
        )}
      </>
    );
  };

  const vocherView2 = () => {
    voucherSelect(client_name, fitness_no).then((res) => {
      // console.log(res);
      const items = res.map((data, index, array) => {
        return (
          <VoucherView2
            kind={data.kind}
            paidMembership={data.paidMembership}
            paidMembership2={data.paidMembership2}
            paymentDate={data.paymentDate}
            salesDays={data.salesDays}
            salesStart_date={data.salesStart_date}
            salesEnd_date={data.salesEnd_date}
          />
        );
      });
      setVoucher2(items);
    });
  };

  return (
    //2 이름-검색페이지
    <TableRow>
      <TableCell onClick={modalOnClick}>{client_name}</TableCell>
      <TableCell onClick={modalOnClick}>{sex == 1 ? '남' : '여'}</TableCell>
      <TableCell onClick={modalOnClick}>{phone}</TableCell>
      <TableCell onClick={modalOnClick}>{newDate}</TableCell>
      <TableCell onClick={modalOnClick}>{lockerNumber}</TableCell>
      <Modal
        className='client_modal'
        show={showModal}
        onHide={modalClose}
        size='xl'
      >
        <Modal.Header className='mb-3'>
          <Modal.Title>회원 상세 정보</Modal.Title>
          {showUpdate ? (
            <Button onClick={modalClose} variant='outline-light'>
              <CloseIcon />
            </Button>
          ) : (
            <Button
              className='border-0'
              onClick={modalClose}
              variant='outline-light'
            >
              <CloseIcon fontSize='large' />
            </Button>
          )}
        </Modal.Header>
        <Modal.Body className='mw-100'>
          <div>
            <CustomerCalendarComponent customer_no={idc} />
          </div>
          <Row className='mt-3 client__modal--information'>
            <Col xs={2}>
              <h5 className='mb-1'>이름</h5>
            </Col>
            {showUpdate ? (
              <Col xs={10}>
                <Form.Control
                  className='w-50'
                  value={client_name_input}
                  onChange={updateChange1}
                />
              </Col>
            ) : (
              <Col xs={10}>{client_name}</Col>
            )}
            <Col xs={2}>
              <h5 className='mb-1'>생년월일</h5>
            </Col>
            <Col xs={10}>{birth}</Col>
            <Col xs={2} className='mb-2'>
              <h5 className='mb-1'>연락처</h5>
            </Col>
            {showUpdate ? (
              <Col xs={10}>
                <Form.Control
                  className='w-50'
                  value={phone_input}
                  onChange={updateChange3}
                />
              </Col>
            ) : (
              <Col xs={10}>{phone}</Col>
            )}
            <Col xs={2} className='mb-2'>
              <h5 className='mb-1'>주소</h5>
            </Col>
            {showUpdate ? (
              <Col xs={10}>
                <Form.Control value={address_input} onChange={updateChange2} />
              </Col>
            ) : (
              <Col xs={10}>{address}</Col>
            )}
            <Col xs={2} className='mb-3'>
              <h5>메모</h5>
            </Col>
            {/* 기능추가:메모로 변경해야함 */}
            {showUpdate ? (
              <Col>
                <Form.Control
                  value={client_name_input}
                  onChange={updateChange1}
                />
              </Col>
            ) : (
              <Col xs={10}>{client_name}</Col>
            )}
            <div className='d-flex justify-content-between'>
              <div className='d-flex justify-content'>
                <h5 className='me-4'>운동복</h5>
                {showUpdate ? (
                  <Form.Group>
                    <Form.Check inline>
                      <Form.Check.Label htmlFor='route1'>
                        미사용
                      </Form.Check.Label>
                      <Form.Check.Input
                        className='mt-3'
                        type='radio'
                        checked={wear_input === '미사용'}
                        onChange={() => setWear_input('미사용')}
                      />
                    </Form.Check>
                    <Form.Check inline>
                      <Form.Check.Label htmlFor='route1'>사용</Form.Check.Label>
                      <Form.Check.Input
                        className='mt-3'
                        type='radio'
                        checked={wear_input === '사용'}
                        onChange={() => setWear_input('사용')}
                      />
                    </Form.Check>
                  </Form.Group>
                ) : (
                  <p>{sportswear}</p>
                )}
              </div>
              <div className='d-flex justify-content mb-3'>
                <h5 className='me-3'>사물함번호</h5>
                {showUpdate ? (
                  <Col xs={2}>
                    <Form.Control
                      type='number'
                      value={locker_input}
                      onChange={updateChange4}
                    />
                  </Col>
                ) : (
                  <p>{lockerNumber}</p>
                )}
              </div>
              <div className='d-flex justify-content'>
                <h5 className='me-3'>가입경로</h5>
                <p>{join_route}</p>
              </div>
            </div>
          </Row>
          <Row>
            <div className='voucher'>
              <div className='d-flex justify-content-between mt-4'>
                <h4>현재 사용중인 이용권</h4>
                <p className='text-primary more' onClick={viewModalOnclick}>
                  + 이용권 전체보기
                </p>
              </div>
              <div>{voucher}</div>
              <div>
                {/* 이용권&기간권 더보기 Modal d-flex justify-content-between */}
                <Modal
                  className='client_modal'
                  show={viewModal}
                  onHide={viewModalClose}
                >
                  <Modal.Header className='p-0'>
                    <Modal.Title>이용권 전체보기</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{voucher2}</Modal.Body>
                </Modal>
              </div>
            </div>
            <div className='text-end text-danger mt-4'>
              {showUpdate ? (
                loginWhether === 1 ? (
                  ''
                ) : (
                  <div>
                    <span className='m-2'>
                      삭제시 되돌릴 수 없습니다 한번 더 확인해주세요
                    </span>
                    <Button
                      variant='outline-danger'
                      onClick={() =>
                        // eslint-disable-next-line no-restricted-globals
                        confirm(
                          client_name +
                            ' 회원을 탈퇴하시겠습니까? \n회원 삭제 시 되돌릴 수 없습니다. \n한번 더 확인해주세요.'
                        ) == true
                          ? deleteCompleted(idc)
                          : alert(client_name + '회원 탈퇴를 취소 하였습니다.')
                      }
                    >
                      삭제
                    </Button>
                  </div>
                )
              ) : (
                ''
              )}
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-center'>
          {showUpdate ? (
            <Button onClick={modalClose} variant='primary-dark'>
              취소
            </Button>
          ) : (
            <Button onClick={modalClose} variant='primary-dark'>
              닫기
            </Button>
          )}
          {showUpdate ? (
            <Button onClick={() => updateCompleted(idc)} variant='primary'>
              완료하기
            </Button>
          ) : (
            <Button onClick={modalUpdate} variant='primary'>
              수정하기
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </TableRow>
  );
};

const ViewClientItem = ({
  joinNo,
  fitness_no,
  client_name,
  phone,
  birth,
  sex,
  join_route,
  address,
  start_date,
  lockerNumber,
  sportswear,
  idc,
  viewClient,
  loginWhether,
}) => {
  const newDate = moment(start_date).format('YYYY년 MM월 DD일');
  const [showModal, setShowModal] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [client_name_input, setClient_name_input] = useState('');
  const [address_input, setAddress_input] = useState('');
  const [phone_input, setPhone_input] = useState('');
  const [locker_input, setLocker_input] = useState(lockerNumber);
  const [wear_input, setWear_input] = useState(sportswear);
  const [voucher, setVoucher] = useState([]);
  const [voucher2, setVoucher2] = useState([]);
  const [viewModal, setViewModal] = useState(false);

  const modalClose = () => {
    setShowModal(false);
    setClient_name_input(client_name);
    setAddress_input(address);
    setPhone_input(phone);
    setShowUpdate(false);
  };
  const modalOnClick = () => {
    setShowModal(true);
    vocherView();
  };
  const modalUpdate = () => {
    setShowUpdate(true);
    setClient_name_input(client_name);
    setAddress_input(address);
    setPhone_input(phone);
  };

  const deleteCompleted = (idc) => {
    deleteClient(idc).then(() => {
      modalClose();
      setShowUpdate(false);
      viewClient();
    });
  };

  const viewModalOnclick = () => {
    setViewModal(true);
    vocherView2();
  };
  const viewModalClose = () => {
    setViewModal(false);
  };

  const updateCompleted = (idc) => {
    if (client_name_input === '') {
      alert('이름을 입력해주세요.');
    } else if (phone_input === '') {
      alert('연락처를 입력해주세요.');
    } else if (address_input === '') {
      alert('주소를 입력해주세요.');
    } else {
      updateClient(
        idc,
        client_name_input,
        phone_input,
        address_input,
        locker_input,
        wear_input
      ).then(() => {
        updateManagerClientTrainer(idc, client_name_input, phone_input).then(
          () => {}
        );
        modalClose();
        setShowUpdate(false);
        viewClient();
      });
    }
  };

  const updateChange1 = (e) => {
    setClient_name_input(e.target.value);
  };
  const updateChange2 = (e) => {
    setAddress_input(e.target.value);
  };
  const updateChange3 = (e) => {
    setPhone_input(e.target.value);
  };
  const updateChange4 = (e) => {
    setLocker_input(e.target.value);
  };
  const handleWear = () => {
    setWear_input('미사용');
  };
  const handleWear2 = () => {
    setWear_input('사용');
  };

  const VoucherView = ({
    kind,
    paidMembership,
    paidMembership2,
    paymentDate,
    salesDays,
    salesStart_date,
  }) => {
    const date1 = moment(paymentDate).format('YYYY년 MM월 DD일');
    const date2 = moment(salesStart_date).format('YYYY년 MM월 DD일');
    const date3 = moment(salesStart_date)
      .add(salesDays, 'days')
      .subtract(1, 'days')
      .format('YYYY년 MM월 DD일');
    const date4 = moment(salesStart_date).add(salesDays, 'days');
    const endDays =
      moment().diff(date4, 'days') == 0 ? '-Day' : moment().diff(date4, 'days');
    const today = moment(new Date()).format('YYYY년 MM월 DD일');
    const date3plus1 = moment(salesStart_date)
      .add(salesDays, 'days')
      .add(1, 'days')
      .subtract(1, 'days')
      .format('YYYY년 MM월 DD일');
    // console.log(today);
    // console.log(date3plus1);
    // console.log(client_name, fitness_no, kind);
    const paidControl = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate(client_name, kind, res[0].paidMembership2 - 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '이용권이 차감됩니다. 잔여 이용권은' +
                    (res[0].paidMembership2 - 1) +
                    '회 입니다.'
                );
              }
            );
          }
        });
      });
    };

    const paidControl2 = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate(client_name, kind, res[0].paidMembership2 + 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '이용권이 증가됩니다. 잔여 이용권은' +
                    (res[0].paidMembership2 + 1) +
                    '회 입니다.'
                );
              }
            );
          }
        });
      });
    };
    //salesControl 비활성화
    const salesControl = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate2(client_name, kind, res[0].salesDays + 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '기간권이 증가됩니다. D - ' +
                    (res[0].salesDays + 1)
                );
              }
            );
          }
        });
      });
    };

    const salesControl2 = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate2(client_name, kind, res[0].salesDays - 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '기간권이 차감됩니다. D - ' +
                    (res[0].salesDays - 1)
                );
              }
            );
          }
        });
      });
    };

    return (
      //paidMembership: 이용권, salesDays: 기간권
      //기간권 이용권 보다 보기좋게 구분
      <>
        {date3plus1 <= today ? (
          ''
        ) : paidMembership ? (
          paidMembership2 === 0 ? (
            ''
          ) : (
            <Row className='client-infomation__detail--membership'>
              <Col xs={9}>
                <Col xs={12}>
                  <h4>{kind}</h4>
                </Col>
                <Col xs={12}>
                  이용권: {paidMembership2}/{paidMembership}
                  <br />
                  이용권 결제일: {date1}
                </Col>
              </Col>
              <Col xs={3}>
                <Col xs={12} sm={4}>
                  <div>
                    <Button
                      className='mb-2'
                      variant='paidControl'
                      onClick={paidControl}
                    >
                      <RemoveIcon />
                      이용권 차감하기
                    </Button>
                  </div>
                  <div>
                    <Button variant='paidControl' onClick={paidControl2}>
                      <AddIcon />
                      이용권 증가하기
                    </Button>
                  </div>
                </Col>
              </Col>
            </Row>
          )
        ) : (
          <Row className='client-infomation__detail--membership'>
            <Col xs={12} sm={8}>
              <h4>{kind}</h4>
              기간권: {salesDays}일 권 [ D{endDays} ]
              <br />
              기간권 결제일: {date2}
              <br />
              기간권 마감일: {date3}
            </Col>
            <Col xs={12} sm={4}>
              {/* <Button onClick={salesControl}>+기간권 기간 증가</Button>
            <Button onClick={salesControl2}>-기간권 기간 차감</Button> */}
            </Col>
          </Row>
        )}
      </>
    );
  };

  const vocherView = () => {
    voucherSelect(client_name, fitness_no).then((res) => {
      // console.log(res);
      const items = res.map((data, index, array) => {
        return (
          <VoucherView
            kind={data.kind}
            paidMembership={data.paidMembership}
            paidMembership2={data.paidMembership2}
            paymentDate={data.paymentDate}
            salesDays={data.salesDays}
            salesStart_date={data.salesStart_date}
            salesEnd_date={data.salesEnd_date}
          />
        );
      });
      setVoucher(items);
    });
  };

  const VoucherView2 = ({
    kind,
    paidMembership,
    paidMembership2,
    paymentDate,
    salesDays,
    salesStart_date,
  }) => {
    const date1 = moment(paymentDate).format('YYYY년 MM월 DD일');
    const date2 = moment(salesStart_date).format('YYYY년 MM월 DD일');
    const date3 = moment(salesStart_date)
      .add(salesDays, 'days')
      .subtract(1, 'days')
      .format('YYYY년 MM월 DD일');
    const date4 = moment(salesStart_date).add(salesDays, 'days');
    const endDays =
      moment().diff(date4, 'days') == 0 ? '-Day' : moment().diff(date4, 'days');

    return (
      //paidMembership: 이용권, salesDays: 기간권
      <>
        {/* paidMembership= true면 이용권 아니면 기간권 */}
        {paidMembership ? (
          <Row className='client-infomation__detail--membership'>
            <Col xs={12}>
              <h4>{kind}</h4>
            </Col>
            <Col xs={12}>
              <p>
                이용권: {paidMembership2}/{paidMembership}
              </p>
              <p>이용권 결제일: {date1}</p>
            </Col>
          </Row>
        ) : (
          <Row className='client-infomation__detail--membership'>
            <Col xs={12}>
              <h4>{kind}</h4>
              기간권: {salesDays}일 권 [ D {endDays} ]
              <br />
              기간권 결제일: {date2}
              <br />
              기간권 마감일: {date3}
            </Col>
          </Row>
        )}
      </>
    );
  };

  const vocherView2 = () => {
    voucherSelect(client_name, fitness_no).then((res) => {
      // console.log(res);
      const items = res.map((data, index, array) => {
        return (
          <VoucherView2
            kind={data.kind}
            paidMembership={data.paidMembership}
            paidMembership2={data.paidMembership2}
            paymentDate={data.paymentDate}
            salesDays={data.salesDays}
            salesStart_date={data.salesStart_date}
            salesEnd_date={data.salesEnd_date}
          />
        );
      });
      setVoucher2(items);
    });
  };

  return (
    // 1 페이지
    <TableRow>
      <TableCell onClick={modalOnClick}>{client_name}</TableCell>
      <TableCell onClick={modalOnClick}>{sex == 1 ? '남' : '여'}</TableCell>
      <TableCell onClick={modalOnClick}>{phone}</TableCell>
      <TableCell onClick={modalOnClick}>{newDate}</TableCell>
      <TableCell onClick={modalOnClick}>{lockerNumber}</TableCell>
      <Modal
        className='client_modal'
        show={showModal}
        onHide={modalClose}
        size='xl'
      >
        <Modal.Header className='mb-3'>
          <Modal.Title>회원 상3세 정보</Modal.Title>
          {showUpdate ? (
            <Button onClick={modalClose} variant='outline-light'>
              <CloseIcon />
            </Button>
          ) : (
            <Button
              className='border-0'
              onClick={modalClose}
              variant='outline-light'
            >
              <CloseIcon fontSize='large' />
            </Button>
          )}
        </Modal.Header>
        <Modal.Body className='mw-100'>
          <div>
            <CustomerCalendarComponent customer_no={idc} />
          </div>
          <Row className='mt-3 client__modal--information'>
            <Col xs={2}>
              <h5 className='mb-1'>이름</h5>
            </Col>
            {showUpdate ? (
              <Col xs={10}>
                <Form.Control
                  className='w-50'
                  value={client_name_input}
                  onChange={updateChange1}
                />
              </Col>
            ) : (
              <Col xs={10}>{client_name}</Col>
            )}
            <Col xs={2}>
              <h5 className='mb-1'>생년월일</h5>
            </Col>
            <Col xs={10}>{birth}</Col>
            <Col xs={2} className='mb-2'>
              <h5 className='mb-1'>연락처</h5>
            </Col>
            {showUpdate ? (
              <Col xs={10}>
                <Form.Control
                  className='w-50'
                  value={phone_input}
                  onChange={updateChange3}
                />
              </Col>
            ) : (
              <Col xs={10}>{phone}</Col>
            )}
            <Col xs={2} className='mb-2'>
              <h5 className='mb-1'>주소</h5>
            </Col>
            {showUpdate ? (
              <Col xs={10}>
                <Form.Control value={address_input} onChange={updateChange2} />
              </Col>
            ) : (
              <Col xs={10}>{address}</Col>
            )}
            <Col xs={2} className='mb-3'>
              <h5>메모</h5>
            </Col>
            {/* 기능추가:메모로 변경해야함 */}
            {showUpdate ? (
              <Col>
                <Form.Control
                  value={client_name_input}
                  onChange={updateChange1}
                />
              </Col>
            ) : (
              <Col xs={10}>{client_name}</Col>
            )}
            <div className='d-flex justify-content-between'>
              <div className='d-flex justify-content'>
                <h5 className='me-4'>운동복</h5>
                {showUpdate ? (
                  <Form.Group>
                    <Form.Check inline>
                      <Form.Check.Label htmlFor='route1'>
                        미사용
                      </Form.Check.Label>
                      <Form.Check.Input
                        className='mt-3'
                        type='radio'
                        checked={wear_input === '미사용'}
                        onChange={() => setWear_input('미사용')}
                      />
                    </Form.Check>
                    <Form.Check inline>
                      <Form.Check.Label htmlFor='route1'>사용</Form.Check.Label>
                      <Form.Check.Input
                        className='mt-3'
                        type='radio'
                        checked={wear_input === '사용'}
                        onChange={() => setWear_input('사용')}
                      />
                    </Form.Check>
                  </Form.Group>
                ) : (
                  <p>{sportswear}</p>
                )}
              </div>
              <div className='d-flex justify-content mb-3'>
                <h5 className='me-3'>사물함번호</h5>
                {showUpdate ? (
                  <Col xs={2}>
                    <Form.Control
                      type='number'
                      value={locker_input}
                      onChange={updateChange4}
                    />
                  </Col>
                ) : (
                  <p>{lockerNumber}</p>
                )}
              </div>
              <div className='d-flex justify-content'>
                <h5 className='me-3'>가입경로</h5>
                <p>{join_route}</p>
              </div>
            </div>
          </Row>
          <Row>
            <div className='voucher'>
              <div className='d-flex justify-content-between mt-4'>
                <h4>현재 사용중인 이용권</h4>
                <p className='text-primary more' onClick={viewModalOnclick}>
                  + 이용권 전체보기
                </p>
              </div>
              <div>{voucher}</div>
              <div>
                {/* 이용권&기간권 더보기 Modal d-flex justify-content-between */}
                <Modal
                  className='client_modal'
                  show={viewModal}
                  onHide={viewModalClose}
                >
                  <Modal.Header className='p-0'>
                    <Modal.Title>이용권 전체보기</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{voucher2}</Modal.Body>
                </Modal>
              </div>
            </div>
            <div className='text-end text-danger mt-4'>
              {showUpdate ? (
                loginWhether === 1 ? (
                  ''
                ) : (
                  <div>
                    <span className='m-2'>
                      삭제시 되돌릴 수 없습니다 한번 더 확인해주세요
                    </span>
                    <Button
                      variant='outline-danger'
                      onClick={() =>
                        // eslint-disable-next-line no-restricted-globals
                        confirm(
                          client_name +
                            ' 회원을 탈퇴하시겠습니까? \n회원 삭제 시 되돌릴 수 없습니다. \n한번 더 확인해주세요.'
                        ) == true
                          ? deleteCompleted(idc)
                          : alert(client_name + '회원 탈퇴를 취소 하였습니다.')
                      }
                    >
                      삭제
                    </Button>
                  </div>
                )
              ) : (
                ''
              )}
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-center'>
          {showUpdate ? (
            <Button onClick={modalClose} variant='primary-dark'>
              취소
            </Button>
          ) : (
            <Button onClick={modalClose} variant='primary-dark'>
              닫기
            </Button>
          )}
          {showUpdate ? (
            <Button onClick={() => updateCompleted(idc)} variant='primary'>
              완료하기
            </Button>
          ) : (
            <Button onClick={modalUpdate} variant='primary'>
              수정하기
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </TableRow>
  );
};

class Client extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewClientList: [],
      rowsPerPage: 5,
      page: 0,
      searchOption: options[0],
      search: '',
      client_phone: '',
      clinet_name: '',
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
        this.viewClient();
      }
    });
  }
  viewClient = () => {
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
      clientSelect(fitness_no).then((result) => {
        const items = result.map((data, index, array) => {
          return (
            <ViewClientItem
              joinNo={this.props.userinfo.joinNo}
              fitness_no={data.fitness_no}
              client_name={data.client_name}
              phone={data.phone}
              birth={data.birth}
              sex={data.sex}
              join_route={data.join_route}
              address={data.address}
              start_date={data.start_date}
              lockerNumber={data.lockerNumber}
              sportswear={data.sportswear}
              idc={data.idc}
              viewClient={this.viewClient}
              loginWhether={this.props.userinfo.loginWhether}
            />
          );
        });
        this.setState({ viewClientList: items });
      });
    });
  };

  handleChangeRowsPerPage = (e) => {
    this.setState({ rowsPerPage: e.target.value, page: 0 });
  };

  handleChangePage = (e, newPage) => {
    this.setState({ page: newPage });
  };
  handleChangePage = (e, newPage) => {
    this.setState({ page: newPage });
  };
  handleOnChangeSearchOption = (e) => {
    this.setState({ searchOption: e.value });
  };

  moveClientAdd = () => {
    this.props.history.push('/clientAdd');
  };

  handleOnSearch = () => {
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
      switch (this.state.searchOption) {
        case '핸드폰':
          return searchPhone(fitness_no, this.state.search).then((result) => {
            const items = result.map((data, index, array) => {
              return (
                <ClientPhone
                  joinNo={this.props.userinfo.joinNo}
                  fitness_no={data.fitness_no}
                  client_name={data.client_name}
                  phone={data.phone}
                  birth={data.birth}
                  sex={data.sex}
                  join_route={data.join_route}
                  address={data.address}
                  start_date={data.start_date}
                  lockerNumber={data.lockerNumber}
                  sportswear={data.sportswear}
                  idc={data.idc}
                  viewClient={this.handleOnSearch}
                  loginWhether={this.props.userinfo.loginWhether}
                />
              );
            });
            this.setState({ client_phone: items });
          });
        case '이름':
          return searchClientname(fitness_no, this.state.search).then(
            (result) => {
              const items = result.map((data, index, array) => {
                return (
                  <ClientName
                    joinNo={this.props.userinfo.joinNo}
                    fitness_no={data.fitness_no}
                    client_name={data.client_name}
                    phone={data.phone}
                    birth={data.birth}
                    sex={data.sex}
                    join_route={data.join_route}
                    address={data.address}
                    start_date={data.start_date}
                    lockerNumber={data.lockerNumber}
                    sportswear={data.sportswear}
                    idc={data.idc}
                    viewClient={this.handleOnSearch}
                    loginWhether={this.props.userinfo.loginWhether}
                  />
                );
              });
              this.setState({ clinet_name: items });
            }
          );
      }
    });
  };
  render() {
    // console.log(this.props.userinfo.fitness_no);
    // console.log(this.state.viewClientList);
    return (
      <div className='wrap client_wrap'>
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                회원관리
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/client'>회원</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>
        <Container>
          <h3>회원 목록</h3>
          <div className='d-flex justify-content mb-3'>
            <div className='d-flex sch_list'>
              <Dropdown
                className='searchDrop'
                options={options}
                onChange={this.handleOnChangeSearchOption}
                value={this.state.searchOption}
                placeholder='검색 대상을 선택하세요.'
              />
              <input
                type='text'
                id='search'
                value={this.state.search}
                onChange={(e) => this.setState({ search: e.target.value })}
              />
            </div>
            <div>
              <Button
                className='mx-2'
                variant='primary'
                onClick={this.handleOnSearch}
              >
                검색
              </Button>
            </div>
            <div>
              <Button variant='outline-primary' onClick={this.moveClientAdd}>
                등록하기
              </Button>
            </div>
          </div>
          <Tabs defaultActiveKey='allClient' id='client-tab'>
            <Tab eventKey='allClient' title='전체'>
              <TableContainer component={Paper}>
                <Table
                  className='table--block table-dark'
                  aria-label='simple table'
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>이름</TableCell>
                      <TableCell>성별</TableCell>
                      <TableCell>연락처</TableCell>
                      <TableCell>가입일</TableCell>
                      <TableCell>사물함번호</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.client_phone
                      ? this.state.client_phone.slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )
                      : this.state.clinet_name
                      ? this.state.clinet_name.slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )
                      : this.state.viewClientList.slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )}
                  </TableBody>
                </Table>
                {this.state.viewClientList.length === 0 ? (
                  <div className='p-3 fs-5 fw-bold text-center'>
                    <TbMoodSuprised className='fs-3' />
                    <p>등록된 회원이 없습니다.</p>
                  </div>
                ) : (
                  ''
                )}
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    {
                      label: 'All',
                      value: this.state.viewClientList.length,
                    },
                  ]}
                  count={this.state.viewClientList.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onPageChange={this.handleChangePage}
                  onRowsPerPageChange={this.handleChangeRowsPerPage}
                />
              </TableContainer>
            </Tab>
            <Tab eventKey='activeClient' title='유효회원'>
              <TableContainer component={Paper}>
                <Table
                  className='table--block table-dark'
                  aria-label='simple table'
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>이름</TableCell>
                      <TableCell>성별</TableCell>
                      <TableCell>연락처</TableCell>
                      <TableCell>가입일</TableCell>
                      <TableCell>사물함번호</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.client_phone
                      ? this.state.client_phone.slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )
                      : this.state.clinet_name
                      ? this.state.clinet_name.slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )
                      : this.state.viewClientList.slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )}
                  </TableBody>
                </Table>
                {this.state.viewClientList.length === 0 ? (
                  <div className='p-3 fs-5 fw-bold text-center'>
                    <TbMoodSuprised className='fs-3' />
                    <p>등록된 회원이 없습니다.</p>
                  </div>
                ) : (
                  ''
                )}
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    {
                      label: 'All',
                      value: this.state.viewClientList.length,
                    },
                  ]}
                  count={this.state.viewClientList.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onPageChange={this.handleChangePage}
                  onRowsPerPageChange={this.handleChangeRowsPerPage}
                />
              </TableContainer>
            </Tab>
            <Tab eventKey='warningClient' title='마감임박'>
              <TableContainer component={Paper}>
                <Table
                  className='table--block table-dark'
                  aria-label='simple table'
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>이름</TableCell>
                      <TableCell>성별</TableCell>
                      <TableCell>연락처</TableCell>
                      <TableCell>가입일</TableCell>
                      <TableCell>사물함번호</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.client_phone
                      ? this.state.client_phone.slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )
                      : this.state.clinet_name
                      ? this.state.clinet_name.slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )
                      : this.state.viewClientList.slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )}
                  </TableBody>
                </Table>
                {this.state.viewClientList.length === 0 ? (
                  <div className='p-3 fs-5 fw-bold text-center'>
                    <TbMoodSuprised className='fs-3' />
                    <p>등록된 회원이 없습니다.</p>
                  </div>
                ) : (
                  ''
                )}
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    {
                      label: 'All',
                      value: this.state.viewClientList.length,
                    },
                  ]}
                  count={this.state.viewClientList.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onPageChange={this.handleChangePage}
                  onRowsPerPageChange={this.handleChangeRowsPerPage}
                />
              </TableContainer>
            </Tab>
            <Tab eventKey='endClient' title='마감'>
              <TableContainer component={Paper}>
                <Table
                  className='table--block table-dark'
                  aria-label='simple table'
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>이름</TableCell>
                      <TableCell>성별</TableCell>
                      <TableCell>연락처</TableCell>
                      <TableCell>가입일</TableCell>
                      <TableCell>사물함번호</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.client_phone
                      ? this.state.client_phone.slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )
                      : this.state.clinet_name
                      ? this.state.clinet_name.slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )
                      : this.state.viewClientList.slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )}
                  </TableBody>
                </Table>
                {this.state.viewClientList.length === 0 ? (
                  <div className='p-3 fs-5 fw-bold text-center'>
                    <TbMoodSuprised className='fs-3' />
                    <p>등록된 회원이 없습니다.</p>
                  </div>
                ) : (
                  ''
                )}
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    {
                      label: 'All',
                      value: this.state.viewClientList.length,
                    },
                  ]}
                  count={this.state.viewClientList.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onPageChange={this.handleChangePage}
                  onRowsPerPageChange={this.handleChangeRowsPerPage}
                />
              </TableContainer>
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
const ClientStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const ClientDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(ClientStateToProps, ClientDispatchToProps)(Client);
