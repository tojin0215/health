import React, { useState, useEffect } from 'react';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import { Row, Col, Form } from 'react-bootstrap';
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
import { searchTrainername, searchTrainerPhone } from '../../api/user';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
/* icon */
import { BsCheckLg } from 'react-icons/bs';
import { FaSearch } from 'react-icons/fa';

// css
import './UserSearch.css';

const options = ['이름', '핸드폰'];

const UserSearchTableHeader = () => (
  <TableHead>
    <TableRow>
      <TableCell align='center'>번호</TableCell>
      <TableCell align='center'>이름</TableCell>
      <TableCell align='center'>폰번호</TableCell>
      <TableCell align='center'>성별</TableCell>
      <TableCell align='center'>선택</TableCell>
    </TableRow>
  </TableHead>
);

const UserSearchTableItem = ({ c, handleSelectUser }) => (
  <TableRow>
    <TableCell align='center'>{c.idx}</TableCell>
    <TableCell>{c.trainer_name}</TableCell>
    <TableCell>
      {/* {c.phone} */}
      {c.phone.slice(0, 3) + '-' + c.phone.slice(3, 7) + '-' + c.phone.slice(7)}
    </TableCell>
    <TableCell>{c.sex == 1 ? '남자' : '여자'}</TableCell>
    <TableCell className='user-search__select--tr'>
      <DialogActions className='p-0'>
        <Button
          className='user-search__select'
          onClick={handleSelectUser}
          id={c.idx}
          value={[c.trainer_name, c.phone]}
          variant='outline-success'
        >
          <BsCheckLg
            onClick={handleSelectUser}
            id={c.idx}
            value={[c.trainer_name, c.phone]}
          />
        </Button>
      </DialogActions>
    </TableCell>
  </TableRow>
);

const TrainerSearch = ({ open, setOpen, fitness_no, handleUser }) => {
  const [searchOption, setSearchOption] = useState(options[0]);
  const [search, setSearch] = useState('');
  const [trainers, setTrainers] = useState([]);

  const handleClose = () => setOpen(false);
  const handleOnChangeSearchOption = (e) => setSearchOption(e.value);

  const handleOnSearch = () => {
    switch (searchOption) {
      case '핸드폰':
        return searchTrainerPhone(fitness_no, search).then((result) => {
          setTrainers(result);
        });
      case '이름':
        return searchTrainername(fitness_no, search).then((result) =>
          setTrainers(result)
        );
    }
  };

  const handleSelectUser = (e) => {
    handleUser(trainers.filter((item) => item.idx === Number(e.target.id))[0]);
  };

  useEffect(() => {
    searchTrainername(fitness_no, search).then((result) => setTrainers(result));
  }, []);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      className='trainers-search'
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
    >
      <DialogTitle>
        <h4>강사 검색</h4>
      </DialogTitle>
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
          <Col xs={12} md={7} className='user-search__utill__classification'>
            <Form.Group>
              <Form.Control
                placeholder='강사를 검색하세요'
                type='text'
                id='search'
                className=''
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={2} className='mt-2'>
            <Button
              /*  className='w-100 h-100' */
              variant='success'
              onClick={handleOnSearch}
            >
              <FaSearch />
            </Button>
          </Col>
        </Row>
        <Table size='small' className='user-search__table table--block '>
          <UserSearchTableHeader />
          <TableBody>
            {trainers ? (
              trainers.map((c) => (
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

export default TrainerSearch;
