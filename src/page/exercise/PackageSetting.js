import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';

// userinfo = {
    // useridx: 1,
    // username: "박재진",
    // fitnessidx: 1,
    // fitnessname: "투진헬스장"
// }

class PackageSetting extends Component {
    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); //나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음
        
        return (
            <div>
            <Header />
            <Navigation />
            <div className='container'>
                <div className='title'>
                <h2>운동 묶음 설정</h2><h4>운동{'>'}운동 묶음 설정</h4>
                </div>

                <div className="ExercisePackageSelect">
                    <div>운동 묶음 선택</div>
                    <hr />
                    <div>
                        <input placeholder="운동 묶음 선택하기"></input>
                        <button>확인</button>
                        <button>추가하기</button>
                    </div>
                </div>
                <div className="ExercisePackageSetting">
                    <p>운동 묶음 설정</p>
                    <hr />
                    <div>
                        <label>묶음 이름
                            <input placeholder="묶음 이름"></input>
                            <button type="submit">저장하기</button>
                        </label>
                    </div>
                    <hr />
                    <table>
                        <caption>운동 묶음 설정 테이블</caption>
                        <thead>
                            <tr>
                                <th>운동 부위</th>
                                <th>운동 이름</th>
                                <th>횟수 단위</th>
                                <th>강도</th>
                                <th>횟수/시간</th>
                                <th>휴식 시간</th>
                                <th>세트 갯수</th>
                                <th>순서 이동</th>
                                <th>제거</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>쉬움</td>
                                <td>회</td>
                                <td>초</td>
                                <td>개</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>상체</td>
                                <td>미선택</td>
                                <td>횟수</td>
                                <td>보통</td>
                                <td>회</td>
                                <td>초</td>
                                <td>개</td>
                                <td><button>up</button><button>down</button></td>
                                <td><button>X</button></td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>어려움</td>
                                <td>회</td>
                                <td>초</td>
                                <td>개</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>
                    <button type="submit">+</button>
                </div>
                <hr />
            </div>
        </div>
        );
    }
}

const PackageStateToProps = (state) => {
    return {
      userinfo: state.userinfo
    }
}

export default connect(PackageStateToProps, undefined)(PackageSetting);
//새 page 추가 시 guide : 이 폴더 안에 페이지 하나 더 만든 후, src/component/app.js && src/page/index 함께 변경해주세요
//잘 모르겠으면 customer폴더 참고