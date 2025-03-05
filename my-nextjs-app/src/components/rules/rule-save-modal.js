'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Save } from 'lucide-react'

export default function RuleSaveModal({ isOpen, setIsOpen, ruleName, setRuleName, onSave }) {
  const [name, setName] = useState(ruleName);
  const [description, setDescription] = useState('');
  const [activeStatus, setActiveStatus] = useState(true);
  const modalRef = useRef(null);
  const nameInputRef = useRef(null);
  
  // Focus on the name input when modal opens
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      setName(ruleName);
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 100);
    }
  }, [isOpen, ruleName]);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);
  
  // Handle save
  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a rule name");
      return;
    }
    
    if (onSave) {
      // Call the onSave callback from the parent component
      onSave(name, description, activeStatus);
    } else {
      // Fallback if onSave is not provided
      setRuleName(name);
      setIsOpen(false);
      alert(`Rule "${name}" saved successfully!`);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h3 className="text-lg font-medium text-stone-800">Save Rule</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            {/* Rule name input */}
            <div>
              <label htmlFor="rule-name" className="block text-sm font-medium text-stone-700 mb-1">
                Rule Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                id="rule-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter a descriptive name for this rule"
                required
              />
            </div>
            
            {/* Rule description input */}
            <div>
              <label htmlFor="rule-description" className="block text-sm font-medium text-stone-700 mb-1">
                Description
              </label>
              <textarea
                id="rule-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Describe what this rule does and when it should be used"
              />
            </div>
            
            {/* Rule status */}
            <div>
              <span className="block text-sm font-medium text-stone-700 mb-1">Status</span>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="focus:ring-green-500 h-4 w-4 text-green-600 border-stone-300"
                    checked={activeStatus}
                    onChange={() => setActiveStatus(true)}
                  />
                  <span className="ml-2 text-sm text-stone-700">Active</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="focus:ring-green-500 h-4 w-4 text-green-600 border-stone-300"
                    checked={!activeStatus}
                    onChange={() => setActiveStatus(false)}
                  />
                  <span className="ml-2 text-sm text-stone-700">Draft</span>
                </label>
              </div>
              <p className="mt-1 text-xs text-stone-500">
                {activeStatus 
                  ? "This rule will be applied to all returns immediately after saving." 
                  : "This rule will be saved as a draft and won't be applied until activated."}
              </p>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 border border-stone-300 rounded-md text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save Rule
          </button>
        </div>
      </div>
    </div>
  );
}