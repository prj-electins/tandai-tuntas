'use client';
import React from 'react';
import {BrandMark} from './Brand';
import {useApp} from './App';
import {APP_VERSION,APP_DEVELOPER} from '@/lib/version';
export function AboutApplication(){const {auth}=useApp();return <div className="about-app"><div className="about-heading"><BrandMark/><div><h2>Tandai Tuntas</h2><p>Rencana yang jelas. Karya yang selesai.</p></div></div><span className="about-version">Versi {APP_VERSION}</span><p>Satu tempat untuk mengatur tugas, memisahkan urusan pribadi dan pekerjaan, serta menyiapkan video dari ide hingga siap tayang.</p><dl className="about-details"><div><dt>Penyimpanan</dt><dd>{auth.mode==='local'?'Di perangkat ini':'Di akun web Anda'}</dd></div><div><dt>Pembaruan</dt><dd>{auth.mode==='local'?'Pasang versi terbaru':'Tersedia saat halaman dimuat ulang'}</dd></div></dl><footer>Dikembangkan oleh <strong>{APP_DEVELOPER}</strong></footer></div>}
