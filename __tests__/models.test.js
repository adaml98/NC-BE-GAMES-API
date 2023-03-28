const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET: /api/categories", () => {
  it("should get a reponse of 200 and return all categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.categories).toHaveLength(4);
        body.categories.forEach((category) => {
          expect(category).toHaveProperty("slug", expect.any(String));
          expect(category).toHaveProperty("description", expect.any(String));
        });
      });
  });
});
describe("GET: /api/reviews/:review_id", () => {
  it("should get a response of 200 and return a specific review depending on the parametric endpoint", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toHaveProperty("review_id", 1);
        expect(body.review).toHaveProperty("title", "Agricola");
        expect(body.review).toHaveProperty("category", "euro game");
        expect(body.review).toHaveProperty("designer", "Uwe Rosenberg");
        expect(body.review).toHaveProperty("owner", "mallionaire");
        expect(body.review).toHaveProperty("review_body", "Farmyard fun!");
        expect(body.review).toHaveProperty(
          "review_img_url",
          "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700"
        );
        expect(body.review).toHaveProperty(
          "created_at",
          "2021-01-18T10:00:20.514Z"
        );
        expect(body.review).toHaveProperty("votes", 1);
      });
  });

  it("should throw a 400 error when given a bad request", () => {
    return request(app)
      .get("/api/reviews/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("should throw a 404 error when given an incorrect id", () => {
    return request(app)
      .get("/api/reviews/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID can not be found");
      });
  });
});

describe("GET: /api/reviews", () => {
  it("should recieve a response of 200 and return all reviews ordered by date desc", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", { descending: true });
        expect(body.reviews).toHaveLength(13);
        body.reviews.forEach((review) => {
          expect(review).toHaveProperty("review_id", expect.any(Number));
          expect(review).toHaveProperty("title", expect.any(String));
          expect(review).toHaveProperty("category", expect.any(String));
          expect(review).toHaveProperty("designer", expect.any(String));
          expect(review).toHaveProperty("owner", expect.any(String));
          expect(review).toHaveProperty("review_body", expect.any(String));
          expect(review).toHaveProperty("review_img_url", expect.any(String));
          expect(review).toHaveProperty("created_at", expect.any(String));
          expect(review).toHaveProperty("votes", expect.any(Number));
          expect(review).toHaveProperty("comment_count", expect.any(String));
        });
      });
  });
});
describe("GET: /api/reviews/:review_id/comments", () => {
  it("should receive a response of 200 and return all comments for the given review id, ordered by date asc", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(3);
        expect(body.comments).toBeSortedBy("created_at");
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("review_id", expect.any(Number));
        });
      });
  });
  it("should throw a 400 error when given a bad request", () => {
    return request(app)
      .get("/api/reviews/notAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("should throw a 404 error when given an incorrect id", () => {
    return request(app)
      .get("/api/reviews/999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID can not be found");
      });
  });
  it("should not throw a 404 error when given a correct id but returns an empty array", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});

describe("POST: /api/reviews/:review_id/comments", () => {
  it("should receive a response of 201 and return the posted comment ", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "mallionaire", body: "hello world" })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty("comment_id", 7);
        expect(body.comment).toHaveProperty("body", "hello world");
        expect(body.comment).toHaveProperty("review_id", 1);
        expect(body.comment).toHaveProperty("author", "mallionaire");
        expect(body.comment).toHaveProperty("votes", 0);
        expect(body.comment).toHaveProperty("created_at", expect.any(String));
      });
  });
  it("should throw a 400 error when missing fields", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "mallionaire" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("should throw a 400 error when given a bad request", () => {
    return request(app)
      .post("/api/reviews/notAnId/comments")
      .send({ username: "mallionaire", body: "hello world" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("should throw a 404 error when given an incorrect id", () => {
    return request(app)
      .post("/api/reviews/999999/comments")
      .send({ username: "mallionaire", body: "hello world" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID can not be found");
      });
  });
  it("should throw a 404 error when given an incorrect username", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "adam", body: "hello world" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID can not be found");
      });
  });
});

describe("Wrong path error handling", () => {
  it("should throw a 404 error when given a route that does not exist", () => {
    return request(app)
      .get("/api/cat")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});
