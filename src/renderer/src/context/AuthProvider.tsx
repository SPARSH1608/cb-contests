import React, { createContext, useState, useContext, useEffect } from 'react';
import type IUser from '../types/IUser';
import type IApiResponse from '../types/IApiResponse';
import axios, { AxiosResponse } from 'axios';
import Cookies from "js-cookie";

export interface IAuth {
	jwt: string;
	refreshToken: string;
	user: IUser;
}

const AuthContext = createContext<Array<IUser>>([]);

type Props = {
	children?: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
	const jwt = Cookies.get('cb_auth');
	const [user, setUser] = useState({} as IUser);

	useEffect(() => {
		async function getUser() {
			if (jwt) {
				const userResponse: AxiosResponse<IApiResponse<IUser>> = await axios({
					method: 'get',
					url: `${import.meta.env.VITE_API_ENDPOINT}/users/me`,
					headers: {
						Authorization: `Jwt ${jwt}`,
					},
				});
				setUser(userResponse.data.data);
			}
		}
		getUser();
	}, [jwt]);

	return <AuthContext.Provider value={[user]}>{children}</AuthContext.Provider>;
}

export const useGetCurrentUser = function () {
	return useContext(AuthContext);
};

export default AuthContext;
