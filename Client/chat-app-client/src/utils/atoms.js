import { atom } from "recoil";

export const MessagesState = atom({
    key : 'MessagesState',
    default : []
})

export const RoomsState = atom({
    key : 'RoomsState' ,
    default : []
})


export const SelectedUserState = atom({
    key : 'SelectedUserState',
    default : ''
})

export const IsConnectedState = atom({
    key : 'IsConnectedState',
    default : false
})