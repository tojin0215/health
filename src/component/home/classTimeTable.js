import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { SERVER_URL } from '../../const/settings';
import { useHistory } from 'react-router-dom';

// React-Bootstrap https://react-bootstrap.github.io
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

// Mui 컴포넌트 https://mui.com
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// 아이콘
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// css
import './classTimeTable.css';

export default function ClassTimeTable() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const history = useHistory();

  const goReservation = () => {
    history.push('/reservation');
  };

  // const handleChange = (event) => {
  //   setState(event.target.value);
  // };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      className='class-time-table__box'
      sx={{ width: 500 }}
      role='presentation'
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      <h4>2022년 10월 19일 (수요일)</h4>
      <FormControl
        className='class-time-table__select'
        variant='filled'
        fullWidth
      >
        <InputLabel id='demo-simple-select-label'>수업 분류 선택</InputLabel>
        <Select
          labelId='demo-simple-select-label'
          id='class-time-table__select-id'
          label='수업 분류 선택'
          // onChange={handleChange}
        >
          <MenuItem value={10}>개인PT</MenuItem>
          <MenuItem value={20}>필라테스</MenuItem>
          <MenuItem value={30}>GX</MenuItem>
          <MenuItem value={40}>기타</MenuItem>
        </Select>
      </FormControl>
      <div className='class-time-table__box__content'>
        {['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map(
          (time) => (
            <React.Fragment key={time}>
              <Row>
                <Col xs={2}>{time}</Col>
                <Col xs={10}>
                  <ul>
                    <li>
                      <Row>
                        <Col xs={2}>{time}</Col>
                        <Col>
                          <span>그룹필라테스</span> [8/10]
                        </Col>
                        <Col xs={3}>김유리</Col>
                      </Row>
                    </li>
                    <li>
                      <Row className='class-time-table__box__content--full'>
                        <Col xs={2}>{time}</Col>
                        <Col>
                          <span>2인 필라테스</span> [2/2]
                        </Col>
                        <Col xs={3}>한세연</Col>
                      </Row>
                    </li>
                    <li>
                      <Row className='class-time-table__box__content--full'>
                        <Col xs={2}>{time}</Col>
                        <Col>
                          <span>기구 필라테스</span> [3/3]
                        </Col>
                        <Col xs={3}>이세영</Col>
                      </Row>
                    </li>
                  </ul>
                </Col>
              </Row>
            </React.Fragment>
          )
        )}
      </div>
      <Button onClick={goReservation}>시간표 전체보기</Button>
    </Box>
  );

  return (
    <div className='class-time-table'>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            className='class-time-table__btn'
            variant='secondary'
            onClick={toggleDrawer(anchor, true)}
          >
            <CalendarMonthIcon />
            시간표
          </Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
