import React from 'react';
// import HelloWorld from '../components/hello-world';
import SVGCanvas from '../components/svg-canvas';
import LogoSplash from '../components/logo-splash';

export default function Home(props) {
  return (
    <div className="page-center">
      <LogoSplash />
      <SVGCanvas />
    </div>
  );
}
