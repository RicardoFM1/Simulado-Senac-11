import { useEffect, useState } from "react"
import Api from "../../service/api"
import { Button, Form, InputGroup } from "react-bootstrap"
import style from "./convidados.module.css"
import { CiSearch } from "react-icons/ci";
import Tabela from "../Tabela/tabela";
import { IoIosArrowForward } from "react-icons/io";
import ConvidadoModal from "../Modais/Convidados/convidadoModal";
import { toast } from "react-toastify";

const Convidados = () => {
    const [convidados, setConvidados] = useState([])
    const [convidadosFiltrados, setConvidadosFiltrados] = useState([])
    const [convidadoSelecionado, setConvidadoSelecionado] = useState([])
    const [search, setSearch] = useState("")
    const [show, setShow] = useState()
    const [mesas, setMesas] = useState([])

    const buscarMesas = async () => {
        try {

            const res = await Api.get('/mesa')

            if (res.status === 200) {
                setMesas(res.data.dados)

            }

        } catch (err) {
            console.log(err)
        }
    }


    const buscarConvidados = async () => {
        try {

            const res = await Api.get('/convidado')

            if (res.status === 200) {
                setConvidados(res.data.dados)
                setConvidadosFiltrados(res.data.dados)
            }

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        buscarConvidados()
        buscarMesas()

    }, [])

    const handleNovo = () => {
        setShow(true)
        setConvidadoSelecionado(null)
    }

    const handleSelected = (row) => {
        setShow(true)
        setConvidadoSelecionado(row)
    }

    const handleClose = () => {
        setShow(false)
        setConvidadoSelecionado(null)
        buscarConvidados()
        buscarMesas()

    }

    useEffect(() => {
        setConvidadosFiltrados(
            convidados.filter((c) => (c.nome + "" + c.sobrenome + "" + c.email + "" + c.cpf + "" + c.telefone + "" + c.categoria + "" + c.confirmacao + "" + c.mesa_idmesa).toLowerCase().includes(search?.toLowerCase()))
        )
    }, [search])

    const columns = [
        { header: 'Nome', accessor: 'nome' },
        { header: 'Sobrenome', accessor: 'sobrenome' },
        { header: 'Email', accessor: 'email' },
        { header: 'Cpf', accessor: 'cpf' },
        { header: 'Telefone', accessor: 'telefone' },
        { header: 'Categoria', accessor: 'categoria' },
        {
            header: 'Confirmação', accessor: 'confirmacao', render: (row) => {
                if (row.confirmacao === 'confirmado') {
                    return <span className="text-success">{row.confirmacao}</span>
                }
                if (row.confirmacao === 'pendente') {
                    return <span className="text-warning">{row.confirmacao}</span>
                } else {
                    return <span className="text-danger">{row.cancelado}</span>
                }
            },
        },
        { header: 'Nº da mesa', accessor: 'mesa_idmesa', render: (row) => row.mesa_idmesa ? `  ${row.mesa_idmesa}` : '-' },

        {
            header: '', accessor: '', render: (row) => (
                <IoIosArrowForward />

            )
        },

    ]

    const enviarDados = async (dados) => {
        try {
            if (convidadoSelecionado) {
                const res = await Api.put(`/convidado?email_convidado=${convidadoSelecionado.email}`, dados)

                if (res.status === 200) {
                    toast.success(res.data.mensagem || 'Convidado atualizado com sucesso')
                    handleClose()
                }
            } else {

                const res = await Api.post('/convidado', dados)

                if (res.status === 201) {
                    toast.success(res.data.mensagem || 'Convidado registrado com sucesso')
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



            const res = await Api.delete(`/convidado?email_convidado=${convidadoSelecionado?.email}`)

            if (res.status === 200) {
                toast.success(res.data.mensagem || 'Convidado deletado com sucesso')
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

            <div className="d-flex justify-content-between align-content-center align-items-center flex-column flex-xl-row">


                <div className="m-5">

                    <h1>Listagem de convidado</h1>
                    <p>{convidadosFiltrados.length ?? 0} Convidados listados</p>
                    <p>Clique na linha da tabela para gerenciar os convidados</p>
                </div>

                <div className="me-5 d-flex gap-3 flex-column flex-xl-row">
                    <Form.Group>

                        <InputGroup>
                            <InputGroup.Text><CiSearch />
                            </InputGroup.Text>
                            <Form.Control
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Busque um convidado"
                            />
                        </InputGroup>
                    </Form.Group>
                    <Button className={style.btnFiltro} onClick={() => setSearch('')}>Todos</Button>
                    <Button className={style.btnFiltro} onClick={() => setSearch('confirmado')}>Confirmados</Button>
                    <Button className={style.btnFiltro} onClick={() => setSearch('pendente')}>Pendentes</Button>
                    <Button className={style.btnFiltro} onClick={() => setSearch('cancelado')}>Cancelados</Button>

                </div>

            </div>

            <Button className={style.btnAdicionar} onClick={handleNovo}>Adicionar novo registro</Button>
            <Tabela columns={columns} rows={convidadosFiltrados} keyField={'id_convidado'} handleSelected={handleSelected} />
            <ConvidadoModal dados={convidadoSelecionado} mesas={mesas} handleClose={handleClose} show={show} submit={enviarDados} handleDeletar={handleDeletar} />
        </div>
    )
}
export default Convidados