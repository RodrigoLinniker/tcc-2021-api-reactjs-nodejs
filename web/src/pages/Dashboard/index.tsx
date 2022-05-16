import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import "./styles.css";
import { AuthContext } from "../../Context/auth";
import clsx from "clsx";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import MenuSideTop from "../../Components/MenuSideTop/index";
import BottomAppBar from "../../Components/MenuBot/index";
import Card from "@material-ui/core/Card";
import { Button, CardContent } from "@material-ui/core";
import PaymentIcon from "@material-ui/icons/Payment";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import CallReceivedIcon from "@material-ui/icons/CallReceived";
import api from "../../services/api";
import TextField from "@material-ui/core/TextField";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CancelIcon from "@material-ui/icons/Cancel";
import InfoIcon from "@material-ui/icons/Info";
import MaterialTable from "material-table";
import XLSX from "xlsx";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Modal from "@material-ui/core/Modal";

interface IPedido {
  id: number;
  data_pedido: Date | string;
  frente: string;
  desconto: string;
  obs: string;
  valor_pago: string;
  status_id: number;
  nameProduto: string;
  cliente_id: number;
  user_id: number;
  created_at: Date | string;
  updated_at: Date | string;
}

interface IDados {
  total: string;
  receber: string;
  lucro: string;
}

interface IGrafico {
  lucro: number;
  dataTotal: Date | string;
}

interface IProduto {
  id: number;
  name: string;
  preco: string;
  custo: string;
  quantidade: number;
  user_id: number;
  created_at: Date | string;
  updated_at: Date | string;
}

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    root1: {
      width: 225,
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
    paper: {
      marginLeft: "46%",
      marginTop: "20%",
      width: "30%",
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      borderRadius: 20,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 3, 1),
      overflow: "scroll",
    },
  })
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

