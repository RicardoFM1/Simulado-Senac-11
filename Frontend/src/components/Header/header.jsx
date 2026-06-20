import { Button, Dropdown, Navbar } from "react-bootstrap"
import style from "./header.module.css"
import logoCasamento from "../../assets/logoCasamento.png"
import { useNavigate } from "react-router"
import { IoMdMenu } from "react-icons/io";

const Header = ({ telaAtiva, setTelaAtiva }) => {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.clear()
        navigate('/login')
    }
    return (
        <Navbar className={style.navbar}>
            <Navbar.Brand className={style.navbarBrand}>
                <img src={logoCasamento} alt="logo Casamento" className={style.logo} />
                <h1 className="mb-0 mt-3">Senac Wedding</h1>
            </Navbar.Brand>

            <div className={style.botoesMeio}>
                <Button onClick={() => setTelaAtiva('dashboard')} className={telaAtiva === 'dashboard' ? style.botaoAtivo : ""}>Dashboard</Button>
                <Button onClick={() => setTelaAtiva('convidados')} className={telaAtiva === 'convidados' ? style.botaoAtivo : ""}>Convidados</Button>
                <Button onClick={() => setTelaAtiva('checkin')} className={telaAtiva === 'checkin' ? style.botaoAtivo : ""}>Check-in</Button>
                <Button onClick={() => setTelaAtiva('mesas')} className={telaAtiva === 'mesas' ? style.botaoAtivo : ""}>Mesas</Button>

            </div>

            <div className={style.botaoFim}>
                <Button onClick={handleLogout} className={style.btnSair}>Sair</Button>
            </div>

            <Dropdown className="me-3 d-block d-xl-none" drop="start">
                <Dropdown.Toggle className="bg-transparent border text-black" >
                    <IoMdMenu />
                </Dropdown.Toggle>
                <Dropdown.Menu className={style.menu}>
                    <Dropdown.Item>
                        <Button onClick={() => setTelaAtiva('dashboard')}>Dashboard</Button>
                    </Dropdown.Item>
                    <Dropdown.Item>

                        <Button onClick={() => setTelaAtiva('convidados')} >Convidados</Button>
                    </Dropdown.Item>
                    <Dropdown.Item>

                        <Button onClick={() => setTelaAtiva('checkin')} >Check-in</Button>
                    </Dropdown.Item>
                    <Dropdown.Item>

                        <Button onClick={() => setTelaAtiva('mesas')} >Mesas</Button>
                    </Dropdown.Item>

                    <Dropdown.Item>
                         <Button onClick={handleLogout} className="text-danger">Sair</Button>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Navbar>
    )
}

export default Header