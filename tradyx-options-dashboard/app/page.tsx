'use client';

import React from 'react';
import OptionsDashboard from '@/components/dashboard/OptionsDashboard';
import SchemaMarkup from './components/SchemaMarkup';
import ConsentBridge from '@/components/ConsentBridge';

export default function Page() {
  return (
    <>
      <SchemaMarkup />
      <ConsentBridge />
      <OptionsDashboard />
    </>
  );
}
