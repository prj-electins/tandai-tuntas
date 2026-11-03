import React from 'react';
import {createRoot} from 'react-dom/client';
import StickyNotes from './StickyNotes';
import AuthGate from '../../app/components/AuthGate';
import '../../app/globals.css';
createRoot(document.getElementById('root')!).render(new URLSearchParams(location.search).has('widget')?<StickyNotes/>:<AuthGate/>);
