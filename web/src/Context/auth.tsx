import React, {createContext, useCallback, useState, useContext} from 'react';
import ICredentialsDev from '../interfaces/credentialsDev';
import api from '../services/api';

interface IUser{
    id: number;
    name:string;
    email:string;
    cpf:string;
    telefone:string;
    active:boolean;
    created_at: Date | string;
    updated_at: Date | string;

}
interface IProduto{
    id: number;
    name:string;
    preco:string;
    custo:string;
    quantidade:number;
    user_id:number;
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

interface IAuthState{
    token: string;
    user: IUser;
    produto: IProduto;
    cliente: ICliente;
    pedido: IPedido;
}

interface IAuthContextState{
    user:IUser,
    produto: IProduto,
    cliente: ICliente,
    pedido: IPedido;
    signInDev(credentials: ICredentialsDev): Promise<void>;
    signOut(): void;
    updateUser(user: IUser): void;
}

export const AuthContext = createContext<IAuthContextState>({} as IAuthContextState);


export const AuthProvider: React.FC = ({ children}) => {
    const [data, setData] = useState<IAuthState>(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        const produto = localStorage.getItem('produto');
        const cliente = localStorage.getItem('cliente');
        const pedido = localStorage.getItem('pedido');

        
        if(token && user && produto && cliente && pedido){
            api.defaults.headers.authorization = `Bearer ${token}`;
            return {token, user: JSON.parse(user), produto: JSON.parse(produto), cliente: JSON.parse(cliente), pedido: JSON.parse(pedido)};
        }
        
        return {} as IAuthState;
    });
    const signInDev = useCallback(async (credentials: ICredentialsDev) => {
       
        const response = await api.post('/login', credentials);
        const {token, user, produto, cliente, pedido} = response.data;

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('produto', JSON.stringify(produto))
        localStorage.setItem('cliente', JSON.stringify(cliente))
        localStorage.setItem('pedido', JSON.stringify(pedido))
        
        api.defaults.headers.Authorization = `Bearer ${token}`;

        setData({
           token,
           user,
           produto,
           cliente,
           pedido
        });
    }, []);

    const updateUser = useCallback(async (user: IUser ) => {
        localStorage.setItem('user', JSON.stringify(user))
        
        setData({
            token: data.token,
            user,
            produto: data.produto,
            cliente: data.cliente,
            pedido: data.pedido
        });
    }, [data.token,data.produto, data.cliente, data.pedido]);

    const signOut = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        api.defaults.headers = {};
        setData({} as IAuthState);
      }, []);

    return(
         <AuthContext.Provider value={{signInDev, user: data.user, produto:data.produto, cliente: data.cliente, pedido: data.pedido , signOut, updateUser}}>{children}</AuthContext.Provider>
    )
};

export const useAuth = (): IAuthContextState => {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
  
    return context;
};