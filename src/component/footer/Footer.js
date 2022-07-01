import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <div className='footerIn'>
        <p className='copy'>COPYRIGHT 2022 DIVVY ALL RIGHT RESERVED.</p>
        <div className='footerUtill'>
          <a href='#'>개인정보 처리방침</a>
          <a href='#'>웹사이트 이용 약관</a>
          <a href='#'>법적 고지</a>
        </div>
        <div className='footerCompany'>
          <span>사업자등록번호 : 312-81-12345</span>
          <a href='#'>
            <span>사업자정보확인</span>
          </a>
          <span>대표이사 : 박재진</span>
          <span>주소 : (우)47243 부산광역시 부산진구 서전로37번길 51</span>
          <span>대표 이메일 : bus0215@hanmail.net</span>
        </div>
      </div>
    );
  }
}

export default Footer;
