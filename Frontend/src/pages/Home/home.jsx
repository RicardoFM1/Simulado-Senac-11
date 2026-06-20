import { useEffect, useState } from "react";
import Header from "../../components/Header/header";
import Dashboard from "../../components/Dashboard/dashboard";
import Convidados from "../../components/Convidados/convidados";
import Mesas from "../../components/Mesas/mesas";
import Checkins from "../../components/Checkins/checkins";
import { useNavigate } from "react-router";



const Home = () => {
    const [telaAtiva, setTelaAtiva] = useState('dashboard')
    const navigate = useNavigate()
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
        }
    }, [])
    return (
        <>
            <Header telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
            <main>
                {telaAtiva === 'dashboard' && <Dashboard />}
                {telaAtiva === 'convidados' && <Convidados />}
                {telaAtiva === 'mesas' && <Mesas />}
                {telaAtiva === 'checkin' && <Checkins />}
            </main>
        </>
    )
}

export default Home;    