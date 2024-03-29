import { createContext, useEffect, useState } from "react";
import firebase from "../../firebase/config";
import Usuario from "../../model/Usuario";
import route from 'next/router';
import Cookies from 'js-cookie';

interface AuthContextProps{
    usuario: Usuario
    carregando?: boolean
    loginGoogle?: () => Promise<void> //por ser assíncrona, retorna uma promessa de void
    login?: (email:string, senha:string) => Promise<void>
    cadastrar?: (email:string, senha:string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({
    usuario: null,
    loginGoogle: null,
    login: null,
    logout: null //esse e usuario sao obrigatorios aqui
})

async function usuarioNormalizado(usuarioFirebase:firebase.User):Promise<Usuario>{
    const token = await usuarioFirebase.getIdToken()
    return{
        uid:usuarioFirebase.uid,
        nome: usuarioFirebase.displayName,
        email: usuarioFirebase.email,
        token,
        provedor: usuarioFirebase.providerData[0].providerId,
        imagemUrl: usuarioFirebase.photoURL
    }
}

function gerenciarCookie(logado: boolean){
    if(logado){
        Cookies.set('admin-template-auth',logado, {
            expires: 7 //em dias
        })
    }else{
        Cookies.remove('admin-template-auth')
    }
}

export function AuthProvider(props){
    const [usuario, setUsuario] = useState<Usuario>(null)
    const [carregando, setCarregando] = useState(true)

    async function configurarSessao(usuarioFirebase){
        if(usuarioFirebase?.email){
            const usuario = await usuarioNormalizado(usuarioFirebase)
            setUsuario(usuario)
            gerenciarCookie(true)
            setCarregando(false)
            return usuario.email
        }else{
            gerenciarCookie(false)
            setUsuario(null)
            setCarregando(false)
            return false
        }
    }

    async function login(email, senha){
        try{
            setCarregando(true)
            const resp = await firebase.auth()
            .signInWithEmailAndPassword(email,senha)
            await configurarSessao(resp.user)
            route.push('/')
        }finally{
            setCarregando(false)
        }
    }

    async function cadastrar(email, senha){
        try{
            setCarregando(true)
            const resp = await firebase.auth()
            .createUserWithEmailAndPassword(email,senha)
            await configurarSessao(resp.user)
            route.push('/')
        }finally{
            setCarregando(false)
        }
    }

    async function loginGoogle(){
        try{
            setCarregando(true)
            const resp = await firebase.auth().signInWithPopup(
                new firebase.auth.GoogleAuthProvider()
            )
            await configurarSessao(resp.user)
            route.push('/')
        }finally{
            setCarregando(false)
        }
    }

    async function logout(){
        try{
            setCarregando(true)
            await firebase.auth().signOut()
            await configurarSessao(null)
        }finally{
            setCarregando(false)
        }
    }

    useEffect(()=>{
            if(Cookies.get('admin-template-auth')){
                const cancelar = firebase.auth().onIdTokenChanged(configurarSessao) //qdo um evento acontecer (id do token se modificar), configsessao sera chamado
                return () => cancelar()    
            }else{
                setCarregando(false)
            }
        },[])

    return(
        <AuthContext.Provider value={{
            usuario, loginGoogle, login, logout, carregando, cadastrar
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext