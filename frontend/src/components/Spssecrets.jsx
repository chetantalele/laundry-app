import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Spssecrets() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://43.204.96.204:3000/service-provider/secrets", { withCredentials: true })
      .then((response) => {
        setMessage(response.data.message);

        navigate('/homep')
      })
      .catch((error) => {
        console.error("Error fetching secrets:", error);
      });
  }, []);

  return <div>{message ? message : "Loading secrets..."}</div>;
}

export default Spssecrets;
