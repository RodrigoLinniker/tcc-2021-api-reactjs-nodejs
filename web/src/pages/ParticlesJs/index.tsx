import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './styles.css';
import Particles from 'react-particles-js';
import { Container } from '@material-ui/core';
import logo from '../../assets/logo.svg';


const ParticlesJs = () => {
    return(

        <Container className='container-fluid' id="page-particles">
        <header>
        <img style ={{ width:'7%'}} src={logo} alt="LinkGus"/>

        <Link className="voltar" to= "/">
            <FiArrowLeft />
            Voltar para home
        </Link>
        </header>
            <Particles height="100%" width="100%"
                params={{
                particles: {
                    line_linked: {
                            color: "#0b4e56",
                    },
                    number: {
                    value: 150,
                    density: {
                        enable: true,
                        value_area: 1000,
                    }
                    },
                },
                
                }}
            />
        </Container>
    );
}

export default ParticlesJs;