import { useEffect, useState } from "react"
import Api from "../../service/api"
import { Button, Card, Form, InputGroup } from "react-bootstrap"
import style from "./dashboard.module.css"
import { CiSearch } from "react-icons/ci";
import Tabela from "../Tabela/tabela";
import { IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
import UsuarioModal from "../Modais/Usuarios/usuarioModal";

const Dashboard = () => {
    const [usuarios, setUsuarios] = useState([])
    const [dashboard, setDashboard] = useState([])
    const [retrieve, setRetrieve] = useState([])
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([])
    const [usuarioSelecionado, setUsuarioSelecionado] = useState([])
    const [search, setSearch] = useState("")
    const [show, setShow] = useState()


    const buscarUsuarios = async () => {
        try {

            const res = await Api.get('/usuario')

            if (res.status === 200) {
                setUsuarios(res.data.dados)
                setUsuariosFiltrados(res.data.dados)
            }

        } catch (err) {
            console.log(err)
        }
    }

    const buscarDashboard = async () => {
        try {

            const res = await Api.get('/dashboard')

            if (res.status === 200) {
                setDashboard(res.data.dados)

            }

        } catch (err) {
            console.log(err)
        }
    }

    const buscarRetrieve = async () => {
        try {

            const res = await Api.get('/retrieve')

            if (res.status === 200) {
                setRetrieve(res.data.dados)

            }

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        buscarDashboard()
        buscarUsuarios()
        buscarRetrieve()
    }, [])

    const handleNovo = () => {
        setShow(true)
        setUsuarioSelecionado(null)
    }

    const handleSelected = (row) => {
        setShow(true)
        setUsuarioSelecionado(row)
    }

    const handleClose = () => {
        setShow(false)
        setUsuarioSelecionado(null)
        buscarDashboard()
        buscarRetrieve()
        buscarUsuarios()

    }

    useEffect(() => {
        setUsuariosFiltrados(
            usuarios.filter((c) => (c.nome + "" + "" + c.email + "" + c.cpf + "" + c.cargo).toLowerCase().includes(search?.toLowerCase()))
        )
    }, [search])

    const columns = [
        { header: 'Nome', accessor: 'nome' },
        { header: 'Email', accessor: 'email' },
        { header: 'Cpf', accessor: 'cpf' },
        { header: 'Cargo', accessor: 'cargo' },
        {
            header: '', accessor: '', render: (row) => (
                <IoIosArrowForward />

            )
        },

    ]

    const enviarDados = async (dados) => {
        try {
            if (usuarioSelecionado) {
                const res = await Api.put(`/usuario?email_usuario=${usuarioSelecionado?.email}`, dados)

                if (res.status === 200) {
                    toast.success(res.data.mensagem || 'Usuário atualizado com sucesso')
                    handleClose()
                }
            } else {

                const res = await Api.post('/usuario', dados)

                if (res.status === 201) {
                    toast.success(res.data.mensagem || 'Usuário registrado com sucesso')
                    handleClose()
                }
            }
        } catch (err) {
            const erros = err.response.data?.erros

            if (erros) {
                Object.values(erros).forEach((msg) => {
                    toast.error(msg)
                })
            } else {
                toast.error(err.response.data?.mensagem)
            }
        }
    }

    const handleDeletar = async () => {
        try {



            const res = await Api.delete(`/usuario?email_usuario=${usuarioSelecionado?.email}`)

            if (res.status === 200) {
                toast.success(res.data.mensagem || 'Usuário deletado com sucesso')
                handleClose()
            }

        } catch (err) {
            const erros = err.response.data?.erros

            if (erros) {
                Object.values(erros).forEach((msg) => {
                    toast.error(msg)
                })
            } else {
                toast.error(err.response.data?.mensagem)
            }
        }
    }

    return (
        <div>

            <div className={style.divCards}>

                <Card>
                    <Card.Header className={style.cardHeader}>
                        <Card.Title>Total convidados:</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <h2>{dashboard?.total ?? 0}</h2>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Header className={style.cardHeader}>
                        <Card.Title>Confirmados:</Card.Title>
                    </Card.Header>
                    <Card.Body>
                       <h2>{dashboard?.confirmados ?? 0}</h2>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header className={style.cardHeader}>
                        <Card.Title>Pendentes</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <h2>{dashboard?.pendentes ?? 0}</h2>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Header className={style.cardHeader}>
                        <Card.Title>Cancelados</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <h2>{dashboard?.cancelados ?? 0}</h2>
                    </Card.Body>
                </Card>
            </div>
                {retrieve?.cargo_usuario === 'administrador' ? (
            <div>


                    <div className="d-flex justify-content-between align-content-center align-items-center flex-column flex-xl-row">


                        <div className="m-5">
                            <h3 className="text-muted">Administração:</h3>

                            <h1>Listagem de usuários</h1>

                        </div>

                        <div className="me-5 d-flex gap-3">
                            <Form.Group>

                                <InputGroup>
                                    <InputGroup.Text><CiSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Busque um usuário"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Button className={style.btnFiltro} onClick={() => setSearch('')}>Todos</Button>
                            <Button className={style.btnFiltro} onClick={() => setSearch('administrador')}>Administrador</Button>
                            <Button className={style.btnFiltro} onClick={() => setSearch('ceremonialista')}>Ceremonialista</Button>
                        </div>

                    </div>

                <Button className={style.btnAdicionar} onClick={handleNovo}>Adicionar novo registro</Button>
                <Tabela columns={columns} rows={usuariosFiltrados} keyField={'id_usuario'} handleSelected={handleSelected} />
                <UsuarioModal dados={usuarioSelecionado} handleClose={handleClose} handleDeletar={handleDeletar} show={show} submit={enviarDados} />
            </div>
                ) : ("")}
        </div>
    )
}
export default Dashboard