# sales-call-review-app
The live web application can be found at https://sales-call-review-app.vercel.app/

To run the app locally add a .env file to the backend folder with 
- BACKEND_CORS_ORIGINS (use `['*']` for running locally)
- ANTHROPIC_API_KEY

The easy way to run the app is by going to the sales-call-review-app folder and running `docker-compose up --build`

The other way is to cd into the frontend folder and running `npm install` and `npm start`.
Then cd into the backend folder and run `uvicorn main:app --reload`

The backend was built with Python 3.13 and the FastAPI framework.
The frontend was built with Javascript and React.

After initially creating a very basic looking version of the application AI was used to improve the UI and give it a more modern look. This was primarily done using cursor.
