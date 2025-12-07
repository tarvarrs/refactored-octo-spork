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
	user1 := models.User{Username: "ANNA_K", TotalScreams: 50}
	user2 := models.User{Username: "IVAN_TAXI", TotalScreams: 1200}
	user3 := models.User{Username: "STUDENT_MAX", TotalScreams: 300}

	users := []*models.User{&admin, &user1, &user2, &user3}
	for _, u := range users {
		db.FirstOrCreate(u, models.User{Username: u.Username})
	}
	// Обновляем ID
	for _, u := range users {
		db.Where("username = ?", u.Username).First(u)
	}

	posts := []models.Post{
		{
			Title:           "СОСЕД С ДРЕЛЬЮ",
			Description:     "Суббота. 8 утра. ВЖЖЖЖЖЖЖЖЖЖЖЖ! Такое чувство, что он сверлит не стену, а мой мозг. Прямо в гипоталамус.",
			InitialVolume:   115,
			SupportScore:    15000,
			MaxScreamVolume: 130,
			UserID:          user1.ID,
		},
		{
			Title:           "Маршрутка",
			Description:     "Водитель курит, шансон орет, окно не открывается, а печка работает на полную. На улице +30. Я еду в ад.",
			InitialVolume:   85,
			SupportScore:    4500,
			MaxScreamVolume: 95,
			UserID:          user3.ID,
		},
		{
			Title:           "Мизинец",
			Description:     "Я ударился мизинцем об ножку дивана. Я видел звезды. Я видел своих предков. Я познал боль вселенной.",
			InitialVolume:   120,
			SupportScore:    9999,
			MaxScreamVolume: 120,
			UserID:          user2.ID,
		},
		{
			Title:           "Поликлиника",
			Description:     "'Мне только спросить!' — сказала бабушка и зашла на 40 минут. А у меня талон на 14:00, сейчас 16:30!",
			InitialVolume:   90,
			SupportScore:    7200,
			MaxScreamVolume: 110,
			UserID:          user1.ID,
		},
		{
			Title:           "Цены на яйца",
			Description:     "Вы видели ценник в магазине?! Это яйца Фаберже или куриные?! Скоро омлет станет блюдом для миллионеров.",
			InitialVolume:   70,
			SupportScore:    3000,
			MaxScreamVolume: 85,
			UserID:          admin.ID,
		},
		{
			Title:           "Голосовые",
			Description:     "Человек записал голосовое на 4 минуты. В нем он просто молчит и дышит 3 минуты. ПОЧЕМУ НЕЛЬЗЯ НАПИСАТЬ ТЕКСТОМ?!",
			InitialVolume:   100,
			SupportScore:    6000,
			MaxScreamVolume: 115,
			UserID:          user3.ID,
		},
		{
			Title:           "Дождь",
			Description:     "Помыл машину. Выехал с мойки. Через 5 минут пошел дождь. Единственное облако на всем небе, и оно надо мной.",
			InitialVolume:   80,
			SupportScore:    1200,
			MaxScreamVolume: 90,
			UserID:          user2.ID,
		},
		{
			Title:           "Пароль",
			Description:     "Придумайте пароль. 'Пароль слишком простой'. 'Пароль должен содержать иероглиф, кровь дракона и знак зодиака'. Ввел старый. 'НОВЫЙ ПАРОЛЬ НЕ МОЖЕТ СОВПАДАТЬ СО СТАРЫМ'!!!",
			InitialVolume:   110,
			SupportScore:    8000,
			MaxScreamVolume: 125,
			UserID:          user1.ID,
		},
	}

	if err := db.Create(&posts).Error; err != nil {
		log.Printf("Error creating posts: %v", err)
	} else {
		log.Printf("Seeding complete. Created %d posts", len(posts))
	}
}
