// Layout.js
import React from 'react';
import logo from './img/logo.png';
import './index.css';

const Layout = (props) => {
  return (
    <React.Fragment>
      <nav className="navbar navbar-dark bg-light">
        <span className="logo">
         <img src={logo}  height={20}/>
         <img src={logo}  height={20}/>
         <img src={logo}  height={20}/>
         <img src={logo}  height={20}/>
        </span>
      </nav>
      <div className="container py-3">
        {props.children}
      </div>
      <footer className="p-3 bg-light">
        <p>Worked with <span><a href="https://www.altcademy.com/" target='blank'>
        Altcademy</a></span></p>
      </footer>
    </React.Fragment>
  );
}

export default Layout;