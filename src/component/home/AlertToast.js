import React, { useState, useEffect } from 'react';
import { Toast } from 'react-bootstrap';

import axios from 'axios';
import { SERVER_URL } from '../../const/settings';
import moment from 'moment';

import styles from './alerttoast.css';

const AlertItem = ({ value }) => {
	const [show, setShow] = useState(!value.confirm);

	const handleClose = (event) => {
		setShow(false);
		axios
			.put(`${SERVER_URL}/alerts`, {
				fitness_no: value.fitness_no,
				member_no: value.member_no,
				alert_id: value.alert_id,
			})
			.then((response) => {
				console.log(response);
				console.log(value);
			});
	};

	return (
		<Toast show={show} onClose={handleClose}>
			<Toast.Header className='d-flex justify-content-between align-items-center'>
				<h3 className='mr-auto fw-bold fs-2 p-3 border-0'>
					호출
					<span className='fs-4 px-3'>
						{moment(value.createdAt).add(9, 'hours').format('hh:mm:ss')}
					</span>
				</h3>
			</Toast.Header>
			<Toast.Body className='px-5 py-4 fs-3'>{value.text}</Toast.Body>
		</Toast>
	);
};

const AlertToastComponent = ({ fitness_no }) => {
	const [alerts, setAlerts] = useState([]);
	const original_pathname = window.location.pathname;

	const load_alerts = () => {
		axios
			.get(`${SERVER_URL}/alerts`, { params: { fitness_no } })
			.then((response) => response.data)
			.then((res) => {
				setAlerts(
					res.map((value) => <AlertItem value={value} key={value.alert_id} />)
				);
			});
	};

	useEffect(() => {
		setTimeout(function tick() {
			if (window.location.pathname === original_pathname) {
				load_alerts();
				setTimeout(tick, 1000);
			}
		}, 500);
	}, []);

	return <div>{alerts}</div>;
};

export default AlertToastComponent;
