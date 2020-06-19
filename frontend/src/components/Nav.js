import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";

class Nav extends React.Component {
    render() {
        return (
            <div className="navbar">
                <div className="logo">
                    seidlserver
                </div>
                <div className="icon">
                    x
                </div>
            </div>
        );
    }
}

export default Nav;