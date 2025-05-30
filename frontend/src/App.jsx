import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/forms/WelcomeScreen';
import { TravelTypeQuestion } from './components/forms/TravelTypeQuestion';
import { DestinationQuestion } from './components/forms/DestinationQuestion';
import { DateQuestion } from './components/forms/DateQuestion';
import { TravelersQuestion } from './components/forms/TravelersQuestion';
import { BudgetQuestion } from './components/forms/BudgetQuestion';
import { Dashboard } from './components/dashboard/Dashboard';
import { useMCP } from './hooks/useMCP';

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [searchParams, setSearchParams] = useState({
    searchType: 'flights',
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    guests: 2,
    budget: ''
  });
  
  const { searchDeals } = useMCP();

  const handleNext = () => setCurrentStep(currentStep + 1);
  const handleBack = () => setCurrentStep(currentStep - 1);

  const handleSearch = async () => {
    // Send data to MCP backend
    console.log('Sending to MCP:', searchParams);
    
    try {
      // In production, you would use the actual MCP API
      // const results = await searchDeals(searchParams);
      // console.log('MCP Results:', results);
      
      // For now, proceed to dashboard
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('MCP Search Error:', error);
    }
  };

  // Add CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.6s ease-out;
      }
      
      .animate-slideIn {
        animation: slideIn 0.4s ease-out;
      }
      
      .animation-delay-200 {
        animation-delay: 200ms;
      }
      
      .animation-delay-400 {
        animation-delay: 400ms;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const steps = [
    <WelcomeScreen key="welcome" onNext={handleNext} />,
    
    <TravelTypeQuestion
      key="travel-type"
      onNext={handleNext}
      onBack={handleBack}
      value={searchParams.searchType}
      onChange={(value) => setSearchParams({...searchParams, searchType: value})}
    />,
    
    <DestinationQuestion
      key="destination"
      onNext={handleNext}
      onBack={handleBack}
      travelType={searchParams.searchType}
      origin={searchParams.origin}
      destination={searchParams.destination}
      onOriginChange={(value) => setSearchParams({...searchParams, origin: value})}
      onDestinationChange={(value) => setSearchParams({...searchParams, destination: value})}
    />,
    
    <DateQuestion
      key="dates"
      onNext={handleNext}
      onBack={handleBack}
      travelType={searchParams.searchType}
      departureDate={searchParams.departureDate}
      returnDate={searchParams.returnDate}
      onDepartureDateChange={(value) => setSearchParams({...searchParams, departureDate: value})}
      onReturnDateChange={(value) => setSearchParams({...searchParams, returnDate: value})}
    />,
    
    <TravelersQuestion
      key="travelers"
      onNext={handleNext}
      onBack={handleBack}
      guests={searchParams.guests}
      onGuestsChange={(value) => setSearchParams({...searchParams, guests: value})}
    />,
    
    <BudgetQuestion
      key="budget"
      onNext={handleNext}
      onBack={handleBack}
      budget={searchParams.budget}
      onBudgetChange={(value) => setSearchParams({...searchParams, budget: value})}
      onSearch={handleSearch}
    />,
    
    <Dashboard
      key="dashboard"
      searchParams={searchParams}
      searchType={searchParams.searchType}
    />
  ];

  return steps[currentStep];
};

export default App;