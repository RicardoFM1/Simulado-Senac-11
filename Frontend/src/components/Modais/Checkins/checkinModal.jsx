import { useEffect, useState } from "react"
import { Button, Form, Modal, Stack } from "react-bootstrap"
import style from "./checkinModal.module.css"
import ModalConfirmacao from "../ModalConfirmacao/modalConfirmacao"
import { IMaskInput } from "react-imask"

const CheckinModal = ({ dados, show, handleClose, confirmar, cancelar }) => {



    return (
        <Modal show={show} onHide={handleClose}>

            <Modal.Header closeButton>
                <Modal.Title>Gerenciar check-in</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Stack gap={3}>
                    <p><span className="fw-bold">Usuário: </span> {dados?.usuario ? `${dados?.usuario?.nome || ''} - ${dados.usuario?.cpf || ''}` : '-'}</p>

                    <p><span className="fw-bold">Convidado: </span> {dados?.convidado ? `${dados?.convidado?.nome} ${dados?.convidado?.sobrenome} - ${dados?.convidado?.cpf}` : '-'}</p>
                    <p><span className="fw-bold">Confirmação: </span> {dados?.convidado?.confirmacao ? dados.convidado?.confirmacao : '-'}</p>
                    <p><span className="fw-bold">Status: </span> {dados?.status ? dados?.status : 'não realizado'}</p>
                    <p><span className="fw-bold">Data e hora: </span> {dados?.data_e_hora ? dados?.data_e_hora : '-'}</p>



                </Stack>
            </Modal.Body>
            <Modal.Footer>


                <Button className={style.btnCancelar} onClick={cancelar}>Cancelar check-in</Button>


                <Button className={style.btnSubmit} onClick={confirmar}>Confirmar check-in</Button>
            </Modal.Footer>


        </Modal>
    )
}

export default CheckinModal