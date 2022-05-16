import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import Home from "../pages/Home";
import Cadastro from "../pages/Cadastro";
import SignIn from "../pages/SignIn";
import Route from "./Route";
import Dashboard from "../pages/Dashboard";
import Produtos from "../pages/Produtos";
import Clientes from "../pages/Clientes";
import Perfil from "../pages/Perfil";
import Pedidos from "../pages/Pedidos";
import Comprovante from "../pages/Comprovante";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={Home} exact path="/" />
        <Route component={Cadastro} exact path="/cadastro" />
        <Route component={SignIn} exact path="/signin" />
        <Route component={Dashboard} exact path="/dashboard" isPrivate />
        <Route component={Produtos} exact path="/produtos" isPrivate />
        <Route component={Clientes} exact path="/clientes" isPrivate />
        <Route component={Perfil} exact path="/perfil" isPrivate />
        <Route component={Pedidos} exact path="/pedidos" isPrivate />
        <Route component={Comprovante} exact path="/comprovante" isPrivate />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
