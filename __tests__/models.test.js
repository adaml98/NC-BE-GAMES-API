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

describe("/api/categories", () => {
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
describe("/api/reviews/:review_id", () => {
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
