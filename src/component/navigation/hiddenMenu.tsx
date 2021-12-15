import React, {useState} from 'react';
import { PC,Mobile } from '../MediaQuery';

import { useHistory, useLocation } from "react-router-dom";
import { Navigation } from 'react-minimal-side-navigation';

import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

import Icon from 'awesome-react-icons';
import { FaHome, FaBriefcase, FaUsers, FaFileAlt, FaMarker, FaNetworkWired, FaTable, FaPiggyBank, FaCoffee, FaDonate, FaFileInvoiceDollar, FaListAlt, FaWindowRestore, FaArchive, FaCommentDots, FaEnvelope, FaPaperPlane } from "react-icons/fa";

const Menu = () => {
  const history = useHistory();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  return (
    <>
      {/* Sidebar Overlay */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-30 block transition-opacity bg-black opacity-50 md:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      />
      <div className='z-30 fixed top-0 md:hidden'>
        <button
          className="btn-menu"
          onClick={(): void => setIsSidebarOpen(true)}
          type="button"
        >
          <Icon name="burger" className="w-10 h-10 m-2" />
        </button>
      </div>


      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white border-r-2 md:translate-x-0 md:inset-0 pt-12 bg-base ${
          isSidebarOpen ? "ease-out translate-x-0" : "ease-in -translate-x-full"
        }
        `
      }
      >
        <PC>
          <div className='logo'>
              <img
                src={ 'assets/logo-text.png' }
                width='50'
                height='50'
                alt='오마이짐'
              />
          </div>
        </PC>
        <Mobile>
          <div className='logo w-24'>
              <img 
                src={ 'assets/logo-text.png' }
                width='40'
                height='40'
                alt='오마이짐'
              />
          </div>
        </Mobile>
        <div className="flex items-center justify-center mt-2 text-center py-6">
          <span className="mx-2 text-2xl font-semibold text-black">
          </span>
        </div>
        {/* https://github.com/abhijithvijayan/react-minimal-side-navigation */}
        <Navigation
          // you can use your own router's api to get pathname
          activeItemId={location.pathname}
          onSelect={({ itemId }) => {
            history.push(itemId);
            setIsSidebarOpen(false);
          }}
          
          // onSelect={({ itemId }) => {
          //   if (itemId==="http://13.124.141.28:9090/") window.open("http://13.124.141.28:9090/", "_blank")
          //   else history.push(itemId);
          // }}
          items={[
            {
              title: '홈',
              itemId: '/home',
              elemBefore: () => <FaHome />,
            },
          ]}
        />
      </div>
    </>
  );
};

export default Menu;
