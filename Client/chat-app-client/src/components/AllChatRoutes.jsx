import { BrowserRouter as Router , Routes , Route , Link , useNavigate } from 'react-router-dom'
import ChatPage from './ChatPage/ChatPage'
import { Register } from '../Authentication/Register'
import { Login } from '../Authentication/Login'

export default function AllChatRoutes() {
    return(
            <Router >
                
                <div  className='router-div'>
                    <Routes>
                        <Route path="/register" element={<Register/>}/>  
                        <Route path="/login" element={<Login/>}/>  
                        <Route path='/chats' element={<ChatPage/>} />                  
                    </Routes>
                </div>
            </Router>

    )
}

const Users = ['Haider U' , 'Aqeel Zafar' , 'Mama' , 'Family Group']



