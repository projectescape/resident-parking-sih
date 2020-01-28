import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import io from "socket.io-client";
import InOutScrollable from "./InOutScrollable";
import Modal from "./Modal";

const Layout = () => {
  const [inData, setInData] = useState([]);
  const [outData, setOutData] = useState([]);
  const [modalData, setModalData] = useState({ active: false, vehicle: null });

  const socket = io("http://127.0.0.1:4001");
  socket.on("inData", data => {
    console.log(data);
    setInData([data, ...inData]);
  });
  socket.on("outData", data => {
    console.log(data);
    setOutData([data, ...outData]);
  });
  socket.on("securityForm", vehicle => {
    setModalData({ active: true, vehicle });
  });

  return (
    <>
      <Modal
        active={modalData.active}
        toggle={() => {
          setModalData({ ...modalData, active: !modalData.active });
        }}
        vehicle={modalData.vehicle}
      />
      <section
        class="hero is-dark is-fullheight is-bold"
        style={{ paddingTop: "10px" }}
      >
        <div className="container is-fluid ">
          <div className="tile is-ancestor" style={{ height: "100vh" }}>
            <div
              className="tile is-vertical"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                className="tile is-parent"
                style={{ textAlign: "center", flex: 3 }}
              >
                <div className="tile box is-child notification is-primary ">
                  <Webcam style={{ height: "100%" }} />
                </div>
              </div>
              <div className="tile">
                <div className="tile is-parent">
                  <div className="tile box is-child notification is-warning ">
                    <p className="title ">Current pending</p>
                  </div>
                </div>
                <div className="tile is-parent is-vertical">
                  <div className="tile box is-child notification is-warning ">
                    <div>
                      <p className="title has-text-dark">Total parking space</p>
                      40
                    </div>
                  </div>
                  <div className="tile box is-child notification is-warning ">
                    <div>
                      <p className="title  has-text-dark">Available space</p>
                      20
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tile is-vertical is-parent is-4">
              <InOutScrollable type="in" key="in" scrollData={inData} />
              <InOutScrollable type="out" key="out" scrollData={outData} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Layout;
