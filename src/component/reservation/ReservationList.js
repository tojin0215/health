import React from "react";
import DataTable from 'react-data-table-component';
import moment from 'moment';


const columns = [
    {
        name: '회원이름',
        selector: row => row.customer_name,
    },
    {
        name: '날짜',
        selector: row => moment(row.date).format("YYYY년 MM월 DD일"),
    },
    {
        name: '시간',
        selector: row => `${row.time}:00`,
    },
    {
        name: '운동명',
        selector: row => row.exercise_name,
    },
    {
        name: '상태',
        selector: row => row.isCancel == null ? '예약 완료' : '예약 취소',
    },
    {
        name: '취소사유',
        selector: row => row.cancelComment,
    },
    {
        name: '인원수',
        selector: row => row.number_of_peopleFountain == 0 ? "제한없음" : (row.number_of_peopleFountain + "/" + row.number_of_people),
    },
    {
        name: '---',
        selector: row => <button onClick={() => reservationDelete(row.res_no)}>삭제</button>
    }
];



const ReservationList = ({reservation}) => {

    return (
        <DataTable
            columns={columns}
            data={reservation}
        />
    );
}

export default ReservationList;