import React from 'react';

export default function LogoSplash() {
  return (
    <div id='logo-splash' className='has-text-centered has-text-grey-lighter'>
      <div className="logo-container m-auto">
        <img
          style={{ filter: 'opacity(14%)' }}
          src='/images/logo-transparent-300px.webp'
          alt='NapkinNotes logo'
        ></img>
      </div>
      <h3 className='is-size-3 has-text-weight-bold'>
        <span className='is-hidden-desktop'>Tap</span><span className='is-hidden-touch'>Click</span> anywhere to start drawing!
      </h3>
    </div>
  );
}
