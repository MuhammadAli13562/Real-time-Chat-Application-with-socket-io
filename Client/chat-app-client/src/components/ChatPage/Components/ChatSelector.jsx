import '../../../custom.css'

const friends = ['Ali Raza' , 'Mama' , 'Family Group' , 'Shaukat U' , 'Aqeel Zafar']

export default function ChatSelector({setselectedUser}) {

    return(
        <div className='chat-selector-wrapper'>
            
                {friends.map((friend)=>{
                  return   <button className='chat-selector-button' onClick={()=>setselectedUser(friend)}>{friend}</button>
                })}
            
        </div>
    )
}