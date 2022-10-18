import React, { useState, useEffect } from 'react';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import { Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  clientSelect,
  getCustomerByName,
  getCustomerByPhone,
  getCustomerByProfileName,
  searchClientname,
  searchPhone,
  selectTrainerReservation,
} from '../../api/user';

import Form from 'react-bootstrap/Form';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { BsCheckLg } from 'react-icons/bs';
import { FaSearch } from 'react-icons/fa';
import SearchIcon from '@mui/icons-material/Search';

// css
import './UserSearch.css';

const options = ['이름', '핸드폰'];

const UserSearchTableHeader = () => (
  <TableHead>
    <TableRow>
      <TableCell align='center'>번호</TableCell>
      <TableCell>이름</TableCell>
      <TableCell>폰번호</TableCell>
      <TableCell>성별</TableCell>
      <TableCell align='center'>선택</TableCell>
    </TableRow>
  </TableHead>
);

const UserSearchTableItem = ({ c, handleSelectUser }) => (
  <TableRow>
    <TableCell align='center'>{c.idc}</TableCell>
    <TableCell>{c.client_name}</TableCell>
    <TableCell>
      {/* {c.phone} */}
      {c.phone.slice(0, 3) + '-' + c.phone.slice(3, 7) + '-' + c.phone.slice(7)}
    </TableCell>
    <TableCell>{c.sex === 1 ? '남자' : '여자'}</TableCell>
    <TableCell className='user-search__select--tr'>
      <DialogActions className='p-0'>
        <Button
          className='user-search__select'
          onClick={handleSelectUser}
          id={c.idc}
          value={[c.client_name, c.phone]}
          variant='outline-success'
        >
          <BsCheckLg
            onClick={handleSelectUser}
            id={c.idc}
            value={[c.client_name, c.phone]}
          />
        </Button>
      </DialogActions>
    </TableCell>
  </TableRow>
);

const UserSearch = ({
  open,
  setOpen,
  fitness_no,
  handleUser,
  loginWhether,
  joinNo,
}) => {
  const [searchOption, setSearchOption] = useState(options[0]);
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([]);

  const handleClose = () => setOpen(false);
  const handleOnChangeSearchOption = (e) => setSearchOption(e.value);

  // const handleOnSearch = () => {
  //   switch (searchOption) {
  //     case '이름':
  //       return getCustomerByName(search, fitness_no).then((result) =>
  //         setCustomers(result)
  //       );
  //     case '핸드폰':
  //       return getCustomerByPhone(search, fitness_no).then((result) =>
  //         setCustomers(result)
  //       );
  //     case '담당자':
  //       // eslint-disable-next-line no-undef
  //       return getCustomerByManager(search, fitness_no).then((result) =>
  //         setCustomers(result)
  //       );
  //     case '주민번호(앞자리)':
  //       // 'getCustomerByResiNo' is not defined  no-undef
  //       // eslint-disable-next-line no-undef
  //       return getCustomerByResiNo(search, fitness_no).then((result) =>
  //         setCustomers(result)
  //       );
  //     case '프로필':
  //       return getCustomerByProfileName(search, fitness_no).then((result) =>
  //         setCustomers(result)
  //       );
  //   }
  // };
  const handleOnSearch = () => {
    switch (searchOption) {
      case '핸드폰':
        return selectTrainerReservation(joinNo ? joinNo : '').then(
          (trainerResult) => {
            searchPhone(
              loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no,
              search
            ).then((result) => setCustomers(result));
          }
        );
      case '이름':
        return selectTrainerReservation(joinNo ? joinNo : '').then(
          (trainerResult) => {
            searchClientname(
              loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no,
              search
            ).then((result) => setCustomers(result));
          }
        );
    }
  };

  const handleSelectUser = (e) => {
    handleUser(customers.filter((item) => item.idc === Number(e.target.id))[0]);
    // console.log(
    //   'handleUser',
    //   customers.filter((item) => item.idc === Number(e.target.id))[0]
    // );
  };

  useEffect(() => {
    selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
      clientSelect(
        loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no
      ).then((result) => setCustomers(result));
    });
  }, []);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      className='user-search'
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
    >
      <DialogTitle>회원 검색</DialogTitle>
      <DialogContent>
        <Row className='user-search__utill'>
          <Col xs={12} md={3} className=''>
            <Dropdown
              className='searchDrop'
              options={options}
              onChange={handleOnChangeSearchOption}
              value={searchOption}
              placeholder='검색 대상을 선택하세요.'
            />
          </Col>
          {/* <Col xs={9}>
            <Paper
              component='form'
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder='회원을 검색하세요'
                // className='w-100 h-100'
                type='text'
                id='search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <IconButton
                sx={{ p: '10px' }}
                aria-label='search'
                onClick={handleOnSearch}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Col> */}
          <Col xs={12} md={7} className='user-search__utill__classification'>
            <Form.Group>
              <Form.Control
                placeholder='회원을 검색하세요'
                type='text'
                id='search'
                className=''
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={2} className='mt-2'>
            <Button onClick={handleOnSearch} variant='success'>
              <FaSearch />
            </Button>
          </Col>
        </Row>
        <Table size='small' className='user-search__table table--block'>
          <UserSearchTableHeader />
          <TableBody>
            {customers ? (
              customers.map((c) => (
                <UserSearchTableItem
                  c={c}
                  handleSelectUser={handleSelectUser}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan='6'></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button
          type='button'
          onClick={handleClose}
          variant='secondary'
          className='px-5'
        >
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserSearch;
