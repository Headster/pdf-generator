# pdf-generator
If you are using XAMPP place project inside xampp/htdocs/
# Step 1: 
Then, you should create a free account at 'pdfgeneratorapi.com'
# Step 2: 
Create .env file in the backend directory with the following parameters. (You can find the API keys and secret in the Settings. You can see the API documentation at: 'https://docs.pdfgeneratorapi.com/v4/')
# .env file
API_KEY=API_KEY
API_SECRET=API_SECRET
WORKSPACE=WORKSPACE
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=certificates

# Step 3: 
Create MySQL database 'certificates'
# Step 4: 
In the root folder, 'certificates.sql' file, use it to create table
# Step 5: 
Start Apache server and MySQL (use XAMPP or similar)
# Step 6: 
Navigate to backend directory and run 'php -S localhost:8000' to start PHP service
# Step 7: 
Navigate to frontend directory and run 'npm install' to install packages
# Step 8: 
Run 'npm start' to start frontend application
# Step 9: 
Open 'http://localhost:3000/' to test application