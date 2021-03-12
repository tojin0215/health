import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import './Exercise.css';
// userinfo = {
    // useridx: 1,
    // username: "박재진",
    // fitnessidx: 1,
    // fitnessname: "투진헬스장"
// }

class Exercise extends Component {
    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); //나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음
        
        return (
            <div>
            <Header />
            <Navigation />
            <div className='title'>
                <div className='titleIn'>
                    <h2>운동 설정</h2><h4>운동 {'>'} 운동 설정</h4>
                </div>
            </div>
            <div className='container'>
                <NavLink exact to="/exercise">[운동 설정]</NavLink>
                <NavLink exact to="/exercise/package">[운동 묶음 설정]</NavLink>
                <NavLink exact to="/exercise/assign">[운동 배정 설정]</NavLink>
            
                <div className='subTitle'>운동 정보 입력</div>
                <hr />
                <form className='input-exercise'>
                    
                    <div className="input-row">
                        <label className="label-description">운동 이름</label>
                        <input placeholder="name" />
                    </div>
                    
                    <div className="input-row">
                        <label className="label-description">부위</label>
                        <div className="part">
                            <div className="checkbox">
                                <input type="checkbox"></input>
                                <div className="text">상체</div>
                            </div>
                            <div className="checkbox">
                                <input type="checkbox"></input>
                                <div className="text">하체</div>
                            </div>
                            <div className="checkbox">
                                <input type="checkbox"></input>
                                <div className="text">코어</div>
                            </div>
                            
                            <div className="checkbox">
                                <input type="checkbox"></input>
                                <div className="text">전신</div>
                            </div>
                            <div className="checkbox">
                                <input type="checkbox"></input>
                                <div className="text">유산소</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="input-row">
                        <label className="label-description">운동 기구</label>
                        <input placeholder="machine" />
                    </div>
                    <div className="input-row">
                        <label className="label-description">영상 링크</label>
                        <input placeholder="link" />
                    </div>
                </form>
                <button type="submit">저장하기</button>
                
                <br />
                <div className="table">
                    <input placeholder="search" />
                    <table>
                        <caption>운동 테이블</caption>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>이름</th>
                                <th>운동 기구</th>
                                <th>운동 부위</th>
                                <th>링크</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>데드 리프트</td>
                                <td>바벨</td>
                                <td>상체</td>
                                <td><a>Link...</a></td>
                            </tr>
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
        );
    }
}

const ExerciseStateToProps = (state) => {
    return {
      userinfo: state.userinfo
    }
}

export default connect(ExerciseStateToProps, undefined)(Exercise);
//새 page 추가 시 guide : 이 폴더 안에 페이지 하나 더 만든 후, src/component/app.js && src/page/index 함께 변경해주세요
//잘 모르겠으면 customer폴더 참고

//와 멋져요