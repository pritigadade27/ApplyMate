const ConfirmModal = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
      <div className="premium-card p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h5 className="mb-3" style={{ fontWeight: '600' }}>{title}</h5>
        <p className="text-muted mb-4">{message}</p>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-light rounded-pill px-4" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger rounded-pill px-4" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
