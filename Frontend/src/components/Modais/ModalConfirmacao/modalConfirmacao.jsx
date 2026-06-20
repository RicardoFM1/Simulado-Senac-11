import { Button, Modal } from "react-bootstrap"
import style from "./ModalConfirmacao.module.css"

const ModalConfirmacao = ({show, handleClose, handleConfirmar}) => {
    return (
        <Modal show={show} onHide={handleClose}>

            <Modal.Header closeButton>

                <Modal.Title className="text-danger">Tem certeza que deseja deletar esse registro?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Essa ação é IRREVERSÍVEL!
            </Modal.Body>
            <Modal.Footer>
            <Button className={style.btnCancelar} onClick={handleClose}>Cancelar</Button>
            <Button variant="danger" onClick={handleConfirmar}>Excluir</Button>

            </Modal.Footer>
        </Modal>
    )
}

export default ModalConfirmacao