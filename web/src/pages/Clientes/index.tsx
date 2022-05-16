import React, { useCallback, useContext, useEffect, useState } from "react";
import clsx from "clsx";
import "./styles.css";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import MenuSideTop from "../../Components/MenuSideTop/index";
import BottomAppBar from "../../Components/MenuBot/index";
import { useHistory } from "react-router";
import { AuthContext } from "../../Context/auth";
import api from "../../services/api";
import { store } from "react-notifications-component";
import { Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import MaterialTable from "material-table";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { validatePhone } from "validations-br";

interface ICliente {
  id: number;
  name: string;
  telefone: string;
  email: string;
  user_id: number;
  created_at: Date | string;
  updated_at: Date | string;
}

interface IFormInputs {
  user_id: number;
  name: string;
  telefone: string;
  email: string;
}

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
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

const schema = Yup.object().shape({
  name: Yup.string().required("Nome obrigatório"),
  email: Yup.string()
    .required("E-mail obrigatório")
    .email("Digite um e-mail válido"),
  telefone: Yup.string()
    .required("Telefone obrigatório")
    .test("is-phone", "Telefone inválido", (value: any) =>
      validatePhone(value)
    ),
});

const Clientes = () => {
  const [clientes1, setClientes1] = useState<ICliente[]>([]);
  const [cliente, setCliente] = useState<number>(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function listClientes() {
      api
        .get("/clientes/" + user.id)
        .then((response) => {
          setClientes1(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    listClientes();
  }, [user.id]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      user_id: user.id,
    },
    resolver: yupResolver(schema),
  });

  const history = useHistory();

  const onSubmit = useCallback(
    async (data: IFormInputs) => {
      try {
        await api.post("/clientes", data);
        history.push("/clientes");
        history.go(0);
        store.addNotification({
          title: "Sucesso!",
          message: "Cliente Adicionado com Sucesso!",
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 4000,
          },
        });
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

  const handleSubmitUpdate = useCallback(
    async (data: IFormInputs) => {
      try {
        await api.put("/clientes/" + cliente, data);
        history.go(0);
        store.addNotification({
          title: "Sucesso!",
          message: "Cliente atualizado com Sucesso!",
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 4000,
          },
        });
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
    [cliente, history]
  );

  function deleteCliente(id: any) {
    const confirmBox = window.confirm("Ok, para deletar");

    if (confirmBox === true) {
      api.delete("/clientes/" + id);
      history.go(0);
    }
  }
  function updateCliente(id: any) {
    if (id) {
      api
        .get("/clientes/up/" + id)
        .then((response) => {
          setValue("name", response.data.name);
          setValue("telefone", response.data.telefone);
          setValue("email", response.data.email);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  const rows =
    clientes1 ||
    [].map((clientes1: any) => {
      return clientes1;
    });

  const classes = useStyles();
  const [open] = React.useState(false);
  return (
    <div className={classes.root} id="page-cliente">
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
            left: "20px",
          }}
        >
          <form onSubmit={handleSubmit(handleSubmitUpdate)}>
            <h1>Cliente</h1>
            <fieldset>
              <div className="field">
                <label htmlFor="name">Nome do cliente</label>
                <input
                  {...register("name")}
                  type="text"
                  name="name"
                  id="name"
                />
                <span className="error">{errors.name?.message}</span>
              </div>
              <div className="field">
                <label htmlFor="telefone">Telefone </label>
                <input
                  {...register("telefone")}
                  type="text"
                  name="telefone"
                  id="telefone"
                />
                <span className="error">{errors.telefone?.message}</span>
              </div>
              <div className="field-group">
                <div className="field">
                  <label htmlFor="email">E-mail </label>
                  <input
                    {...register("email")}
                    type="text"
                    name="email"
                    id="email"
                  />
                  <span className="error">{errors.email?.message}</span>
                </div>
              </div>
              <div className="field-group">
                <button onClick={handleSubmit(onSubmit)}>
                  Adicionar Cliente
                </button>
                <button id="btnDisable" type="submit" disabled>
                  Editar
                </button>
              </div>
            </fieldset>
          </form>
        </div>
        <div id="grid-cliente">
          <MaterialTable
            style={{ flex: 1, width: "100%" }}
            title="CLIENTES"
            columns={[
              { title: "NOME", field: "name" },
              { title: "TELEFONE", field: "telefone" },
              { title: "EMAIL", field: "email" },
              {
                title: "EXCLUIR",
                field: "",
                render: (rowData) => {
                  const onClickDelete = () => {
                    const id = rowData.id;
                    return deleteCliente(id);
                  };
                  return (
                    <p>
                      <Button onClick={onClickDelete}>
                        <DeleteIcon color="secondary" />
                      </Button>
                    </p>
                  );
                },
              },
              {
                title: "EDITAR",
                field: "",
                render: (rowData) => {
                  const onClickEdit = () => {
                    const teste = document.querySelector("#btnDisable");
                    const id = rowData.id;
                    setCliente(id);
                    updateCliente(id);

                    if (teste != null) {
                      teste.removeAttribute("disabled");
                    }
                  };

                  return (
                    <p>
                      <Button onClick={onClickEdit}>
                        <EditIcon />
                      </Button>
                    </p>
                  );
                },
              },
            ]}
            data={rows}
            options={{
              exportButton: true,
              paging: true,
              pageSize: 4,
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
          />
        </div>
      </main>
      <BottomAppBar />
    </div>
  );
};

export default Clientes;
