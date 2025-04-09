// interface Service {
//   id: string;
//   title: string;
//   link: string;
//   taxonomy?: { id: string; name: string }[];
// }

// interface ServiceRecommendationsProps {
//   services: Service[];
// }

// const ServiceRecommendations = ({ services }: ServiceRecommendationsProps) => {
//   return (
//     <div className="service-recommendations">
//       <h2>Recommended Services</h2>
//       <div className="service-grid">
//         {services.map((service) => (
//           <div key={service.id} className="service-card">
//             {service.taxonomy && service.taxonomy.length > 0 && (
//               <div className="service-tags">
//                 {service.taxonomy.map((tax) => (
//                   <span key={tax.id} className="tag">
//                     {tax.name}
//                   </span>
//                 ))}
//               </div>
//             )}
//             <h3>{service.title}</h3>
//             <a href={service.link} target="_blank" rel="noopener noreferrer">
//               View Details
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ServiceRecommendations;

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
            {/* <a href={service.link} target="_blank" rel="noopener noreferrer">
              View Details
            </a> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceRecommendations;
