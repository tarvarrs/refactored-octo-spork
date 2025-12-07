package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"oralo/internal/database"
	"oralo/internal/models"
	repo "oralo/internal/repository"
	"oralo/internal/usecase/post"
	"oralo/internal/usecase/user"
	"os"
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

	jwtSecret := os.Getenv("JWT_SECRET")
    if jwtSecret == "" {
        jwtSecret = "secret"
    }

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

    public := r.Group("/")
    {
        public.GET("/posts", postH.GetFeed)
        public.POST("/auth/login", userH.Login)
        public.GET("/stats/leaderboard", userH.GetLeaderboard) 
    }

    protected := r.Group("/")
    protected.Use(handlers.AuthMiddleware())
    {
        protected.POST("/posts", postH.CreatePost) 
    }

	r.GET("/ws", wsH.HandleConnection)
	
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
