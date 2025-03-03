import React, { useState, useEffect } from "react";
import { FiCheck, FiX, FiRefreshCw } from "react-icons/fi";
import { 
  detectUserCurrency, 
  convertPrice, 
  formatPrice, 
  fetchExchangeRates,
  defaultCurrency 
} from "../utils/currencyUtils";

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [currency, setCurrency] = useState(defaultCurrency);
  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(true);
  const [isLoadingRates, setIsLoadingRates] = useState(true);
  const [convertedPrices, setConvertedPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [userCountry, setUserCountry] = useState(null);

  // Base pricing in INR
  const pricingPlansBase = [
    {
      id: "free",
      name: "Free",
      description: "For small stores just getting started",
      price: {
        monthly: 0,
        annually: 0,
      },
      features: [
        { text: "1 online store", included: true },
        { text: "Up to 10 products", included: true },
        { text: "Basic analytics", included: true },
        { text: "24/7 support", included: false },
        { text: "Custom domain", included: false },
        { text: "Advanced reporting", included: false },
      ],
      ctaText: "Start for free",
      popular: false,
    },
    {
      id: "standard",
      name: "Standard",
      description: "For growing businesses",
      price: {
        monthly: 2400,  // ₹2,400 per month
        annually: 24000, // ₹24,000 per year
      },
      features: [
        { text: "3 online stores", included: true },
        { text: "Up to 100 products", included: true },
        { text: "Advanced analytics", included: true },
        { text: "24/7 support", included: true },
        { text: "Custom domain", included: true },
        { text: "Advanced reporting", included: false },
      ],
      ctaText: "Start with Standard",
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      description: "For large scale operations",
      price: {
        monthly: 6500,  // ₹6,500 per month
        annually: 65000, // ₹65,000 per year
      },
      features: [
        { text: "Unlimited stores", included: true },
        { text: "Unlimited products", included: true },
        { text: "Advanced analytics", included: true },
        { text: "24/7 priority support", included: true },
        { text: "Custom domain", included: true },
        { text: "Advanced reporting", included: true },
      ],
      ctaText: "Start with Premium",
      popular: false,
    },
  ];

  // Country name mapping for display purposes
  const countryNames = {
    'USD': 'United States',
    'EUR': 'Europe',
    'GBP': 'United Kingdom',
    'JPY': 'Japan',
    'CAD': 'Canada',
    'AUD': 'Australia',
    'INR': 'India',
    'CNY': 'China',
    'BRL': 'Brazil',
    'MXN': 'Mexico',
    'RUB': 'Russia',
    'ZAR': 'South Africa',
  };

  useEffect(() => {
    // Detect user's country and currency
    const detectUserLocation = async () => {
      setIsLoadingCurrency(true);
      try {
        // First try to get location from IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_name) {
          setUserCountry(data.country_name);
        }
        
        // Then detect appropriate currency
        const detectedCurrency = await detectUserCurrency();
        setCurrency(detectedCurrency);
      } catch (error) {
        console.error("Failed to detect location:", error);
        setCurrency(defaultCurrency);
        setUserCountry('Unknown');
      } finally {
        setIsLoadingCurrency(false);
      }
    };

    // Get exchange rates
    const getExchangeRates = async () => {
      setIsLoadingRates(true);
      try {
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      } finally {
        setIsLoadingRates(false);
      }
    };

    detectUserLocation();
    getExchangeRates();
  }, []);

  // Calculate converted prices whenever currency or exchange rates change
  useEffect(() => {
    const calculatePrices = async () => {
      if (isLoadingRates || !Object.keys(exchangeRates).length) return;
      
      const newPrices = {};
      
      for (const plan of pricingPlansBase) {
        newPrices[plan.id] = {
          monthly: await convertPrice(plan.price.monthly, currency),
          annually: await convertPrice(plan.price.annually, currency)
        };
      }
      
      setConvertedPrices(newPrices);
    };
    
    calculatePrices();
  }, [currency, exchangeRates, isLoadingRates]);

  const toggleBillingCycle = () => {
    setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly");
  };

  const handleChangeCurrency = async (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    setIsLoadingRates(true);
    
    // Update country name if available
    if (countryNames[newCurrency]) {
      setUserCountry(countryNames[newCurrency]);
    }
    
    // Recalculate prices for the new currency
    const newPrices = {};
    
    for (const plan of pricingPlansBase) {
      newPrices[plan.id] = {
        monthly: await convertPrice(plan.price.monthly, newCurrency),
        annually: await convertPrice(plan.price.annually, newCurrency)
      };
    }
    
    setConvertedPrices(newPrices);
    setIsLoadingRates(false);
  };
  
  // Function to refresh exchange rates
  const refreshRates = async () => {
    setIsLoadingRates(true);
    try {
      const rates = await fetchExchangeRates(true); // Force refresh
      setExchangeRates(rates);
      setLastUpdated(new Date());
      
      // Recalculate prices with new rates
      const newPrices = {};
      
      for (const plan of pricingPlansBase) {
        newPrices[plan.id] = {
          monthly: await convertPrice(plan.price.monthly, currency),
          annually: await convertPrice(plan.price.annually, currency)
        };
      }
      
      setConvertedPrices(newPrices);
    } catch (error) {
      console.error("Failed to refresh exchange rates:", error);
    } finally {
      setIsLoadingRates(false);
    }
  };

  const isLoading = isLoadingCurrency || isLoadingRates || !Object.keys(convertedPrices).length;

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
          Choose the perfect plan for your business needs
        </p>

        {/* Location detected notice */}
        {userCountry && !isLoadingCurrency && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Showing prices for {userCountry} ({currency})
          </div>
        )}

        {/* Currency and Billing Cycle selection */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Currency selector with refresh button */}
          <div className="relative min-w-[200px] flex items-center">
            <label htmlFor="currency-selector" className="sr-only">
              Select Currency
            </label>
            <div className="relative flex-grow">
              {isLoading && (
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FiRefreshCw className="animate-spin h-5 w-5 text-gray-400" />
                </div>
              )}
              <select
                id="currency-selector"
                value={currency}
                onChange={handleChangeCurrency}
                className={`block w-full py-2 pl-10 pr-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm ${
                  isLoading ? 'text-gray-400' : 'text-gray-700 dark:text-gray-200'
                }`}
                disabled={isLoading}
              >
                {Object.keys(exchangeRates).map((currencyCode) => (
                  <option key={currencyCode} value={currencyCode}>
                    {currencyCode} {countryNames[currencyCode] ? `- ${countryNames[currencyCode]}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <button 
              onClick={refreshRates}
              disabled={isLoading}
              className="ml-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              title="Refresh exchange rates"
            >
              <FiRefreshCw className={`h-5 w-5 text-gray-500 dark:text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Billing toggle */}
          <div className="relative bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg flex">
            <button
              type="button"
              className={`${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "bg-transparent"
              } relative py-2 px-6 border-transparent rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 transition-colors`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`${
                billingCycle === "annually"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "bg-transparent"
              } relative py-2 px-6 border-transparent rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 transition-colors`}
              onClick={() => setBillingCycle("annually")}
            >
              Annually{" "}
              <span className="text-primary-500 dark:text-primary-400 font-medium">
                (Save 17%)
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <FiRefreshCw className="animate-spin h-10 w-10 text-primary-500" />
            <span className="ml-3 text-gray-600 dark:text-gray-300">
              Loading pricing information...
            </span>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlansBase.map((plan) => {
              // Get the converted prices
              const priceData = convertedPrices[plan.id] || { monthly: plan.price.monthly, annually: plan.price.annually };
              
              // Format prices according to currency conventions
              const formattedMonthlyPrice = formatPrice(priceData.monthly, currency);
              const formattedAnnuallyPrice = formatPrice(priceData.annually, currency);
              
              return (
                <div
                  key={plan.id}
                  className={`rounded-lg shadow-lg bg-white dark:bg-gray-800 overflow-hidden ring-1 ${
                    plan.popular
                      ? "ring-primary-500 dark:ring-primary-400 transform scale-105 md:scale-110 z-10"
                      : "ring-gray-200 dark:ring-gray-700"
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-primary-500 dark:bg-primary-600 py-1 text-center text-white text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      {plan.description}
                    </p>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                        {billingCycle === "monthly"
                          ? formattedMonthlyPrice
                          : formattedAnnuallyPrice}
                      </span>
                      <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </div>
                    <ul className="mt-6 space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0">
                            {feature.included ? (
                              <FiCheck className="h-5 w-5 text-green-500 dark:text-green-400" />
                            ) : (
                              <FiX className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            )}
                          </div>
                          <p className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                            {feature.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <button
                        className={`w-full py-3 px-4 rounded-md shadow font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                          plan.popular
                            ? "bg-primary-600 hover:bg-primary-700"
                            : "bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600"
                        }`}
                      >
                        {plan.ctaText}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Exchange Rate Disclaimer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Base currency: INR (Indian Rupee). Exchange rates updated hourly.
            {lastUpdated && ` Last updated: ${lastUpdated.toLocaleString()}`}
          </p>
        </div>

        {/* FAQ section */}
        <div className="mt-24">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">
            Frequently asked questions
          </h2>
          <div className="mt-12 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                What payment methods do you accept?
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                We accept all major credit cards, PayPal, UPI, and bank transfers. 
                For Indian customers, we also support payment options like Paytm, PhonePe,
                and other popular local payment methods.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Do you offer regional pricing?
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Yes, our base currency is Indian Rupee (INR), but we automatically show prices in your local 
                currency based on your location. You can also manually select your preferred currency from 
                the dropdown menu above. All currency conversions use real-time exchange rates.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                How often do you update exchange rates?
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Our exchange rates are updated hourly using reliable financial data providers. 
                This ensures you always see accurate pricing in your local currency. You can also
                manually refresh the rates using the refresh button next to the currency selector.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Can I change my plan later?
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. 
                When you upgrade, you'll be prorated for the remainder of your billing cycle. 
                When you downgrade, the new rate will apply on your next billing date.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Is there a free trial?
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Yes, we offer a 14-day free trial on all paid plans. 
                No credit card is required to start your trial. 
                At the end of your trial, you can choose to subscribe or downgrade to the free plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;