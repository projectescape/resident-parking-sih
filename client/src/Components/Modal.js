import React, { useState } from "react";
import axios from "axios";

const Modal = ({ active = false, toggle, vehicle }) => {
  const [formData, setFormData] = useState({
    name: null,
    mobile: null,
    address: null
  });

  const getActiveClass = () => {
    return active ? "modal is-active" : "modal";
  };

  const handleSubmit = async () => {
    console.log(formData);
    await axios.post("http://localhost:4001/security/form", formData);
    toggle();
  };

  return (
    <div className={getActiveClass()}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">UnAuthorzed Vehicle</p>
        </header>
        <section className="modal-card-body">
          <div class="field">
            <label class="label">Vehicle Number</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input is-success"
                type="text"
                placeholder="Text input"
                value={vehicle}
                disabled
              />
              <span class="icon is-small is-left">
                <i class="fas fa-car"></i>
              </span>
            </div>
          </div>

          <div class="field">
            <label class="label">Name</label>
            <div class="control has-icons-left">
              <input
                class="input is-success"
                type="text"
                placeholder="Enter Name"
                value={formData.name}
                onChange={e => {
                  setFormData({ ...formData, name: e.target.value });
                }}
              />
              <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
              </span>
            </div>
          </div>

          <div class="field">
            <label class="label">Mobile Number</label>
            <div class="control has-icons-left">
              <input
                class="input is-success"
                type="number"
                placeholder="Enter Mobile Number"
                value={formData.mobile}
                onChange={e => {
                  setFormData({ ...formData, mobile: e.target.value });
                }}
              />
              <span class="icon is-small is-left">
                <i class="fas fa-phone"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label">Resident Address</label>
            <div class="control has-icons-left">
              <input
                class="input is-success"
                type="text"
                placeholder="Email Address"
                value={formData.address}
                onChange={e => {
                  setFormData({ ...formData, address: e.target.value });
                }}
              />
              <span class="icon is-small is-left">
                <i class="fas fa-home"></i>
              </span>
            </div>
          </div>

          <div class="field is-grouped"></div>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={handleSubmit}>
            Submit
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Modal;
