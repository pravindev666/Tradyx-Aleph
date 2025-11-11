'use client';

import React from 'react';
import OptionsDashboard from '@/components/dashboard/OptionsDashboard';
import SchemaMarkup from './components/SchemaMarkup';
import SEOHead from './components/SEOHead';
import ConsentBridge from '@/components/ConsentBridge';

export default function Page() {
  return (
    <>
      <SEOHead />
      <SchemaMarkup />
      <ConsentBridge />
      <OptionsDashboard />
    </>
  );
}
