import React from 'react';
import styled from 'styled-components';
import EditForm from './EditForm';

const EditProductModal = ({ product, onClose, onUpdate }) => {
    return (
        <Modal>
        <ModalContent>
            <CloseButton onClick={onClose}>✖</CloseButton>
            <h2>Editar producto</h2>
            <EditForm
            product={product}
            onUpdate={onUpdate}
            onCancel={onClose}
            />
        </ModalContent>
        </Modal>
    );
};

export default EditProductModal;

// --- Styled Components ---
const Modal = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  width: 90%;
  max-width: 700px;
  border-radius: 12px;
  position: relative;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.3s ease;

  /* 👇 Agregamos esto */
  max-height: 90vh;
  overflow-y: auto;

  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;


const CloseButton = styled.button`
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    font-size: 1.5rem;
    cursor: pointer;
    border: none;
`;
