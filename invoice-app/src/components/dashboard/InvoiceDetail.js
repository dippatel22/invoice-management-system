import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const InvoiceDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(location.state);

  useEffect(() => {
    if (!data) {
      // If there's no data in the state, navigate back to the previous page
      navigate(-1);
    }
  }, [data, navigate]);

  const printInvoice = () => {
    const input = document.getElementById('invoice');
    html2canvas(input, { useCORS: true })
      .then((canvas) => {
        const imageData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: [612, 792],
        });
        pdf.internal.scaleFactor = 1;
        const imageProps = pdf.getImageProperties(imageData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imageProps.height * pdfWidth) / imageProps.width;

        pdf.addImage(imageData, 'png', 0, 0, pdfWidth, pdfHeight);
        pdf.save('invoice_' + new Date().toISOString() + '.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF: ', error);
        window.alert('Something went wrong while generating the PDF');
      });
  };

  if (!data) {
    return null; // Optionally, you can return a loading spinner or a message here
  }

  return (
    <div>
      <div className='invoice-top-header'>
        <button onClick={printInvoice} className='print-btn'>Print</button>
      </div>
      <div id='invoice' className='invoice-wrapper'>
        <div className='invoice-header'>
          <div className='company-detail'>
            <img
              alt='logo'
              className='company-logo'
              src={localStorage.getItem('photoURL')}
            />
            <p className='cName'>{localStorage.getItem('cName')}</p>
            <p>{localStorage.getItem('email')}</p>
          </div>
          <div className='customer-detail'>
            <h2>Invoice</h2>
            <p>To: {data.to}</p>
            <p>Phone: {data.phone}</p>
            <p>Address: {data.address}</p>
          </div>
        </div>
        <table className='product-table'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.product.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.quantity * product.price}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan='4'>Total</td>
              <td>{data.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
