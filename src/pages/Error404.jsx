import React from 'react';
import { withRouter } from 'react-router-dom';

class Error404 extends React.Component {
    render() {
        return(
            <div className="justify-items-center align-middle flex-grow max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 text-black dark:text-white bg-light-mode dark:bg-dark-mode">
                <div className="inset-0">
                    ERROR 404 - PAGE NOT FOUND
                </div>
            </div>
        );
    }
}

export default withRouter(Error404)