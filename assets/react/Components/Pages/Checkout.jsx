import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../Partials/Header';
import Footer from "../Partials/Footer";

// Import Payment Methods from Config file
import "../../../../config/config";

import { BsFillTrash3Fill } from 'react-icons/bs';
import axios from 'axios';


function Checkout({itemsInCart, totalPrice, user, setItemsInCart, setTotalPrice}) {
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState({billingErr: false, payMethodErr: false});
    const [billing, setBilling] = useState({
        fname: user ? user?.fname : '',
        lname: user ? user?.lname : '',
        city: user ? user?.city : '',
        address: user ? user?.address : '',
        zip: user ? user?.zip : '',
        phone: user ? user?.phone : '',
        email: user ? user?.user : '',
        pay_method:'',
        is_guest: user ? false : true,
    });

    const handleOrderSubmit = () => {
        if (billing.fname && billing.lname && billing.city && billing.address && billing.zip && billing.phone && billing.email){
            setErrorMsg({billingErr: false, payMethodErr: false});
            if(billing.pay_method == ''){
                setErrorMsg({billingErr: false, payMethodErr: true});
            }else{
                // Submit order
                submitOrder();
            }
        }else {
            setErrorMsg({billingErr: true, payMethodErr: false});
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }


    // Submit order function
    const submitOrder = async () => {
        setLoading(true);
        
        const formData = new FormData();
        formData.append('user_id', user ? user.user_id : 0 );
        formData.append('fname', billing.fname);
        formData.append('lname', billing.lname);
        formData.append('city', billing.city);
        formData.append('address', billing.address);
        formData.append('zip', billing.zip);
        formData.append('phone', billing.phone);
        formData.append('email', billing.email);
        formData.append('pay_method', billing.pay_method);
        formData.append('is_guest', billing.is_guest);
        
        formData.append('products', JSON.stringify(itemsInCart));
        formData.append('total_price', totalPrice);

        

        try {
            const res = await axios.post('/api/order', formData);
            setLoading(false);
            if(res.status == 200) {
                setItemsInCart([]);
                setTotalPrice(0);
                setSuccessMsg(res.data);

            }else{
                setSuccessMsg('An error occurd, try again later');
            }
        } catch (err) {
            console.log(err);
        }
    
    }



    // Set Page Title
    document.title = 'Shop - Checkout';

    return (
        <>


            {/* { 
                successMsg !== '' && <div className="overlay" onClick={()=>setSuccessMsg('')}></div>
            }
            {
                successMsg !== '' ? document.body.style.setProperty('overflow', 'hidden')
                : document.body.style.setProperty('overflow', 'visible')
            }
            {
                successMsg && <div className='popup-elements'>{successMsg}</div>
            } */}

            <Header itemsCount = {itemsInCart?.length} checkoutloading={loading} />

            <div className="container">
                <div className="checkout">
                    <h1 className='sh-c-heading'>Checkout</h1>
                    {errorMsg?.billingErr && <p className='error-msg'>Please set billing info.</p> }
                    {
                        itemsInCart?.length ?
                        (
                            <div className="cart-detail">
                                <div className="billing-detail">
                                    <h3 className='sh-c-heading'>Billing detail</h3>
                                        {
                                            user ? (
                                                <div className="user-billing">
                                                    <div className="user-name">
                                                        <div className="fname">
                                                            <label>First name</label>
                                                            <span>{user.fname}</span>
                                                        </div>
                                                        <div className="lname">
                                                            <label>Last name</label>
                                                            <span>{user.lname}</span>
                                                        </div>
                                                    </div>
                                                    <div className="user-city">
                                                        <label>Country</label>
                                                        <span>{user.city}</span>
                                                    </div>
                                                    <div className="user-address">
                                                        <label>Address</label>
                                                        <span>{user.address}</span>
                                                    </div>
                                                    <div className="user-zip">
                                                        <label>Postcode/Zip</label>
                                                        <span>{user.zip}</span>
                                                    </div>
                                                    <div className="user-phone">
                                                        <label>Phone</label>
                                                        <span>{user.phone}</span>
                                                    </div>
                                                    <div className="user-email">
                                                        <label>Email address</label>
                                                        <span>{user.user}</span>
                                                    </div>

                                                </div>
                                            )
                                            : 
                                            (
                                                <div className="user-billing">
                                                    <form >
                                                        <div className="user-name">
                                                            <div className="fname">
                                                                <label>First name</label>
                                                                <input type="text" onChange={e=>setBilling({...billing, fname:e.target.value})} />
                                                            </div>
                                                            <div className="lname">
                                                                <label>Last name</label>
                                                                <input type="text" onChange={e=>setBilling({...billing, lname:e.target.value})} />
                                                            </div>
                                                        </div>
                                                        <div className="user-city">
                                                            <label>Country</label>
                                                            <input type="text" onChange={e=>setBilling({...billing, city:e.target.value})} />
                                                        </div>
                                                        <div className="user-address">
                                                            <label>Address</label>
                                                            <input type="text" onChange={e=>setBilling({...billing, address:e.target.value})} />
                                                        </div>
                                                        <div className="user-zip">
                                                            <label>Postcode/Zip</label>
                                                            <input type="number" onChange={e=>setBilling({...billing, zip:e.target.value})} />
                                                        </div>
                                                        <div className="user-phone">
                                                            <label>Phone</label>
                                                            <input type="text" onChange={e=>setBilling({...billing, phone:e.target.value})} />
                                                        </div>
                                                        <div className="user-email">
                                                            <label>Email address</label>
                                                            <input type="email" onChange={e=>setBilling({...billing, email:e.target.value})} />
                                                        </div>
                                                    </form>

                                                </div>
                                            )
                                        }
                                </div>
                                <div className="order-incart">
                                    
                                    {
                                        loading ? <div className="overlay" style={{ height:'auto', background:'rgb(255 255 255 / 30%)' }}></div> 
                                        : null
                                    }

                                    <h3 className='sh-c-heading'>Your order</h3>
                                    <span className='checkout-cancel' onClick={()=> {setItemsInCart([]); setTotalPrice(0); setErrorMsg(false) } }> <BsFillTrash3Fill /> </span>
                                    <div className="table-wrapper">
                                        <table className='table'>
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {
                                                itemsInCart && itemsInCart?.map((product, i) => (
                                                    <tr key={product.id}>
                                                        <td>{product.title} <strong>x {product.itemQntity}</strong></td>
                                                        <td>{product.price * product.itemQntity}$</td>
                                                    </tr>
                                                ))
                                                }
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th>Total</th>
                                                    <td>{totalPrice}$</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div className="payment-method">
                                        <h5 className='sh-c-heading'>Check your payment method</h5>
                                        {errorMsg?.payMethodErr && <p className='error-msg'>Please check your payment method!</p> }
                                        
                                        {
                                            Object.values(global.config.paymentMethods).map( (method,i) => (
                                                <div className="payment" key={i}>
                                                    <input type="radio" id={i} name="pay_method" onChange={()=>{setBilling({...billing, pay_method:method }), setErrorMsg({...errorMsg, payMethodErr: false})} } />
                                                    <label htmlFor={i}>{method}</label>
                                                </div>
                                            ) )
                                        }

                                    </div>
                                    <div className="place-order">
                                        {
                                            billing.pay_method === 'Credit card' && billing.fname && billing.lname && billing.city && billing.address && billing.zip && billing.phone && billing.email ?
                                                <form id='place-order' action="/payment/checkout" method='POST'>
                                                    <input type="hidden" name="products" value={JSON.stringify(itemsInCart)} />
                                                    <input type="hidden" name="total_price" value={totalPrice} />
                                                    <input type="hidden" name="user_data" value={JSON.stringify(billing)} />
                                                    <input type="hidden" name="user_id" value={user? user.user_id : 0} />
                                                    <input type='submit' onClick={()=>setLoading(true)} className={loading ? 'button input-submit btn-disable': 'button input-submit'} value={loading ? '...' : 'Place order'}  />
                                                </form>
                                            :
                                                <Link className={loading ? 'button btn-disable': 'button'} onClick={()=>handleOrderSubmit()}>{loading ? '...' : 'Place order'}</Link>
                                                
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                        :
                            
                            successMsg != '' ?
                            (
                                <div className='no-items-selected'>
                                    <p className='mb-10'> {successMsg} </p>
                                    <p> <Link to='/' className="back-home-btn">Home page</Link> </p>
                                </div>
                            )
                            :
                            (
                                <div className='no-items-selected'>
                                    <p className='mb-10'> Your shopping cart is empty! </p>
                                    <p> <Link to='/'>Click here!</Link> to add products.</p>
                                </div>
                            )
                            
                    }

                    


                </div>

            </div>


            <Footer />
        </>
    )

}


export default Checkout;