import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setFitness } from '../../action/userinfo';

import $ from 'jquery';

// import jQuery from "jquery";
// window.$ = window.jQuery = jQuery;

import { MdMenu } from "react-icons/md";

import imgLogo from '../../images/logo-text.png';
import './Menu.css';

class MegaMenu extends Component {
  render() {
		// $('.megamenu').prepend('<div id="menu-icon"><span class="first"></span><span class="second"></span><span class="third"></span></div>');

		// $("#menu-icon").on("click", function(){
		// 	$("nav").slideToggle();
		// 	$(this).toggleClass("active");
		// });
		
		$("#menu-icon").on("click", function(){
			$("nav").slideToggle();
			$(this).toggleClass("active");
		});

    return (

		
      <div class="megamenu">
					<div class="logo">
						<a href='/home'>
							<img
									alt="투진컴퍼니"
									src={imgLogo}
									width="auto"
									height="30"
									className="d-inline-block align-top"
							/>{' '}
						</a>
					</div>
					<div id='menu-icon'>
						<span className='first'></span>
						<span className='second'></span>
						<span className='third'></span>
					</div>
					<nav>
						<ul>
							<li>
								<a href="/home">Home</a>
							</li>
							<li>
								<a href="/customer">고객</a>
								<ul class="mega-dropdown">
									<li class="row">
									</li>
								</ul>        
							</li>
							<li class="dropdown">
								<a href="">Contact</a>
									<ul>
										<li><a href="#">About Version</a></li>
										<li><a href="#">About Version</a></li>
										<li><a href="#">Contact Us</a></li>
										<li><a href="#">Contact Us</a></li>
									</ul>        
							</li>
							<li>
								<a href="">Portfolio</a>
							</li>
							<li>
								<a href="">Team</a>
							</li>
						</ul>
					</nav>
      </div>
    );
  }
}

export default MegaMenu;