import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";

import { UserContext } from '../../Auth/Context/UserContext';
import { FiEye } from 'react-icons/fi';

function Users(){
    const navigate = useNavigate();
    const { user, dispatch } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [users, SetUsers] = useState([]);
    const [userDetail, setUserDetail] = useState({
        clicked:false,
        id:'',
        user:'',
        role:'',
        orders:[],
        view:''
    });
    const [message, setMessage] = useState({
        whatOperation: '',
        dontClose:false,
        confirButton: false,
        operationMsg: '',
    });


    // Fetch all users
    useEffect(() => {
        fetchUsers();
    }, [users]);
    const fetchUsers = async () => {
        try {
            const response = await axios('/api/users');
            SetUsers(response.data);
            setLoading(false);
        }catch(err){
            console.log(err);
        }
    }

    // Delete User
    const deleteUser = async (id) => {
        try {
            setMessage({...message, operationMsg:'Loading...', dontClose:true });
            const response = await axios.post(`/api/user/${id}/delete`);
            setMessage({...message, operationMsg:response.data, dontClose:false});
        } catch (err) {
            console.log(err);
        }
    }

    // Update User Role
    const updateUserRole = async (id, role) => {
        setMessage({...message, operationMsg:'Loading...', dontClose:true });
        try {
            const response = await axios.post(`/api/user/${id}/update`, {role});
            setMessage({...message, operationMsg:response.data, dontClose:false});
            if (user.user_id == id){
                setMessage({...message, operationMsg:'You will be redirect to login page, You should login again.', dontClose:true });
                setTimeout(()=> {
                    navigate('/login');
                    dispatch( { type: "LOGOUT" } );
            }, 3000 );
                
            }
        } catch (err) {
            console.log(err);
        }
    }


    // Rendering Update & Delete Messages
    const RenderMsg = (id, role, op) => {
            setMessage({...message, operationMsg:''});
            setUserDetail({ ...userDetail, clicked:false, id, role, view:''});
            if ( op == 'op-update' ){
                setMessage({...message, confirButton:true, whatOperation:op, operationMsg:''});
            }else if ( op == 'op-delete' ){
                setMessage({...message, confirButton:true, whatOperation:op, operationMsg:''});
            }
        
    }



    // Rendering views (orders detatils and actions)
    const renderViews = () => {
        if (userDetail.view === 'orders-view') {
            return (
                <div className="popup-elements no-scroll">
                    <span className="close" onClick={()=>{ setUserDetail({clicked:false,id:'',user:'',role:'',orders:[],view:''}) }}>x</span>
                    <div className="top">
                        <p>User: <strong><small>{userDetail.user}</small></strong> has placed <strong><small>{userDetail.orders?.length}</small></strong> Order(s) </p>
                        <div className="order-ref mt-10">
                            {
                                userDetail.orders?.length ?
                                    userDetail.orders.map( (order, i) => (
                                        <p key={i} className='mt-10'>
                                            <strong><small>{i+1}: </small></strong> <span>{ order }</span>
                                        </p>
                                    ) )
                                : null 

                            }
                        </div>
                    </div>
                </div>
            )
        }else if (userDetail.view === 'actions-view') {
            return (
                <div className="popup-elements no-scroll">
                    <span className="close" onClick={()=>{ setUserDetail({...userDetail, clicked:false,orders:[],view:''}) }}>x</span>
                    <div className="top">
                        <p>User: <strong><small>{userDetail.user}</small></strong> is <strong><small>{userDetail.role}</small></strong> </p>
                        <div className="user-admin-actions mt-10 mb-1rem">
                            {
                                !user.roles.includes('SUPER_ADMIN') ? 
                                    <p className='mb-1rem'> You don't have permission on this Actions. </p>
                                    :
                                    userDetail.role == 'User' ?
                                        <>
                                            <p className='mb-1rem'> Set {userDetail.user} as <span onClick={ ()=> { RenderMsg(userDetail.id, 'SUPER_ADMIN', 'op-update') } } >SUPER ADMIN</span> </p>
                                            <p className='mb-1rem'> Set {userDetail.user} as <span onClick={ ()=> { RenderMsg(userDetail.id, 'ADMIN', 'op-update') } } >NORMAL ADMIN</span> </p>
                                            <p className='mb-1rem'> Did you want to <span className='remove-action' onClick={ ()=> { RenderMsg(userDetail.id, null, 'op-delete') } }>Remove</span> {userDetail.user} ? </p>
                                        </> 
                                        : userDetail.role == 'Admin' ?
                                            <>
                                                <p className='mb-1rem'> Set {userDetail.user} as <span onClick={ ()=> { RenderMsg(userDetail.id, 'SUPER_ADMIN', 'op-update') } } >SUPER ADMIN</span> </p>
                                                <p className='mb-1rem'> Set {userDetail.user} as <span onClick={ ()=> { RenderMsg(userDetail.id, 'User', 'op-update') } } >NORMAL USER</span> </p>
                                                <p className='mb-1rem'> Did you want to <span className='remove-action' onClick={ ()=> { RenderMsg(userDetail.id, null, 'op-delete') } }>Remove</span> {userDetail.user} ? </p>
                                            </>
                                            : userDetail.role == 'Super Admin' ?
                                                <>
                                                    <p className='mb-1rem'> Set {userDetail.user} as <span onClick={ ()=> { RenderMsg(userDetail.id, 'ADMIN', 'op-update') } } >NORMAL ADMIN</span> </p>
                                                    <p className='mb-1rem'> Set {userDetail.user} as <span onClick={ ()=> { RenderMsg(userDetail.id, 'User', 'op-update') } } >NORMAL USER</span> </p>
                                                    <p className='mb-1rem'> Did you want to <span className='remove-action' onClick={ ()=> { RenderMsg(userDetail.id, null, 'op-delete') } }>Remove</span> {userDetail.user} ? </p>
                                                </> 
                                                : null
                                     
                                    
                            }
                        </div>
                    </div>
                </div>
            )
        }
    }


    return (
        <>
            {
                loading && <h3 className="loading">Loading...</h3>
            }
            {
                message.operationMsg != '' ?
                            ( <div className='popup-elements no-scroll text-center' style={{padding: '4rem'}}>{message.operationMsg}
                                {
                                    message.operationMsg != 'Loading...' && message.operationMsg != '' && message.dontClose == false ?
                                    <span className="close" onClick={()=>{ setMessage({whatOperation: '', confirButton:false, dontClose:false, operationMsg: ''}) }}>x</span>
                                    : ''
                                }

                            </div>
                            ) : message.whatOperation != '' && message.operationMsg == '' ? <div className='popup-elements no-scroll text-center' style={{padding: '4rem'}}>
                                
                                { 
                                    message.whatOperation == 'op-update' ? 
                                        <>
                                            <p className='mb-1rem'>Did you whant to Update this user role?</p>
                                            <p> 
                                                <span className='btn admin-btn_edited' onClick={() => { setMessage({ operationMsg:'Loading...', whatOperation:'', dontClose:true, confirButton:false}) ; updateUserRole(userDetail.id, userDetail.role) }  }>Confirm</span>
                                                <span className='btn admin-btn_edited' onClick={() => { setMessage({ operationMsg: '', whatOperation:'', dontClose:true, confirButton:false }) } }>Cancel</span>
                                            </p>
                                        </>
                                    :
                                        <>
                                            <p className='mb-1rem'>Did you whant to delete this user?</p>
                                            <p> 
                                                <span className='btn admin-btn_edited' onClick={() => { setMessage({ operationMsg:'Loading...', whatOperation:'', dontClose:true, confirButton:false}) ;  deleteUser(userDetail.id) }  }>Confirm</span>
                                                <span className='btn admin-btn_edited' onClick={() => { setMessage({ operationMsg: '', whatOperation:'', dontClose:true, confirButton:false }) } }>Cancel</span>
                                            </p>
                                        </>

                                }

                            </div>
                            : ''
            }
            {
                loading ? null
                :
                <>

                    { 
                        userDetail.clicked || message.operationMsg != '' || message.whatOperation != '' ? 
                            <div className="overlay" onClick={  message.dontClose == false ? ()=>{ setUserDetail({...userDetail, clicked:false,view:''}), setMessage({whatOperation: '', confirButton:false, dontClose:false, operationMsg: ''})} : null }></div> : null
                    }
                    {
                        userDetail.clicked || message.operationMsg != '' || message.whatOperation != '' ? document.body.style.setProperty('overflow', 'hidden')
                        : document.body.style.setProperty('overflow', 'visible')
                    }
                    
                    <h4 className='sh-c-heading'>Users list</h4>
                    {
                        users?.length ?
                    

                        <div className="users-list">
                            <div className="table-scroll">

                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Orders</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        users && users.map(user => (
                                            <tr className="order-item" key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td className='text-center'> <a className='btn-actions' onClick={()=>{setUserDetail({clicked:true, id:user.id, user:user.email, role:'', orders:user.orders, view:'orders-view'}) } }>{user.orders?.length}</a> </td>
                                                <td className='text-center'> <a className="btn-actions" onClick={()=>{setUserDetail({clicked:true, id:user.id, user:user.email, role:user.role, orders:[], view:'actions-view'})} } >{ <FiEye/> }</a> </td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                    <tfoot></tfoot>
                                </table>

                            </div>

                            {/* Render orders Or actions views */}
                            { userDetail && renderViews()}

                            
                            
                            {/* Create Pagination */}
                            {/* {
                                filteredOrders?.length > global.config.paginPerItem ? 
                                    pagination(global.config.paginPerItem, filteredOrders?.length)
                                : null
                            } */}

                        </div>
                        :   
                        <div className='text-center'>No Users found!</div>
                    }

                </>
            }
        </>
    )

}



export default Users;