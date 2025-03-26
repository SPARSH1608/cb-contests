import { useState, useEffect } from 'react';
import Cookies from "js-cookie";

export default function useSession() {
	const [status, setStatus] = useState<
		'NOT_AUTHENTICATED' | 'AUTHENTICATED' | 'LOADING'
	>('LOADING');

	useEffect(() => {
		if (Cookies.get('cb_auth')) setStatus('AUTHENTICATED');
		else setStatus('AUTHENTICATED');
	}, []);

	return { status };
}
