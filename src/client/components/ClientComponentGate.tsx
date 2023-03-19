'use client';

import { CategoryModel, TenantModel, UserModel } from 'model';
import { AppContextProvider } from '../providers';

export type ClientComponentGateProps = {
    children: React.ReactNode;
    initialData: {
        categories: CategoryModel[];
        currentUser: UserModel | null;
        requestBaseUrl: string;
        tenant: TenantModel;
    };
};

const ClientComponentGate = ({
    children,
    initialData,
}: ClientComponentGateProps) => {
    return <AppContextProvider {...initialData}>{children}</AppContextProvider>;
};

export default ClientComponentGate;
