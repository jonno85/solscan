import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; 

const Button = ({ to, children, ...props }) => {
  return (
    <Link to={to} className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" {...props}>
      {children}
    </Link>
  );
};

export default Button;