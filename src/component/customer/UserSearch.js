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
  getCustomerByName,
  getCustomerByPhone,
  getCustomerByProfileName,
} from '../../api/user';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const options = ['이름', '핸드폰', '프로필(미지원)'];

const UserSearchTableHeader = () => (
  <TableHead>
    <TableRow>
      <TableCell align='center'>번호</TableCell>
      <TableCell>이름</TableCell>
      <TableCell>폰번호</TableCell>
      <TableCell>선택</TableCell>
    </TableRow>
  </TableHead>
);

const UserSearchTableItem = ({ c, handleSelectUser }) => (
  <TableRow>
    <TableCell align='center'>{c.member_no}</TableCell>
    <TableCell>{c.name}</TableCell>
    <TableCell>
      {/* {c.phone} */}
      {c.phone.slice(0, 3) + '-' + c.phone.slice(3, 7) + '-' + c.phone.slice(7)}
    </TableCell>
    <TableCell>
      <DialogActions className='p-0'>
        <Button
          type='button'
          onClick={handleSelectUser}
          id={c.member_no}
          value={[c.name, c.phone]}
          variant='outline-primary'
        >
          선택
        </Button>
      </DialogActions>
    </TableCell>
  </TableRow>
);

const UserSearch = ({ open, setOpen, fitness_no, handleUser }) => {
  const [searchOption, setSearchOption] = useState(options[0]);
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([]);

  const handleClose = () => setOpen(false);
  const handleOnChangeSearchOption = (e) => setSearchOption(e.value);

  const handleOnSearch = () => {
    switch (searchOption) {
      case '이름':
        return getCustomerByName(search, fitness_no).then((result) =>
          setCustomers(result)
        );
      case '핸드폰':
        return getCustomerByPhone(search, fitness_no).then((result) =>
          setCustomers(result)
        );
      case '담당자':
        // eslint-disable-next-line no-undef
        return getCustomerByManager(search, fitness_no).then((result) =>
          setCustomers(result)
        );
      case '주민번호(앞자리)':
        // 'getCustomerByResiNo' is not defined  no-undef
        // eslint-disable-next-line no-undef
        return getCustomerByResiNo(search, fitness_no).then((result) =>
          setCustomers(result)
        );
      case '프로필':
        return getCustomerByProfileName(search, fitness_no).then((result) =>
          setCustomers(result)
        );
    }
  };

  const handleSelectUser = (e) => {
    handleUser(
      customers.filter((item) => item.member_no === Number(e.target.id))[0]
    );
  };

  useEffect(() => {
    getCustomerByName(search, fitness_no).then((result) =>
      setCustomers(result)
    );
  }, []);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>고객 검색</DialogTitle>
      <DialogContent>
        <Row>
          <Col xs={3}>
            <Dropdown
              className='searchDrop'
              options={options}
              onChange={handleOnChangeSearchOption}
              value={searchOption}
              placeholder='검색 대상을 선택하세요.'
            />
          </Col>
          <Col xs={6}>
            <input
              className='w-100 h-100'
              type='text'
              id='search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col xs={3}>
            <Button
              className='w-100 h-100'
              type='button'
              onClick={handleOnSearch}
            >
              고객 검색
            </Button>
          </Col>
        </Row>
        <Table size='small' className='addsalesSearchTable'>
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
