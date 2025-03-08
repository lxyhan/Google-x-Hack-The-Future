
'use client'
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, Package, Leaf, RefreshCw, Send, Loader, Home, Box, MessageCircle, CheckCircle, Camera, Upload, AlertTriangle } from 'lucide-react';

// Mock Data
const userData = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, Apt 4B, New York, NY 10001"
};

const purchaseHistory = [
  {
    id: "ord-12345",
    date: "2025-02-12",
    items: [
      { 
        id: "prod-001", 
        name: "Premium Wireless Headphones", 
        price: 149.99, 
        image: "/api/placeholder/80/80",
        color: "Black",
        eligibleForReturn: true,
        sustainabilityImpact: "87% recyclable materials",
        returnStatus: null,
        returnId: null
      },
      { 
        id: "prod-002", 
        name: "Smart Fitness Watch", 
        price: 199.99, 
        image: "/api/placeholder/80/80",
        color: "Silver",
        eligibleForReturn: true,
        sustainabilityImpact: "Energy-efficient battery, 92% recyclable",
        returnStatus: null,
        returnId: null
      }
    ]
  },
  {
    id: "ord-67890",
    date: "2025-01-25",
    items: [
      { 
        id: "prod-003", 
        name: "Portable Bluetooth Speaker", 
        price: 79.99, 
        image: "/api/placeholder/80/80",
        color: "Blue",
        eligibleForReturn: false,
        sustainabilityImpact: "Made with 75% recycled plastics",
        returnStatus: "Returned",
        returnId: "RTN-prod-003-582"
      }
    ]
  }
];

