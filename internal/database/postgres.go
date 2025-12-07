package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"oralo/internal/models"
)

func Connect() *gorm.DB {
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	if host == "" || user == "" || dbname == "" {
		log.Fatal("DB config missing")
	}

	if port == "" {
		port = "5432"
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, password, dbname, port)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connected successfully")
	return db
}


func Seed(db *gorm.DB) {
    var count int64
    db.Model(&models.User{}).Count(&count)
    if count > 0 {
        log.Println("Database already seeded.")
        return
    }

    log.Println("Seeding initial data...")
    
    admin := models.User{Username: "ADMIN", TotalScreams: 999}
    user1 := models.User{Username: "ALICE", TotalScreams: 50}
    db.Create(&admin)
    db.Create(&user1)

    posts := []models.Post{
        {Content: "ПОЧЕМУ ДОКЕР НЕ ЗАПУСКАЕТСЯ?!", InitialVolume: 100, SupportScore: 5000, MaxScreamVolume: 110, UserID: admin.ID},
        {Content: "Кофе остыл...", InitialVolume: 20, SupportScore: 10, MaxScreamVolume: 20, UserID: user1.ID},
        {Content: "Хакатон — это весело", InitialVolume: 80, SupportScore: 300, MaxScreamVolume: 85, UserID: admin.ID},
    }
    db.Create(&posts)
    
    log.Println("Seeding complete.")
}
