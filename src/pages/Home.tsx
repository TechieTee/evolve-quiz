import "../styles/quiz.css";
import "../styles/home.css"; // Additional home page styles
import BodyQuiz from "../components/bodyQuiz";

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Main Content Area */}
      <main className="main-content">
        {/* Introduction Section */}
        {/* <section className="intro-section">
          <div className="header-content">
            <p className="subtitle">Take out the guess work on your goals</p>
            <h1>TAKE OUR AESTHETICS QUIZ</h1>
          </div>
          <div className="container">
            <p className="subtitle-text">
              Everyone has a dream of what their best self looks like. Take our
              aesthetic quiz to find out what our expert providers would suggest
              to meet you goals. This information will help yourself as well as
              our team better understand your goals and create a treatment plan
              specifically for you!
            </p>

            <div className="view-toggle-container">
              <button className="view-toggle">Take The Quiz</button>
            </div>
          
          </div>
        </section> */}

        {/* Quiz Container */}
        <section className="quiz-container-section">
          <div className="quiz-wrapper">
            <BodyQuiz />
          </div>
        </section>

        {/* Additional Information Section */}
        {/* <section className="info-section">
          <div className="container">
            <h2>About Our Treatments</h2>
            <p>
              Our clinic specializes in advanced aesthetic treatments tailored
              to your unique needs. The recommendations provided by this quiz
              are based on our most popular and effective treatment options.
            </p>
            <div className="features-grid">
              <div className="feature">
                <h3>Expert Care</h3>
                <p>All treatments performed by certified professionals</p>
              </div>
              <div className="feature">
                <h3>Personalized Approach</h3>
                <p>Customized treatment plans for optimal results</p>
              </div>
              <div className="feature">
                <h3>Cutting-Edge Technology</h3>
                <p>Using the latest techniques and equipment</p>
              </div>
            </div>
          </div>
        </section> */}
      </main>

      {/* Footer */}
      {/* <footer className="quiz-footer">
        <div className="container">
          <p>
            © {new Date().getFullYear()} Evolve Med Spa. All rights reserved.
          </p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default HomePage;
