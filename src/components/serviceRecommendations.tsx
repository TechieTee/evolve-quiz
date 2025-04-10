interface Service {
  id: string;
  title: string;
  link: string;
  taxonomy?: { id: string; name: string }[];
}

interface ServiceRecommendationsProps {
  services: Service[];
}

const ServiceRecommendations = ({ services }: ServiceRecommendationsProps) => {
  return (
    <div className="service-recommendations">
      <div className="service-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            {service.taxonomy && service.taxonomy.length > 0 && (
              <div className="service-tags">
                {service.taxonomy.map((tax) => (
                  <span key={tax.id} className="tag">
                    {tax.name}
                  </span>
                ))}
              </div>
            )}
            <h3>{service.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceRecommendations;
