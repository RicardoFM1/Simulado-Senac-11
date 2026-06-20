import { useEffect, useState } from "react"
import Api from "../../service/api"
import { Button, Form, InputGroup } from "react-bootstrap"
import style from "./checkins.module.css"
import { CiSearch } from "react-icons/ci";
import Tabela from "../Tabela/tabela";
import { IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
import CheckinModal from "../Modais/Checkins/checkinModal";

const Checkins = () => {
    const [convidados, setConvidados] = useState([])
    const [convidadosFiltrados, setConvidadosFiltrados] = useState([])
    const [convidadoSelecionado, setConvidadoSelecionado] = useState([])
    const [search, setSearch] = useState("")
    const [show, setShow] = useState()
    const [mesas, setMesas] = useState([])




    const buscarConvidados = async () => {
        try {

            const res = await Api.get('/checkin')

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


    }

    useEffect(() => {
        setConvidadosFiltrados(
            convidados.filter((c) => (c.nome + "" + c.sobrenome + "" + c.email + "" + c.cpf + "" + c.telefone + "" + c.categoria + "" + c.confirmacao + "" + c.mesa_idmesa).toLowerCase().includes(search?.toLowerCase()))
        )
    }, [search])

    const columns = [
        { header: 'Nº', accessor: 'id_convidado' },
        { header: 'Usuário', accessor: 'usuario', render: (row) => row.usuario ? `${row.usuario.nome || ""} - ${row.usuario.cpf || ""}` : '-' },
        { header: 'Convidado', accessor: 'convidado', render: (row) => row.convidado ? `${row.convidado.nome || ""} ${row.convidado.sobrenome} - ${row.convidado.cpf || ""}` : '-' },

        {
            header: 'Confirmação', accessor: 'convidado.confirmacao', render: (row) => {
                if (row.convidado.confirmacao === 'confirmado') {
                    return <span className="text-success">{row.convidado.confirmacao}</span>
                }
                if (row.convidado.confirmacao === 'pendente') {
                    return <span className="text-warning">{row.convidado.confirmacao}</span>
                } else {
                    return <span className="text-danger">{row.convidado.cancelado}</span>
                }
            },
        },
        { header: 'Data e hora', accessor: 'data_e_hora', render: (row) => row.data_e_hora ? `${row.data_e_hora}` : "-" },
        { header: 'Status', accessor: 'status', render: (row) => row.status ? `${row.status}` : "não realizado" },




        {
            header: '', accessor: '', render: (row) => (
                <IoIosArrowForward />

            )
        },

    ]

    const handleConfirmar = async () => {
        try {


            const res = await Api.post('/checkin', { convidado_idconvidado: convidadoSelecionado.id_convidado })

            if (res.status === 201) {
                toast.success(res.data.mensagem || 'Checkin confirmado com sucesso')
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

    const handleCancelar = async () => {
        try {


            const res = await Api.put(`/checkin/cancelar?id_checkin=${convidadoSelecionado?.id_checkin}`)

            if (res.status === 200) {
                toast.success(res.data.mensagem || 'Checkin cancelado com sucesso')
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
                    <p>Confirme o check-in de um convidado </p>

                </div>

                <div className="me-5 d-flex gap-3 flex-column flex-xl-row mb-4">
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


                </div>

            </div>

            <Tabela columns={columns} rows={convidadosFiltrados} keyField={'id_convidado'} handleSelected={handleSelected} />
            <CheckinModal dados={convidadoSelecionado} handleClose={handleClose} show={show} confirmar={handleConfirmar} cancelar={handleCancelar} />
        </div>
    )
}
export default Checkins