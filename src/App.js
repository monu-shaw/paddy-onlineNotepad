//import { collection, , getDocs  } from "firebase/firestore";
//import db from './firbase';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login.jsx';
import Navbar from './components/navbar.jsx';
import Paddy from './components/paddy.jsx';
import Signup from './components/add.jsx';
import Offline from './offline/offline.jsx';

import useNetwork from './offline/useNetwork';
import Betatester from './components/betatesterform.jsx';
import Share from './components/share.jsx';
import React from 'react';
import { ToastContainer } from 'react-toastify';

function App() {
  const networkState = useNetwork();

  return (
    <BrowserRouter>
      <ToastContainer position="top-right"/>
      {networkState.online && 
        <div style={{marginBottom:'64px'}}>
          <Navbar />
        </div>
      }
      <Routes>
        <Route path="/" element={<Login network={networkState.online} />} />
        <Route path="/home" element={<Paddy network={networkState.online} />} />
        <Route
          path="/share"
          element={<Share network={networkState.online} />}
        />
        <Route
          path="/signup"
          element={<Signup network={networkState.online} />}
        />
        <Route
          path="/offline"
          element={<Offline network={networkState.online} />}
        />
        <Route
          path="/signupasbetatester"
          element={<Betatester network={networkState.online} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
