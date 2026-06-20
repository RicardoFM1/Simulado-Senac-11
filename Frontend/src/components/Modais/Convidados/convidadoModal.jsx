import { useEffect, useState } from "react"
import { Button, Form, Modal, Stack } from "react-bootstrap"
import style from "./convidadoModal.module.css"
import ModalConfirmacao from "../ModalConfirmacao/modalConfirmacao"
import { IMaskInput } from "react-imask"

const ConvidadoModal = ({ dados, mesas, show, handleClose, submit, handleDeletar }) => {
    const [formData, setFormData] = useState({ nome: "", sobrenome: "", email: "", cpf: "", telefone: "", categoria: "", confirmacao: "", mesa_idmesa: "" })
    const [editando, setEditando] = useState(false)
    const [showDeletar, setShowDeletar] = useState(false)
   


    useEffect(() => {
       

        if (dados) {
            setEditando(true)
            setFormData(dados)
        } else {
            setEditando(false)
            setFormData({ nome: "", sobrenome: "", email: "", cpf: "", telefone: "", categoria: "", confirmacao: "", mesa_idmesa: "" })
        }

    }, [show, dados])

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (!name) console.log('Sem nome no input')

        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        submit(formData)
    }

    const handleFechar = () => {
        setShowDeletar(false)
    }

    const handleConfirmar = () => {
        handleDeletar()
        setShowDeletar(false)
        handleClose()

    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{editando ? 'Gerenciar convidado' : 'Registrar convidado'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stack gap={3}>

                        <Form.Group>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                placeholder="Inclua o nome do convidado"
                                value={formData.nome}
                                name="nome"
                                onChange={handleChange}
                                required={!editando}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Sobrenome</Form.Label>
                            <Form.Control
                                placeholder="Inclua o sobrenome do convidado"
                                value={formData.sobrenome}
                                name="sobrenome"
                                onChange={handleChange}
                                required={!editando}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Inclua o email do convidado"
                                value={formData.email}
                                name="email"
                                onChange={handleChange}
                                required={!editando}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Cpf</Form.Label>
                            <Form.Control
                               
                                as={IMaskInput}
                                mask="000.000.000-00"
                                placeholder="Inclua o cpf do convidado"
                                value={formData.cpf}
                                name="cpf"
                                onChange={handleChange}
                                required={!editando}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control

                                as={IMaskInput}
                                mask="(00) 00000-0000"
                                placeholder="Inclua o telefone do convidado"
                                value={formData.telefone}
                                name="telefone"
                                onChange={handleChange}
                                required={!editando}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select


                                placeholder="Inclua a categoria do convidado"
                                value={formData.categoria}
                                name="categoria"
                                onChange={handleChange}
                                required={!editando}
                            >
                                <option value="">Selecione uma opção</option>
                                <option value="noivos">Noivos</option>
                                <option value="familia">Família</option>
                                <option value="amigos">Amigos</option>
                                <option value="equipe">Equipe</option>

                            </Form.Select>
                        </Form.Group>
                        {editando ? (
                            <Form.Group>

                                <Form.Label>Confirmação</Form.Label>
                                <Form.Select


                                    placeholder="Inclua a confirmação do convidado"
                                    value={formData.confirmacao}
                                    name="confirmacao"
                                    onChange={handleChange}
                                    required={!editando}
                                >
                                    <option value="">Selecione uma opção</option>
                                    <option value="confirmado">Confirmado</option>
                                    <option value="pendente">Pendente</option>
                                    <option value="cancelado">Cancelado</option>


                                </Form.Select>
                            </Form.Group>
                        ) : ("")}
                        <Form.Group>

                            <Form.Label>Nº da mesa</Form.Label>
                            <Form.Select


                                placeholder="Inclua o nº da mesa do convidado"
                                value={formData.mesa_idmesa}
                                name="mesa_idmesa"
                                onChange={handleChange}
                                required={!editando}
                            >
                                <option value="">Selecione uma opção</option>
                                

                                    {mesas.map(mesa => (
                                        <option value={mesa?.id_mesa}>{mesa?.id_mesa}</option>
                                    ))}
                                


                            </Form.Select>
                        </Form.Group>

                    </Stack>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" className={style.btnCancelar} onClick={handleClose}>Cancelar</Button>
                    {editando ? (

                        <Button type="button" variant="danger" onClick={() => setShowDeletar(!showDeletar)}>Excluir</Button>
                    ) : ("")}

                    <Button className={style.btnSubmit} type="submit">{editando ? 'Salvar alterações' : 'Registrar'}</Button>
                </Modal.Footer>
            </Form>
            <ModalConfirmacao show={showDeletar} handleClose={handleFechar} handleConfirmar={handleConfirmar} />
        </Modal>
    )
}

export default ConvidadoModal