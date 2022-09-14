import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';
import { Rate } from 'k6/metrics';

export const errorRate = new Rate('errors');
export const options = {
  vus: 10,
  duration: '30s'
};

export default function () {
  const review = JSON.stringify({
    product_id: 1000011,
    rating:  4,
    summary: "summary loving this product",
    body: "body I reallly love this product I really love it",
    recommend: true,
    name: "superuser123",
    email: "username@gmail.com",
    photos: [
      "https://res.cloudinary.com/lexicon-atelier/image/upload/v1661733999/nnoyb1vnnkrmn0t8gvmo.jpg",
      "https://images.unsplash.com/photo-1561693532-9ff59442a7db?ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80"
    ],
    characteristics: {3347676:5, 3347677:2, 3347678:3, 3347679:1}
  })
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  check(http.post('http://localhost:1337/reviews', review, params), {
    'status is 201': (r) => r.status == 201,
  }) || errorRate.add(1);
  sleep(1);
}