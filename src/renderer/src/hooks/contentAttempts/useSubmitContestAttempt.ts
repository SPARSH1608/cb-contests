import { useMutation } from 'react-query';
import createAxiosClient from '../../utils/axiosClient';
import IApiResponse from '../../types/IApiResponse';
import TContestAttempt from '../../types/TContestAttempt';
import IJsonApi from '../../types/IJsonApi';

const client = createAxiosClient();

async function postSubmitContestAttempt(contest_attempt_id: string) {
  const response = await client.post<IApiResponse<IJsonApi<TContestAttempt>>>(`/contest-attempts/${contest_attempt_id}/submit`)
  return response.data
}

export default function useSubmitContestAttempt(contest_attempt_id: string) {
  return useMutation(postSubmitContestAttempt)
}