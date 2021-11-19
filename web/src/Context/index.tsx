import React from 'react';
import { AuthProvider } from '../Context/auth';

const AppProvider: React.FC = ({ children}) =>{
        return <AuthProvider>{children}</AuthProvider>;
};

export default AppProvider;