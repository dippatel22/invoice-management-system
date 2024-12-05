import React, { useState } from 'react'
import { db } from '../../firebase';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const NewInvoice = () => {
  const [to, setTo] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const navigate=useNavigate();

  var [product,setProduct]=useState([]);

  const addProduct=()=>{ 
    setProduct([...product,{'id':product.length,'name':name,'price':price,'quantity':quantity}])
    const t=quantity*price
    setTotal(total+t)
    setName('')
    setPrice('')
    setQuantity(1)
  }

  const saveData=async()=>{
const data=await addDoc(collection(db,'invoices'),{
  to:to,
  phone:phone,
  address:address,
  product:product,
  total:total,
  uid: localStorage.getItem('uid'),
  date:Timestamp.fromDate(new Date())
})
console.log(data)
navigate('/dashboard/invoices');
  }

  return (
    <div>
      <div className='header-row'>
      <p className='new-invoice-heading'>New Invoice</p>
      <button type='button' onClick={saveData} className='add-btn'>Save Data</button>
      </div>
      <form className='new-invoice-form'>
        <div className='first-row'>
          <input onChange={(e)=>{setTo(e.target.value)}}placeholder='To' value={to}/>
          <input onChange={(e)=>{setPhone(e.target.value)}}placeholder='Phone' value={phone}/>
          <input onChange={(e)=>{setAddress(e.target.value)}}placeholder='Address' value={address}/>
        </div>
        <p className='new-invoice-second-heading'>Add Product</p>
        <div className='first-row'>
          <input onChange={(e)=>{setName(e.target.value)}}placeholder='Product Name' value={name}/>
          <input onChange={(e)=>{setPrice(e.target.value)}}placeholder='Price' value={price}/>
          <input onChange={(e)=>{setQuantity(e.target.value)}}type='number' placeholder='Quantity' value={quantity} />
        </div>
        <button type='button' onClick={addProduct} className='add-btn'>Add Product</button>
        
      </form>
      {product.length>0 && <div className='product-box'>
      <p className='new-invoice-second-heading'>Product List</p>
      <div className='product-list'>
              <p>S. no</p>
              <p>Product Name</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total Price</p>
            </div>

        {
          product.map((data,index)=>(
            <div className='product-list' key={index}>
              <p>{index+1}</p>
              <p>{data.name}</p>
              <p>{data.price}</p>
              <p>{data.quantity}</p>
              <p>{data.quantity*data.price}</p>
            </div>
          ))


        }
      </div>}
      <div className='total-wrapper'>
      <p>Total : {total}</p>
      </div>
    </div>
  )
}
