import { useMedia } from 'react-use';

export const useIsMobile = () => {
    return useMedia('screen and (max-width: 600px)', false);
};
