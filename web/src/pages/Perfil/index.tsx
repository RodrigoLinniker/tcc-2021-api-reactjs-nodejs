import React, {useContext, useCallback} from 'react';
import './styles.css';
import Particles from 'react-particles-js';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../Context/auth';
import { store } from 'react-notifications-component';
import api from '../../services/api';
import BottomAppBar from '../../Components/MenuBot/index';

import clsx from 'clsx';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import MenuSideTop from '../../Components/MenuSideTop/index';
import * as Yup from "yup";
import { useForm }   from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { validateCPF, validatePhone } from 'validations-br';


interface IFormInputs {
  name: string;
  email: string;
  senha: string;
  remember: string;
  telefone: string;
  cpf: string;
}

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }),
);

const schema = Yup.object().shape({
  name: Yup.string()
  .required('Nome obrigatório'),
  email: Yup.string()
    .required('E-mail obrigatório')
    .email('Digite um e-mail válido'),
  senha: Yup.string().required('Senha obrigatória'),
  cpf: Yup.string().required('CPF obrigatório').test("is-cpf",
  "CPF inválido",
  (value: any) => validateCPF(value)),
  telefone: Yup.string().required('Telefone obrigatório').test("is-phone",
  "Telefone inválido",
  (value: any) => validatePhone(value))
})

const Perfil = () => {
    const classes = useStyles();
    const [open] = React.useState(false);
    const {user, updateUser} = useContext(AuthContext);

     const  { register, handleSubmit, formState: { errors }} = useForm<IFormInputs>({
      defaultValues: {
        name: user.name,
        email: user.email,
        telefone: user.telefone,
        cpf: user.cpf
      },
      resolver: yupResolver(schema)
    });

     const history = useHistory();
  
     const onSubmit = useCallback(async (data: IFormInputs) =>{
       
        try {
         const response = await api.put('/users/'+user.id, data);
         updateUser(response.data);
         history.push('/perfil');
         history.go(0);
           store.addNotification({
              title: "Sucesso!",
              message: "Usuário atualizado com Sucesso!",
              type: "success",
              insert: "top",
              container: "top-right",
              animationIn: ["animate__animated", "animate__fadeIn"],
              animationOut: ["animate__animated", "animate__fadeOut"],
              dismiss: {
                duration: 2000,
              }
            });
         
        } catch (error:any) {
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
     },[history, updateUser, user.id]);
    return (
        <div className={classes.root} id="page-perfil">
        <MenuSideTop />
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Perfil</h1>
                <fieldset>
                    <div className="field" >
                       <label htmlFor="name">Novo Nome</label>
                       <input
                        {...register("name")}
                       type="text"
                       name="name"
                       id="name"
                     
                       />
                        <span className='error'>{errors.name?.message}</span> 
                    </div>
                  <div className="field-group">
                    <div className="field">
                       <label htmlFor="email">Novo E-mail</label>
                       <input
                        {...register("email")} 
                       type="email"
                       name="email"
                       id="email"
                    
                       />
                        <span className='error'>{errors.email?.message}</span> 
                    </div>
                    <div className="field">
                       <label htmlFor="senha">Nova Senha</label>
                       <input
                        {...register("senha")} 
                       type="password"
                       name="senha"
                       id="senha"
                       />
                        <span className='error'>{errors.senha?.message}</span> 
                    </div>
                    </div> 

                    <div className="field-group">
                    <div className="field">
                       <label htmlFor="cpf">Novo CPF</label>
                       <input
                        {...register("cpf")}
                       type="text"
                       name="cpf"
                       id="cpf"
                      
                       />
                        <span className='error'>{errors.cpf?.message}</span>  
                    </div>
                    <div className="field">
                       <label htmlFor="telefone">Novo Telefone</label>
                       <input 
                        {...register("telefone")}
                       type="text"
                       name="telefone"
                       id="telefone"
                       
                       />
                        <span className='error'>{errors.telefone?.message}</span>  
                    </div>
                    </div>
                    <button type="submit">Atualizar</button>
                </fieldset>
            </form>
            <Particles height="81vh" width="90vw"
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
        </main>
        <BottomAppBar/>
        </div>    
    )
    
}

export default Perfil;