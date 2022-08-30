const request = require("supertest")
const app = require("./app")
const pool = require("./database/sql/config.js")

describe("Get Reviews Tests", () => {
  test("It should respond with reviews from product id", async () => {
    const res = await request(app)
      .get("/reviews?product_id=1")
      .set('Accept', 'application/json')
    expect(res.status).toBe(200)
    expect(res.body.product).toBe("1")
  }, 10000)
  test("It should provide the number of reviews of count if they exist", async () => {
    const res = await request(app)
      .get("/reviews?product_id=1000011&page=1&count=4")
      .set('Accept', 'application/json')
    expect(res.status).toBe(200)
    expect(res.body.results.length).toBe(4)
  }, 10000)
  test("It should provide photo urls with the review if they exist", async () => {
    const res = await request(app)
      .get("/reviews?product_id=1000011&page=1&count=4&sort=newest")
      .set('Accept', 'application/json')
    expect(res.status).toBe(200)
    expect(res.body.results[3].photos.length > 0).toBe(true)
  }, 10000)
  test("It should sort reviews by date if specified in the parameters", async () => {
    const res = await request(app)
      .get("/reviews?product_id=1000011&page=1&count=4&sort=newest")
      .set('Accept', 'application/json')
    expect(res.status).toBe(200)
    expect(res.body.results[0].date > res.body.results[1].date).toBe(true)
    expect(res.body.results[1].date > res.body.results[2].date).toBe(true)
    expect(res.body.results[2].date > res.body.results[3].date).toBe(true)
  }, 10000)
  test("If not specified it should sort reviews by helpfulness", async () => {
    const res = await request(app)
      .get("/reviews?product_id=1000011&page=1&count=4")
      .set('Accept', 'application/json')
    expect(res.status).toBe(200)
    expect(res.body.results[0].helpfulness >= res.body.results[1].helpfulness).toBe(true)
    expect(res.body.results[1].helpfulness >= res.body.results[2].helpfulness).toBe(true)
    expect(res.body.results[2].helpfulness >= res.body.results[3].helpfulness).toBe(true)

  }, 10000)
  test("It should respond to request of a product id with no reivews", async () => {
    const res = await request(app)
      .get("/reviews?product_id=1000012&page=1&count=4&sort=newest")
      .set('Accept', 'application/json')
    expect(res.status).toBe(200)
    expect(res.body.results).toStrictEqual([])
  }, 10000)
  test("It should respond to bad requests with status 400", async () => {
    const res = await request(app)
      .get("/reviews?product_id=abcd")
      .set('Accept', 'application/json')
    expect(res.status).toBe(400)
  }, 10000)
})

describe("Get Review Meta Tests (Method 1)", () => {
  test("It should respond with metadata from product id", async () => {
    const res = await request(app)
      .get("/reviews/meta?product_id=1000011")
      .set('Accept', 'application/json')
    expect(res.status).toBe(200)
    expect(res.body.product_id).toBe("1000011")
  }, 10000)
  test("It should respond to bad requests with status 400", async () => {
    const res = await request(app)
      .get("/reviews/meta?product_id=abcd")
      .set('Accept', 'application/json')
    expect(res.status).toBe(400)
  }, 10000)
})

describe("Get Review Meta Tests (Method 2)", () => {
  test("It should respond with metadata from product id", async () => {
    const res = await request(app)
      .get("/reviews/meta/alt?product_id=1000011")
      .set('Accept', 'application/json')
    expect(res.status).toBe(200)
    expect(res.body.product_id).toBe("1000011")
  }, 10000)
  test("It should respond to bad requests with status 400", async () => {
    const res = await request(app)
      .get("/reviews/meta/alt?product_id=abcd")
      .set('Accept', 'application/json')
    expect(res.status).toBe(400)
  }, 10000)
})

describe("Post Review Tests", () => {
  const sampleReviewPost = {
    "product_id": 1000011,
    "rating":  4,
    "summary": "summary loving this product",
    "body": "body I reallly love this product I really love it",
    "recommend": true,
    "name": "superuser123",
    "email": "username@gmail.com",
    "photos": ["https://res.cloudinary.com/lexicon-atelier/image/upload/v1661733999/nnoyb1vnnkrmn0t8gvmo.jpg", "https://images.unsplash.com/photo-1561693532-9ff59442a7db?ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80"],
    "characteristics": {"3347676":5, "3347677":2, "3347678":3, "3347679":1}
}

  afterEach(async () => {
    await pool.query('DELETE from photos where id > 2742540; \
    DELETE from characteristicsreviews where id > 19327575; \
    DELETE from reviews where id > 5774952; \
    ALTER SEQUENCE review_serial RESTART with 5774953; \
    ALTER SEQUENCE photos_serial RESTART with 2742541; \
    ALTER SEQUENCE characteristicsreviews_serial RESTART with 19327576;')
  })

  test("It should respond with status created on sucessful post", async () => {
    const res = await request(app)
      .post("/reviews")
      .set('Accept', 'application/json')
      .send(sampleReviewPost)
    expect(res.status).toBe(201)
    expect(res.text).toBe("Created")
  }, 10000)
  test("It should respond to bad requests with status 400", async () => {
    const res = await request(app)
      .post("/reviews")
      .set('Accept', 'application/json')
      .send({"product_id": 'this is a bad request'})
    expect(res.status).toBe(400)
  }, 10000)
})