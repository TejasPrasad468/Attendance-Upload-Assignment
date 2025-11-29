📂Project Structure/

	root/
	|
	|--.env
	|
	|--middleware_server/
	|	|--controllers/
	|	|--server.js
	|	|--models/
	|	|--routes/
	|	|--utils/
	|	|--validators/
	|	|--db/
	|	|--middleware/
	|	|--worker.js (need to run differently)
	|
	|--crm_server/
	|	|--controllers/
	|	|--models/
	|	|--db/
	|	|--routes/
	|
	|__README.md


🔨 Tools

 1. API testing - Postman (for REST Api check)
 2. Database - Mongodb atlas (for mongodb)
 3. Redis + BullMQ - Upstash (Redis + BullMQ)(https://upstash.com/)


💻 Setup

1. Clone this project in your system
	git clone <repository-url>
	cd project-root
2. Create .env file at root directory and add field
	a. DB_URL=<your-mongodb-url>
	b. REDIS_URL=<your-upstash-redis-url> (Create free account then create Redis Attendance_datas for url Upstash → Create Redis DB → Copy URL & Token)
	c. MIDDLEWARE_PORT = 4000
	d. CRM_PORT = 5000
	e. API = http://localhost
3. For Middleware server
	a. cd attendance_middleware_server
	b. npm install
	c. nodemon server.js
	d. Middleware server runs on 👉 http://localhost:4000
4. For Worker (Used to read data from bullmq then send to crm server)
	a. cd middleware_server
	b. nodemon worker.js
5. For CRM server
	a. cd crm_server
	b. npm install
	c. nodemon server.js
	d. CRM server runs on 👉 http://localhost:5000


🏢 Working

1. In postman use POST API http://localhost:4000/device/punch and send data in body raw with JSON
	{
		"deviceId": "DEV001",
		"userId": "EMP789",
		"timestamp": "2025-02-10T09:16:00",
		"type": "in"
	}
2. Firstly, check if there is data with same userId in redis If yes, Error user already exist
3. If no, This data will be saved in redis with 60s TTL (Time To Live), In database and in bullmq it will save logId
4. Worker will run parallely it will check if there is any data in bullmq it will fetch that data logId then get other details from database (To avoid database from being locked we can use database sharding)
5. This data will be send to crm server http://localhost:5000/crm/attendance/punch if got success message it will update success in database else check for retries if total retries are 3 then marked false in database else will again try in 10s
6. This will be working of all the project.


🛣️ Final Workflow Summary

1. Device sends punch → Middleware
2. Middleware validates → Saves → Adds to queue
3. Worker picks job → Sends to CRM
4. CRM responds → Worker updates MongoDB
5. Clean, scalable pipeline of attendance sync

🎯 Conclusion

1. This project is a complete Attendance Synchronization System with:
2. Accurate time processing (UTC -> ISO)
3. Queue-based retry mechanism
4. Fast duplicate detection
5. Clear separation of device → middleware → CRM responsibilities