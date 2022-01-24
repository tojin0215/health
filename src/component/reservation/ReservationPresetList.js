import React, {useEffect, useState} from "react";
import DataTable from 'react-data-table-component';

const columns = [
    {
        name: '운동명',
        selector: row => row.exercise_class,
    },
    {
        name: '제한 인원 수',
        selector: row => row.number_of_people,
    },
];



const ReservationPresetList = ({reservationClass}) => {

    return (
        <DataTable
            columns={columns}
            data={reservationClass}
        />
    );
}

export default ReservationPresetList;