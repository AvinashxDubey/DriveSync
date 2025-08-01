import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import AssignUpdateForm from '../components/AssignUpdateForm';
import ErrorMessage from '../components/ErrorMessage';

import { getAllVehicles, assignUpdateToVehicle } from '../services/api';

import '../styles/AssignUpdate.css';

function AssignUpdate() {
  const [vehicles, setVehicles] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoadingData(true);
      setError('');

      try {
        const vehiclesRes = await getAllVehicles();

        const dummyUpdates = [
          { _id: 'u1', name: 'Engine Firmware v2.1' },
          { _id: 'u2', name: 'Security Patch 2025-08' },
          { _id: 'u3', name: 'Entertainment System v5.0' },
        ];

        if (isMounted) {
          setVehicles(vehiclesRes.data?.vehicles || vehiclesRes.data || []);
          setUpdates(dummyUpdates);
        }
      } catch (err) {
        if (!isMounted) return;
        let msg = 'Failed to load data.';
        if (err.response?.data?.message) msg = err.response.data.message;
        else if (err.message) msg = err.message;
        setError(msg);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const onAssignUpdate = async (vehicleId, updateId) => {
    try {
      await assignUpdateToVehicle(vehicleId, { updateId });
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="assignUpdateContainer">
      {error && <ErrorMessage message={error} />}

      {loadingData ? (
        <Loader />
      ) : (
        <AssignUpdateForm
          vehicles={vehicles}
          updates={updates}
          onAssignUpdate={onAssignUpdate}
          disabled={false}
        />
      )}
    </div>
  );
}

export default AssignUpdate;
