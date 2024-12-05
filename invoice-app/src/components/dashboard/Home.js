import { Chart } from 'chart.js/auto';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../firebase';

export const Home = () => {
  const [total, setTotal] = useState(0);
  const [totalMonthCollection, setTotalMonthCollection] = useState(0);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [invoices, setInvoices] = useState([]);

  
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
      getOverallTotal(data);
      getMonthTotal(data);
      monthCollection(data);
    } catch (error) {
      console.error('Something went wrong while fetching data:', error);
    }
  };

  useEffect(() => {
    getData();
    // createChart();
    // Cleanup chart on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const getOverallTotal = (invoiceList) => {
    var t = 0;
    invoiceList.forEach(data => {
      t += data.total;
    });
    setTotal(t);
  };

  const getMonthTotal = (invoiceList) => {
    var mt = 0;
    invoiceList.forEach(data => {
      if (new Date(data.date.seconds * 1000).getMonth() === new Date().getMonth()) {
        mt += data.total;
      }
    });
    setTotalMonthCollection(mt);
  };

  const monthCollection = (data) => {
    const chartData = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0
    };
    
    data.forEach(d => {
      if (new Date(d.date.seconds * 1000).getFullYear() === new Date().getFullYear()) {
        const monthName = new Date(d.date.seconds * 1000).toLocaleString('default', { month: 'long' });
        chartData[monthName] += d.total;
      }
    });

    createChart(chartData);
  };

  const createChart = (chartData) => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(chartData),
        datasets: [{
          label: 'Total Amount',
          data: Object.values(chartData),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <div>
      <div className='home-first-row'>
        <div className='home-box box-1'>
          <h1 className='box-header'>Rs. {total}</h1>
          <p>OverAll</p>
        </div>
        <div className='home-box box-2'>
          <h1 className='box-header'>{invoices.length}</h1>
          <p>Invoices</p>
        </div>
        <div className='home-box box-3'>
          <h1 className='box-header'>Rs. {totalMonthCollection}</h1>
          <p>This Month</p>
        </div>
      </div>
      <div className='home-second-row'>
        <div className='chart-box'>
          <canvas ref={chartRef} id="myChart"></canvas>
        </div>
        <div className='recent-invoice-list'>
          <h1>Recent Invoice List</h1>
          <div>
            <p>Customer Name</p>
            <p>Date</p>
            <p>Total</p>
          </div>
          {
          invoices.slice(0,6).map(data=>(
            <div>
            <p>{data.to}</p>
            <p>{new Date(data.date.seconds * 1000).toLocaleString()}</p>
            <p>{data.total}</p>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};
