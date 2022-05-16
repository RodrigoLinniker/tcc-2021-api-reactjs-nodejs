import React, { useCallback } from "react";
import "./styles.css";
import { Link, useHistory } from "react-router-dom";
import { Container } from "@material-ui/core";
import api from "../../services/api";
import { store } from "react-notifications-component";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validateCPF } from "validations-br";
import { validatePhone } from "validations-br";
import { FiArrowLeft } from "react-icons/fi";
import logo from "../../assets/logo.svg";
import Particles from "react-particles-js";

interface IFormInputs {
  name: string;
  email: string;
  senha: string;
  remember: string;
  telefone: string;
  cpf: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required("Nome obrigatório"),
  email: Yup.string()
    .required("E-mail obrigatório")
    .email("Digite um e-mail válido"),
  senha: Yup.string().required("Senha obrigatória"),
  remember: Yup.string().required("Confirme a senha"),
  cpf: Yup.string()
    .required("CPF obrigatório")
    .test("is-cpf", "CPF inválido", (value: any) => validateCPF(value)),
  telefone: Yup.string()
    .required("Telefone obrigatório")
    .test("is-phone", "Telefone inválido", (value: any) =>
      validatePhone(value)
    ),
});

const Cadastro = () => {
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    async (data: IFormInputs) => {
      try {
        await api.post("/users", data);
        store.addNotification({
          title: "Sucesso!",
          message: "Usuário cadastrado com Sucesso!",
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 2000,
          },
        });
        history.push("/");
      } catch (error: any) {
        const { data } = error.response;
        const erro = data.message;
        store.addNotification({
          title: "Erro",
          message: erro,
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 4000,
          },
        });
      }
    },
    [history]
  );

  return (
    <Container className="container" id="page-cadastro">
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
      <header>
        <img style={{ width: "7%" }} src={logo} alt="LinkGus" />

        <div>
          <Link className="voltar" to="/">
            <div>
              <FiArrowLeft />
            </div>
            Voltar para home
          </Link>
        </div>
      </header>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Cadastro do usuário</h1>

          <fieldset>
            <div className="field">
              <label htmlFor="name">Nome Completo</label>
              <input {...register("name")} type="text" name="name" id="name" />
              <span>{errors.name?.message}</span>
            </div>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                {...register("email")}
                type="email"
                name="email"
                id="email"
              />
              <span>{errors.email?.message}</span>
            </div>
            <div className="field-group">
              <div className="field">
                <label htmlFor="senha">Senha</label>
                <input
                  {...register("senha")}
                  type="password"
                  name="senha"
                  id="senha"
                />
                <span>{errors.senha?.message}</span>
              </div>
              <div className="field">
                <label htmlFor="remember">Confirmar Senha</label>
                <input
                  {...register("remember")}
                  type="password"
                  name="remember"
                  id="remember"
                />
                <span>{errors.remember?.message}</span>
              </div>
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="cpf">CPF</label>
                <input {...register("cpf")} type="text" name="cpf" id="cpf" />
                <span>{errors.cpf?.message}</span>
              </div>
              <div className="field">
                <label htmlFor="telefone">Telefone</label>
                <input
                  {...register("telefone")}
                  type="text"
                  name="telefone"
                  id="telefone"
                />
                <span>{errors.telefone?.message}</span>
              </div>
            </div>
            <button type="submit">Enviar</button>
          </fieldset>
        </form>
      </div>
    </Container>
  );
};

export default Cadastro;
