import React, {useState, useEffect} from "react";

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from "axios";
import { SERVER_URL } from "../../const/settings";


const options = ['이름', '핸드폰'];


const UserSearch = ({open, setOpen, fitness_no, handleUser}) => {
    const [searchOption, setSearchOption] = useState(options[0]);
    const [search, setSearch] = useState("");
    const [customers, setCustomers] = useState([]);

    const handleClose = () => setOpen(false);
    const handleOnChangeSearchOption = (e) => setSearchOption(e.value);

    const handleOnSearch = () => {
        const body = {
            type: "search",
            search: search,
            fn: fitness_no
        }
        if (searchOption === "이름") body.type += "0"
        else if (searchOption === "핸드폰") body.type += "1"

        axios.get(`${SERVER_URL}/customer`, {params: body})
        .then(response => response.data)
        .then(result => setCustomers(result))
    }

    const handleSelectUser = (e) => {
        handleUser(customers.filter(item => item.member_no === Number(e.target.id))[0]);
    }

    return (<Dialog
    open={open}
    onClose={handleClose}
    maxWidth='lg'
    >
        <DialogTitle>고객 검색</DialogTitle>
        <DialogContent>
            <div className='customerSearch'>
                <Dropdown
                    className='searchDrop'
                    options={options}
                    onChange={handleOnChangeSearchOption}
                    value={searchOption}
                    placeholder='검색 대상을 선택하세요.'
                />
                {/*.searchDrop */}
                <input
                    type='text'
                    id='search'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                {/*#search */}
                <button type='button' onClick={handleOnSearch}>
                    고객 검색
                </button>
            </div>
            {/*.customerSearch */}
            <Table className='addsalesSearchTable'>
                <TableHead>
                    <TableRow>
                        <TableCell>번호</TableCell>
                        <TableCell>이름</TableCell>
                        <TableCell>폰번호</TableCell>
                        <TableCell>선택</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {customers ? (
                        customers.map((c) => (
                            <TableRow>
                                <TableCell>{c.member_no}</TableCell>
                                <TableCell>{c.name}</TableCell>
                                <TableCell>{c.phone}</TableCell>
                                <TableCell>
                                    <DialogActions>
                                        <button
                                            type='button'
                                            onClick={handleSelectUser}
                                            id={c.member_no}
                                            value={[c.name, c.phone]}
                                        >
                                            선택
                                        </button>
                                    </DialogActions>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan='6' align='center'></TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </DialogContent>
        <DialogActions><button type='button' onClick={handleClose}>닫기</button></DialogActions>
    </Dialog>)
}

export default UserSearch;