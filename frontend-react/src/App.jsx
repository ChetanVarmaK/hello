import Login from './pages/Login.jsx'
import Home from  './pages/Home.jsx'
import ChatPage from './pages/ChatPage.jsx'
import {Routes,Route} from 'react-router-dom'


function App() {

  return (
    <>
     <Routes>

      <Route path="/" element={<Login/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/chat" element={<ChatPage/>}/>

     </Routes>
    </>
  )
}

export default App;
