import React, { useContext, useState } from 'react';
import { UserContext } from '../Auth/Context/UserContext';
import axios from 'axios';


function HeaderUserMenu({editProfile, setEditProfile}){
    const { user } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({
        fName:user?.fname,
        lName:user?.lname,
        address:user?.address,
        city:user?.city,
        zip:user?.zip,
        phone:user?.phone,
    });
    const [emailPass, setEmailPass] = useState({
        newEmail:'',
        currentPassword:'',
        newPassword:'',
        repeatNewPassword:'',
    });



    // Render Edit Profile Menu
    const renderEditProfile = () => {
        return (
            <div className="edit-profile popup-elements no-scroll">
                <span className="close" onClick={()=>{setEditProfile({...editProfile, isEditing:false, editUserInfo:false, editEmail:false, editPass:false})}}>x</span>
                <div className="edit-actions">
                    <span className="edit-user-info" onClick={()=>{ setEditProfile({...editProfile, editUserInfo:true}) } } >Edit my info</span>
                    <span className="edit-user-credentials" onClick={()=>{ setEditProfile({...editProfile, editEmail:true}) } } >Change email</span>
                    <span className="edit-user-credentials" onClick={()=>{ setEditProfile({...editProfile, editPass:true}) } } >Change password</span>
                </div>
            </div>
        )
    }
    // Render Edit forms
    const editForms = () => {
        if(editProfile.editUserInfo){
            return (
                <div className="popup-elements no-scroll edit-forms ">
                    <span className="close" onClick={()=>{setEditProfile({...editProfile, editUserInfo:false})}}>x</span>
                    <div className="update-user-form">
                        <h4 className="sh-c-heading">Edit User Info</h4>
                        <form className="form" onSubmit={e => updateUserInfo(e, user?.user_id)} >
                            <div className="form-top">
                                <div className="form-right">
                                    <label>First Name</label>
                                    <input type="text" name="fname"   placeholder="First Name" onChange={ e => setUserData({...userData, fName:e.target.value}) }    value={userData.fName} />
                                    <label>Last Name</label>
                                    <input type="text" name="lname"   placeholder="Last Name"  onChange={ e => setUserData({...userData, lName:e.target.value}) }    value={userData.lName} />
                                    <label>Address</label>
                                    <input type="text" name="address" placeholder="Address"    onChange={ e => setUserData({...userData, address:e.target.value}) }  value={userData.address} />
                                </div>
                                <div className="form-left">
                                    <label>City</label>
                                    <input type="text" name="city"    placeholder="City"       onChange={ e => setUserData({...userData, city:e.target.value}) }     value={userData.city} />
                                    <label>ZIP</label>
                                    <input type="number" name="zip"   placeholder="ZIP"        onChange={ e => setUserData({...userData, zip:e.target.value}) }      value={userData.zip} />
                                    <label>Phone</label>
                                    <input type="text" name="phone"   placeholder="Phone"      onChange={ e => setUserData({...userData, phone:e.target.value}) }    value={userData.phone} />
                                </div>
                            </div>
                            <input className={isLoading ? 'btn-disable' : ''} type="submit" value={isLoading? '...' : 'Update' } disabled={isLoading} />
                        </form>
                    </div>
                </div>
            )
        }else if(editProfile.editEmail){
            return (
                <div className="popup-elements no-scroll edit-forms ">
                    <span className="close" onClick={()=>{
                                                    setEditProfile({...editProfile, editEmail:false});
                                                    setEmailPass({newEmail:'',currentPassword:'',newPassword:'',repeatNewPassword:''})
                                                }
                                            }
                    >x</span>
                    <div className="update-user-form">
                        <h4 className="sh-c-heading">Change email</h4>
                        <form className="form w-80" onSubmit={e => updateUserEmail(e, user?.user_id)} >
                            <input type="email" placeholder='New email' value={emailPass.newEmail} required onChange={e=> setEmailPass({...emailPass, newEmail:e.target.value})} />
                            <input type="password" placeholder='Password' value={emailPass.currentPassword} required onChange={e=> setEmailPass({...emailPass, currentPassword:e.target.value})} />

                            <input className={isLoading ? 'btn-disable' : ''} type="submit" value={isLoading? '...' : 'Update' } disabled={isLoading} />
                        </form>
                    </div>
                </div>
            )
        }else if(editProfile.editPass){
            return (
                <div className="popup-elements no-scroll edit-forms ">
                    <span className="close" onClick={()=>{
                                                setEditProfile({...editProfile, editPass:false});
                                                setEmailPass({newEmail:'',currentPassword:'',newPassword:'',repeatNewPassword:''})
                                                }
                                            }
                    >x</span>
                    <div className="update-user-form">
                        <h4 className="sh-c-heading">Change Password</h4>
                        <form className="form w-80" onSubmit={e => updateUserPass(e, user?.user_id)} >
                            <input type="password" placeholder='Current password' value={emailPass.currentPassword} required onChange={e=> setEmailPass({...emailPass, currentPassword:e.target.value})} />
                            <input type="password" placeholder='New password' value={emailPass.newPassword} required onChange={e=> setEmailPass({...emailPass, newPassword:e.target.value})} />
                            <input type="password" placeholder='Repeat new password' value={emailPass.repeatNewPassword} required onChange={e=> setEmailPass({...emailPass, repeatNewPassword:e.target.value})} />

                            <input className={isLoading ? 'btn-disable' : ''} type="submit" value={isLoading? '...' : 'Update' } disabled={isLoading} />
                        </form>
                    </div>
                </div>
            )
        }
    } 



    // Submit Forms
    const updateUserInfo = async (e, id) => {
        e.preventDefault();
        setEditProfile({...editProfile, editUserInfo:false, isEditing:false, editMessage:'Loading...', editDontClose:true});
        setIsLoading(true);
        try {
            const response = await axios.post(`/api/user/${id}/user-info`, {data: userData} );
            setIsLoading(false);
            setEditProfile({...editProfile, editUserInfo:false, isEditing:false, editMessage:response.data, editDontClose:false});
        }catch (err) {
            console.log(err);
        }
    }

    // Submit Forms
    const updateUserEmail = async (e, id) => {
        e.preventDefault();
        setEditProfile({...editProfile, editEmail:false, isEditing:false, editMessage:'Loading...', editDontClose:true});
        setIsLoading(true);
        try {
            const response = await axios.post(`/api/user/${id}/user-email`, {newEmail:emailPass.newEmail, password:emailPass.currentPassword} );
            setIsLoading(false);
            setEditProfile({...editProfile, editEmail:true, isEditing:false, editMessage:response.data, editDontClose:false});
            setEmailPass({newEmail:'',currentPassword:'',newPassword:'',repeatNewPassword:''});
        }catch (err) {
            console.log(err);
        }
    }

    // Submit Forms
    const updateUserPass = async (e, id) => {
        e.preventDefault();
        setEditProfile({...editProfile, editPass:false, isEditing:false, editMessage:'Loading...', editDontClose:true});
        setIsLoading(true);
        try {
            const response = await axios.post(`/api/user/${id}/user-pass`, {
                currentPassword:emailPass.currentPassword,
                newPassword:emailPass.newPassword,
                repeatNewPassword:emailPass.repeatNewPassword
            });
            setIsLoading(false);
            setEditProfile({...editProfile, editPass:false, isEditing:false, editMessage:response.data, editDontClose:false});
            setEmailPass({newEmail:'',currentPassword:'',newPassword:'',repeatNewPassword:''});
        }catch (err) {
            console.log(err);
        }
    }


    return (
        <>
            { 
                editProfile.isEditing || editProfile.editMessage != '' ? 
                    <div className="overlay" onClick={ ()=>{ editProfile.editDontClose == false ? 
                                                            (setEditProfile({...editProfile, editMessage:'', isEditing:false, editUserInfo:false, editEmail:false, editPass:false }),
                                                            setEmailPass({newEmail:'',currentPassword:'',newPassword:'',repeatNewPassword:''}))
                                                            : null 
                                                        } 
                                                    }
                    >
                    </div> : null
            }
        
            {
                editProfile.isEditing || editProfile.editMessage !=  '' ? document.body.style.setProperty('overflow', 'hidden')
                : document.body.style.setProperty('overflow', 'visible')
            }

            {
                editProfile.editMessage != '' && (
                    <div className="edit-profile popup-elements no-scroll">
                        {
                            editProfile.editDontClose == false && <span className="close" 
                                                                    onClick={()=>{
                                                                        setEditProfile({...editProfile, editMessage:'', editDontClose:false});
                                                                        setEmailPass({newEmail:'',currentPassword:'',newPassword:'',repeatNewPassword:''})
                                                                    }}
                                                                  >x</span>
                            
                        }
                        
                        <p className='text-center' style={{padding: '4rem 3rem'}}>{editProfile.editMessage}</p>
                    </div>
                )
            }


            {/* Edit Profile */}
            { editProfile.isEditing && renderEditProfile() }
            { editProfile.isEditing && editForms() }

        </>
    )
}



export default HeaderUserMenu;