const Dashboard = () => {
  const timeElapsed = Date.now();
  const dateNow = new Date(timeElapsed);
  dateNow.setMinutes(dateNow.getMinutes() - dateNow.getTimezoneOffset());
  const [pedidos1, setPedidos1] = useState<IPedido[]>([]);
  const [dados, setDados] = useState<IDados[]>([]);
  const [dadosGrafico, setDadosGrafico] = useState<IGrafico[]>([]);
  const { user } = useContext(AuthContext);
  const classes = useStyles();
  const [open] = React.useState(false);
  const [selectedData1, setSelectedData1] = useState(`2021-01-01T00:00:01`);
  const [selectedData2, setSelectedData2] = useState(
    dateNow.toISOString().slice(0, 19)
  );
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [descricaoOBS, setDescricaoOBS] = React.useState("");
  const [descricaoProduto, setDescricaoProduto] = useState<IProduto[]>([]);

  const handleOpen = () => {
    setOpen1(true);
  };

  const handleClose = () => {
    setOpen1(false);
  };

  const handleOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleDataChange1 = useCallback(
    (event: ChangeEvent<HTMLDataElement>) => {
      const data1 = event.target.value;
      setSelectedData1(data1);
    },
    []
  );

  const handleDataChange2 = useCallback(
    (event: ChangeEvent<HTMLDataElement>) => {
      const data2 = event.target.value;
      setSelectedData2(data2);
    },
    []
  );

  function resetar() {
    setSelectedData1("2021");
    setSelectedData2(dateNow.toISOString());
  }

  useEffect(() => {
    async function listPedidosData() {
      api
        .get(
          "/pedidos/data/" + user.id + "/" + selectedData1 + "/" + selectedData2
        )
        .then((response) => {
          setPedidos1(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    async function listDados() {
      api
        .get(
          "/pedidosDados/" + user.id + "/" + selectedData1 + "/" + selectedData2
        )
        .then((response) => {
          setDados(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    async function listDadosGrafico() {
      api
        .get(
          "/pedidosGrafico/" +
            user.id +
            "/" +
            selectedData1 +
            "/" +
            selectedData2
        )
        .then((response) => {
          setDadosGrafico(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    listPedidosData();
    listDados();
    listDadosGrafico();
  }, [selectedData1, selectedData2, user.id]);

  const rows =
    pedidos1 ||
    [].map((pedidos1: any) => {
      return pedidos1;
    });

  const dataGrafico = dadosGrafico.map((dadosGrafico: IGrafico) => {
    return dadosGrafico;
  });

  const downloadExcel = () => {
    const newData = rows.map((row: any) => {
      delete row.tableData;
      delete row.cliente_id;
      delete row.user_id;
      delete row.status_id;
      delete row.created_at;
      delete row.updated_at;
      delete row.desconto;
      delete row.valor_pago;

      return row;
    });
    const workSheet = XLSX.utils.json_to_sheet(newData);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "pedidos");

    XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });

    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });

    XLSX.writeFile(workBook, "Pedidos.xlsx");
  };

  function pedidosProduto1(id: any) {
    if (id) {
      api
        .get("/pedidosProduto/" + id)
        .then((response) => {
          setDescricaoProduto(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h3 id="simple-modal-title">Descrição</h3>
      <p id="simple-modal-description">{descricaoOBS}</p>
    </div>
  );

  const bodyProduto = (
    <div style={modalStyle} className={classes.paper}>
      <h3 id="simple-modal-title">Produtos</h3>
      {descricaoProduto.map((item: IProduto, index: number) => (
        <p id="simple-modal-description" key={index}>
          {item.name}
        </p>
      ))}
    </div>
  );

  return (
    <div className={classes.root} id="page-dash">
      <MenuSideTop />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <div className="card-group">
          <Card className="card-content" id="card1">
            <CardContent>
              <h5>
                <MonetizationOnIcon /> Total
              </h5>{" "}
              <h6 className="dados">
                R${" "}
                {dados.map((dados: any, index) => (
                  <b key={index}>{dados.total}</b>
                ))}{" "}
              </h6>
            </CardContent>
          </Card>
          <Card className="card-content" id="card2">
            <CardContent>
              <h5>
                <PaymentIcon /> Despesas{" "}
              </h5>{" "}
              <h6 className="dados">
                R${" "}
                {dados.map((dados: any, index) => (
                  <b key={index}>{dados.despesas}</b>
                ))}
              </h6>
            </CardContent>
          </Card>
          <Card className="card-content" id="card3">
            <CardContent>
              <h5>
                <MonetizationOnIcon /> Lucro Final
              </h5>{" "}
              <h6 className="dados">
                R${" "}
                {dados.map((dados: any, index) => (
                  <b key={index}>{dados.lucro}</b>
                ))}
              </h6>
            </CardContent>
          </Card>
          <Card className="card-content" id="card4">
            <CardContent>
              <h5>
                <CallReceivedIcon /> A receber
              </h5>{" "}
              <h6 className="dados">
                R${" "}
                {dados.map((dados: any, index) => (
                  <b key={index}>{dados.receber}</b>
                ))}{" "}
              </h6>
            </CardContent>
          </Card>

          <Card className="card-content" id="card5">
            <CardContent>
              <h5>Entre as datas</h5>
              <TextField
                id="datetime-local"
                type="datetime-local"
                value={selectedData1}
                style={{ height: "5%", border: "1px solid" }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleDataChange1}
              />
              <TextField
                id="datetime-local"
                type="datetime-local"
                value={selectedData2}
                style={{ border: "1px solid" }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleDataChange2}
              />
            </CardContent>
          </Card>
          <Button
            id="card6"
            style={{
              marginLeft: "3px",
              marginTop: "5px",
              border: "solid 0.1px",
              maxWidth: "1%",
              minWidth: "2%",
            }}
            onClick={resetar}
          >
            <CancelIcon color="secondary" />
          </Button>
        </div>
        <div id="grid4" className="grafico">
          <AreaChart
            style={{ marginLeft: "-3%", marginTop: "2%" }}
            width={400}
            height={300}
            data={dataGrafico}
            margin={{ top: 10, right: 30, left: 0, bottom: 2 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00a65a" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="dataTotal"
              label={{ value: "Data", offset: -2, position: "insideBottom" }}
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Area
              type="monotone"
              dataKey="lucro"
              stroke="#00a65a"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </div>
        <div id="grid5">
          <MaterialTable
            style={{ flex: 1, width: "98%" }}
            title="PEDIDOS"
            columns={[
              { title: "CLIENTE", field: "nameCliente" },
              { title: "ENTREGAR", field: "data_pedido" },
              {
                title: "PRODUTO",
                field: "",
                render: (rowData) => {
                  const onClickObs = () => {
                    const idpedido = rowData.id;
                    if (idpedido === null) {
                      setDescricaoProduto([]);
                    } else {
                      pedidosProduto1(idpedido);
                    }
                    handleOpen2();
                  };

                  return (
                    <div>
                      <Button style={{ padding: 0 }} onClick={onClickObs}>
                        <InfoIcon color="primary" />
                      </Button>
                    </div>
                  );
                },
              },
              { title: "PREÇO", field: "precoProduto" },
              { title: "FRETE", field: "frete" },
              { title: "CUSTO", field: "custo" },
              { title: "LUCRO", field: "lucro" },
              {
                title: "OBSERVAÇÃO",
                field: "obs",
                render: (rowData) => {
                  const onClickObs = () => {
                    const descricao = rowData.obs;

                    if (descricao === "") {
                      setDescricaoOBS("Sem descrição");
                    } else {
                      setDescricaoOBS(descricao);
                    }
                    handleOpen();
                  };

                  return (
                    <div>
                      <Button style={{ padding: 0 }} onClick={onClickObs}>
                        <InfoIcon color="primary" />
                      </Button>
                    </div>
                  );
                },
              },
              { title: "STATUS", field: "nameStatus" },
            ]}
            data={rows}
            options={{
              exportButton: true,
              paging: true,
              pageSize: 3,
              pageSizeOptions: [],
              headerStyle: {
                backgroundColor: "#106a75",
                color: "#FFF",
                height: 20,
                maxHeight: 20,
                padding: "0 1%",
              },
              rowStyle: {
                height: 20,
                maxHeight: 20,
                padding: 0,
              },
            }}
            actions={[
              {
                icon: () => (
                  <div>
                    <CloudDownloadIcon />
                  </div>
                ),
                tooltip: "Baixar Excel",
                onClick: () => downloadExcel(),
                isFreeAction: true,
              },
            ]}
          />
          <Modal
            open={open1}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {body}
          </Modal>
          <Modal
            open={open2}
            onClose={handleClose2}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {bodyProduto}
          </Modal>
        </div>
      </main>
      <BottomAppBar />
    </div>
  );
};

export default Dashboard;
