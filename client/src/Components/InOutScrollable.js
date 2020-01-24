import React from "react";
import moment from "moment";

const InOutScrollable = ({ type, scrollData }) => {
  const tileColorClass =
    type === "in"
      ? "tile is-child box notification is-info"
      : "tile is-child box notification is-danger";

  const tableColorClass =
    type === "in"
      ? "table has-background-info is-fullwidth has-text-white-ter "
      : "table has-background-danger is-fullwidth has-text-white-ter ";

  const renderList = () => {
    return scrollData.map(dat => {
      return (
        <tr key={dat._id}>
          <th className="has-text-white-ter">{dat.vehicle}</th>
          <td>{dat.guest_id ? "No" : "Yes"}</td>
          <td>{dat.name}</td>
          <td>
            {moment(type === "in" ? dat.in_time : dat.out_time).format("LTS")}
          </td>
        </tr>
      );
    });
  };

  return (
    <div
      className={tileColorClass}
      style={{
        overflow: "auto"
      }}
    >
      <div style={{ overflow: "none" }}>
        <div className="title">{type.toUpperCase()}</div>
        <table className={tableColorClass}>
          <thead>
            <th>Vehicle Number</th>
            <th>Resident</th>
            <th>Person Name</th>
            <th>Time</th>
          </thead>
          <tbody>{renderList()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default InOutScrollable;
