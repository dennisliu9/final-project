import React from 'react';
import SVGCanvas from '../components/svg-canvas';
import Toolbar from '../components/toolbar';

export default function Home(props) {
  return (
    <div className="page-center">
      <SVGCanvas />
      <Toolbar />
    </div>
  );
}
