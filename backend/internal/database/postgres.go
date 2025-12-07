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
	var postCount int64
	db.Model(&models.Post{}).Count(&postCount)
	if postCount > 0 {
		log.Println("Database already seeded with posts")
		return
	}

	log.Println("Seeding initial data...")

	admin := models.User{Username: "ADMIN", TotalScreams: 999}
	user1 := models.User{Username: "ALICE", TotalScreams: 50}

	if err := db.FirstOrCreate(&admin, models.User{Username: "ADMIN"}).Error; err != nil {
		log.Printf("Error creating admin user: %v", err)
	}
	if err := db.FirstOrCreate(&user1, models.User{Username: "ALICE"}).Error; err != nil {
		log.Printf("Error creating user1: %v", err)
	}

	// Перезагружаем пользователей, чтобы получить их ID
	db.Where("username = ?", "ADMIN").First(&admin)
	db.Where("username = ?", "ALICE").First(&user1)

	posts := []models.Post{
		{
			Title:           "CSS",
			Description:     "Я ПРОСТО ХОТЕЛ ВЫРОВНЯТЬ DIV ПО ЦЕНТРУ!!! ПОЧЕМУ ОН УЕХАЛ В ДРУГОЙ КОНЕЦ ВСЕЛЕННОЙ?!",
			InitialVolume:   110,
			SupportScore:    8500,
			MaxScreamVolume: 120,
			UserID:          admin.ID,
		},
		{
			Title:           "Наушники",
			Description:     "Опять зацепился проводом за ручку двери и вырвал их из ушей. Вместе с душой.",
			InitialVolume:   80,
			SupportScore:    1200,
			MaxScreamVolume: 90,
			UserID:          user1.ID,
		},
		{
			Title:           "Встреча",
			Description:     "Эта часовая встреча могла бы быть ОДНИМ сообщением в чате.",
			InitialVolume:   70,
			SupportScore:    450,
			MaxScreamVolume: 75,
			UserID:          admin.ID,
		},
		{
			Title:           "Код",
			Description:     "Работало на моей машине...",
			InitialVolume:   50,
			SupportScore:    2000,
			MaxScreamVolume: 95,
			UserID:          user1.ID,
		},
	}

	if err := db.Create(&posts).Error; err != nil {
		log.Printf("Error creating posts: %v", err)
	} else {
		log.Printf("Seeding complete. Created %d posts", len(posts))
	}
}
