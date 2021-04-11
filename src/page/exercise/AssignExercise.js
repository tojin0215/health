import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

import {getStatusRequest} from '../../action/authentication';

// import './Exercise.css';
// userinfo = {
    // useridx: 1,
    // username: "박재진",
    // fitnessidx: 1,
    // fitnessname: "투진헬스장"
// }

const ip = '13.124.141.28';
class AssignExercise extends Component {
    goLogin = () => {
        this.props.history.push("/");
    }
    componentDidMount() { //컴포넌트 렌더링이 맨 처음 완료된 이후에 바로 세션확인
        // get cookie by name
        function getCookie(name) {
            var value = "; " + document.cookie; 
            var parts = value.split("; " + name + "="); 
            if (parts.length == 2) return parts.pop().split(";").shift();
        }
   
        // get loginData from cookie
        let loginData = getCookie('key');
        // if loginData is undefined, do nothing
        if(typeof loginData === "undefined"){
            this.props.history.push('/');
            return;
        } 
   
        // decode base64 & parse json
        loginData = JSON.parse(atob(loginData));
        // if not logged in, do nothing
        if(!loginData.isLoggedIn){
            this.props.history.push('/');
            return;
        } 
   
        // page refreshed & has a session in cookie,
        // check whether this cookie is valid or not
        this.props.getStatusRequest().then(
            () => {
                // if session is not valid
                if(!this.props.status.valid) {
                    // logout the session
                    loginData = {
                        isLoggedIn: false,
                        id: ''
                    };
   
                    document.cookie='key=' + btoa(JSON.stringify(loginData));
   
                    // and notify
                    alert("Your session is expired, please log in again")
                }
            }
        );
    }

    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); //나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음
        
        return (
            <div>
            <Header />
            <Navigation goLogin={this.goLogin}/>
            <div className='title'>
                <div className='titleIn'>
                    <h2>운동 배정</h2><h4>운동 {'>'} 운동 배정</h4>
                </div>
            </div>
            <div className='container'>
                <NavLink exact to="/assign">[운동 배정 설정]</NavLink>
                <Link to={{pathname:"/assign/inbody?member_no="+0}}>[고객인바디]</Link>
            
                <div>
                <input placeholder="검색" /><button>돋보기</button>
                </div>

                <p><h1>{userinfo.username}</h1> 회원님</p>
                <p><h1>{new Date().toLocaleString()}</h1> 운동 배정입니다.</p>
                <br />
                <div>운동 배정</div>
                <hr />
                <div>
                    <div>
                        <label>운동 부위
                            
                        <button>상체</button>
                            <button>하체</button>
                            <button>코어</button>
                            <button>전신</button>
                            <button>유산소</button>
                        </label>
                    </div>
                    <div>
                        <label>운동 강도

                        <button>쉬움</button>
                        <button>보통</button>
                        <button>어려움</button>
                        </label>
                    </div>
                    <div>
                        <label>
                            운동 묶음
                            <button>운동 묶음을 선택하세요</button>
                        </label>
                        
                    </div>
                    <div>
                        <label>운동 내용
                            <div>
                            <table>
                                <caption>운동 내용</caption>
                                <thead>
                                    <tr>
                                        <th>운동 이름</th>
                                        <th>사용 기구</th>
                                        <th>횟수/시간</th>
                                        <th>휴식 시간</th>
                                        <th>세트 갯수</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>유산소 운동 A</td>
                                        <td>러닝머신</td>
                                        <td>10 분</td>
                                        <td>0 초</td>
                                        <td>1 세트</td>
                                    </tr>
                                    <tr>
                                        <th>상체 운동 2</th>
                                        <td>없음</td>
                                        <td>5 회</td>
                                        <td>10 초</td>
                                        <td>3 세트</td>
                                    </tr>
                                    <tr>
                                        <th>상체 운동 3</th>
                                        <td>기구 2</td>
                                        <td>10 회</td>
                                        <td>10 초</td>
                                        <td>3 세트</td>
                                        
                                    </tr>
                                    <tr>
                                        <th>유산소 운동 4</th>
                                        <td>러닝머신</td>
                                        <td>15 분</td>
                                        <td>60 초</td>
                                        <td>2 세트</td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                        </label>
                    </div>

                </div>
                <br />
                <button>배정하기</button>
            </div>
        </div>
        );
    }
}

const AssignExerciseStateToProps = (state) => {
    return {
      userinfo: state.authentication.userinfo,
      status: state.authentication.status
    }
}

const AssignExerciseDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
    };
};

export default connect(AssignExerciseStateToProps, AssignExerciseDispatchToProps)(AssignExercise);
//새 page 추가 시 guide : 이 폴더 안에 페이지 하나 더 만든 후, src/component/app.js && src/page/index 함께 변경해주세요
//잘 모르겠으면 customer폴더 참고