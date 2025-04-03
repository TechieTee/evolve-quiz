import '../styles/quiz.css'; 
import '../styles/home.css'; // Additional home page styles
import BodyQuiz from '../components/bodyQuiz';

const HomePage = () => {
  return (
    <div className="home-page">

      {/* Main Content Area */}
      <main className="main-content">
        {/* Introduction Section */}
        <section className="intro-section">
        <div className="header-content">
          <h1>Evolve Med Spa Body Treatment Quiz</h1>
          <p className="subtitle">
            Discover personalized treatment recommendations based on your specific concerns
          </p>
        </div>
          <div className="container">
            <h2>How It Works</h2>
            <div className="steps-container">
              <div className="step">
                <div className="step-icon">1</div>
                <h3>Body Area Selection</h3>
                <p>Choose the area of your body you're interested in treating from the front or back view</p>
              </div>
              <div className="step">
                <div className="step-icon">2</div>
                <h3>Identify Your Condition</h3>
                <p>Select the specific condition you'd like to address</p>
              </div>
              <div className="step">
                <div className="step-icon">3</div>
                <h3>Get Recommendations</h3>
                <p>Receive personalized service recommendations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz Container */}
        <section className="quiz-container-section">
        
        
            <div className="quiz-wrapper">
              <BodyQuiz />
            </div>
    
        </section>

 

        {/* Additional Information Section */}
        <section className="info-section">
          <div className="container">
            <h2>About Our Treatments</h2>
            <p>
              Our clinic specializes in advanced aesthetic treatments tailored to your unique needs.
              The recommendations provided by this quiz are based on our most popular and effective
              treatment options.
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
        </section>
      </main>

      {/* Footer */}
      <footer className="quiz-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Evolve Med Spa. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;