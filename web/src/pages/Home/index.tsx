import React from 'react';
import { FiLogIn} from 'react-icons/fi';
import './styles.css';
import logo from '../../assets/logo.svg';
import logo1 from '../../assets/logoempreender.svg';
import { Link } from 'react-router-dom';
import Particles from 'react-particles-js';
import Container from '@material-ui/core/Container';

const Home = () => {
    return (
        <Container id="page-home" maxWidth="xl">
           <div className="content">
                <img id='logo' style ={{ width:'15%'}} src={logo} alt="LinkGus"/>
                <main>
                    <h1>Seu marketplace de empreendedorismo</h1>
                    <p>Ajudamos pessoas a controlarem seus produtos de forma eficiente.</p>
                
                    <Link to ="/SignIn">
                        <span>
                           <FiLogIn/>
                        </span>
                        <strong>
                        Login 
                        </strong>
                    </Link>
                    <Link to ="/cadastro">
                        <span>
                           <FiLogIn/>
                        </span>
                        <strong>
                        Faça seu cadastro 
                        </strong>
                    </Link>
                </main>
                <img id="img-home" src={logo1} alt="empreender"/>
                </div>
                <Particles className="particlesjs" height="100%" width="99%"
                    params={{
                    particles: {
                        line_linked: {
                                color: "#0b4e56",
                        },
                        number: {
                        value: 100,
                        density: {
                            enable: true,
                            value_area: 1100,
                        }
                        },
                    },
                    
                    }}
                />
       </Container>
    )
}

export default Home;