import { UseQueryOptions, useQuery } from 'react-query';
import TContestAttempt from '../../types/TContestAttempt';

const dummyData: TContestAttempt = {
    id: '123',
    'start-time': '2025-03-22T10:00:00Z',
    'end-time': '2025-03-22T12:00:00Z',
    contest: {
        id: '6',
    },
    user: {
        id: '8',
    },
};

async function queryFn({ queryKey }: { queryKey: any }) {
    // Return dummy data instead of making an API call
    return dummyData;
}

export default function useCurrentContestAttempt(
    contest_id: string,
    options: UseQueryOptions<
        TContestAttempt | null,
        unknown,
        TContestAttempt | null
    > = {}
) {
    return useQuery({
        queryKey: ['contest-attempt', 'current-attempt', contest_id],
        queryFn,
        ...options,
    });
}
