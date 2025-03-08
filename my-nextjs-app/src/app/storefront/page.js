'use client'

import { useState, useEffect } from 'react'
import { processReturnsWithRule } from '../services/returns-processor'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon, AdjustmentsHorizontalIcon, TagIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'

// Enhanced Gemini API integration for richer content generation
const generateEnhancedContent = async (item) => {
  try {
    // In a real implementation, this would call the Gemini API with more context
    const condition = item.items[0].condition;
    const category = item.items[0].category;
    const reason = item.items[0].reason;
    const name = item.items[0].name;
    const brand = item.items[0].brand || "Designer";
    const material = item.items[0].material || "premium materials";
    
    // Generate more detailed descriptions using Gemini's capabilities
    let description = '';
    let sustainabilityNote = '';
    let keyFeatures = [];
    
    // Enhanced description generation
    if (condition === 'New with tags') {
      description = `This authentic ${brand} ${name} is brand new with tags attached. Perfect condition with original packaging. ${category} enthusiasts will appreciate this find - originally returned due to ${reason.toLowerCase()}.`;
      sustainabilityNote = 'By purchasing this new item, youre preventing it from potentially ending up in a landfill and reducing environmental waste.';
      keyFeatures = ['Brand new with tags', 'Original packaging', 'Authentic designer piece', '100% quality guaranteed'];
    } else if (condition === 'Like new') {
      description = `This ${brand} ${name} is practically indistinguishable from new. Crafted from ${material}, it shows no signs of wear despite being briefly owned. A coveted ${category.toLowerCase()} piece at a significant discount from retail.`;
      sustainabilityNote = 'Choosing like-new items reduces manufacturing demand and gives premium products a second chance.';
      keyFeatures = ['Indistinguishable from new', 'No visible signs of wear', 'Complete with all accessories', 'Professionally inspected'];
    } else if (condition === 'Good') {
      description = `This well-maintained ${brand} ${name} offers exceptional value. Made with ${material}, it shows minimal signs of previous use. A versatile ${category.toLowerCase()} option returned due to ${reason.toLowerCase()}, now available at a fraction of retail price.`;
      sustainabilityNote = 'Extending the lifecycle of quality goods reduces carbon footprint and promotes sustainable consumption.';
      keyFeatures = ['Excellent condition', 'Minimal signs of wear', 'Fully functional', 'Professionally cleaned'];
    } else {
      description = `This gently used ${brand} ${name} combines style with sustainability. Originally returned because of ${reason.toLowerCase()}, this ${category.toLowerCase()} piece has been thoroughly inspected and is in ${condition.toLowerCase()} condition, ready for its next chapter.`;
      sustainabilityNote = 'Every pre-owned purchase helps build a more circular economy and reduces fashion waste.';
      keyFeatures = ['Great value', 'Sustainable choice', 'Unique style', 'Budget-friendly option'];
    }
    
    // Generate color suggestions based on item category
    const colorPalette = category === 'Clothing' ? 
      ['#F5F5DC', '#E6E6FA', '#FFDAB9', '#E0FFFF'] : 
      category === 'Footwear' ? 
      ['#DCDCDC', '#F0F8FF', '#FFF0F5', '#F5FFFA'] : 
      ['#F0FFF0', '#FFF5EE', '#F0FFFF', '#FFF8DC'];
    
    // Add styling suggestions based on item type
    const stylingSuggestions = category === 'Clothing' ? 
      ['Pair with dark denim for a casual look', 'Layer under a blazer for office wear', 'Perfect for weekend outings'] : 
      category === 'Footwear' ? 
      ['Complements both casual and formal outfits', 'Ideal for all-day comfort', 'Versatile styling options'] : 
      ['Adds a distinctive touch to any setup', 'Blends with modern interior design', 'Functional and stylish'];
    
    return {
      description,
      sustainabilityNote,
      keyFeatures,
      colorPalette,
      stylingSuggestions,
      estimatedLifespan: condition === 'New with tags' ? '3+ years' : condition === 'Like new' ? '2-3 years' : '1-2 years'
    };
  } catch (error) {
    console.error('Error generating enhanced content:', error);
    return {
      description: `This ${item.items[0].name} is in ${item.items[0].condition.toLowerCase()} condition and was returned due to ${item.items[0].reason.toLowerCase()}.`,
      sustainabilityNote: 'Sustainable choice for conscious consumers.',
      keyFeatures: ['Quality item', 'Sustainable choice'],
      colorPalette: ['#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA'],
      stylingSuggestions: ['Versatile piece for many occasions'],
      estimatedLifespan: '1+ year'
    };
  }
};

