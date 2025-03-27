import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto"> {/* Bootstrap classes */}
      <div className="container">
      <img src="/logo192.png" alt="Blockchain Explorer Logo" width="30" height="30" className="me-2" />
        <p>&copy; {new Date().getFullYear()} Blockchain Explorer</p>
      </div>
    </footer>
  );
}

export default Footer;
