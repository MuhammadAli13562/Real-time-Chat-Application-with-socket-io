import { BrowserRouter as Router , Routes , Route , Link , useNavigate } from 'react-router-dom'
import ChatBar from './demoChat'

export default function AllChatRoutes() {
    return(
       
            <Router >
                
                <div  className='router-div'>

                    <NavBar/>

                    <Routes>
                        <Route path='/HaiderU' element={<ChatBar user='HaiderU' />} />
                        <Route path='/AqeelZafar' element={<ChatBar user='AqeelZafar'/>} />
                        <Route path='/Mama' element={<ChatBar user='Mama'/>} />
                        <Route path='/FamilyGroup' element={<ChatBar user='FamilyGroup'/>} />
                    </Routes>

                </div>

            </Router>

    )
}

const Users = ['Haider U' , 'Aqeel Zafar' , 'Mama' , 'Family Group']

function NavBar() {

    const navigate = useNavigate()

    return(
     <div className='NavBar-wrapper'>
        {Users.map((elem)=>{

            const path = elem.replace(/\s+/g, '');
            
            return (
                <button className='user-button' onClick={()=>navigate(`${path}`)}>
                   <div style={{display :'flex' , flexDirection:"row" , justifyContent:"space-around" }}>
                        <img src='https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg' className="userimg"/>
                        {elem}
                   </div> 

                </button>
            )
        })}
     </div>  
    )
}

