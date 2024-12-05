import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

export const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const q = query(collection(db, 'invoices'), where('uid', '==', localStorage.getItem('uid')));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Fetched data:', data); // Log fetched data
        setInvoices(data);
      } catch (error) {
        console.error('Something went wrong while fetching data:', error);
      }
    };

    getData();
  }, []); // Empty dependency array means this useEffect runs once after the initial render

  const deleteData = async (id) => {
    const isSure = window.confirm('Are you sure?');
    if (isSure) {
      try {
        await deleteDoc(doc(db, 'invoices', id));
        // Refresh the data after deletion
        const q = query(collection(db, 'invoices'), where('uid', '==', localStorage.getItem('uid')));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Data after deletion:', data); // Log data after deletion
        setInvoices(data);
      } catch (error) {
        window.alert('Something went wrong');
        console.error('Error deleting document:', error);
      }
    }
  };

  return (
    <div>
      {invoices.length === 0 ? (
        <p>No invoices available</p>
      ) : (
        invoices.map(data => (
          <div className='box' key={data.id}>
            <p>{data.to}</p>
            <p>{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
            <p>Rs. {data.total}</p>
            <button onClick={() => deleteData(data.id)} className='delete-btn'>
              <i className="fa-solid fa-trash"></i> Delete
            </button>
            <button onClick={() => navigate('/dashboard/invoice-detail', { state: data })} className='view-btn'>
              <i className="fa-solid fa-eye"></i> View
            </button>
          </div>
        ))
      )}
    </div>
  );
};
