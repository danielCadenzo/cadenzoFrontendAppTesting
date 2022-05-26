import {
  Environment,
  Network,
  RecordSource,
  Store as GQLStore,
} from 'relay-runtime';
import { getCookie } from 'utils/helpers';
import { BASE_URL } from 'data/api';
import axios from 'axios';

function fetchQuery(operation, variables = {}) {
  const form = new FormData();
  const token = getCookie('authtoken');
  form.append('variables', JSON.stringify(variables));
  form.append('query', JSON.stringify(operation.text));
  return axios
    .post(`${BASE_URL}/gql/`, form, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'X-CSRFToken': token || '',
        // 'Access-Control-Request-Headers':  'authorization,content-type,credentials,x-csrftoken',
      },
    })
    .then(response => response.data);
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new GQLStore(new RecordSource()),
});

export default environment;
