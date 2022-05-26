import { getCookie } from 'utils/helpers';
import axios from 'axios';
import { requestBaseURL } from '../constants';

export function dataURItoBlob(dataURI) {
  let byteString;
  try {
    byteString = atob(dataURI.split(',')[1]);
  } catch {
    byteString = atob(dataURI);
  }
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/jpg' });
}

export default Object.freeze({
  post(query, variables = {}, headers = {}) {
    const token = getCookie('authtoken');
    const form = new FormData();
    if (variables) form.append('variables', JSON.stringify(variables));
    form.append('query', JSON.stringify(query));
    return axios
      .post(`${requestBaseURL}/gql/`, form, {
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
  },

  upload(query, file, { isFromDataUri, variables }) {
    const token = getCookie('authtoken');
    const form = new FormData();
    let uploadedFile = file;
    if (isFromDataUri) {
      uploadedFile = dataURItoBlob(file);
    }
    form.append('attachedFile', uploadedFile);
    if (variables) form.append('variables', JSON.stringify(variables));
    form.append('query', JSON.stringify(query));
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
          query,
          variables,
        },
        Authorization: token,
        transformResponse: r => r,
      })
      .then(response => {
        const thisFuckingData = Object.freeze(JSON.parse(response.data));
        return thisFuckingData.data;
      });
  },
});
