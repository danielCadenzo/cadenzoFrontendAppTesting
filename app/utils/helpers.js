/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
import { SOCIAL_MEDIA_DOMAINS } from './constants';

/* eslint-disable func-names */
export const getCookie = name => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === `${name}=`) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

export const dateTimeToHumanReadable = dateTime => {
  try {
    const date = new Date(dateTime);
    return `${date.toLocaleDateString()}`;
  } catch {
    return 'TBA';
  }
};

export const flattenGQLEdges = edges => edges.map(node => ({ ...node.node }));

export const redirectToUrl = (url = '/') => {
  window.location.href = `${window.location.origin}${url}`;
};

export const priceToDollars = priceInPennies =>
  +(priceInPennies / 100).toFixed(2);

export function getJsonFromUrl(url) {
  // eslint-disable-next-line no-param-reassign
  if (!url) url = location.href;
  const question = url.indexOf('?');
  let hash = url.indexOf('#');
  if (hash === -1 && question === -1) return {};
  if (hash === -1) hash = url.length;
  const query =
    question === -1 || hash === question + 1
      ? url.substring(hash)
      : url.substring(question + 1, hash);
  const result = {};
  query.split('&').forEach(function(part) {
    if (!part) return;
    part = part.split('+').join(' '); // replace every + with space, regexp-free version
    const eq = part.indexOf('=');
    let key = eq > -1 ? part.substr(0, eq) : part;
    const val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : '';
    const from = key.indexOf('[');
    if (from === -1) result[decodeURIComponent(key)] = val;
    else {
      const to = key.indexOf(']', from);
      const index = decodeURIComponent(key.substring(from + 1, to));
      key = decodeURIComponent(key.substring(0, from));
      if (!result[key]) result[key] = [];
      if (!index) result[key].push(val);
      else result[key][index] = val;
    }
  });
  return result;
}

// hashes a string to an hex colors
export function stringToHex(string) {
  let hash = 0;
  if (string.length === 0) return hash;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
    hash &= hash;
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 255;
    color += `00${value.toString(16)}`.substr(-2);
  }
  return color;
}

export function updateURLParameter(url, param, paramVal) {
  let newAdditionalURL = '';
  let tempArray = url.split('?');
  const baseURL = tempArray[0];
  const additionalURL = tempArray[1];
  let temp = '';
  if (additionalURL) {
    tempArray = additionalURL.split('&');
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i].split('=')[0] !== param) {
        newAdditionalURL += temp + tempArray[i];
        temp = '&';
      }
    }
  }

  const rowsTxt = `${temp}${param}=${paramVal}`;
  return `${baseURL}?${newAdditionalURL}${rowsTxt}`;
}

export function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getSocialMediaDomainFromLinks(urls) {
  return urls.reduce((acc, socialMediaLink) => {
    if (!socialMediaLink) return acc;
    let domain = new URL(socialMediaLink);
    domain = domain.hostname.replace('www.', '');
    domain = domain.replace('.com', '');
    if (SOCIAL_MEDIA_DOMAINS[domain]) {
      acc[domain] = socialMediaLink;
      return acc;
    }
    return acc;
  }, {});
}
