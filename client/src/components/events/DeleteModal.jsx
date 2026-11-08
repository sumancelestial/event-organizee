import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import cross from '../../assets/cross.png';
import styles from '../../styleModules/DeleteModal.module.css'

const stylesDelete = {
    backgroundColor: 'red'
}

const DeleteModal = forwardRef(function DeleteModal({ eventName, deleteNow }, ref) {

    const dialog = useRef();

    useImperativeHandle(ref, () => {
        const handles = {
            open() {
                dialog.current.showModal();
            },
            close() {
                dialog.current.close();
            }
        }
        return handles;
    });

    const closeModal = () => {
        dialog.current.close();
    }

    window.addEventListener('click', (e) => {
        if (e.target === dialog.current) {
            closeModal();
        }
    })

    return createPortal((
        <dialog ref={dialog} className={styles.modal}>
            <img src={cross} onClick={() => closeModal()} />
            <form method="dialog">
                <p>Do you want to delete the below event?</p>
                <h3>{eventName}</h3>
                <button onClick={() => closeModal()}>Cancel</button>
                <button onClick={deleteNow} style={stylesDelete}>Delete</button>
            </form>
        </dialog>
    ), document.getElementById('modal'));
})

export default DeleteModal;