// Components
const Header = ({ step, onBack, title }) => (
  <header className="bg-gradient-to-r from-emerald-700 to-teal-600 p-4 shadow-md border-0">
    <div className="max-w-3xl mx-auto flex items-center">
      {step !== 'purchases' && (
        <button 
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-emerald-600 text-white"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <h1 className="text-xl font-semibold text-white">{title}</h1>
    </div>
  </header>
);

const ProgressIndicator = ({ currentStep }) => {
  const steps = [
    { id: 'purchases', icon: Home, label: 'Orders' },
    { id: 'items', icon: Box, label: 'Items' },
    { id: 'chat', icon: MessageCircle, label: 'Return' },
    { id: 'upload', icon: Camera, label: 'Analysis' },
    { id: 'complete', icon: CheckCircle, label: 'Done' }
  ]

  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className="py-4 bg-white border-b border-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index <= currentIndex;
            const isComplete = index < currentIndex;
            
            return (
              <div key={step.id} className="flex flex-col items-center w-1/5">
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-full ${
                  isActive ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <StepIcon className="w-5 h-5" />
                  {isComplete && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                  )}
                </div>
                <span className={`mt-1 text-xs font-medium ${
                  isActive ? 'text-emerald-600' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block absolute h-0.5 w-1/5 top-5 left-${index+1}/5 -translate-x-1/2 ${
                    index < currentIndex ? 'bg-emerald-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const UserInfoCard = ({ user }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
    <h2 className="text-lg font-medium mb-3 text-gray-800">My Information</h2>
    <div className="text-sm text-gray-600 space-y-1">
      <p>{user.name}</p>
      <p>{user.email}</p>
      <p>{user.phone}</p>
      <p>{user.address}</p>
    </div>
  </div>
);

const OrderCard = ({ order, onSelect }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transform transition hover:shadow-md hover:-translate-y-1">
    <div className="p-5 border-b border-gray-100">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-gray-800">Order #{order.id}</h3>
          <p className="text-sm text-gray-500">
            Purchased on {new Date(order.date).toLocaleDateString()}
          </p>
        </div>
        <button 
          onClick={() => onSelect(order)}
          className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
        >
          View Items <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
    
    <div className="p-4 bg-gray-50">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Package className="w-4 h-4" />
        <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  </div>
);

const SustainabilityBadge = ({ impact }) => (
  <div className="flex items-center space-x-1 text-xs bg-emerald-50 text-emerald-700 py-1 px-2 rounded-full">
    <Leaf className="w-3 h-3" />
    <span>{impact}</span>
  </div>
);

const ItemCard = ({ item, onSelect }) => (
  <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex justify-between items-center transform transition hover:shadow-md">
    <div className="flex items-center">
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-20 h-20 rounded-lg object-cover mr-4"
        />
        {item.sustainabilityImpact && (
          <div className="absolute -top-2 -right-2">
            <div className="bg-emerald-500 rounded-full p-1 shadow-sm">
              <Leaf className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
        {item.returnStatus && (
          <div className="absolute -bottom-2 -left-2">
            <div className="bg-blue-500 rounded-full p-1 shadow-sm">
              <RefreshCw className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
      </div>
      <div>
        <h4 className="font-medium text-gray-800">{item.name}</h4>
        <p className="text-sm text-gray-500 mb-1">${item.price.toFixed(2)} • {item.color}</p>
        {item.sustainabilityImpact && (
          <SustainabilityBadge impact={item.sustainabilityImpact} />
        )}
        {item.returnStatus && (
          <div className="text-xs text-blue-600 font-medium mt-1">
            {item.returnStatus} • ID: {item.returnId}
          </div>
        )}
      </div>
    </div>
    
    {item.eligibleForReturn && !item.returnStatus ? (
      <button 
        onClick={() => onSelect(item)}
        className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transform transition hover:shadow"
      >
        Return
      </button>
    ) : item.returnStatus ? (
      <div className="flex items-center space-x-2 text-blue-600 italic text-sm">
        <span>Already returned</span>
      </div>
    ) : (
      <div className="flex items-center space-x-2 text-gray-500 italic text-sm">
        <span>Not eligible</span>
      </div>
    )}
  </div>
);

const ChatMessage = ({ message, isLoading }) => (
  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div 
      className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${
        message.sender === 'user' 
          ? 'bg-emerald-600 text-white rounded-br-none' 
          : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
      }`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Processing your request...</span>
        </div>
      ) : (
        message.text
      )}
    </div>
  </div>
);

const ChatInput = ({ value, onChange, onSend, disabled }) => (
  <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Type your message..."
      className="flex-1 p-4 focus:outline-none"
      onKeyPress={(e) => e.key === 'Enter' && onSend()}
      disabled={disabled}
    />
    <button
      onClick={onSend}
      disabled={!value.trim() || disabled}
      className={`p-4 ${
        !value.trim() || disabled
          ? 'text-gray-400'
          : 'text-emerald-600 hover:text-emerald-700'
      }`}
    >
      <Send className="w-5 h-5" />
    </button>
  </div>
);

const SustainabilityImpactCard = ({ isComplete }) => (
  <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 mb-4">
    <h3 className="flex items-center text-emerald-800 font-medium mb-2">
      <Leaf className="w-5 h-5 mr-2" />
      Sustainability Impact
    </h3>
    {isComplete ? (
      <div>
        <p className="text-emerald-700 mb-3">By completing this return online:</p>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
              <span className="text-emerald-800 text-xs">1</span>
            </div>
            <p className="text-sm text-gray-700">You saved approximately 0.82 kg of CO₂</p>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
              <span className="text-emerald-800 text-xs">2</span>
            </div>
            <p className="text-sm text-gray-700">This product will be refurbished or responsibly recycled</p>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
              <span className="text-emerald-800 text-xs">3</span>
            </div>
            <p className="text-sm text-gray-700">Our packaging is 100% recyclable</p>
          </div>
        </div>
      </div>
    ) : (
      <p className="text-sm text-emerald-700">
        Process your return online to reduce environmental impact and contribute to our sustainability goals.
      </p>
    )}
  </div>
);

// Main Component
// API integration service
const apiService = {
  async analyzeReturn(returnData, images) {
    // In a real implementation, this would call the FastAPI backend
    console.log('Analyzing return data:', returnData);
    console.log('Analyzing images:', images);
    
    // Simulate API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          return_id: `RTN-${returnData.product_id}-${Math.floor(Math.random() * 1000)}`,
          defect_analysis: {
            defects_found: Math.random() > 0.5,
            defect_types: ["minor_scratch", "button_wear"],
            severity: "low",
            images_processed: 1
          },
          fraud_analysis: {
            risk_score: Math.random() * 100,
            suspicious: Math.random() > 0.8,
            return_frequency: "normal"
          },
          condition_grade: {
            grade: "B+",
            description: "Good condition with minor wear",
            resale_value_percentage: 75
          },
          price_recommendation: {
            suggested_price: returnData.original_price * 0.7,
            market_comparison: "Average",
            marketplace_recommendations: [
              "Refurbish and resell",
              "Offer as certified pre-owned"
            ]
          }
        });
      }, 2000);
    });
  },
  
  async getReturn(returnId) {
    // Simulate fetching a return by ID
    console.log('Fetching return with ID:', returnId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          return_id: returnId,
          status: "Processed",
          created_at: new Date().toISOString()
        });
      }, 1000);
    });
  }
};

