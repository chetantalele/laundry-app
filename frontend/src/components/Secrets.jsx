import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Secrets() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://43.204.96.204:3000/secrets", { withCredentials: true })
      .then((response) => {
        setMessage(response.data.message);

        navigate("/home");
      })
      .catch((error) => {
        console.error("Error fetching secrets:", error);
      });
  }, []);

  return <div>{message ? message : "Loading secrets..."}</div>;
}

export default Secrets;