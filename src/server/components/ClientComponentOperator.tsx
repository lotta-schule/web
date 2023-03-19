import ClientComponentGate from 'client/components/ClientComponentGate';
import { TenantModel } from 'model';
import { getAllCategories, getCurrentUser, getTenant } from 'server/loader';
import { getBaseUrl } from 'server/util';

export type ClientComponentOperatorProps = {
    children: React.ReactNode;
}

export const ClientComponentOperator = async ({ children }: ClientComponentOperatorProps) => {
    const [categories, currentUser, tenant] = await Promise.all([getAllCategories(), getCurrentUser(), getTenant() as Promise<TenantModel>])
    const baseUrl = getBaseUrl();

    return (
        <ClientComponentGate initialData={{ categories, currentUser, tenant, requestBaseUrl: baseUrl }}>{children}</ClientComponentGate>
    );
}
