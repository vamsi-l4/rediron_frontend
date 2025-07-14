import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EquipmentList.css';

const EquipmentList = () => {
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/equipment/')
      .then(response => {
        setEquipments(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="equipment-container">
      <h2>🏋️ RedIron Gym Equipment</h2>
      <div className="equipment-grid">
        {equipments.map(equip => (
          <div className="equipment-card" key={equip.id}>
            <h3>{equip.name}</h3>
            <p>{equip.usage}</p>
            <div >
              {equip.image && (
              <img
                src={`http://127.0.0.1:8000${equip.image}`}
                alt={equip.name}
              />
            )}
              </div>
            {equip.video_link && (
              <a
                href={equip.video_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                ▶ Watch Video
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentList;
