import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Webcam from "react-webcam";

function App() {
  const [inData, setInData] = useState(0);
  const [outData, setOutData] = useState(0);

  useEffect(() => {
    const socket = io("http://127.0.0.1:4001");
    socket.on("inData", data => {
      setInData(data);
    });
    socket.on("outData", data => {
      setOutData(data);
    });
  }, []);

  return (
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
            <div
              className="tile is-child box notification is-info"
              style={{
                overflow: "auto"
              }}
            >
              <div style={{ overflow: "none" }}>
                <div className="title">In</div>
                <table className="table has-background-info is-fullwidth has-text-white-ter ">
                  <thead>
                    <th>Vehicle Number</th>
                    <th>Resident</th>
                    <th>Person Name</th>
                    <th>Time</th>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="has-text-white-ter">HR10AE1090</th>
                      <td>Yes</td>
                      <td>Aniket</td>
                      <td>Date.now()</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className="tile is-child box notification is-danger"
              style={{
                overflow: "auto"
              }}
            >
              <div style={{ overflow: "none" }}>
                <div className="title">Out</div>
                <table className="table has-background-danger is-fullwidth has-text-white-ter ">
                  <thead>
                    <th>Vehicle Number</th>
                    <th>Resident</th>
                    <th>Person Name</th>
                    <th>Time</th>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="has-text-white-ter">HR10AE1090</th>
                      <td>Yes</td>
                      <td>Aniket</td>
                      <td>Date.now()</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
