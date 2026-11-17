import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/variables.css'
import './styles/base.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { MenuProvider } from './context/MenuContext'
import { TablesProvider } from './context/TablesContext'
import { OrdersProvider } from './context/OrdersContext'
import { PaymentsProvider } from './context/PaymentsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MenuProvider>
          <TablesProvider>
            <OrdersProvider>
              <PaymentsProvider>
                <App />
              </PaymentsProvider>
            </OrdersProvider>
          </TablesProvider>
        </MenuProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)