export default function NorthStyleStorefront() {
  const [loading, setLoading] = useState(true);
  const [resaleItems, setResaleItems] = useState([]);
  const [allReturns, setAllReturns] = useState([]);
  const [activeRule, setActiveRule] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [itemEnhancedContent, setItemEnhancedContent] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [showNotification, setShowNotification] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // Load saved rules from localStorage
  useEffect(() => {
    const loadSavedRules = () => {
      try {
        // Get rule keys from localStorage
        const ruleKeys = Object.keys(localStorage).filter(key => key.startsWith('rule_'));
        
        if (ruleKeys.length > 0) {
          // Get the most recently created rule
          const rules = ruleKeys.map(key => {
            const ruleJson = localStorage.getItem(key);
            try {
              const rule = JSON.parse(ruleJson);
              return {
                id: rule.id,
                name: rule.name,
                createdAt: rule.createdAt,
                definition: rule
              };
            } catch (e) {
              console.error('Error parsing rule:', e);
              return null;
            }
          }).filter(Boolean);
          
          // Set the most recently created rule as active by default
          if (rules.length > 0 && !activeRule) {
            const sortedRules = [...rules].sort((a, b) => 
              new Date(b.createdAt) - new Date(a.createdAt)
            );
            setActiveRule(sortedRules[0]);
          }
        }
      } catch (e) {
        console.error('Error loading saved rules:', e);
      }
    };
    
    loadSavedRules();
  }, [activeRule]);

  // Process returns with active rule
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (activeRule) {
          console.log("Processing returns with rule:", activeRule.name);
          
          // Process returns with the active rule
          const result = await processReturnsWithRule(activeRule.definition);
          const { processedReturns } = result;
          
          setAllReturns(processedReturns);
          
          // Filter for resale/refurbishment items only
          const forResale = processedReturns.filter(item => 
            item.nextAction === 'Resale' || item.nextAction === 'Refurbishment'
          );
          
          setResaleItems(forResale);
        } else {
          console.log("No active rule, using default API");
          
          // Fallback to fetching standard data if no rule is active
          const returnsRes = await fetch('/api/returns?type=recent');
          const returnsData = await returnsRes.json();
          
          setAllReturns(returnsData);
          
          // Filter for resale/refurbishment items only
          const forResale = returnsData.filter(item => 
            item.nextAction === 'Resale' || item.nextAction === 'Refurbishment'
          );
          
          setResaleItems(forResale);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error processing returns for storefront:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeRule]);

  // Generate enhanced content for items using Gemini API
  useEffect(() => {
    const generateContent = async () => {
      const contentMap = {};
      
      for (const item of resaleItems) {
        contentMap[item.id] = await generateEnhancedContent(item);
      }
      
      setItemEnhancedContent(contentMap);
    };
    
    if (resaleItems.length > 0) {
      generateContent();
    }
  }, [resaleItems]);

  // Filter and sort items
  const getFilteredItems = () => {
    let filtered = [...resaleItems];
    
    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(item => 
        filter === 'resale' ? item.nextAction === 'Resale' : 
        filter === 'refurbishment' ? item.nextAction === 'Refurbishment' :
        item.items[0].category === filter
      );
    }
    
    // Apply sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => {
        const aPrice = getRecommendedPrice(a);
        const bPrice = getRecommendedPrice(b);
        return aPrice - bPrice;
      });
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => {
        const aPrice = getRecommendedPrice(a);
        const bPrice = getRecommendedPrice(b);
        return bPrice - aPrice;
      });
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.dateReturned) - new Date(a.dateReturned));
    } else if (sortBy === 'condition') {
      const conditionRank = {
        'New with tags': 5,
        'Like new': 4,
        'Good': 3,
        'Fair': 2,
        'Poor': 1
      };
      filtered.sort((a, b) => conditionRank[b.items[0].condition] - conditionRank[a.items[0].condition]);
    }
    
    return filtered;
  };

  const filteredItems = getFilteredItems();
  
  // Calculate recommended price based on condition
  const getRecommendedPrice = (item) => {
    const originalPrice = item.items[0].price;
    const condition = item.items[0].condition;
    
    const discountFactors = {
      'New with tags': 0.85,
      'Like new': 0.75,
      'Good': 0.65,
      'Fair': 0.55,
      'Poor': 0.45
    };
    
    const factor = discountFactors[condition] || 0.65;
    return parseFloat((originalPrice * factor).toFixed(2));
  };
  
  // Calculate savings percentage
  const getSavingsPercentage = (item) => {
    const originalPrice = item.items[0].price;
    const discountedPrice = getRecommendedPrice(item);
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };
  
  // Get quality stars based on condition
  const getQualityStars = (condition) => {
    let stars = 5;
    
    if (condition === 'New with tags' || condition === 'Like new') {
      stars = 5;
    } else if (condition === 'Good') {
      stars = 4;
    } else if (condition === 'Fair') {
      stars = 3;
    } else {
      stars = 2;
    }
    
    return Array(5).fill().map((_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${i < stars ? 'text-amber-400' : 'text-gray-200'}`}
        aria-hidden="true"
      />
    ));
  };
  
  // Handle quick view
  const openQuickView = (item) => {
    setSelectedItem(item);
    setQuickViewOpen(true);
  };
  
  // Handle add to wishlist or cart
  const handleAddItem = (item, action) => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'resale', label: 'Ready for Resale' },
    { value: 'refurbishment', label: 'Needs Refurbishment' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Footwear', label: 'Footwear' },
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'condition', label: 'Best Condition' },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Modern Header */}
      <header className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <a href="#" className="flex items-center">
                <span className="text-xl font-bold text-gray-900">NORTH<span className="text-teal-600">STYLE</span></span>
              </a>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium text-gray-800 hover:text-teal-600 transition-colors">New Arrivals</a>
              <a href="#" className="text-sm font-medium text-gray-800 hover:text-teal-600 transition-colors">Collections</a>
              <a href="#" className="text-sm font-medium text-gray-800 hover:text-teal-600 transition-colors">Sustainability</a>
              <a href="#" className="text-sm font-medium text-gray-800 hover:text-teal-600 transition-colors">About</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                type="button" 
                className="p-2 text-gray-500 hover:text-teal-600 transition-colors"
                onClick={() => setFiltersOpen(true)}
              >
                <AdjustmentsHorizontalIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        
        {activeRule && (
          <div className="bg-teal-600 py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-sm font-medium text-white">
                Sustainable collection processed with <strong>{activeRule.name}</strong>
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <div className="relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Sustainable Style, <span className="text-teal-600">Renewed</span>
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Premium returned items, curated and renewed for conscious fashion lovers.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 rounded-md bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors">
                Shop Now
              </button>
              <button className="px-6 py-3 rounded-md bg-white text-gray-900 font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                Our Story
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">        
        {/* Filters Dialog - Mobile */}
        <Transition.Root show={filtersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40" onClose={setFiltersOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500"
                      onClick={() => setFiltersOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filter Options */}
                  <div className="mt-4 border-t border-gray-200">
                    <div className="px-4 py-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Category</h3>
                      <div className="space-y-4">
                        {filterOptions.map((option) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              id={`mobile-filter-${option.value}`}
                              name="mobile-filter"
                              type="radio"
                              checked={filter === option.value}
                              onChange={() => setFilter(option.value)}
                              className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                            <label htmlFor={`mobile-filter-${option.value}`} className="ml-3 text-sm text-gray-600">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="px-4 py-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Sort By</h3>
                      <div className="space-y-4">
                        {sortOptions.map((option) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              id={`mobile-sort-${option.value}`}
                              name="mobile-sort"
                              type="radio"
                              checked={sortBy === option.value}
                              onChange={() => setSortBy(option.value)}
                              className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                            <label htmlFor={`mobile-sort-${option.value}`} className="ml-3 text-sm text-gray-600">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Category Title */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h2 className="text-2xl font-medium text-gray-900">Renewed Collection</h2>
          <p className="mt-2 text-gray-500">Curated pre-owned and returned items with a focus on quality and sustainability</p>
        </div>

        {/* Desktop Filter and View Options */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  filter === option.value
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center">
              <label htmlFor="desktop-sort" className="text-sm text-gray-500 mr-2">Sort:</label>
              <select
                id="desktop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-gray-700 focus:ring-teal-500 focus:border-teal-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Loading collection...</p>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-base font-medium text-gray-900">No items available</h3>
            <p className="mt-1 text-sm text-gray-500">
              No items currently match your filter criteria.
            </p>
            <button
              type="button"
              className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
              onClick={() => setFilter('all')}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Product Grid Layout */}
        {!loading && filteredItems.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-100"
              >
                {/* Product Image with Hover Effect */}
                <div className="aspect-w-1 aspect-h-1 bg-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Placeholder or actual image */}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Product Image</span>
                    </div>
                  </div>
                  
                  {/* Quick actions overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openQuickView(item)}
                        className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleAddItem(item, 'wishlist')}
                        className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.nextAction === 'Resale' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.nextAction}
                    </span>
                  </div>
                  
                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {getSavingsPercentage(item)}% OFF
                    </span>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-1">
                    <h3 className="text-base font-medium text-gray-900 truncate">{item.items[0].name}</h3>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    {getQualityStars(item.items[0].condition)}
                    <span className="ml-2 text-xs text-gray-500">{item.items[0].condition}</span>
                  </div>
                  
                  {/* AI-Generated Description */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {itemEnhancedContent[item.id] ? itemEnhancedContent[item.id].description : 'Loading description...'}
                  </p>
                  
                  {/* Sustainability Note - subtle highlight */}
                  <div className="bg-green-50 rounded-md p-2 mb-3 text-xs text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {itemEnhancedContent[item.id] ? itemEnhancedContent[item.id].sustainabilityNote : 'Sustainable choice'}
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold text-gray-900">${getRecommendedPrice(item).toFixed(2)}</span>
                      <span className="ml-2 text-sm text-gray-500 line-through">${item.items[0].price.toFixed(2)}</span>
                    </div>
                    
                    <button
                      type="button"
                      className="text-sm font-medium text-teal-600 border border-teal-600 px-3 py-1 rounded-md hover:bg-teal-50 transition-colors"
                      onClick={() => handleAddItem(item, 'cart')}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product List Layout - Alternative View */}
        {!loading && filteredItems.length > 0 && viewMode === 'list' && (
          <div className="space-y-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-100 flex flex-col md:flex-row"
              >
                {/* Product Image */}
                <div className="w-full md:w-48 lg:w-64 bg-gray-100 relative aspect-w-1 aspect-h-1 md:aspect-auto">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Product Image</span>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.nextAction === 'Resale' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.nextAction}
                    </span>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{item.items[0].name}</h3>
                      <div className="flex items-center mt-1">
                        {getQualityStars(item.items[0].condition)}
                        <span className="ml-2 text-xs text-gray-500">{item.items[0].condition}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold text-gray-900">${getRecommendedPrice(item).toFixed(2)}</span>
                      <span className="ml-2 text-sm text-gray-500 line-through">${item.items[0].price.toFixed(2)}</span>
                      <span className="ml-2 text-sm font-medium text-amber-600">
                        {getSavingsPercentage(item)}% OFF
                      </span>
                    </div>
                  </div>
                  
                  {/* AI-Generated Description */}
                  <p className="text-sm text-gray-600 mb-3">
                    {itemEnhancedContent[item.id] ? itemEnhancedContent[item.id].description : 'Loading description...'}
                  </p>
                  
                  <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Key Features */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-1">Key Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {itemEnhancedContent[item.id] && itemEnhancedContent[item.id].keyFeatures.map((feature, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-700">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-sm font-medium text-gray-600 border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                        onClick={() => openQuickView(item)}
                      >
                        Quick View
                      </button>
                      <button
                        type="button"
                        className="text-sm font-medium text-white bg-teal-600 px-3 py-1.5 rounded-md hover:bg-teal-700 transition-colors"
                        onClick={() => handleAddItem(item, 'cart')}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Quick View Modal */}
        <Transition.Root show={quickViewOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={setQuickViewOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full max-w-4xl sm:p-6">
                    <div className="absolute right-0 top-0 pr-4 pt-4">
                      <button
                        type="button"
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                        onClick={() => setQuickViewOpen(false)}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    {selectedItem && (
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Product Image */}
                        <div className="w-full md:w-1/2 bg-gray-100 rounded-lg overflow-hidden aspect-w-1 aspect-h-1">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-sm">Product Image</span>
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          <div className="absolute top-2 right-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              selectedItem.nextAction === 'Resale' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {selectedItem.nextAction}
                            </span>
                          </div>
                          
                          {/* Discount Badge */}
                          <div className="absolute top-2 left-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              {getSavingsPercentage(selectedItem)}% OFF
                            </span>
                          </div>
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {selectedItem.items[0].name}
                          </h2>
                          
                          <div className="flex items-center mb-4">
                            {getQualityStars(selectedItem.items[0].condition)}
                            <span className="ml-2 text-sm text-gray-500">{selectedItem.items[0].condition}</span>
                          </div>
                          
                          <div className="flex items-baseline mb-4">
                            <span className="text-2xl font-bold text-gray-900">${getRecommendedPrice(selectedItem).toFixed(2)}</span>
                            <span className="ml-2 text-base text-gray-500 line-through">${selectedItem.items[0].price.toFixed(2)}</span>
                          </div>
                          
                          {/* Full AI-Generated Description */}
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                            <p className="text-sm text-gray-600">
                              {itemEnhancedContent[selectedItem.id] ? itemEnhancedContent[selectedItem.id].description : 'Loading description...'}
                            </p>
                          </div>
                          
                          {/* Key Features */}
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-1">Key Features</h3>
                            <ul className="text-sm text-gray-600 pl-5 list-disc">
                              {itemEnhancedContent[selectedItem.id] && itemEnhancedContent[selectedItem.id].keyFeatures.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Styling Suggestions */}
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-1">Styling Suggestions</h3>
                            <ul className="text-sm text-gray-600 pl-5 list-disc">
                              {itemEnhancedContent[selectedItem.id] && itemEnhancedContent[selectedItem.id].stylingSuggestions.map((suggestion, idx) => (
                                <li key={idx}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Sustainability Note */}
                          <div className="bg-green-50 rounded-md p-3 mb-6 text-sm text-green-700">
                            <div className="font-medium mb-1">Sustainability Impact</div>
                            <p>
                              {itemEnhancedContent[selectedItem.id] ? itemEnhancedContent[selectedItem.id].sustainabilityNote : 'Sustainable choice'}
                            </p>
                            <div className="mt-2 text-xs">
                              Estimated Lifespan: {itemEnhancedContent[selectedItem.id] ? itemEnhancedContent[selectedItem.id].estimatedLifespan : '1+ year'}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <button
                              type="button"
                              className="flex-1 bg-teal-600 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                              onClick={() => {
                                handleAddItem(selectedItem, 'cart');
                                setQuickViewOpen(false);
                              }}
                            >
                              Add to Cart
                            </button>
                            <button
                              type="button"
                              className="flex-1 bg-white border border-gray-300 rounded-md py-3 px-8 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                              onClick={() => {
                                handleAddItem(selectedItem, 'wishlist');
                              }}
                            >
                              Save for Later
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        
        {/* Notification Toast */}
        <Transition
          show={showNotification}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4 flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Item added successfully</p>
                <p className="mt-1 text-sm text-gray-500">You can view your items in your cart or wishlist.</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="inline-flex text-gray-400 hover:text-gray-500"
                  onClick={() => setShowNotification(false)}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </main>

      {/* Sustainability Commitment Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Sustainability Commitment</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              At NorthStyle, we're committed to extending the lifecycle of quality products and reducing fashion waste.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Circular Economy</h3>
              <p className="text-sm text-gray-600">
                We extend the life of premium products, keeping them in circulation and out of landfills.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Quality Inspection</h3>
              <p className="text-sm text-gray-600">
                Every item is thoroughly inspected, cleaned, and refurbished when necessary to ensure premium quality.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Carbon Footprint</h3>
              <p className="text-sm text-gray-600">
                Purchasing renewed items reduces carbon footprint by up to 82% compared to buying new products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-teal-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white max-w-2xl">
              <h2 className="text-2xl font-bold">Join our sustainable fashion community</h2>
              <p className="mt-2">
                Subscribe to receive exclusive offers, style inspiration, and early access to new arrivals.
              </p>
            </div>
            
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-md text-gray-900 focus:ring-2 focus:ring-white focus:border-transparent border-transparent"
                />
                <button className="px-6 py-3 rounded-md bg-white text-teal-700 font-medium hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="text-xl font-bold">NORTH<span className="text-teal-400">STYLE</span></span>
              <p className="mt-4 text-gray-400 text-sm">
                Premium renewed apparel and accessories for conscious consumers.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.2923.743 4.105 4.105 0 01-3.7-2.105 4.126 4.126 0 003.791 2.863 8.217 8.217 0 01-6.05 1.699 11.616 11.616 0 006.29 1.843c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.843" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Shop</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Clothing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Footwear
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Electronics
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Collections
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">About</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Sustainability
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Certification
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Help</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm text-center">
              &copy; {new Date().getFullYear()} NorthStyle Apparel. All rights reserved. Making fashion sustainable, one piece at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}