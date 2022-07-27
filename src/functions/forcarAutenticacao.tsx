import Image from "next/image"
import Router from "next/router"
import loading from '../../public/images/loading.gif'
import useAuth from "../data/hook/UseAuth"
import Head from "next/head"

export default function forcarAutenticacao(jsx){
    const {usuario,carregando} = useAuth()

    function renderizarConteudo(){
        return(
            <>
            <Head>
                <script dangerouslySetInnerHTML={{//garantia a mais de obrigatoriedade de autenticacao
                    __html:`
                    if(!document.cookie?.includes("admin-template-auth")){
                        window.location.href = "/autenticacao"
                    }
                    `
                }}></script>
            </Head>
                {jsx}
            </>
        )
    }

    function renderizarCarregando(){
        return(
            <div className={`
            flex justify-center items-center h-screen
            `}>
                <Image src={loading} />
            </div>
        )
    }

    if(!carregando && usuario?.email){//? garante que nao se acessara um atributo nulo de objeto
        return renderizarConteudo()
    } else if(carregando){
        return renderizarCarregando()
    }else{
        Router.router.push('/autenticacao')
        return null
    }
}