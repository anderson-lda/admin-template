import Layout from "../components/template/Layout"
import useAppData from "../data/hook/UseAppData"

export default function Notificaoes() {
  const {alternarTema} = useAppData()

  return (
    <Layout titulo="Notificações" 
    subtitulo="Aqui você irá gerenciar suas notificações">
      <h3>conteudo</h3>
      <button onClick={alternarTema}>Alternar Tema</button>
    </Layout>
  )
}
