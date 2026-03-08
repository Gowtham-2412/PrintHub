import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './customer/pages/HomePage';
import AuthPage from './customer/pages/AuthPage';
import { Toaster } from 'react-hot-toast';
import AdminPage from './admin/AdminPage';
import DashBoard from './admin/DashBoard';
import ManageServices from './admin/ManageServices';
import Orders from './admin/Orders';
import CartPage from './customer/pages/CartPage';
import MyOrdersPage from './customer/pages/MyOrdersPage';

const App = () => {
  return (
    <div className=" bg-[#ebedef] min-h-[100dvh] h-auto">
      <Toaster position='top-right' reverseOrder={false}/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<AuthPage type='login' />}/>
        <Route path='/register' element={<AuthPage type='register' />}/>
        <Route path='/cart' element={<CartPage/>}/>
        <Route path='/my-orders' element={<MyOrdersPage/>}/>
        <Route path='/admin' element={<AdminPage />}>
          <Route index element={<Navigate to='dashboard' replace />} />
          <Route path='dashboard' element={<DashBoard/>} />
          <Route path='manage' element={<ManageServices/>} />
          <Route path='orders' element={<Orders/>} />
        </Route>
      </Routes>
    </div>
  )
}
export default App;
