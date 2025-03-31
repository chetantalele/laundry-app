import React, { useState, useEffect } from "react";
import axios from "axios";
import PHeader from "./PHeader";
import PFooter from "./PFooter";

function ServiceProviderAddService() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/service-provider/services", { withCredentials: true });
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleAddService = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (servicePrice <= 0) {
      setMessage("Service price must be a positive number.");
      setLoading(false);
      return;
    }

    try {
      let serviceId = selectedService;

      if (!serviceId) {
        const response = await axios.post("http://localhost:3000/service-provider/services", {
          name: newServiceName,
          description: newServiceDescription,
        }, { withCredentials: true });
        serviceId = response.data.serviceId;
      }

      const response = await axios.post("http://localhost:3000/service-provider/add-service", {
        serviceId,
        price: servicePrice,
      }, { withCredentials: true });

      if (response.status === 200) {
        setMessage("Service added successfully!");
        setSelectedService("");
        setNewServiceName("");
        setNewServiceDescription("");
        setServicePrice("");
      } else {
        setMessage("Failed to add service.");
      }
    } catch (error) {
      console.error("Error adding service:", error);
      setMessage("Error adding service. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f0f4f8',
    },
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    },
    heading: {
      color: '#194376',
      textAlign: 'center',
      marginBottom: '30px',
      fontSize: '2.5rem',
      fontWeight: 'bold',
      animation: 'fadeIn 0.5s ease-out',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      padding: '40px',
      width: '100%',
      maxWidth: '500px',
      animation: 'slideUp 0.5s ease-out',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      marginBottom: '8px',
      color: '#194376',
      fontWeight: 'bold',
      fontSize: '1rem',
    },
    input: {
      padding: '12px',
      borderRadius: '6px',
      border: '2px solid #e0e0e0',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      '&:focus': {
        borderColor: '#46C6CE',
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(70, 198, 206, 0.2)',
      },
    },
    select: {
      padding: '12px',
      borderRadius: '6px',
      border: '2px solid #e0e0e0',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%23194376\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z\'/%3E%3C/svg%3E")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      '&:focus': {
        borderColor: '#46C6CE',
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(70, 198, 206, 0.2)',
      },
    },
    textarea: {
      padding: '12px',
      borderRadius: '6px',
      border: '2px solid #e0e0e0',
      fontSize: '1rem',
      minHeight: '120px',
      resize: 'vertical',
      transition: 'all 0.3s ease',
      '&:focus': {
        borderColor: '#46C6CE',
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(70, 198, 206, 0.2)',
      },
    },
    button: {
      backgroundColor: '#46C6CE',
      color: '#ffffff',
      padding: '14px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: '#194376',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      '&:disabled': {
        opacity: 0.7,
        cursor: 'not-allowed',
      },
    },
    message: {
      textAlign: 'center',
      marginTop: '20px',
      padding: '12px',
      borderRadius: '6px',
      fontWeight: 'bold',
      animation: 'fadeIn 0.5s ease-out',
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
    },
  };

  return (
    <div style={styles.pageContainer}>
      <PHeader text={"Add Service"} />
      <div style={styles.container}>
        <h1 style={styles.heading}>Add New Service</h1>
        <div style={styles.card}>
          <form onSubmit={handleAddService} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Existing Service</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                style={styles.select}
              >
                <option value="">-- Select a Service --</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Add New Service Name</label>
              <input
                type="text"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                placeholder="New Service Name"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Service Description</label>
              <textarea
                value={newServiceDescription}
                onChange={(e) => setNewServiceDescription(e.target.value)}
                placeholder="New Service Description"
                style={styles.textarea}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Service Price</label>
              <input
                type="number"
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
                placeholder="Service Price"
                style={styles.input}
                required
              />
            </div>
            <button
              type="submit"
              style={styles.button}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Service"}
            </button>
          </form>
          {message && (
            <div
              style={{
                ...styles.message,
                ...(message.includes("successfully") ? styles.successMessage : styles.errorMessage),
              }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
      <PFooter />
    </div>
  );
}

export default ServiceProviderAddService;