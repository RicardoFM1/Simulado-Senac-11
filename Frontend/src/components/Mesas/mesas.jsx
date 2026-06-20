import { useEffect, useState } from "react"
import Api from "../../service/api"
import { Button, Form, InputGroup } from "react-bootstrap"
import style from "./mesas.module.css"
import { CiSearch } from "react-icons/ci";
import Tabela from "../Tabela/tabela";
import { IoIosArrowForward } from "react-icons/io";
import MesaModal from "../Modais/Mesas/mesaModal";
import { toast } from "react-toastify";

const Mesas = () => {
    const [mesas, setMesas] = useState([])
    const [mesasFiltradas, setMesasFiltradas] = useState([])
    const [mesaSelecionada, setMesaSelecionada] = useState([])
    const [search, setSearch] = useState("")
    const [show, setShow] = useState()

    const buscarMesas = async () => {
        try {

            const res = await Api.get('/mesa')

            if (res.status === 200) {
                setMesas(res.data.dados)
                setMesasFiltradas(res.data.dados)
            }

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        buscarMesas()
    }, [])

    const handleNovo = () => {
        setShow(true)
        setMesaSelecionada(null)
    }

    const handleSelected = (row) => {
        setShow(true)
        setMesaSelecionada(row)
    }

    const handleClose = () => {
        setShow(false)
        setMesaSelecionada(null)
        buscarMesas()
    }

    useEffect(() => {
        setMesasFiltradas(
            mesas.filter((m) => String(m.id_mesa).includes(search))
        )
    }, [search])

    const columns = [
        { header: 'Nº', accessor: 'id_mesa' },
        { header: 'Capacidade', accessor: 'capacidade' },
        {
            header: '', accessor: '', render: (row) => (
                <IoIosArrowForward />

            )
        },

    ]

    const enviarDados = async (dados) => {
        try {
            if (mesaSelecionada) {
                const res = await Api.put(`/mesa?id_mesa=${mesaSelecionada.id_mesa}`, dados)

                if (res.status === 200) {
                    toast.success(res.data.mensagem || 'Mesa atualizada com sucesso')
                    handleClose()
                }
            } else {

                const res = await Api.post('/mesa', dados)

                if (res.status === 201) {
                    toast.success(res.data.mensagem || 'Mesa registrada com sucesso')
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

    const handleDeletar = async() => {
        try {



            const res = await Api.delete(`/mesa?id_mesa=${mesaSelecionada?.id_mesa}`)

            if (res.status === 200) {
                toast.success(res.data.mensagem || 'Mesa excluída com sucesso')
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

                    <h1>Listagem de mesas</h1>
                    <p>{mesasFiltradas.length ?? 0} Mesas listadas</p>
                    <p>Clique na linha da tabela para gerenciar as mesas</p>
                </div>

                <div className="me-5 flex-column flex-xl-row">
                    <Form.Group>

                        <InputGroup>
                            <InputGroup.Text><CiSearch />
                            </InputGroup.Text>
                            <Form.Control
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Busque uma mesa (nº)"
                            />
                        </InputGroup>
                    </Form.Group>

                </div>

            </div>

            <Button className={style.btnAdicionar} onClick={handleNovo}>Adicionar novo registro</Button>
            <Tabela columns={columns} rows={mesasFiltradas} keyField={'id_mesa'} handleSelected={handleSelected} />
            <MesaModal dados={mesaSelecionada} handleClose={handleClose} show={show} submit={enviarDados} handleDeletar={handleDeletar} />
        </div>
    )
}
export default Mesas