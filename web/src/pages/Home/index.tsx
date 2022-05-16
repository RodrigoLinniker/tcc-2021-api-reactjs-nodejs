import React from "react";
import { FiLogIn } from "react-icons/fi";
import "./styles.css";
import logo from "../../assets/logo.svg";
import logo1 from "../../assets/logoempreender.svg";
import { Link } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Particles from "react-particles-js";

const Home = () => {
  return (
    <Container id="page-home">
      <Particles
        className="particles"
        params={{
          particles: {
            line_linked: {
              color: "#0b4e56",
            },
            number: {
              value: 100,
              density: {
                enable: true,
                value_area: 1000,
              },
            },
          },
        }}
      />
      <main>
        <img id="logo" style={{ width: "40%" }} src={logo} alt="LinkGus" />
        <h1>Empreendedorismo Designer</h1>
        <p>Ajudamos pessoas a controlarem seus produtos de forma eficiente.</p>

        <Link className="link" to="/SignIn">
          <span>
            <FiLogIn />
          </span>
          <strong>Login</strong>
        </Link>
        <Link className="link" to="/cadastro">
          <span>
            <FiLogIn />
          </span>
          <strong>Faça seu cadastro</strong>
        </Link>
      </main>
      <img id="img-home" src={logo1} alt="empreender" />
    </Container>
  );
};

export default Home;
