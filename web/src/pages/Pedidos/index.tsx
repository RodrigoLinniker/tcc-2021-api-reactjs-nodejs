import React,  {ChangeEvent, FormEvent, useCallback, useContext, useEffect, useState }  from 'react';
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
import TextField from '@material-ui/core/TextField';
import InfoIcon from '@material-ui/icons/Info';
import MaterialTable from 'material-table';
import Modal from '@material-ui/core/Modal';


const drawerWidth = 240;

interface IPedido{
  id: number;
  data_pedido: Date | string;
  frente: string;
  desconto: string;
  obs: string;
  valor_pago: string;
  status_id: number;
  cliente_id: number,
  produto_id: number,
  user_id: number;
  created_at: Date | string;
  updated_at: Date | string;
}

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

interface ICliente{
  id: number;
  name: string;
  telefone: string;
  email: string;
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
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 215,
      background: '#F0F0F5',
      borderRadius: '8px'
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    paper: {
      marginLeft: '46%',
      marginTop: '20%', 
      width: '30%', 
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      borderRadius: 20,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 3, 1),
      overflow:'scroll',
    },
  }),
);

function getModalStyle() {
  const top = 40;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const Pedidos = () => {
  const [pedidos1, setPedidos1] = useState<IPedido[]>([]);
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [status, setStatus] = useState<ICliente[]>([]);
  const [selectedProduto, setSelectedProduto] = useState('');
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedData, setSelectedData] = useState('');
  const [open1, setOpen1] = React.useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [descricaoOBS, setDescricaoOBS] = React.useState('');

  const handleOpen = () => {
    setOpen1(true);
  };

  const handleClose = () => {
    setOpen1(false);
  };

    const {user, pedido} = useContext(AuthContext);

    useEffect(() =>{
      async function listPedidos(){
      api.get('/pedidos/'+user.id)
      .then(response => {
          setPedidos1(response.data);
      })
      .catch(error => {
        console.log(error);
      }); 
    }
      async function listProdutos(){
      api.get('/produtos/'+user.id)
      .then(response => {
          setProdutos(response.data);
      })
      .catch(error => {
        console.log(error);
      }); 
    }
    async function listClientes(){
      api.get('/clientes/'+user.id)
      .then(response => {
          setClientes(response.data);
      })
      .catch(error => {
        console.log(error);
      }); 
    }
    async function listStatus(){
      api.get('/statusPedido')
      .then(response => {
          setStatus(response.data);
      })
      .catch(error => {
        console.log(error);
      }); 
    }
    listClientes();
    listPedidos();
    listProdutos();
    listStatus();
  },[user.id, selectedProduto]);

    const [formData, setFormData] = useState({
      frete: '', 
      desconto: '',
      obs: '',
      valor_pago: ''
   });

   const history = useHistory();

   const handleInputChange = useCallback((event: (ChangeEvent<HTMLInputElement>)) =>{

      const {name, value } = event.target;

      setFormData({ ...formData, [name]: value })
   }, [formData]);

   const handleSelectProduto = useCallback((event: ChangeEvent<HTMLSelectElement>) =>{
    const produto3 = event.target.value;

      setSelectedProduto(produto3);
   },[]);

   const handleSelectCliente = useCallback((event: ChangeEvent<HTMLSelectElement>) =>{
    const cliente3 = event.target.value;

      setSelectedCliente(cliente3);
   },[]);

   const handleSelectedStatus = useCallback((event: ChangeEvent<HTMLSelectElement>) =>{
    const status3 = event.target.value;

      setSelectedStatus(status3);
   },[]);

   const handleDataChange = useCallback((event: ChangeEvent<HTMLDataElement>) =>{
    const data = event.target.value;
    setSelectedData(data);
   },[]);

   const handleSubmit = useCallback(async (event: FormEvent) =>{
      event.preventDefault();

      const {frete, desconto, obs, valor_pago} = formData;
      const cliente_id = selectedCliente;
      const produto_id = selectedProduto;
      const data_pedido = selectedData;
      const status_id = selectedStatus;
      
      const data = {
        data_pedido: data_pedido,
        frete,
        desconto,
        obs,
        valor_pago,
        cliente_id,
        produto_id,
        status_id,
        user_id: user.id,
      };

      try {
        await api.post('/pedidos', data);
        history.push('/pedidos');
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
          
       } catch (error : any) {
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
    },[formData, selectedCliente, selectedProduto, selectedData, selectedStatus, history, user.id]);

    const handleSubmitUpdate = useCallback(async (event: FormEvent) =>{
      event.preventDefault();

      const {frete, desconto, obs, valor_pago} = formData;
      const cliente_id = selectedCliente;
      const produto_id = selectedProduto;
      const data_pedido = selectedData;
      const status_id = selectedStatus;

      const data = {
        data_pedido,
        frete,
        desconto,
        obs,
        valor_pago,
        cliente_id,
        produto_id,
        status_id,
        user_id: user.id,
      };

      try {
        await api.put('/pedidos/'+pedido.id, data);
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
       } catch (error : any) {
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
    },[formData, selectedCliente, selectedProduto, selectedData, selectedStatus, history, pedido.id, user.id]);

    function deletePedido(id: any){
      const confirmBox = window.confirm('Ok, para deletar');

      if(confirmBox === true){
      api.delete('/pedidos/'+ id );
      history.go(0);
      }
    }
    function updatePedido(id: any){
      pedido.id = id;
      if(pedido.id){
      api.get('/pedidos/up/'+ pedido.id)
      .then(response => { 
        setSelectedData(response.data.data_pedido)
        setSelectedCliente(response.data.cliente_id)
        setSelectedProduto(response.data.produto_id)
        setSelectedStatus(response.data.status_id)
        setFormData(response.data)
      })
      .catch(error => {
      console.log(error);
      }); 
      }
    }
      const rows = pedidos1 || [].map((pedidos1 :any) => {
        return pedidos1;
      });

    const classes = useStyles();
    const [open] = React.useState(false);

    const body = (
      <div style={modalStyle} className={classes.paper}>
        <h3 id="simple-modal-title">Descrição</h3>
        <p id="simple-modal-description">
          {descricaoOBS}
        </p>
      </div>
    );

    return (
        <div className={classes.root} id="page-pedido">
        <MenuSideTop />
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <div style={{ height: '85%', width: '41%', position: 'absolute', left:'20px'}}>
          <form onSubmit={handleSubmitUpdate}>
                <h1>Pedidos</h1>
                <fieldset>
                <div className="field-group">
                    <div className="field" >
                    <label htmlFor="produto">Produto</label>
                       <select
                          name="produto"
                          id="produto"
                          value={selectedProduto}
                          onChange={handleSelectProduto}
                       >
                        <option aria-label="None" value='' />
                      {produtos.map(produtos => <option key={produtos.id} value={produtos.id}>{produtos.name} | R${produtos.preco}</option> )}
                      </select>
                    </div>
                    <div className="field" >
                    <label htmlFor="data">Data de Entrega</label>
                       <TextField
                        id="datetime-local"
                        type="date"
                        style={{width: '87%'}}
                        className={classes.textField}
                        defaultValue={selectedData}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={handleDataChange}
                      />
                      
                    </div>
                    </div>
                    <div className="field-group">
                    <div className="field">
                       <label htmlFor="frete">Frete </label>
                       <input 
                       type="text"
                       name="frete"
                       id="frete"
                       onChange={handleInputChange}
                       value={formData.frete}
                       /> 
                    </div>
                    <div className="field" >
                       <label htmlFor="cliente">Cliente</label>
                       <select
                          name="cliente"
                          id="cliente"
                          value={selectedCliente}
                          onChange ={handleSelectCliente}
                       >
                         <option aria-label="None" value='' />
                      {clientes.map(clientes => <option key={clientes.id} value={clientes.id}>{clientes.name}</option> )}
                      </select>
                    </div>
                    </div>
                    <div className="field-group">
                    <div className="field">
                       <label htmlFor="desconto">Desconto</label>
                       <input 
                       type="text"
                       name="desconto"
                       id="desconto"
                       onChange={handleInputChange}
                       value={formData.desconto}
                       /> 
                    </div>
                    <div className="field" >
                       <label htmlFor="cliente">Status</label>
                       <select
                          name="cliente"
                          id="cliente"
                          value={selectedStatus}
                          onChange ={handleSelectedStatus}
                       >
                         <option aria-label="None" value='' />
                      {status.map(status => <option key={status.id} value={status.id}>{status.name}</option> )}
                      </select>
                    </div>
                    </div>
                    <div className="field-group">
                    <div className="field">
                       <label htmlFor="obs">Observação</label>
                       <input 
                       type="text"
                       name="obs"
                       id="obs"
                       onChange={handleInputChange}
                       value={formData.obs}
                       />
                    </div>
                    <div className="field">
                       <label htmlFor="valor_pago">Valor Pago</label>
                       <input 
                       type="text"
                       name="valor_pago"
                       id="valor_pago"
                       onChange={handleInputChange}
                       value={formData.valor_pago}
                       />
                      
                    </div>
                    </div> 
                    <div className="field-group">
                    <button onClick={handleSubmit}>Adicionar Pedido</button>
                    <button id='btnDisable' type="submit" disabled>Editar</button>
                    </div>
                    
                </fieldset>
            </form> 
          </div>
          <div id="grid2">
          <MaterialTable style={{ flex : 1, width: '100%'}}
              title="PEDIDOS"
              columns={[
                { title: 'ENTREGAR',field: 'data_pedido'},
                { title: 'OBSERVAÇÃO',field: 'obs',
                render: rowData => {
                  const onClickObs = () => {
                  const descricao = rowData.obs;
                  if(descricao === ''){
                    setDescricaoOBS('Sem descrição');
                  }else{
                    setDescricaoOBS(descricao);
                  }
                    handleOpen();
                  };

                  return <div><Button style={{padding: 0}} onClick={onClickObs}><InfoIcon color="primary"/></Button></div>;
                }},
                { title: 'PREÇO',field: 'precoProduto'},
                { title: 'PAGO',field: 'valor_pago'},
                { title: 'CLIENTE',field: 'nameCliente'},
                {title: 'PRODUTO', field: 'nameProduto', cellStyle:{ width: '10%'}},
                {title: 'STATUS', field: 'nameStatus'},
                {title: 'EXCLUIR', field: '',render: rowData => {
                  const onClickDelete = () => {
                  const id = rowData.id;
                  return deletePedido(id);
                  };
                  return <p><Button  onClick={onClickDelete}><DeleteIcon color="secondary"/></Button></p>;
                }},
                {title: 'EDITAR', field: '',render: rowData => {
                  const onClickEdit = () => {
                    const teste = document.querySelector("#btnDisable")
                    const id = rowData.id;
                    updatePedido(id);

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
            {/* <DataGrid rows={rows} columns={columns} pageSize={8} /> */}

            <Modal
                open={open1}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                {body}
              </Modal>
            
        </div>
        </main>
        <BottomAppBar/>
        </div>
    )
    
}

export default Pedidos;