import { createStore } from 'redux'

// 1. Save all the channels at one place - Application State
let initialState = {
    date: new Date(),
    startTime: '10:10',
    endTime: '10:30'
}

// 2. function - expose that function - to raise/trigger change requests - dispatch function - already present in redux
// dispatch(action)

// 3. function - make the necessary changes - reducer function

export function appRuducerFunction(state = initialState, action) {
    //console.log("redux state here", state)
    //console.log("redux action here", action)
    let stateCopy = JSON.parse(JSON.stringify(state))
    switch (action.type) {
        case "title":
            stateCopy.title = action.payload
            return stateCopy;
        case "mettingLink":
            stateCopy.mettingLink = action.payload
            return stateCopy
        case "attendees":
            stateCopy.attendees = action.payload
            return stateCopy
        case "date":
            stateCopy.date = action.payload
            return stateCopy
        case "startTime":
            stateCopy.startTime = action.payload
            return stateCopy
        case "endTime":
            stateCopy.endTime = action.payload
            return stateCopy
        case "allTask":
            stateCopy.allTask = JSON.parse(JSON.stringify(action.payload))
            stateCopy.allTask.sort((a,b)=> a.id - b.id)
            return stateCopy
        case "clear":
            stateCopy.title = "";
            stateCopy.mettingLink ="";
            stateCopy.attendees="";
            return stateCopy

            
        default:
            return state
    }

}

// 4. Create a package - (state, dispatch) - store - there should be a way to create this store - already present in redux
const store = createStore(appRuducerFunction)

export default store;