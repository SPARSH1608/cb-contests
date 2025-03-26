import { useQuery, UseQueryOptions } from 'react-query';
import createAxiosClient from '../utils/axiosClient';
import IApiResponse from '../types/IApiResponse';
import TUser from '../types/TUser';

const client = createAxiosClient();
const dummyData: TUser = {
    id: "8",
    name: 'Sparsh Goel',
    email: 'sparshgoelk@gmail.com',
    role_id: 1,
    oauth_id: 1,
    photo: 'https://lh3.googleusercontent.com/a/ACg8ocKtvICWY4GprnpXSZLiVf6n-iu3ZnQeNDk5BDhRHCjjvPAY1fOW=s96-c',
};
async function fetchMe() {
	// const response = await client.get<IApiResponse<TUser>>('/users/me');
	// console.log('data',response.data.data);
	return dummyData
}

type TQueryKey = ['users', 'me'];

export default function useMeData(
	options: UseQueryOptions<TUser, unknown, TUser, TQueryKey> = {}
) {
	return useQuery<TUser, unknown, TUser, TQueryKey>({
		queryKey: ['users', 'me'],
		queryFn: fetchMe,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
		keepPreviousData: true,
		enabled: true,
		retry: false,
		...options,
	});
}
