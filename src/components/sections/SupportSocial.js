// src/components/sections/SupportSocial.js
import React from 'react';
import BaseSection from '../ui/BaseSection';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import useForm from '../../hooks/useForm';

const SupportSocial = () => {
  // Support info form
  const supportForm = useForm(
    {
      email: '',
      mobile: ''
    },
    (values) => {
      const errors = {};
      if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      if (values.mobile && !/^[0-9]{10}$/i.test(values.mobile)) {
        errors.mobile = 'Invalid mobile number';
      }
      return errors;
    },
    (formData) => {
      console.log('Saving support info:', formData);
      // API call would go here
    }
  );

  // Social profiles form
  const socialForm = useForm(
    {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
      pinterest: ''
    },
    (values) => {
      const errors = {};
      const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      
      Object.entries(values).forEach(([key, value]) => {
        if (value && !urlPattern.test(value)) {
          errors[key] = 'Invalid URL';
        }
      });
      
      return errors;
    },
    (formData) => {
      console.log('Saving social profiles:', formData);
      // API call would go here
    }
  );

  // The social media options with their icons and input fields
  const socialMediaOptions = [
    {
      name: 'facebook',
      label: 'Facebook URL',
      icon: (
        <div className="bg-black dark:bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-white dark:text-black font-bold text-lg">f</span>
        </div>
      ),
      placeholder: 'Enter Facebook url'
    },
    {
      name: 'twitter',
      label: 'Twitter URL',
      icon: (
        <div className="bg-black dark:bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-white dark:text-black font-bold text-lg">𝕏</span>
        </div>
      ),
      placeholder: 'Enter Twitter URL'
    },
    {
      name: 'instagram',
      label: 'Instagram URL',
      icon: (
        <div className="bg-black dark:bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="text-white dark:text-black" viewBox="0 0 16 16">
            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
          </svg>
        </div>
      ),
      placeholder: 'Enter Instagram URL'
    },
    {
      name: 'linkedin',
      label: 'LinkedIn URL',
      icon: (
        <div className="bg-black dark:bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-white dark:text-black font-bold text-lg">in</span>
        </div>
      ),
      placeholder: 'Enter LinkedIn URL'
    },
    {
      name: 'youtube',
      label: 'YouTube URL',
      icon: (
        <div className="bg-black dark:bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="text-white dark:text-black" viewBox="0 0 16 16">
            <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
          </svg>
        </div>
      ),
      placeholder: 'Enter YouTube URL'
    },
    {
      name: 'pinterest',
      label: 'Pinterest URL',
      icon: (
        <div className="bg-black dark:bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="text-white dark:text-black" viewBox="0 0 16 16">
            <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0z"/>
          </svg>
        </div>
      ),
      placeholder: 'Enter Pinterest URL'
    }
  ];

  // Social media input with icon
  const SocialMediaInput = ({ option }) => (
    <FormField 
      label={option.label}
      error={socialForm.touched[option.name] && socialForm.errors[option.name]}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {option.icon}
        </div>
        <input
          type="text"
          name={option.name}
          value={socialForm.values[option.name]}
          onChange={socialForm.handleChange}
          onBlur={socialForm.handleBlur}
          placeholder={option.placeholder}
          className="pl-12 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
    </FormField>
  );

  return (
    <BaseSection>
      {/* Customer Support Section */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Customer support</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Stay connected and responsive to your customers' needs.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            label="Email address"
            error={supportForm.touched.email && supportForm.errors.email}
          >
            <input
              type="email"
              name="email"
              value={supportForm.values.email}
              onChange={supportForm.handleChange}
              onBlur={supportForm.handleBlur}
              placeholder="Email address"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </FormField>
          
          <FormField 
            label="Mobile number"
            error={supportForm.touched.mobile && supportForm.errors.mobile}
          >
            <input
              type="text"
              name="mobile"
              value={supportForm.values.mobile}
              onChange={supportForm.handleChange}
              onBlur={supportForm.handleBlur}
              placeholder="+91-0123456789"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </FormField>
        </div>
      </section>
      
      {/* Social Profiles Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Social profiles</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Connect with customers and grow your online presence.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialMediaOptions.map(option => (
            <SocialMediaInput key={option.name} option={option} />
          ))}
        </div>
      </section>
      
      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={() => {
            supportForm.handleSubmit();
            socialForm.handleSubmit();
          }}
          disabled={supportForm.isSubmitting || socialForm.isSubmitting}
        >
          {(supportForm.isSubmitting || socialForm.isSubmitting) ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </BaseSection>
  );
};

export default SupportSocial;