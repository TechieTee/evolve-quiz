import BodyQuiz from "../components/bodyQuiz";
import "../styles/quiz.css";

const HomePage = () => {
  return <BodyQuiz />;
};

export default HomePage;

// import BodyQuiz from "../components/bodyQuiz";
// import "./quiz.css";
// import evolveLogo from "../assets/react.svg";
// import { FiMenu, FiUser, FiX } from "react-icons/fi";
// import { useState } from "react";

// const HomePage = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   return (
//     <div className="home-page">
//       <header className="top-bar">
//         <div className="container">
//           {/* Logo and Mobile Toggle */}
//           <div className="logo-container">
//             <button
//               className="mobile-toggle"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               aria-label="Toggle menu"
//             >
//               {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//             </button>
//             <img src={evolveLogo} alt="Evolve" className="logo" />
//           </div>

//           <nav className="desktop-nav">
//              <ul>
//               <li>
//                 <a href="/treatments">Treatments</a>
//               </li>
//             </ul>
//           </nav>

//        <div className="cta-buttons">
//             <button className="btn-primary">
//               <FiUser size={18} />
//               <span>Book Consultation</span>
//             </button>
//           </div>
//         </div>

//         {mobileMenuOpen && (
//           <div className="mobile-nav">
//             <ul>
//               <li>
//                 <a href="#">Home</a>
//               </li>
//             </ul>
//           </div>
//         )}
//       </header>

//       <main className="body-quiz-container">
//         <BodyQuiz />
//       </main>
//     </div>
//   );
// };
