const {createSlice} = require('@reduxjs/toolkit')
let n ='', s=false;
if(localStorage.getItem("user")){
    n=localStorage.getItem("user");
    s=true;
}
/* const STATUS = Object.freeze({
    IDLE: 'idle',
    ERROR: 'error',
    LOADING: 'loading'
});
 */

const userSlice = createSlice({
    name: 'user',
    initialState:{
        data: [],
        status: s,
        user: n,
        category:[],
        addModal:false
    },
    reducers:{
        logIN(state, action){
            state.status= true;
            state.user = action.payload[0];
            localStorage.setItem("user",action.payload[0])
        },
        logOut(state, action){
            state.status = false;
            localStorage.removeItem("user")
        },
        allCategory(state, action){
            state.category= action.payload;
        },
        setModal(state,action){
            state.addModal=!state.addModal;
        }
    
},
/* extraReducers: (builder) => {
    builder
        .addCase(fetchUsers.pending, (state, action) => {
            state.status = STATUS.LOADING;
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = STATUS.IDLE;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.status = STATUS.ERROR;
        });
}, */
});

export const { logIN, logOut, allCategory,setModal} = userSlice.actions;
export default userSlice.reducer;

/* export const fetchUsers = createAsyncThunk('users/fetch', async () => {
    const res = await fetch('https://fakestoreapi.com/products');
    const data = await res.json();
    return data;
});
 */

//export function fetchProducts(){
//    return async function fetchProductThunk(dispatch, getState){
//           dispatch(setStatus(STATUS.LOADING));
//        try{
//            const res = await fetch("https://fakestoreapi.com/products");
//            const data = await res.json();
//             dispatch(setProduct(data));
//             dispatch(setStatus(STATUS.IDLE));
//        }catch(err){
//            console.log(err)
//            dispatch(setStatus(STATUS.ERROR));
//        }
//    }
//}