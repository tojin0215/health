import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { SERVER_URL } from '../../const/settings';
import { useHistory } from 'react-router-dom';

// React-Bootstrap https://react-bootstrap.github.io
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
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

  const handleChange = (event) => {
    setState(event.target.value);
  };

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
      sx={{ width: 500 }}
      role='presentation'
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      <h3>2022년 10월 19일 (수요일)</h3>
      <FormControl fullWidth>
        <InputLabel id='demo-simple-select-label'>Age</InputLabel>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          label='Age'
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      {['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map(
        (time) => (
          <React.Fragment key={time}>
            <div>
              <Row>
                <Col xs={2}>{time}</Col>
                <Col xs={10}>
                  <ul>
                    <li>
                      <Row>
                        <Col xs={2}>{time}</Col>
                        <Col>그룹필라테스 [8/10]</Col>
                        <Col xs={3}>윤강사님</Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={2}>{time}</Col>
                        <Col>그룹필라테스 [8/10]</Col>
                        <Col xs={3}>윤강사님</Col>
                      </Row>
                    </li>
                  </ul>
                </Col>
              </Row>
            </div>
          </React.Fragment>
        )
      )}
      <Button onClick={goReservation}>시간표 전체보기</Button>
    </Box>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button variant='secondary' onClick={toggleDrawer(anchor, true)}>
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
