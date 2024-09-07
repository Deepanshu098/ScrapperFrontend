import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

function Details() {
    const { id } = useParams();
    const [company, setCompany] = useState('');

    useEffect(() => {
        const fetchCompany = async () => {
            const res = await axios.get(`https://scrapperbackend.onrender.com/api/company/${id}`);
            console.log(res)
            setCompany(res?.data?.data);
        };

        fetchCompany();
    }, [id]);

    // if (!company) return <div>Loading...</div>;


  return (
    <div style={{padding:'25px'}}>
        <div style={{display:'flex',gap:'2rem',justifyContent:'center',alignItems:'center'}}>
            <h1>{company.name}</h1>
            <img src={company.logo} style={{width:'50px',height:'50px'}} alt={`${company.name} logo`} />
            </div>
            <p>{company.description}</p>
            <div>
                <p>Phone:{company.phone}</p>
                <p>{company.email}</p>
                <div style={{display:'flex',gap:'0.5rem'}}>
                    <FaFacebook />
                    <FaTwitter />
                    <FaLinkedin />
                    <FaInstagram />
                </div>
            </div>
            <div>
                <h2>Website Screenshot</h2>
                <img src={`https://scrapperbackend.onrender.com/${company.screenshot}`} style={{height:'400px',width:'60%'}} alt="Website Screenshot" />
            </div>
        </div>
  )
}

export default Details