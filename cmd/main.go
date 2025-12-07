package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"github.com/joho/godotenv"

	"oralo/internal/database"
	"oralo/internal/models"
	"oralo/internal/repository"
	"oralo/internal/usecase/post"
	"oralo/internal/usecase/user"
	
	"oralo/internal/handlers"
	"oralo/internal/handlers/websocket"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on OS env vars")
	}

	db := database.Connect()

	db.AutoMigrate(&models.Post{}, &models.User{})
	 database.Seed(db) 

	postRepo := repo.NewPostRepo(db)
	userRepo := repo.NewUserRepo(db)

	jwtSecret := "secret"
	
	postUC := post.NewUsecase(postRepo)
	userUC := user.NewUsecase(userRepo, jwtSecret)

	postH := handlers.NewPostHandler(postUC)
	userH := handlers.NewUserHandler(userUC)
	wsH := websocket.NewWsHandler(postUC)

	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	r.POST("/posts", postH.CreatePost)
	r.GET("/posts", postH.GetFeed)
	r.POST("/auth/login", userH.Login)
	r.GET("/stats/leaderboard", userH.GetLeaderboard)
	r.GET("/ws", wsH.HandleConnection)

	r.Run(":8084")
}
