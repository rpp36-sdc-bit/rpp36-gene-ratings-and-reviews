import http from 'k6/http';
import { URLSearchParams } from 'https://jslib.k6.io/url/1.0.0/index.js';
import { check } from 'k6';
import { sleep } from 'k6';
import { Rate } from 'k6/metrics';

export const errorRate = new Rate('errors');
export const options = {
  vus: 1000,
  duration: '30s'
};

export default function () {
  const productid = Math.floor(Math.random() * (1000011 - 900000 + 1) + 900000)
  const searchParams = new URLSearchParams([
    ['product_id', productid],
    ['page', 1],
    ['count', 100],
    ['sort', 'newest']
  ]);

  check(http.get(`${'http://localhost:1337/reviews'}?${searchParams.toString()}`), {
    'status is 200': (r) => r.status == 200,
  }) || errorRate.add(1);
  sleep(1);
}