const ReturnsApp = () => {
  const [step, setStep] = useState('purchases');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "Hi Alex! I'm here to help with your return. What seems to be the issue with your product?" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [returnComplete, setReturnComplete] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setStep('items');
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setChatMessages([
      { sender: 'bot', text: `Hi Alex! I'm here to help with your return for the ${item.name}. What seems to be the issue with this product?` }
    ]);
    setStep('chat');
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    setChatMessages([...chatMessages, { sender: 'user', text: inputMessage }]);
    setInputMessage('');
    
    // Simulate processing
    setIsProcessing(true);
    
    // Simulate bot response
    setTimeout(() => {
      let botResponse;
      
      if (chatMessages.length === 1) {
        botResponse = "I'm sorry to hear that. Would you mind sharing a few more details about the issue? This helps us improve our products and sustainability efforts.";
      } else if (chatMessages.length === 3) {
        botResponse = "Thank you for explaining. I'll need to analyze your product condition. Could you please upload a photo of the item so our AI can assess it?";
        setStep('upload');
      } else if (chatMessages.length === 5) {
        botResponse = "Based on our analysis, you're eligible for a return. Since this product is part of our sustainability program, would you prefer a refund to your original payment method, or store credit with a 10% bonus to reduce environmental impact?";
      } else if (chatMessages.length === 7) {
        botResponse = `Great! I've processed your refund request. You'll receive a digital return shipping label at ${userData.email}. Your refund of ${selectedItem.price.toFixed(2)} will be processed once we receive the item. We'll ensure this product is refurbished or properly recycled. Would you like me to help with anything else?`;
      } else if (chatMessages.length === 9) {
        botResponse = "Perfect! Your return has been successfully processed. The return label has been sent to your email. Thank you for participating in our sustainable returns program!";
        
        // Update the purchase history to mark this item as returned
        const newReturnId = `RTN-${selectedItem.id}-${Math.floor(Math.random() * 1000)}`;
        
        // Find and update the item in the purchaseHistory
        const updatedItem = {
          ...selectedItem,
          returnStatus: "Returned",
          returnId: newReturnId,
          eligibleForReturn: false
        };
        
        // Set return complete state
        setReturnComplete(true);
        setSelectedItem(updatedItem);
        setStep('complete');
      }
      
      if (botResponse) {
        setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      }
      
      setIsProcessing(false);
    }, 1500);
  };

  const handleGoBack = () => {
    if (step === 'items') {
      setStep('purchases');
      setSelectedOrder(null);
    } else if (step === 'upload') {
      setStep('chat');
    } else if (step === 'chat') {
      setStep('items');
      setSelectedItem(null);
      setChatMessages([{ sender: 'bot', text: "Hi Alex! I'm here to help with your return. What seems to be the issue with your product?" }]);
      setReturnComplete(false);
      setProductImages([]);
      setAnalysisResults(null);
    } else if (step === 'complete') {
      setStep('purchases');
      setSelectedOrder(null);
      setSelectedItem(null);
      setChatMessages([{ sender: 'bot', text: "Hi Alex! I'm here to help with your return. What seems to be the issue with your product?" }]);
      setReturnComplete(false);
      setProductImages([]);
      setAnalysisResults(null);
    }
  };

  // Get appropriate title for header
  const getHeaderTitle = () => {
    switch (step) {
      case 'purchases': return 'My Purchases';
      case 'items': return 'Select Item to Return';
      case 'chat': return 'Process Return';
      case 'upload': return 'Analyze Product';
      case 'complete': return 'Return Complete';
      default: return 'Returns Portal';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 border-0">
      <Header 
        step={step} 
        onBack={handleGoBack} 
        title={getHeaderTitle()} 
      />
      
      <ProgressIndicator currentStep={step} />

      <main className="flex-1 overflow-y-auto pb-6">
        <div className="max-w-3xl mx-auto p-4">
          
          {/* Purchases List */}
          {step === 'purchases' && (
            <div className="space-y-4">
              <UserInfoCard user={userData} />
              
              <div className="mt-6 mb-3 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-800">Recent Orders</h2>
                <div className="flex items-center text-sm text-emerald-600">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  <span>Last updated: Today</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {purchaseHistory.map(order => (
                  <OrderCard 
                    key={order.id}
                    order={order}
                    onSelect={handleOrderSelect}
                  />
                ))}
              </div>
              
              <SustainabilityImpactCard isComplete={false} />
            </div>
          )}
          
          {/* Items Selection */}
          {step === 'items' && selectedOrder && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
                <h2 className="text-lg font-medium mb-2 text-gray-800">Order #{selectedOrder.id}</h2>
                <p className="text-sm text-gray-500">
                  Purchased on {new Date(selectedOrder.date).toLocaleDateString()}
                </p>
              </div>
              
              <h3 className="font-medium mb-3 text-gray-700">Select an item to return:</h3>
              
              <div className="space-y-4">
                {selectedOrder.items.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onSelect={handleItemSelect}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Chat Interface */}
          {(step === 'chat' || step === 'upload') && selectedItem && (
            <div className="flex flex-col h-full">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={selectedItem.image} 
                      alt={selectedItem.name} 
                      className="w-20 h-20 rounded-lg object-cover mr-4"
                    />
                    {selectedItem.sustainabilityImpact && (
                      <div className="absolute -top-2 -right-2">
                        <div className="bg-emerald-500 rounded-full p-1 shadow-sm">
                          <Leaf className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{selectedItem.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">${selectedItem.price.toFixed(2)} • {selectedItem.color}</p>
                    {selectedItem.sustainabilityImpact && (
                      <SustainabilityBadge impact={selectedItem.sustainabilityImpact} />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {chatMessages.map((message, index) => (
                  <ChatMessage 
                    key={index}
                    message={message}
                    isLoading={false}
                  />
                ))}
                
                {isProcessing && (
                  <ChatMessage 
                    message={{ sender: 'bot', text: '' }}
                    isLoading={true}
                  />
                )}
              </div>
              
              {/* Image Upload for Product Analysis */}
              {step === 'upload' && (
                <div className="mb-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Upload Product Images
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {productImages.map((image, index) => (
                        <div key={index} className="relative w-16 h-16 rounded-md bg-white border border-blue-200 overflow-hidden">
                          <img 
                            src={URL.createObjectURL(image)} 
                            alt={`Product image ${index+1}`} 
                            className="w-full h-full object-cover"
                          />
                          <button 
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-md p-1"
                            onClick={() => {
                              const newImages = [...productImages];
                              newImages.splice(index, 1);
                              setProductImages(newImages);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      
                      {productImages.length < 3 && (
                        <label className="w-16 h-16 flex flex-col items-center justify-center bg-white border border-blue-200 rounded-md cursor-pointer hover:bg-blue-50">
                          <Upload className="w-6 h-6 text-blue-500" />
                          <span className="text-xs mt-1 text-blue-500">Add</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                setProductImages([...productImages, e.target.files[0]]);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                    
                    <div className="flex justify-between">
                      <p className="text-xs text-blue-700">
                        Please upload clear images of your product from different angles
                      </p>
                      <button 
                        className={`text-sm px-3 py-1 rounded-lg ${
                          productImages.length > 0 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={productImages.length === 0}
                        onClick={async () => {
                          // Set processing state
                          setIsProcessing(true);
                          
                          // Simulate analyzing the image with the API
                          try {
                            const analysisResult = await apiService.analyzeReturn({
                              product_id: selectedItem.id,
                              product_category: 'electronics', 
                              original_price: selectedItem.price,
                              user_id: 'alex123'
                            }, productImages);
                            
                            // Store analysis results
                            setAnalysisResults(analysisResult);
                            
                            // Add AI response based on analysis
                            let aiResponse = "";
                            
                            if (analysisResult.defect_analysis.defects_found) {
                              aiResponse = `I've analyzed your ${selectedItem.name} and found ${analysisResult.defect_analysis.defect_types.join(", ")}. The condition is graded as ${analysisResult.condition_grade.grade} (${analysisResult.condition_grade.description}).`;
                            } else {
                              aiResponse = `I've analyzed your ${selectedItem.name} and it appears to be in ${analysisResult.condition_grade.grade} condition (${analysisResult.condition_grade.description}). No significant defects were found.`;
                            }
                            
                            setChatMessages(prev => [...prev, { 
                              sender: 'bot', 
                              text: aiResponse
                            }]);
                            
                            // Return to chat
                            setStep('chat');
                          } catch (error) {
                            console.error("Error analyzing return:", error);
                            setChatMessages(prev => [...prev, { 
                              sender: 'bot', 
                              text: "I'm sorry, I encountered an error while analyzing your images. Could you try uploading them again?"
                            }]);
                          } finally {
                            setIsProcessing(false);
                          }
                        }}
                      >
                        Analyze Images
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Analysis Results (if available) */}
              {analysisResults && step === 'chat' && (
                <ProductAnalysis analysisResults={analysisResults} />
              )}
              
              {/* Input Area */}
              <div className="mt-auto">
                {step === 'chat' && (
                  <ChatInput 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onSend={handleSendMessage}
                    disabled={isProcessing}
                  />
                )}
              </div>
            </div>
          )}
          
          {/* Return Complete */}
          {step === 'complete' && selectedItem && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Return Successfully Processed</h2>
                <p className="text-gray-600 mb-4">
                  Your return for {selectedItem.name} has been confirmed.
                  A prepaid shipping label has been sent to your email.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
                  <button 
                    onClick={() => setStep('purchases')}
                    className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700"
                  >
                    Return to Orders
                  </button>
                </div>
              </div>
              
              <SustainabilityImpactCard isComplete={true} />
              
              {analysisResults && (
                <ProductAnalysis analysisResults={analysisResults} />
              )}
              
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-medium mb-2 text-gray-800">Return Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Return ID</span>
                    <span className="font-medium text-gray-800">{selectedItem.returnId || analysisResults?.return_id || `RTN-${selectedItem.id}-${Math.floor(Math.random() * 1000)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Item</span>
                    <span className="font-medium text-gray-800">{selectedItem.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Refund Amount</span>
                    <span className="font-medium text-gray-800">${selectedItem.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Refund Method</span>
                    <span className="font-medium text-gray-800">Original Payment Method</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expected Processing</span>
                    <span className="font-medium text-gray-800">3-5 business days after receipt</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
};

export default ReturnsApp;