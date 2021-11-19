import React, {useCallback, useContext} from 'react';
import './styles.css';
import { useHistory } from 'react-router-dom';
import {Container} from '@material-ui/core';
import ParticlesJS from '../ParticlesJs/index';
import { AuthContext} from '../../Context/auth';
import { store } from 'react-notifications-component';
import ICredentialsDev from '../../interfaces/credentialsDev';
import * as Yup from "yup";
import { useForm }   from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

  const schema = Yup.object().shape({
    email: Yup.string()
      .required('E-mail obrigatório')
      .email('Digite um e-mail válido'),
    senha: Yup.string().required('Senha obrigatória'),
  })

const SignIn = () => {

    const {signInDev} = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors } } = useForm<ICredentialsDev>({
        resolver: yupResolver(schema)
      });

     const history = useHistory();
  
     const onSubmit = useCallback(async (data: ICredentialsDev) =>{
        try{
            await signInDev(data);
            store.addNotification({
                title: "Sucesso!",
                message: "Usuário autenticado com Sucesso!",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                duration: 2000,
                }
            });
            history.push('/dashboard');
        } catch(error : any){
            const {data} = error.response;
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
                }
            });
        }

     },[signInDev, history]);

    return (
        <Container className='container'  id="page-login">
           <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Login</h1>
                <fieldset>
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
                    </div>
                    <div className="field-group">
                    <button type="submit">Entrar</button>
                    </div>
                </fieldset>
            </form>
            <ParticlesJS/>
         </Container>
      
    )
}

export default SignIn;