import Modal from 'react-modal';

function initModal() {
  const div = document.createElement('div');

  document.body.appendChild(div);
  Modal.setAppElement(div);
}

export default initModal;
