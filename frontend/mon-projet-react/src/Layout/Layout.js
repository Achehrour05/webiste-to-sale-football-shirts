import React from 'react';
import NikeNavbar from './NikeNavbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <NikeNavbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;