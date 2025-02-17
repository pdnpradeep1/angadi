import React from 'react';
import { HomeContainer, WelcomeMessage } from '../styles/HomeStyle';

function Home() {
  return (
    <HomeContainer>
      <WelcomeMessage>Welcome to Our Store!</WelcomeMessage>
      {/* Additional components and content for the Home page can go here */}
    </HomeContainer>
  );
}

export default Home;