import {useCallback, useState} from 'react';

/**
 * Hook for waiting a specific number of updates for one component.
 * This can be used to display a loading animation, until the component receives it's next contentful update.
 */
export default function useUpdateTimeout(): [boolean, { (ttl: number): void } ] {
    const [getUpdateTimeout, setUpdateTimeout] = useState<{ttl: number}>({ttl: 0});

    // update the timeout on every render without triggering a rerender... hacky!
    if (getUpdateTimeout.ttl > 0) {
        getUpdateTimeout.ttl--;
    }

    const isWaiting = getUpdateTimeout.ttl > 0;
    const updateFunc = useCallback((ttl: number) => setUpdateTimeout({ttl: ttl+1}), [setUpdateTimeout]);

    return [isWaiting, updateFunc];
}