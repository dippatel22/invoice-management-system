
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import { Login } from './components/login/Login';
import { Register } from './components/register/Register';
import {Dashboard} from './components/dashboard/Dashboard'
import { Home } from './components/dashboard/Home';
import { Invoices } from './components/dashboard/Invoices';
import { NewInvoice } from './components/dashboard/NewInvoice';
import { Setting } from './components/dashboard/Setting';
import { InvoiceDetail } from './components/dashboard/InvoiceDetail';

function App() {

  const myRouter=createBrowserRouter([
    {path:'/login', Component:Login},
    {path:'', Component:Login},
    {path:'/register',Component:Register},
    {path:'/dashboard',Component:Dashboard,children:[
      {path:'',Component:Home},
      {path:'home',Component:Home},
      {path:'invoices',Component:Invoices},
      {path:'new-invoice',Component:NewInvoice},
      {path:'setting',Component:Setting},
      {path:'invoice-detail',Component:InvoiceDetail}
    ]}
  ])

  return (
    <>
  <RouterProvider router={myRouter}></RouterProvider>
    </>
  );
}

export default App;
