import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background-color: #f7f8fa;
  }
  
  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;