import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { FiEye } from 'react-icons/fi';

// Import pagination item count from Config file
import "../../../../../config/config";

function Orders() {

    const [loading, setLoading] = useState(true);
    const [allOrders, setAllOrders] = useState([]);
    const [ordersPaginated, setOrdersPaginated] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [orderDetail, setOrderDetail] = useState(0);
    const [message, setMessage] = useState('');

    // paginations
    const [paginStart, setPaginStart] = useState(0);
    const [paginEnd, setPaginEnd] = useState(global.config.paginPerItem);
    const [page, setPage] = useState(1);

    useEffect(()=>{
        const getOrders = async () => {
            try {
                const response = await axios.get('/api/orders');
                const data = response.data;
                const result = data.reduce((accumulator, current) => {
                    let exists = accumulator.find(item => {
                      return item.order_id === current.order_id;
                    });
                    if(!exists) { 
                      accumulator = accumulator.concat(current);
                    }
                    return accumulator;
                  }, []);
                  
                setAllOrders(data);
                setFilteredOrders(result);
                setLoading(false);
            }catch (err){
                console.log(err);
            }
        }
        getOrders();
    }, [allOrders]);


    // Render order detail
    const renderOrderDetail = () => {

        const orderData = allOrders.filter(order => order.order_id == orderDetail );
        
        return (
            <div className="order-details popup-elements">
                <span className="close" onClick={()=>{setOrderDetail(0)}}>x</span>
                <div className="top">
                    <div className="order-guest">
                        {orderData[0].is_guest ? "Ordered by Guest: " : "Ordered by User: "  } <em>{orderData[0].user_email}</em>
                    </div>
                    <div className="order-ref mt-10">
                        <strong><small>Order Ref:</small></strong> <span>{ orderData[0].order_id }</span>
                    </div>
                    <div className="bill-shipp d-flex">
                        <div className="billi">
                            <h5>Billing</h5>
                            <p className='mt-5'>Name: {orderData[0].user }</p>
                            <p className='mt-5'>Address: {orderData[0].address }</p>
                            <p className='mt-5'>City: {orderData[0].city }</p>
                            <p className='mt-5'>Zip code: {orderData[0].zip }</p>
                            <p className='mt-5'>Email: {orderData[0].user_email }</p>
                            <p className='mt-5'>Phone: {orderData[0].phone }</p>
                        </div>
                        <div className="shipping">
                            <h5>Shipping</h5>
                            <p className='mt-5'>Name: {orderData[0].user }</p>
                            <p className='mt-5'>Address: {orderData[0].address }</p>
                            <p className='mt-5'>City: {orderData[0].city }</p>
                            <p className='mt-5'>Zip code: {orderData[0].zip }</p>
                            <p className='mt-5'>Email: {orderData[0].user_email }</p>
                            <p className='mt-5'>Phone: {orderData[0].phone }</p>
                        </div>
                    </div>
                    </div>
                <div className="bottom">
                    <h5>Order Items</h5>
                    <table className="table">
                        <tbody>
                            {
                                orderData.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.product} <strong>*</strong>{order.product_qntity}</td>
                                        <td className='text-right'>${order.product_price * order.product_qntity}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>total</td>
                                <td>${orderData[0].total_price}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <div className="payment-meth mt-10">
                        <h5>Payment Info</h5>
                        <p>Is Paid? : {orderData[0].is_paid ? 'Paid' : 'Not Paid'} </p>
                        <p>Payment Method: {orderData[0].pay_method } </p>
                    </div>
                </div>
            </div>
        )
    }


    // Edit Order (set order finished)
    const editOrder = async (order_id) => {
        try {
            setMessage('Loading...');
            const response = await axios.post(`/api/order/finish/${order_id}`);
                setMessage(response.data);
        }catch (err){
            console.log(err);
        }
    }



    // Remove Order
    const removeOrder = async (order_id) => {
        try {
            setMessage('Loading...');
            const response = await axios.post(`/api/order/delete/${order_id}`);
                setMessage(response.data);
        }catch (err){
            console.log(err);
        }
    }



    // Create Pagination
    const pagination = (count, ordersCount) => {
        var pages = Math.ceil(ordersCount / count);
        if(ordersCount > count) {
            return (
                <div className="pagination text-center">
                    <span className={page == 1 ?'page btn-disable' : 'page'} onClick={ (e)=>paginateOnClick(e, 1, count, 'first') } >First</span> 

                    <span className={page == 1 ?'page btn-disable' : 'page'} onClick={ (e)=>paginateOnClick(e, pages, count, 'prev') } >Prev</span> 
                    
                    <span className='page page-dots' >...</span> 
                    <span className='page' >{page}</span> 
                    <span className='page page-dots' >...</span> 
                    
                    <span className={page == Math.ceil(ordersCount / count) ?'page btn-disable' : 'page'} onClick={ (e)=>paginateOnClick(e, pages, count, 'next') } >Next</span> 

                    <span className={page == Math.ceil(ordersCount / count) ?'page btn-disable' : 'page'} onClick={ (e)=>paginateOnClick(e, pages, count, 'last') } >Last</span> 

                </div>
            )
        }
    }
    //Paginate on click
    const paginateOnClick = (e, currentPage, count, state='') => {
        document.querySelectorAll('.pagination .page').forEach(el =>{
            el.classList.remove('btn-disable');
        });
        e.target.classList.add('btn-disable');
        if(state == 'first' && currentPage == 1){
            setPaginStart(0);
            setPaginEnd(count);
            setPage(1);
        }else if(state == 'last' && currentPage == Math.ceil(filteredOrders.length / count)){
            setPaginStart(paginEnd);
            setPaginEnd(filteredOrders.length);
            setPage(Math.ceil(filteredOrders.length / count));
         }else if(state == 'next' && paginEnd != filteredOrders.length ){
            setPaginEnd(paginEnd + count);
            setPaginStart(paginEnd);
            setPage(page + 1);
            e.target.classList.remove('btn-disable');

         }else if(state == 'prev' && paginStart != 0){
            setPaginStart(paginStart - count);
            setPaginEnd(paginStart );
            setPage(page - 1);
            e.target.classList.remove('btn-disable');
         }
    }
    useEffect(()=>{
        setOrdersPaginated( filteredOrders?.slice(paginStart, paginEnd) );
    },[allOrders, page])



    return (
        <>
            {
                loading && <h3 className="loading">Loading...</h3>
            }
            {
                message && ( <div className='popup-elements text-center' style={{overflowY: 'unset', padding: '4rem'}}>{message}
                                {
                                    message != 'Loading...' && message != '' ?
                                    <span className="close" onClick={()=>{setMessage('')}}>x</span>
                                    : ''
                                }

                            </div>
                            )
            }
            {
                loading ? null
                :
                <>

                    { 
                        orderDetail !== 0 || message != '' ? 
                            <div className="overlay" onClick={  message != 'Loading...' ? ()=>{ setOrderDetail(0), setMessage('')} : null }></div> : null
                    }
                    {
                        orderDetail !== 0 || message != '' ? document.body.style.setProperty('overflow', 'hidden')
                        : document.body.style.setProperty('overflow', 'visible')
                    }
                    
                    <h4 className='sh-c-heading'>Orders list</h4>
                    {
                        allOrders?.length ?
                    

                        <div className="orders-list">
                            <div className="table-scroll">

                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th>Order</th>
                                            <th>Date</th>
                                            <th>User</th>
                                            <th>Status</th>
                                            <th>Is paid</th>
                                            <th>Amount</th>
                                            <th>Details</th>
                                            <th>Action</th>
                        
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        ordersPaginated && ordersPaginated.map(order => (
                                            <tr className="order-item" key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.create_date}</td>
                                                <td>{order.user_email}</td>
                                                <td>{order.status}</td>
                                                <td>{order.is_paid ? 'Paid' : 'Not Paid'}</td>
                                                <td>${order.total_price}</td>
                                                <td className='text-center' onClick={()=>setOrderDetail(order.order_id)}><a className='clickable-btn'>{ < FiEye /> }</a> </td>
                                                <td>
                                                    <a className="btn-actions" onClick={()=>editOrder(order.order_id)}>
                                                        { order.status == 'Processing' ? 'Finish | ' : ''   }
                                                    </a>
                                                    
                                                    <a className="btn-actions" onClick={()=>removeOrder(order.order_id)}>Delete</a> </td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                    <tfoot></tfoot>
                                </table>

                            </div>

                            {/* Render order detail */}
                            { orderDetail !== 0 && renderOrderDetail()}

                            
                            
                            {/* Create Pagination */}
                            {
                                filteredOrders?.length > global.config.paginPerItem ? 
                                    pagination(global.config.paginPerItem, filteredOrders?.length)
                                : null
                            }

                        </div>
                        :   
                        <div className='text-center'>No orders found!</div>
                    }

                </>
            }
        </>
    )
}



export default Orders;