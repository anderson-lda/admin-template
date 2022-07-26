import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import { AppProvider } from '../data/context/AppContext'
import { AuthProvider } from '../data/context/AuthContext'

//provider esta provendo para todos os objetos da aplicacao
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </AuthProvider>)
}

export default MyApp
