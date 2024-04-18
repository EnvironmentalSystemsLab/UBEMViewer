import React from 'react';

const HomePage = ({ handleDigitalTwinClick }) => {
  return (
    <div className="home-page">
      {/* <p className="second-title">Our Mission</p>
      <p className="main-text">
        This project introduces a highly automated and scalable methodology for mapping Energy Use in US cities. It generates building energy models from widely urban data sets to support decision-making in urban decarbonization efforts. We focus on automation, scalability, lightweight computation, and intuitive result visualization to make our approach available to resource-constrained municipalities of small to medium size.
      </p> */}

      <p className="second-title">Digital Twin APIs</p>
      <img className="general-image" src="../Image/digitalTwin_withIcon.png" onClick={handleDigitalTwinClick} />
      <img className="general-image" src="../Image/digitalTwinAdd.png" />
      <img className="general-image" src="../Image/digitalTwinBlank.png" />
      <img className="general-image" src="../Image/digitalTwinBlank.png" />
      <img className="general-image" src="../Image/digitalTwinBlank.png" />

      <p className="second-title">Our Partners</p>
      <img className="general-image" src="../Image/partners.png" />

      <p className="second-title">Disclaimer</p>
      <p className="main-text">
        The data and the associated metadata are provided "as-is," without express or implied warranty of completeness, accuracy, or fitness for a particular purpose.
      </p>
    </div>
  );
};


<a href="https://explorer.morphocode.com/attribution#disclaimer">Read full disclaimer</a>

export default HomePage;
