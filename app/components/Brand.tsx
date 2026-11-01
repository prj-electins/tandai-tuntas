import React from 'react';
export function BrandMark(){return <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
export function Brand(){return <><BrandMark/><span className="brand-copy"><span className="brand-name">Tandai</span><span className="studio-word" aria-label="Tuntas">{'TUNTAS'.split('').map((letter,i)=><span aria-hidden="true" key={i}>{letter}</span>)}</span></span></>}
