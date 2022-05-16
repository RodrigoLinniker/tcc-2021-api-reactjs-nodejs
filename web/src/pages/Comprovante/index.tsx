import { Container } from "@material-ui/core";
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import "./styles.css";
import BottomAppBar from "../../Components/MenuBot";
import MenuSideTop from "../../Components/MenuSideTop";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import "./styles.css";
import clsx from "clsx";
import api from "../../services/api";
import { AuthContext } from "../../Context/auth";
import { store } from "react-notifications-component";
import logo4 from "../../assets/logo4.png";
//import { Document, Page } from "react-pdf";
import {
  Page,
  Text,
  View,
  Document,
  PDFDownloadLink,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const drawerWidth = 240;

interface IPedido {
  id: number;
  data_pedido: Date | string;
  frente: string;
  desconto: string;
  obs: string;
  valor_pago: string;
  status_id: number;
  cliente_id: number;
  user_id: number;
  created_at: Date | string;
  updated_at: Date | string;
  nameCliente: string;
  nameProduto: string;
  precoProduto: number;
  lucro: number;
  nameStatus: string;
  custo: string;
}

interface ICliente {
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
      margin: "auto",
      spacing: "2",
      justifyContent: "center",
      alignItems: "center",
    },
    paper: {
      width: "100%",
      height: "100%",
      overflow: "auto",
    },
    button: {
      margin: theme.spacing(0.5, 0),
    },

    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  })
);

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 0,
    padding: 0,
  },
});

const Comprovante = () => {
  const classes = useStyles();
  const [open] = React.useState(false);
  const [ids, setIds] = useState<Array<number>>([]);

  const { user } = useContext(AuthContext);
  const [pedidosComprovante, setPedidosComprovante] = useState<IPedido[]>([]);
  const [selectedCliente, setSelectedCliente] = useState("");
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [cliente, setCliente] = useState(0);

  useEffect(() => {
    async function listClientes() {
      api
        .get("/clientes/" + user.id)
        .then((response) => {
          setClientes(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    async function listPedidosComprovante() {
      await api
        .get(`/pedidos/${user.id}/${cliente}`)
        .then((response) => {
          setPedidosComprovante(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    listClientes();
    listPedidosComprovante();
  }, [user.id, cliente]);

  /* function imprimirComprovante() {
    return <div></div>
  } */

  /* function imprimirComprovante() {
    function onDocumentLoadSuccess({ numPages }: any) {
      setNumPages(numPages);
    }

    return (
      <div>
        <Document file="somefile.pdf" onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </div>
    );
  }
 */

  const MyDocument = () => {
    const pedidosEscolhidos = pedidosComprovante.filter((pedidos) =>
      ids.includes(pedidos.id)
    );

    const clienteEscolhidoNome = clientes
      .filter((clientes: ICliente) => clientes.id === cliente)
      .map((clientes: ICliente) => clientes.name);

    const clienteEscolhidoTelefone = clientes
      .filter((clientes: ICliente) => clientes.id === cliente)
      .map((clientes: ICliente) => clientes.telefone);

    const clienteEscolhidoEmail = clientes
      .filter((clientes: ICliente) => clientes.id === cliente)
      .map((clientes: ICliente) => clientes.email);

    return (
      <Document>
        <Page size="A4">
          <Image
            id="logo"
            style={{ width: "40%", alignSelf: "center" }}
            src={logo4}
          />
          <Text
            style={{ alignSelf: "center", fontSize: "20px", color: "#0b4e56" }}
          >
            Comprovante
          </Text>

          <div style={{ marginLeft: "20px", margin: "20px" }}>
            <Text>Nome : {clienteEscolhidoNome.toString().toUpperCase()}</Text>
            <Text>Telefone: {clienteEscolhidoTelefone.toString()}</Text>
            <Text>Email : {clienteEscolhidoEmail.toString()}</Text>
          </div>

          <div style={{ alignSelf: "center", margin: "5px" }}>
            <Text style={{ alignSelf: "center", margin: "5px" }}>Produtos</Text>

            {pedidosEscolhidos.map((pedidos: IPedido) => {
              return (
                <View style={styles.section}>
                  <Text key={pedidos.id}>
                    {pedidos.nameProduto}.............R${pedidos.precoProduto}
                    ,00 / Data de Entrega :{pedidos.data_pedido}
                  </Text>
                </View>
              );
            })}
          </div>
        </Page>
      </Document>
    );
  };

  /* function teste() {
    
    );
  } */

  const selectPedido = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = parseInt(event.target.value);

    // Check if "ids" contains "selectedIds"
    // If true, this checkbox is already checked
    // Otherwise, it is not selected yet
    if (ids.includes(selectedId)) {
      const newIds = ids.filter((id) => id !== selectedId);
      setIds(newIds);
    } else {
      const newIds = [...ids];
      newIds.push(selectedId);
      setIds(newIds);
    }
  };

  const handleSelectCliente = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const cliente3 = event.target.value;

      setSelectedCliente(cliente3);
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const cliente_id = selectedCliente;

      try {
        setCliente(parseInt(cliente_id));
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
    [selectedCliente]
  );

  const customList = (items: number[]) => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {pedidosComprovante.map((pedido: IPedido) => {
          return (
            <ListItem key={pedido.id} role="listitem" button>
              <ListItemIcon>
                <Checkbox
                  value={pedido.id}
                  onChange={selectPedido}
                  checked={ids.includes(pedido.id) ? true : false}
                />
              </ListItemIcon>
              <ListItemText
                primary={`${pedido.nameProduto}`}
                secondary={`preço - ${pedido.precoProduto} R$`}
              />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <Container id="page-comprovante">
      <MenuSideTop />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <div
          style={{
            height: "85%",
            width: "41%",
            position: "absolute",
            left: "100px",
            marginTop: "20px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <h1>Selecione o cliente</h1>
            <fieldset>
              <div className="field">
                <select
                  name="cliente"
                  id="cliente"
                  value={selectedCliente}
                  onChange={handleSelectCliente}
                >
                  <option aria-label="None" value="" />
                  {clientes.map((clientes) => (
                    <option key={clientes.id} value={clientes.id}>
                      {clientes.name}
                    </option>
                  ))}
                </select>
              </div>
              <button className="buttonG" type="submit">
                Procurar
              </button>
            </fieldset>
          </form>
        </div>
        <div id="grid2">
          <Grid container className={classes.root}>
            <Grid item>{customList([0, 1, 2, 3, 4])}</Grid>
            <Button
              variant="outlined"
              size="small"
              //onClick={teste}
              className={classes.button}
              aria-label="move all right"
            >
              <div className="App">
                <PDFDownloadLink
                  document={<MyDocument />}
                  fileName="somename.pdf"
                >
                  {({ blob, url, loading, error }: any) =>
                    loading ? "Loading document..." : "Imprimir Comprovante!"
                  }
                </PDFDownloadLink>
              </div>
            </Button>
          </Grid>
        </div>
      </main>
      <BottomAppBar />
    </Container>
  );
};
export default Comprovante;
