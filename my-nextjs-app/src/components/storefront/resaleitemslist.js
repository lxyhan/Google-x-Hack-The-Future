// components/storefront/ResaleItemsList.jsx
"use client";

import React, { useState, useEffect } from 'react';
import ResaleItemCard from './ResaleItemCard';

export default function ResaleItemsList({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(!initialItems.length);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // If we have initial items, no need to fetch again
    if (initialItems.length > 0) {
      setItems(initialItems);
      setLoading(false);
      return;
    }

    // Function to fetch items if no initial items were provided
    const fetchItems = async () => {
      setLoading(true);
      try {
        // This would be a real API call in production
        const response = await fetch('/api/resale-items');
        if (!response.ok) {
          throw new Error('Failed to fetch resale items');
        }
        const data = await response.json();
        setItems(data.items || []);
      } catch (err) {
        setError(err.message || 'An error occurred');
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();

    // Set up event listeners for real-time updates
    const handleResaleUpdate = (event) => {
      console.log('Received resale item update:', event.detail);
      
      const newItems = event.detail.items;
      setItems(prevItems => {
        // Merge new items with existing items, avoiding duplicates
        const existingIds = new Set(prevItems.map(item => item.id));
        const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
        
        // Show notification about new items
        if (uniqueNewItems.length > 0) {
          showToast(`${uniqueNewItems.length} new item${uniqueNewItems.length === 1 ? '' : 's'} added!`);
        }
        
        return [...uniqueNewItems, ...prevItems];
      });
    };

    // Add event listener for custom events
    window.addEventListener('resale-items-update', handleResaleUpdate);

    // Clean up
    return () => {
      window.removeEventListener('resale-items-update', handleResaleUpdate);
    };
  }, [initialItems]);

  // Filter and sort items
  const getFilteredItems = () => {
    let result = [...items];
    
    // Apply filter
    if (filter !== 'all') {
      result = result.filter(item => 
        filter === 'resale' ? item.nextAction === 'Resale' : 
        filter === 'refurbishment' ? item.nextAction === 'Refurbishment' :
        item.category === filter
      );
    }
    
    // Apply sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.recommendedPrice - b.recommendedPrice);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.recommendedPrice - a.recommendedPrice);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate));
    }
    
    return result;
  };

  const filteredItems = getFilteredItems();

  // Function to display a toast notification
  const showToast = (message) => {
    // Create toast element
    const toast = document.createElement('div');
    toast.textContent = message;
    
    // Style the toast
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#10b981',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '4px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      zIndex: 1000,
      opacity: 0,
      transition: 'opacity 0.3s ease'
    });
    
    // Add to document
    document.body.appendChild(toast);
    
    // Fade in
    setTimeout(() => {
      toast.style.opacity = 1;
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.opacity = 0;
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };
  
  // Loading state
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading items...</div>;
  }
  
  // Error state
  if (error) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>Error: {error}</div>;
  }
  
  // Empty state
  if (items.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>No items currently available for resale</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Items Ready for Resale</h2>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ marginRight: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Filter:</label>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ 
                padding: '0.375rem 0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">All Items</option>
              <option value="resale">Ready for Resale</option>
              <option value="refurbishment">Needs Refurbishment</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Footwear">Footwear</option>
            </select>
          </div>
          
          <div>
            <label style={{ marginRight: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Sort:</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ 
                padding: '0.375rem 0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
          No items match your current filters
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredItems.map(item => (
            <ResaleItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}