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
  it("should get a response of 200 and return the new column 'comment count'", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toHaveProperty("comment_count", "3");
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
        expect(body.msg).toBe("404 Not Found");
      });
  });
});

describe("GET: /api/reviews", () => {
  it("should recieve a response of 200 and return all reviews ordered by date desc when given no extra parameters", () => {
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
  it("should work with just the category query", () => {
    return request(app)
      .get("/api/reviews?category=social%20deduction")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSorted({ descending: true });
        expect(body.reviews).toHaveLength(11);
        body.reviews.forEach((review) => {
          expect(review).toHaveProperty("review_id", expect.any(Number));
          expect(review).toHaveProperty("title", expect.any(String));
          expect(review).toHaveProperty("category", "social deduction");
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
  it("should work with just the sort_by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("title", { descending: true });
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
  it("should work with just the order query", () => {
    return request(app)
      .get("/api/reviews?&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSorted({ descending: true });
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
  it("should work with the category, sort_by and order queries at the same time", () => {
    return request(app)
      .get("/api/reviews?category=social%20deduction&sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("title");
        expect(body.reviews).toHaveLength(11);
        body.reviews.forEach((review) => {
          expect(review).toHaveProperty("review_id", expect.any(Number));
          expect(review).toHaveProperty("title", expect.any(String));
          expect(review).toHaveProperty("category", "social deduction");
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
  it("should respond with empty body when given a category with no reviews associated with it", () => {
    return request(app)
      .get("/api/reviews?category=children's%20games")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toEqual([]);
      });
  });
  it("should throw a 404 error when given an invalid category query", () => {
    return request(app)
      .get("/api/reviews?category=notACategory")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
  it("should throw a 400 error when given an invalid sort query", () => {
    return request(app)
      .get("/api/reviews?sort_by=notASort")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort query");
      });
  });
  it("should throw a 400 error when given an invalid order query", () => {
    return request(app)
      .get("/api/reviews?order=notAOrder")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
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
        expect(body.msg).toBe("404 Not Found");
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
  it("should recieve a response of 201 and ignore any unnecessary properties in the input body", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "mallionaire",
        body: "hello world",
        comment_id: "99",
        hello: "hello",
      })
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
  it("should throw a 400 error when given an invalid ID", () => {
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
        expect(body.msg).toBe("404 Not Found");
      });
  });
  it("should throw a 404 error when given an incorrect username", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "adam", body: "hello world" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
});

describe("PATCH: /api/reviews/:review_id", () => {
  it("should modify the votes on a review and return the updated review", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.editedReview).toHaveProperty("review_id", 1);
        expect(body.editedReview).toHaveProperty("title", "Agricola");
        expect(body.editedReview).toHaveProperty("category", "euro game");
        expect(body.editedReview).toHaveProperty("designer", "Uwe Rosenberg");
        expect(body.editedReview).toHaveProperty("owner", "mallionaire");
        expect(body.editedReview).toHaveProperty(
          "review_body",
          "Farmyard fun!"
        );
        expect(body.editedReview).toHaveProperty(
          "review_img_url",
          "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700"
        );
        expect(body.editedReview).toHaveProperty(
          "created_at",
          "2021-01-18T10:00:20.514Z"
        );
        expect(body.editedReview).toHaveProperty("votes", 11);
      });
  });
  it("should throw a 400 error when given incorrect data in the inc_votes key", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "hello" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("should throw a 400 error when given a bad request", () => {
    return request(app)
      .patch("/api/reviews/notAnId")
      .send({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("should throw a 404 error when given an incorrect id", () => {
    return request(app)
      .patch("/api/reviews/999999")
      .send({ inc_votes: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  it("should delete the given comment and return no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  it("should throw a 404 error when given an incorrect id", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
  it("should throw a 400: bad request error when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET: /api/users", () => {
  it("should recieve a 200 and return an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});

describe("GET: /api", () => {
  it("should recieve a 200 and return an object of endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .expect("Content-Type", /json/)
      .then(({ body }) => {
        expect(body.endpoints).toHaveProperty("GET /api");
        expect(body.endpoints).toHaveProperty("GET /api/categories");
        expect(body.endpoints).toHaveProperty("GET /api/reviews");
        expect(body.endpoints).toHaveProperty("GET /api/reviews/:review_id");
        expect(body.endpoints).toHaveProperty(
          "GET /api/reviews/:review_id/comments"
        );
        expect(body.endpoints).toHaveProperty("GET /api/users");
        expect(body.endpoints).toHaveProperty("PATCH /api/reviews/:review_id");
        expect(body.endpoints).toHaveProperty(
          "POST /api/reviews/:review_id/comments"
        );
        expect(body.endpoints).toHaveProperty(
          "DELETE /api/comments/:comment_id"
        );
      });
  });
});
describe("GET: /api/users/:user_id", () => {
  it("should recieve a 200 and return a single user depending on the user_id", () => {
    return request(app)
      .get("/api/users/mallionaire")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toHaveProperty("username", "mallionaire");
        expect(body.user).toHaveProperty("name", "haz");
        expect(body.user).toHaveProperty(
          "avatar_url",
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        );
      });
  });
  it("should throw a 404 error when given an incorrect user", () => {
    return request(app)
      .get("/api/users/adam")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
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
