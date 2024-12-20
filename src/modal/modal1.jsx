import red from "../assets/img/flagred.png";
import green from "../assets/img/flaggreen.png";
import close from "../assets/img/close.png";

const Modal = ({ show, onClose, data }) => {
  // Ensure data exists before destructuring to avoid undefined errors
  const { prop, flag, color } = data || {};

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-background')) {
      onClose();
    }
  };

  // If the modal should not show, return null (don't render)
  if (!show) return null;

  return (
    <div className={`modal-overlay ${show ? 'show' : ''}`} onClick={handleOverlayClick}>
       <div className="modal-background"></div>
      <div className={`modal ${show ? 'show' : ''}`}>
        <button className="close-button" onClick={onClose}>
          <img src={close} style={{ width: '20px' }} alt="Close" />
        </button>
        <div className="flagWrapper">
          <div className="row text-start">
            {/* Render specific properties instead of entire object */}
            <h1 className='flagHeader'>{prop || 'Default Title'}</h1>
            <div className="col-12">
              <span className='flagName'><img src={color=="green" ? green : red} className='flag' alt={`${color} flag`} />{color == "green" ? "Green" : "Red"} Flags</span>
              <ul className='flagList'>
                {flag.length != 0 ? flag.map(item => (
                  <li key={item.id}>
                    <span className='flagStrong'></span> {item}
                  </li>
                ))
                :
                <p>There is no {color} flag</p>
              }
              </ul>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Modal;
