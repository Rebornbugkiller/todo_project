@echo off
echo 🚀 Starting Todo List Application...

docker-compose up -d

echo ✅ Services started!
echo 📝 Frontend: http://localhost
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
