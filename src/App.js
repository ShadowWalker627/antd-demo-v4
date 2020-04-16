import React from 'react';

import BaseUpload from './components/BaseUpload'; 
import { BaseUploadStyled } from './style';
import './App.css';

function App() {
  return (
    <div className="App">
      <BaseUploadStyled>
        <h4>自定义upload</h4>
        <BaseUpload />
      </BaseUploadStyled>

    </div>
  );
}

export default App;
