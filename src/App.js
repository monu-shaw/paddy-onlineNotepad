//import { collection, , getDocs  } from "firebase/firestore"; 
//import db from './firbase';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./components/login.jsx";
import Navbar from "./components/navbar.jsx"
import Paddy from './components/paddy.jsx'
import Signup from './components/add.jsx'
import Offline from "./offline/offline.jsx";

import useNetwork from './offline/useNetwork';
import Betatester from "./components/betatesterform.jsx";


function App() {
  const networkState = useNetwork();
  
  return (
    <BrowserRouter>
    {networkState.online && <Navbar />}
    <Routes>
      <Route path='/' element={<Login network={networkState.online}/>}/>
      <Route path='/home' element={<Paddy network={networkState.online}/>}/>
      <Route path='/signup' element={<Signup network={networkState.online}/>}/>
      <Route path='/offline' element={<Offline network={networkState.online}/>} />
      <Route path='/signupasbetatester' element={<Betatester network={networkState.online}/>} />
    </Routes>
  </BrowserRouter>

  );
}

export default App;
