import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const ServerErrorPage = () => {
  return (
    <>
      {/* <Navbar /> */}
      <div className="content-server-error">
        <img
          src="/server-offline.svg"
          alt="server-offline"
          style={{ height: 300 }}
        />
        <p>Sorry, the server seems to be offline.</p>
        <p>Should be back up in a jiffy.</p>
        <Link to="/">Try Again</Link>
      </div>
    </>
  );
};

export default ServerErrorPage;
