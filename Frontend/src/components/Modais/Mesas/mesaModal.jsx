import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import style from "./mesaModal.module.css"
import ModalConfirmacao from "../ModalConfirmacao/modalConfirmacao"

const MesaModal = ({ dados, show, handleClose, submit, handleDeletar }) => {
    const [formData, setFormData] = useState({ capacidade: "" })
    const [editando, setEditando] = useState(false)
    const [showDeletar, setShowDeletar] = useState(false)

    useEffect(() => {
        if (dados) {
            setEditando(true)
            setFormData(dados)
        } else {
            setEditando(false)
            setFormData({ capacidade: "" })
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
                    <Modal.Title>{editando ? 'Gerenciar mesa' : 'Registrar mesa'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Capacidade</Form.Label>
                        <Form.Control
                            placeholder="Inclua a capacidade da mesa"
                            value={formData.capacidade}
                            name="capacidade"
                            onChange={handleChange}
                            required={!editando}
                            type="number"
                        />
                    </Form.Group>
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

export default MesaModal