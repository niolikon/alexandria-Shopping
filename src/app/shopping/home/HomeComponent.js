import React from 'react';
import FeaturedCarousel from './FeaturedCarousel';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home(props) {
    return(
        <div className="container">
            <div className="row">
                <div className="col">
                    Welcome to Alexandria library
                </div>
            </div>
            <div className="row justify-contents-center ">
                <div className="col carousel-content d-none d-md-block">
                    <FeaturedCarousel/>
                </div>
            </div>
        </div>
    );
}

export default Home;