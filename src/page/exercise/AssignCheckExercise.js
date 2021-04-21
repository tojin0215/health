import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../styles/exercise/AssignCheckExercise.css';

const List = [
    {'no':1,'name':'AAA','tool':'바벨','aa':'상체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':2,'name':'BBB','tool':'바벨','aa':'하체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':3,'name':'CCC','tool':'바벨','aa':'전신','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':4,'name':'AAA','tool':'바벨','aa':'상체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':5,'name':'BBB','tool':'바벨','aa':'하체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':6,'name':'CCC','tool':'바벨','aa':'전신','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':7,'name':'AAA','tool':'바벨','aa':'상체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':8,'name':'BBB','tool':'바벨','aa':'하체','set':'3','bb':'10','cc':'10분','link':'www.www.www'}
]

const ip = '13.124.141.28';
class AssignCheckExercise extends Component {
    constructor(props) {
        super(props);

        const search = location.search;

        this.state = {
            fitness_no:this.props.userinfo.fitness_no, //Redux를 통해 받은 값
            member_no: (search.split('='))[1] ,
        };
    };


    goLogin = () => {
        this.props.history.push("/");
    }

    handleOnClick(){
        alert('배정완료')
    }

    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); //나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음
        
        const options ={
            noDataText: '인바디 정보가 없습니다.',
        }

        return (
        <div className='assignCheckExercise'>
            <div className='header'>
                <Header />
                <Navigation goLogin={this.goLogin}/>
                <div className='localNavigation'>
                    <div className='container'>
                        <h2>
                            운동 배정 확인
                        </h2>
                        <div className='breadCrumb'>
                            <Link to='/home'>HOME</Link>
                            <span>&#62;</span>
                            <Link to='/assign'>운동 배정</Link>
                            <span>&#62;</span>
                            <Link to='#'>운동 배정 확인</Link>
                        </div>{/*.breadCrumb */}
                    </div>{/*.container */}
                </div>{/*.localNavigation */}
            </div>{/*.header */}
            <div className='container'>
                <article className='waySub'>
                    <NavLink exact to="/assign">
                        <button type='button'>
                            운동 배정 설정
                        </button>
                    </NavLink>
                    <Link to={{pathname:"/assign/inbody?member_no="+0}}>    
                        <button type='button'>
                            고객인바디
                        </button>
                    </Link>
                </article>{/*.waySub */}
                <section className='checkExercise'>
                    <h3>
                        <span>
                            {this.state.member_no}
                        </span>
                        님의 운동배정입니다.
                    </h3>
                    <BootstrapTable
                    hover
                    data={ List }  
                    //pagination={ List.length > 1 }
                    options={options}
                    tableHeaderClass='tableHeader'  
                    tableContainerClass='tableContainer'
                    //selectRow={selectRowProp}
                    className="table2"
                    >
                        <TableHeaderColumn
                        dataField='no'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        isKey
                        >
                            no
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='name'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            운동이름
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='tool'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            운동도구
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='aa'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            운동부위
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='set' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            세트
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='bb' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            횟수
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='cc' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            휴식시간
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='link' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            링크
                        </TableHeaderColumn>
                    </BootstrapTable>{/*.table2 */}
                    <button
                    className='btnOneCenter'
                    type="button"
                    onClick={this.handleOnClick}
                    >
                        배정하기
                    </button>
                </section>{/*.checkExercise */}
            </div>{/*.container */}
            <div className='footer'>
                <Footer />
            </div>{/*.footer */}
        </div>/*.assignCheckExercise */
        );
    }
}

const AssignCheckExerciseStateToProps = (state) => {
    return {
      userinfo: state.authentication.userinfo
    }
}

export default connect(AssignCheckExerciseStateToProps, undefined)(AssignCheckExercise);
//새 page 추가 시 guide : 이 폴더 안에 페이지 하나 더 만든 후, src/component/app.js && src/page/index 함께 변경해주세요
//잘 모르겠으면 customer폴더 참고