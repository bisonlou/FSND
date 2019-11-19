# Full Stack Trivia API Backend

Welcome to the Trivia backend API. This backend serves the Trivia frontend with questions, answers and categories of trivia questions. It also allows adding of your own trivia questions and answers while attaching them to categories and speciying a difficulty level.

This backend was built following [PEP8](https://www.python.org/dev/peps/pep-0008/) standards.

## Getting Started

### Installing Dependencies

#### Python 3.7

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Virtual Enviornment

We recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organaized. Instructions for setting up a virual enviornment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

#### PIP Dependencies

Once you have your virtual environment setup and running, install dependencies by naviging to the `/backend` directory and running:

```bash
pip install -r requirements.txt
```

This will install all of the required packages we selected within the `requirements.txt` file.

##### Key Dependencies

- [Flask](http://flask.pocoo.org/)  is a lightweight backend microservices framework. Flask is required to handle requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) is the Python SQL toolkit and ORM we'll use handle the lightweight sqlite database. You'll primarily work in app.py and can reference models.py. 

- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/#) is the extension we'll use to handle cross origin requests from our frontend server. 

## Database Setup

With Postgres running, restore a database using the trivia.psql file provided. From the backend folder in terminal run:

```bash
psql -U postgres -d trivia -f trivia.psql
```

## Running the server

From within the `backend` directory first ensure you are working using your created virtual environment.

To run the server, create a .env file.

```bash
    touch .env
```

Inside the .env file, export your database URIs

```bash
export URI='postgresql+psycopg2://<username>:<password>@localhost:5432/trivia'

export URI_TEST='postgresql+psycopg2://<username>:<password>@localhost:5432/trivia_test'
```

Then excecute:

```bash
. .env
python app.py
```

```bash

Endpoints
GET '/categories'
GET '/api/v1/categories/<int:category_id>/questions'
GET '/api/v1/questions'
DELETE '/api/v1/questions/<int:question_id>'
POST '/api/v1/questions'
POST '/api/v1/quizzes'
```

```bash

curl http://127.0.0.1:5000/api/v1/categories

- Fetches a list of all the categories
- Returns:
{
  "categories": [
    {
      "id": 1,
      "type": "Science"
    },
    {
      "id": 2,
      "type": "Art"
    },
    {
      "id": 3,
      "type": "Geography"
    },
    {
      "id": 4,
      "type": "History"
    },
    {
      "id": 5,
      "type": "Entertainment"
    },
    {
      "id": 6,
      "type": "Sports"
    }
  ],
  "success": true
}

```

```bash

curl http://127.0.0.1:5000/api/v1/categories/1/questions

- Fetches a list of questions
- Returns:
{
  "questions": [
    {
      "answer": "The Liver",
      "category_id": 1,
      "difficulty": 4,
      "id": 20,
      "question": "What is the heaviest organ in the human body?"
    },
    {
      "answer": "Alexander Fleming",
      "category_id": 1,
      "difficulty": 3,
      "id": 21,
      "question": "Who discovered penicillin?"
    },
    {
      "answer": "Blood",
      "category_id": 1,
      "difficulty": 4,
      "id": 22,
      "question": "Hematology is a branch of medicine involving the study of what?"
    }
  ],
  "success": t
  ```

  ```bash

curl http://127.0.0.1:5000/api/v1/questions?page=1

- Fetches a list ofthe first 10 questions as well as a list of the categories
- Returns:
{
  "categories": [
    {
      "id": 1,
      "type": "Science"
    },
    {
      "id": 2,
      "type": "Art"
    },
    {
      "id": 3,
      "type": "Geography"
    },
    {
      "id": 4,
      "type": "History"
    },
    {
      "id": 5,
      "type": "Entertainment"
    },
    {
      "id": 6,
      "type": "Sports"
    }
  ],
  "questions": [
    {
      "answer": "Maya Angelou",
      "category_id": 4,
      "difficulty": 2,
      "id": 5,
      "question": "Whose autobiography is entitled 'I Know Why the Caged Bird Sings'?"
    },
    {
      "answer": "Muhammad Ali",
      "category_id": 4,
      "difficulty": 1,
      "id": 9,
      "question": "What boxer's original name is Cassius Clay?"
    },
    {
      "answer": "Apollo 13",
      "category_id": 5,
      "difficulty": 4,
      "id": 2,
      "question": "What movie earned Tom Hanks his third straight Oscar nomination, in 1996?"
    },
    {
      "answer": "Tom Cruise",
      "category_id": 5,
      "difficulty": 4,
      "id": 4,
      "question": "What actor did author Anne Rice first denounce, then praise in the role of her beloved Lestat?"
    },
    {
      "answer": "Edward Scissorhands",
      "category_id": 5,
      "difficulty": 3,
      "id": 6,
      "question": "What was the title of the 1990 fantasy directed by Tim Burton about a young man with multi-bladed appendages?"
    },
    {
      "answer": "Brazil",
      "category_id": 6,
      "difficulty": 3,
      "id": 10,
      "question": "Which is the only team to play in every soccer World Cup tournament?"
    },
    {
      "answer": "Uruguay",
      "category_id": 6,
      "difficulty": 4,
      "id": 11,
      "question": "Which country won the first ever soccer World Cup in 1930?"
    },
    {
      "answer": "George Washington Carver",
      "category_id": 4,
      "difficulty": 2,
      "id": 12,
      "question": "Who invented Peanut Butter?"
    },
    {
      "answer": "Lake Victoria",
      "category_id": 3,
      "difficulty": 2,
      "id": 13,
      "question": "What is the largest lake in Africa?"
    },
    {
      "answer": "The Palace of Versailles",
      "category_id": 3,
      "difficulty": 3,
      "id": 14,
      "question": "In which royal palace would you find the Hall of Mirrors?"
    }
  ],
  "success": true,
  "total_questions": 21
}
```

```bash

curl -X DELETE http://127.0.0.1:5000/api/v1/questions/4

- Deletes a question
- Returns:
{
  "message": "question successfuly deleted",
  "success": true
}
```

```bash

curl  http://127.0.0.1:5000/api/v1/questions -X POST -H "Content-Type: application/json" -d '{"question": "What is the longest river", "answer": "Nile", "category": "3", "difficulty": "1"}'

- Posts a question
- Returns:
{
  "message": "question successfuly added",
  "success": true
}
```

```bash

curl  http://127.0.0.1:5000/api/v1/questions -X POST -H "Content-Type: application/json" -d '{"searchTerm": "penicillin"}'

- Searches for questions
- Returns:
{
  "questions": [
    {
      "answer": "Alexander Fleming",
      "category_id": 1,
      "difficulty": 3,
      "id": 21,
      "question": "Who discovered penicillin?"
    }
  ],
  "totalQuestions": 1
}
```

```bash

curl  http://127.0.0.1:5000/api/v1/quizzes -X POST -H "Content-Type: application/json" -d '{"previous_questions": [], "quiz_category": {"type": "ALL", "id": 0}}'

- Fetches questios for the trivia quiz
- Returns:
{
  "question": {
    "answer": "Agra",
    "category_id": 3,
    "difficulty": 2,
    "id": 15,
    "question": "The Taj Mahal is located in which Indian city?"
  },
  "success": true
}
```

## Error Handling
Errors are returned as JSON objects in the following format:

```bash
{
    "success": False,
    "error": 400,
    "message": "bad request"
}
```

The API will return five error types when requests fail:

400: Bad Request

```bash
{
    "success": False,
    "error": 400,
    "message": "bad request"
}
```

404: Resource Not Found

```bash
{
    "success": False,
    "error": 404,
    "message": "resource not found"
}
```

405: Method Not Allowed

```bash
{
    "success": False,
    "error": 405,
    "message": "method not allowed"
}
```

422: Not Processable

```bash
{
    "success": False,
    "error": 422,
    "message": "unable to process request"
}
```

500: Internal Server Error

```bash
{
    "success": False,
    "error": 500,
    "message": "internal server error"
}
```

## Testing

To run the tests, run

```bash
dropdb trivia_test
createdb trivia_test
python test_flaskr.py
```
