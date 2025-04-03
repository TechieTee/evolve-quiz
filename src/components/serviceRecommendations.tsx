// src/components/ServiceRecommendations.js
import React from 'react';

const ServiceRecommendations = ({ services }) => {
  return (
    <div className="service-recommendations">
      <h2>Recommended Services</h2>
      <div className="service-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <h3>{service.title}</h3>
            <a href={service.link} target="_blank" rel="noopener noreferrer">
              View Details
            </a>
            {service.taxonomy && service.taxonomy.length > 0 && (
              <div className="service-tags">
                {service.taxonomy.map((tax) => (
                  <span key={tax.id} className="tag">{tax.name}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceRecommendations;