import React,  {ChangeEvent, FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import './styles.css';
import clsx from 'clsx';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import MenuSideTop from '../../Components/MenuSideTop/index';
import BottomAppBar from '../../Components/MenuBot/index';

import api from '../../services/api';
import { useHistory } from 'react-router';
import { AuthContext } from '../../Context/auth';
import { store } from 'react-notifications-component';
import { Button} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MaterialTable from 'material-table';

const drawerWidth = 240;

interface IProduto{
  id: number;
  name: string;
  preco: string;
  custo: string;
  quantidade: number;
  user_id: number;
  created_at: Date | string;
  updated_at: Date | string;
}

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

const Produtos = () => {
    const [produtos1, setProdutos1] = useState<IProduto[]>([]);
    const {user, produto} = useContext(AuthContext);

    useEffect(() =>{
      async function listProdutos(){
      api.get('/produtos/'+user.id)
      .then(response => {
          setProdutos1(response.data);
      })
      .catch(error => {
        console.log(error);
      }); 
    }
    listProdutos();
  },[user.id]);

    const [formData, setFormData] = useState({
      name: '',
      preco: '', 
      custo: '',
      quantidade: '', 
   });

   const history = useHistory();

   const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) =>{

      const {name, value } = event.target;

      setFormData({ ...formData, [name]: value })
   }, [formData]);

   const handleSubmit = useCallback(async (event: FormEvent) =>{
      event.preventDefault();

      const {name, preco, custo, quantidade} = formData;

      const data = {
         name,
         preco,
         custo,
         quantidade,
         user_id: user.id,
      };

      try {
        await api.post('/produtos', data);
        history.push('/produtos');
        history.go(0);
          store.addNotification({
             title: "Sucesso!",
             message: "Produto Adicionado com Sucesso!",
             type: "success",
             insert: "top",
             container: "top-right",
             animationIn: ["animate__animated", "animate__fadeIn"],
             animationOut: ["animate__animated", "animate__fadeOut"],
             dismiss: {
               duration: 4000,
             }
           });
          
       } catch (error: any) {
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
    },[formData, history, user.id]);

    const handleSubmitUpdate = useCallback(async (event: FormEvent) =>{
      event.preventDefault();

      const {name, preco, custo, quantidade} = formData;

      const data = {
         name,
         preco,
         custo,
         quantidade,
         user_id: user.id,
      };

      try {
        await api.put('/produtos/'+produto.id, data);
        history.go(0);
          store.addNotification({
             title: "Sucesso!",
             message: "Produto atualizado com Sucesso!",
             type: "success",
             insert: "top",
             container: "top-right",
             animationIn: ["animate__animated", "animate__fadeIn"],
             animationOut: ["animate__animated", "animate__fadeOut"],
             dismiss: {
               duration: 4000,
             }
           });
       } catch (error: any) {
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
    },[formData, produto.id, user.id, history]);
      
    function deleteProduto(id: any){
      const confirmBox = window.confirm('Ok, para deletar');

      if(confirmBox === true){
      api.delete('/produtos/'+ id );
      history.go(0);
      }
    }
    function updateProduto(id: any){
      produto.id = id;
      if(id){
      api.get('/produtos/up/'+ produto.id)
      .then(response => {
         setFormData(response.data)
      })
      .catch(error => {
      console.log(error);
      }); 
      }
    }
      const rows = produtos1 || [].map((produtos1:any) => {
        return produtos1;
      });
    
    const classes = useStyles();
    const [open] = React.useState(false);
    return (
        <div className={classes.root} id="page-produto">
        <MenuSideTop />
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <div style={{ height: '85%', width: '41%', position: 'absolute', left:'20px'}}>
          <form onSubmit={handleSubmitUpdate}>
                <h1>Produto</h1>
                <fieldset>
                    <div className="field" >
                       <label htmlFor="name">Nome do produto</label>
                       <input 
                       type="text"
                       name="name"
                       id="name"
                       onChange={handleInputChange}
                       value={formData.name}
                       /> 
                    </div>
                    <div className="field">
                       <label htmlFor="preco">Preço </label>
                       <input 
                       type="text"
                       name="preco"
                       id="preco"
                       onChange={handleInputChange}
                       value={formData.preco}
                       /> 
                    </div>
                    <div className="field">
                       <label htmlFor="custo">Custo </label>
                       <input 
                       type="text"
                       name="custo"
                       id="custo"
                       onChange={handleInputChange}
                       value={formData.custo}
                       /> 
                    </div>
                    <div className="field">
                       <label htmlFor="quantidade">Quantidade</label>
                       <input 
                       type="text"
                       name="quantidade"
                       id="quantidade"
                       onChange={handleInputChange}
                       value={formData.quantidade}
                       />
                    </div> 
                    <div className="field-group">
                    <button onClick={handleSubmit}>Adicionar Produto</button>
                    <button id='btnDisable' type="submit"  disabled>Editar</button>
                    </div>
                </fieldset>
            </form> 
          </div>
          <div id="grid3">
          <MaterialTable style={{ flex : 1, width: '100%'}}
              title="PRODUTOS"
              columns={[
                { title: 'NOME',field: 'name'},
                { title: 'PREÇO',field: 'preco'},
                { title: 'CUSTO',field: 'custo'},
                { title: 'QUANTIDADE',field: 'quantidade'},
                {title: 'EXCLUIR', field: '',render: rowData => {
                  const onClickDelete = () => {
                  const id = rowData.id;
                  return deleteProduto(id);
                  };
                  return <p><Button  onClick={onClickDelete}><DeleteIcon color="secondary"/></Button></p>;
                }},
                {title: 'EDITAR', field: '',render: rowData => {
                  const onClickEdit = () => {
                    const teste = document.querySelector("#btnDisable")
                    const id = rowData.id;
                    updateProduto(id);

                    if(teste != null){
                    teste.removeAttribute("disabled");
                    }
                    };

                  return <p><Button onClick={onClickEdit}><EditIcon/></Button></p>;
                }},
              ]}
              data={rows}
              options={{
                exportButton: true,
                paging: true,
                pageSize: 4,
                pageSizeOptions: [],
                headerStyle: {
                  backgroundColor: '#106a75',
                  color: '#FFF',
                  height: 20,
                  maxHeight: 20,
                  padding: '0 1%',
                },
                rowStyle: {
                  height: 20,
                  maxHeight: 20,
                  padding: 0
              },
              }}
              />
         {/*    <DataGrid rows={rows} columns={columns} pageSize={8} /> */}
        </div>
        </main>
        <BottomAppBar/>
        </div>
    )
    
}

export default Produtos;