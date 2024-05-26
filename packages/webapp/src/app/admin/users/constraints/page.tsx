import * as React from 'react';
import { loadTenant } from 'loader';
import { ConstraintList } from './ConstraintsList';

async function ConstraintsListPage() {
  const tenant = await loadTenant();

  return <ConstraintList tenant={tenant} />;
}

export default ConstraintsListPage;