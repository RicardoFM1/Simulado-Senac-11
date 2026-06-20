import { useEffect, useState } from "react"
import { Button, Form, Modal, Stack } from "react-bootstrap"
import style from "./usuarioModal.module.css"
import ModalConfirmacao from "../ModalConfirmacao/modalConfirmacao"
import { IMaskInput } from "react-imask"

const UsuarioModal = ({ dados, show, handleClose, submit, handleDeletar }) => {
    const [formData, setFormData] = useState({ nome: "", email: "", cpf: "", senha: "", cargo: "" })
    const [editando, setEditando] = useState(false)
    const [showDeletar, setShowDeletar] = useState(false)



    useEffect(() => {


        if (dados) {
            setEditando(true)
            setFormData(dados)
        } else {
            setEditando(false)
            setFormData({ nome: "", email: "", cpf: "", senha: "", cargo: "" })
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
                    <Modal.Title>{editando ? 'Gerenciar usuário' : 'Registrar usuário'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stack gap={3}>

                        <Form.Group>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                placeholder="Inclua o nome do usuário"
                                value={formData.nome}
                                name="nome"
                                onChange={handleChange}
                                required={!editando}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Inclua o email do usuário"
                                value={formData.email}
                                name="email"
                                onChange={handleChange}
                                required={!editando}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Deixe vazio caso não queira incluir a senha do usuário"
                                value={formData.senha}
                                name="senha"
                                onChange={handleChange}
                                required={!editando}
                            
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Cpf</Form.Label>
                            <Form.Control

                                as={IMaskInput}
                                mask="000.000.000-00"
                                placeholder="Inclua o cpf do usuário"
                                value={formData.cpf}
                                name="cpf"
                                onChange={handleChange}
                                required={!editando}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select


                                placeholder="Inclua a cargo do usuário"
                                value={formData.cargo}
                                name="cargo"
                                onChange={handleChange}
                                required={!editando}
                            >
                                <option value="">Selecione uma opção</option>
                                <option value="administrador">Administrador</option>
                                <option value="ceremonialista">Ceremonialista</option>


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

export default UsuarioModal