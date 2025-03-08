// components/storefront/ResaleItemCard.jsx

import React from 'react';

export default function ResaleItemCard({ item }) {
  const {
    id,
    name,
    category,
    condition,
    recommendedPrice,
    originalPrice,
    nextAction,
    returnDate,
    reasonReturned,
    qualityAssessment,
    generatedListing
  } = item;

  // Helper function to get a quality icon/label
  const getQualityLabel = () => {
    const quality = qualityAssessment?.overallQuality?.toLowerCase() || '';
    
    if (quality === 'excellent') {
      return '⭐⭐⭐⭐⭐ Excellent';
    } else if (quality === 'good') {
      return '⭐⭐⭐⭐ Good';
    } else if (quality === 'fair') {
      return '⭐⭐⭐ Fair';
    } else if (quality === 'poor') {
      return '⭐⭐ Poor';
    } else {
      return '⭐⭐⭐ Average';
    }
  };

  // Helper function to get an action icon/label
  const getActionLabel = () => {
    if (nextAction === 'Resale') {
      return '🏷️ Ready for Resale';
    } else if (nextAction === 'Refurbishment') {
      return '🔧 Needs Refurbishment';
    } else {
      return '📦 Processing';
    }
  };

  // Get discount percentage
  const discountPercentage = originalPrice ? Math.round((1 - (recommendedPrice / originalPrice)) * 100) : 0;

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
            {generatedListing?.title || name}
          </h3>
          <span style={{ 
            fontSize: '0.75rem', 
            backgroundColor: nextAction === 'Resale' ? '#ecfdf5' : '#eff6ff',
            color: nextAction === 'Resale' ? '#047857' : '#1d4ed8',
            padding: '0.25rem 0.5rem',
            borderRadius: '9999px'
          }}>
            {getActionLabel()}
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
          {category} • {condition} • Returned {new Date(returnDate).toLocaleDateString()}
        </p>
      </div>
      
      <div style={{ padding: '1rem', flex: '1 1 0%' }}>
        <p style={{ 
          fontSize: '0.875rem', 
          color: '#4b5563',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {generatedListing?.description || 
            `${name} in ${condition} condition. Returned due to ${reasonReturned}.`}
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {(generatedListing?.tags || [category]).map((tag, index) => (
            <span key={index} style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              backgroundColor: '#f3f4f6',
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px',
              border: '1px solid #e5e7eb'
            }}>
              {tag}
            </span>
          ))}
        </div>
        
        {qualityAssessment && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
            <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Quality Assessment:</p>
            <p style={{ color: '#6b7280' }}>{getQualityLabel()}</p>
          </div>
        )}
      </div>
      
      <div style={{ 
        padding: '1rem', 
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
            ${recommendedPrice?.toFixed(2)}
          </span>
          {originalPrice && (
            <span style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280', 
              marginLeft: '0.5rem',
              textDecoration: 'line-through'
            }}>
              ${originalPrice.toFixed(2)}
            </span>
          )}
          {discountPercentage > 0 && (
            <span style={{ 
              fontSize: '0.75rem', 
              backgroundColor: '#fee2e2', 
              color: '#b91c1c',
              padding: '0.125rem 0.375rem',
              borderRadius: '9999px',
              marginLeft: '0.5rem'
            }}>
              {discountPercentage}% OFF
            </span>
          )}
        </div>
        
        <button style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          fontWeight: '500',
          fontSize: '0.875rem',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          border: 'none',
          cursor: 'pointer'
        }}>
          View Details
        </button>
      </div>
    </div>
  );
}