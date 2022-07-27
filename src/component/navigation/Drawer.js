// https://codesandbox.io/s/vj6noq66w0?file=/demo.js
// 작업중
import * as React from 'react';

import { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { setFitness } from '../../action/userinfo';
import { logoutRequest } from '../../action/authentication';

// react-Bootstrap
import Image from 'react-bootstrap/Image';

// MUI
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';

import './drawer.css';

const drawerWidth = 240;

function DrawerAppBar(props) {
  // DrawerAppBar = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [open, setOpen] = React.useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant='h6' sx={{ my: 2 }}>
        DIVVY
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: 'center' }}
            onClick={handleDrawerToggle}
          >
            <ListItemText primary={'센터소개222'} />
          </ListItemButton>
        </ListItem>
        {/* 센터 */}
        <ListItemButton sx={{ textAlign: 'start' }} onClick={handleClick}>
          <ListItemText primary={'센터'} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='센터 소개' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='센터 소개 등록' />
            </ListItemButton>
          </List>
        </Collapse>
        {/* 강사 */}
        <ListItemButton sx={{ textAlign: 'start' }} onClick={handleClick}>
          <ListItemText primary={'강사'} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='강사' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='강사 등록' />
            </ListItemButton>
          </List>
        </Collapse>
        {/* 회원 */}
        <ListItemButton sx={{ textAlign: 'start' }} onClick={handleClick}>
          <ListItemText primary={'회원'} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='회원' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='회원 등록' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='인바디 정보' />
            </ListItemButton>
          </List>
        </Collapse>
        {/* 수업 */}
        <ListItemButton sx={{ textAlign: 'start' }} onClick={handleClick}>
          <ListItemText primary={'수업'} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='수업' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='수업 설정' />
            </ListItemButton>
          </List>
        </Collapse>
        {/* 운동 */}
        <ListItemButton sx={{ textAlign: 'start' }} onClick={handleClick}>
          <ListItemText primary={'운동'} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='운동 배정' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='루틴 배정' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='배정된 운동 목록' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='운동 만들기' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='루틴 만들기' />
            </ListItemButton>
          </List>
        </Collapse>
        {/* 매출 */}
        <ListItemButton sx={{ textAlign: 'start' }} onClick={handleClick}>
          <ListItemText primary={'매출'} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='매출 현황' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary='결제 등록' />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex' }} className='top-menu'>
        <AppBar component='nav'>
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant='h6'
              component='div'
              sx={{ flexGrow: 1, display: { sm: 'block' } }}
            >
              <Image
                className='menu_logo'
                src={process.env.PUBLIC_URL + '/assets/logo-circle-yellow.png'}
                // src={process.env.PUBLIC_URL + '/assets/divvy_gif_1.gif'}
              />
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button sx={{ color: '#fff' }}>센터</Button>
              <Button sx={{ color: '#fff' }}>강사</Button>
              <Button sx={{ color: '#fff' }}>회원</Button>
              <Button sx={{ color: '#fff' }}>수업</Button>
              <Button sx={{ color: '#fff' }}>운동</Button>
              <Button sx={{ color: '#fff' }}>매출</Button>
            </Box>
            <Button variant='text' color='error'>
              LOG-OUT
            </Button>
          </Toolbar>
        </AppBar>
        <Box component='nav'>
          <Drawer
            container={container}
            variant='temporary'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default DrawerAppBar;
