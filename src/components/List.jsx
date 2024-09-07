import React, { useState , useEffect} from 'react'
import {CSVLink} from 'react-csv'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';


function List() {
    const [displayedData, setDisplayedData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
  

  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <FaFacebook />;
      case 'twitter':
        return <FaTwitter />;
      case 'linkedin':
        return <FaLinkedin />;
      case 'instagram':
        return <FaInstagram />;
      case 'youtube':
        return <FaYoutube />;
      default:
        return null;
    }
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('scrapedData'));
    if (savedData) {
      setDisplayedData(savedData);
    }
  }, []);

  // Save the updated data to localStorage whenever displayedData changes
  useEffect(() => {
    if (displayedData.length > 0) {
      localStorage.setItem('scrapedData', JSON.stringify(displayedData));
    }
  }, [displayedData]);

  // Handle scraping the data
  const handleFetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:9000/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      console.log(result)

      if (result.status === 'success') {
        setDisplayedData((prevData) => [...prevData, result.data]); // Append new data
        setUrl('');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectRow = (index) => {
    const selected = [...selectedRows];
    if (selected.includes(index)) {
      selected.splice(selected.indexOf(index), 1);
    } else {
      selected.push(index);
    }
    setSelectedRows(selected);
  };

  // Delete selected rows
  const handleDeleteSelected = () => {
    const updatedData = displayedData.filter((_, index) => !selectedRows.includes(index));
    setDisplayedData(updatedData);
    setSelectedRows([]);
    localStorage.setItem('scrapedData', JSON.stringify(updatedData));
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayedData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <div className="container">
      <div className="search-bar">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter domain name"
        />
        <button onClick={handleFetchData} disabled={loading || !url}>
          {loading ? 'Fetching...' : 'Fetch & Save Details'}
        </button>
        <CSVLink data={displayedData} filename={"website-details.csv"} className="btn-csv">
          Export as CSV
        </CSVLink>
        <button className="btn-delete" onClick={handleDeleteSelected} disabled={selectedRows.length === 0}>
          Delete Selected
        </button>
      </div>

      <table className="responsive-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Company</th>
            <th>Name</th>
            <th>Social Profiles</th>
            <th>Description</th>
            <th>Address</th>
            <th>Phone No.</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={() => toggleSelectRow(index)}
                />
              </td>
              <td data-label="Company">
                <img src={row.logo} alt='Logo' className="logo" />
              </td>
              <td data-label="Name">
                <Link to={`/company/${row._id}`} style={{textDecoration:'none'}}>
                {row.name}
                </Link>
              </td>
              <td data-label="Social Profiles">
                {row.socialLinks && Object.entries(row.socialLinks).map(([platform, url]) => (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px' }}>
                    {getSocialIcon(platform)}
                  </a>
                ))}
              </td>
              <td data-label="Description">{row.description}</td>
              <td data-label="Address">{row.address || 'N/A'}</td>
              <td data-label="Phone No.">{row.phone || 'N/A'}</td>
              <td data-label="Email">{row.email || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(displayedData.length / itemsPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default List