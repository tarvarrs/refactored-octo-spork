package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"oralo/internal/models"
	"rand"
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

	// Создаем юзеров
	users := []models.User{
		{Username: "ADMIN", TotalScreams: 9999},
		{Username: "AngryCitizen", TotalScreams: 500},
		{Username: "QuietMouse", TotalScreams: 50},
		{Username: "CatLover", TotalScreams: 1000},
		{Username: "Student", TotalScreams: 200},
	}

	var userIDs []uint
	for _, u := range users {
		if err := db.FirstOrCreate(&u, models.User{Username: u.Username}).Error; err != nil {
			log.Printf("Error creating user %s: %v", u.Username, err)
		} else {
			var existingUser models.User
			db.Where("username = ?", u.Username).First(&existingUser)
			userIDs = append(userIDs, existingUser.ID)
		}
	}

	// Функция для рандомного юзера
	getRandomUserID := func() uint {
		if len(userIDs) == 0 { return 1 }
		return userIDs[rand.Intn(len(userIDs))]
	}

	// ДАННЫЕ С РАЗНЫМИ HP (SupportScore) ОТ 0 ДО 15000
	postsData := []struct {
		Title       string
		Description string
		Volume      int
		HP          int // SupportScore
	}{
		// --- 0-100 HP (Никому не интересно) ---
		{Title: "забыл имя собеседника...", Description: "Неловкая пауза затянулась.", Volume: 24, HP: 0},
		{Title: "я же просил без лука...", Description: "Внимательность повара оставляет желать лучшего.", Volume: 10, HP: 10},
		{Title: "кто оставил пустую коробку?", Description: "Молоко испарилось, коробка осталась.", Volume: 17, HP: 15},
		{Title: "опять дождь, а я без зонта", Description: "Прогноз погоды опять обманул.", Volume: 23, HP: 25},
		{Title: "Я просто шепнул...", Description: "Но получилось как всегда громко.", Volume: 10, HP: 45},
		{Title: "НОСОК ИСЧЕЗ В СТИРАЛКЕ", Description: "Портал в другое измерение снова открыт.", Volume: 61, HP: 70},
		{Title: "КТО БРАЛ МОИ ТАПОЧКИ?!", Description: "Расследование пропажи века.", Volume: 96, HP: 85},
		{Title: "акция закончилась вчера...", Description: "Боль упущенной выгоды.", Volume: 20, HP: 95},
		{Title: "ПЕЛЬМЕНИ СЛИПЛИСЬ", Description: "Кулинарная трагедия на кухне.", Volume: 93, HP: 99},

		// --- 100-500 HP (Норм тема) ---
		{Title: "забыл пакет дома", Description: "Стою на кассе и чувствую себя неловко.", Volume: 68, HP: 105},
		{Title: "почему никто не лайкает кота?", Description: "Он же такой милый, посмотрите!", Volume: 38, HP: 120},
		{Title: "СУП УБЕЖАЛ НА ПЛИТУ", Description: "Запах гари как признак готового обеда.", Volume: 84, HP: 150},
		{Title: "СНОВА ЗВОНЯТ МОШЕННИКИ", Description: "Разговор со службой безопасности банка.", Volume: 90, HP: 167},
		{Title: "почему такси стоит как самолет?", Description: "Экономический анализ тарифов в час пик.", Volume: 57, HP: 250},
		{Title: "ОТКУДА СТОЛЬКО ПЫЛИ", Description: "Я же убирался буквально вчера!", Volume: 81, HP: 270},
		{Title: "ПИЦЦУ ПРИВЕЗЛИ ХОЛОДНУЮ", Description: "Сервис доставки подвел в самый голодный момент.", Volume: 94, HP: 300},
		{Title: "ТИШИНА В БИБЛИОТЕКЕ!", Description: "Попытка нарушить правила читального зала.", Volume: 95, HP: 340},
		{Title: "КТО ПРИДУМАЛ ЭТИ ПРОБКИ", Description: "Философские размышления за рулем.", Volume: 80, HP: 410},
		{Title: "ОНА СКАЗАЛА 'ОЙ ВСЁ'", Description: "Анализ завершения спора.", Volume: 58, HP: 450},

		// --- 500-1000 HP (Популярное) ---
		{Title: "выходные быстро кончились", Description: "Только моргнул - и уже понедельник.", Volume: 24, HP: 550},
		{Title: "ЗАРЯДКА 1% АААА", Description: "Хроники умирающего телефона.", Volume: 97, HP: 600},
		{Title: "наступил коту на хвост", Description: "Прости меня, пушистый друг!!!", Volume: 82, HP: 750},
		{Title: "СРОЧНЫЕ НОВОСТИ", Description: "Никто не слушает, но я продолжаю вещать.", Volume: 60, HP: 850},
		{Title: "АВТОБУС УЕХАЛ ПЕРЕД НОСОМ", Description: "Драма в трех актах на остановке.", Volume: 97, HP: 910},
		{Title: "СОСЕД С ДРЕЛЬЮ В ВОСКРЕСЕНЬЕ", Description: "Симфония ремонта в 8 утра.", Volume: 98, HP: 999},

		// --- >1000 HP (ЛЕГЕНДАРНОЕ) ---
		{Title: "УДАРИЛСЯ МИЗИНЦЕМ", Description: "Краткий пересказ боли и страданий.", Volume: 99, HP: 1000},
		{Title: "Голосовые", Description: "4 минуты молчания в голосовом.", Volume: 100, HP: 6000},
		{Title: "Поликлиника", Description: "'Мне только спросить!' на 40 минут.", Volume: 90, HP: 7200},
		{Title: "СОСЕД С ДРЕЛЬЮ (V2)", Description: "Он начал сверлить другую стену.", Volume: 115, HP: 15000},
	}

	var posts []models.Post
	for _, p := range postsData {
		posts = append(posts, models.Post{
			Title:           p.Title,
			Description:     p.Description,
			InitialVolume:   p.Volume,
			SupportScore:    p.HP, // Вот тут разные значения!
			MaxScreamVolume: p.Volume + 10,
			UserID:          getRandomUserID(),
		})
	}

	if err := db.Create(&posts).Error; err != nil {
		log.Printf("Error creating posts: %v", err)
	} else {
		log.Printf("Seeding complete. Created %d posts", len(posts))
	}
}
