import { getCookie } from 'utils/helpers';
import jsonToFormData from '@ajoelp/json-to-formdata';
import axios from 'axios';
import { dataURItoBlob } from 'data/clients/utils';
import { UPLOAD_GENERIC_FILES, requestBaseURL } from './constants';

export const BASE_URL =
  window.location.origin === 'http://127.0.0.1:3000' ||
  window.location.origin === 'http://127.0.0.1:8000'
    ? process.env.API_PATH
    : window.location.origin;

export function createGQLQuery(query, variables = {}, headers = {}) {
  const token = getCookie('authtoken');
  const form = new FormData();
  form.append('variables', JSON.stringify(variables));
  form.append('query', JSON.stringify(query));
  return axios
    .post(`${BASE_URL}/gql/`, form, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        ...headers,
        'X-CSRFToken': token || '',
        'Content-Type': 'multipart/form-data',
        Authorization: token,
        // 'Access-Control-Request-Headers': 'authorization,content-type,credentials,x-csrftoken',
      },
      Authorization: token,
      transformResponse: r => r,
    })
    .then(response => {
      const thisFuckingData = Object.freeze(JSON.parse(response.data));
      return thisFuckingData.data;
    });
}

export function loginUser(email, password) {
  const token = getCookie('authtoken');
  return fetch(`${BASE_URL}/accounts/login/`, {
    method: 'POST',
    header: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    'X-CSRFToken': token || '',
    Authorization: token || '',
    body: jsonToFormData({
      password,
      email,
    }),
  })
    .then(response => response.json())
    .then(data => data);
}

export function uploadGenericFile(file, { isFromDataUri, variables }) {
  const token = getCookie('authtoken');
  const form = new FormData();
  let uploadedFile = file;
  if (isFromDataUri) {
    uploadedFile = dataURItoBlob(file);
  }
  form.append('attachedFile', uploadedFile);
  if (variables) form.append('variables', JSON.stringify(variables));
  form.append('query', JSON.stringify(UPLOAD_GENERIC_FILES));
  return axios
    .post(`${requestBaseURL}/gql/`, form, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-CSRFToken': token || '',
        'Content-Type': 'multipart/form-data',
        Authorization: token,
        // 'Access-Control-Request-Headers': 'authorization,content-type,credentials,x-csrftoken',
      },
      params: {
        query: UPLOAD_GENERIC_FILES,
        variables,
      },
      Authorization: token,
      transformResponse: r => r,
    })
    .then(response => {
      const thisFuckingData = Object.freeze(JSON.parse(response.data));
      return thisFuckingData.data;
    });
}

export function post(endpoint, data) {
  const token = getCookie('authtoken');
  return fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    header: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    'X-CSRFToken': token || '',
    Authorization: token || '',
    body: jsonToFormData(data),
  });
}

export function signupUser(email, password, phoneNumber) {
  const token = getCookie('authtoken');
  return fetch(`${BASE_URL}/accounts/signup/`, {
    method: 'POST',
    header: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    'X-CSRFToken': token || '',
    Authorization: token || '',
    body: jsonToFormData({
      password,
      email,
      phone_number: phoneNumber,
    }),
  })
    .then(response => response.json())
    .then(data => data);
}
