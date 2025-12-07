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

	admin := models.User{Username: "ADMIN", TotalScreams: 9999}
	angry := models.User{Username: "AngryCitizen", TotalScreams: 500}
	quiet := models.User{Username: "QuietMouse", TotalScreams: 50}
	catLover := models.User{Username: "CatLover", TotalScreams: 1000}
	student := models.User{Username: "Student", TotalScreams: 200}

	users := []*models.User{&admin, &angry, &quiet, &catLover, &student}
	for _, u := range users {
		db.FirstOrCreate(u, models.User{Username: u.Username})
		db.Where("username = ?", u.Username).First(u)
	}

	// Перемешанный список: Большое - Маленькое - Среднее - Большое
	posts := []models.Post{
		{Title: "УДАРИЛСЯ МИЗИНЦЕМ", Description: "Краткий пересказ боли и страданий.", InitialVolume: 99, SupportScore: 1000, UserID: angry.ID},
		{Title: "забыл имя собеседника...", Description: "Неловкая пауза затянулась.", InitialVolume: 24, SupportScore: 0, UserID: quiet.ID},
		{Title: "АВТОБУС УЕХАЛ ПЕРЕД НОСОМ", Description: "Драма в трех актах на остановке.", InitialVolume: 97, SupportScore: 910, UserID: student.ID},
		{Title: "я же просил без лука...", Description: "Внимательность повара оставляет желать лучшего.", InitialVolume: 10, SupportScore: 10, UserID: angry.ID},
		{Title: "СОСЕД С ДРЕЛЬЮ (V2)", Description: "Он начал сверлить другую стену.", InitialVolume: 115, SupportScore: 15000, UserID: angry.ID},
		{Title: "ПИЦЦУ ПРИВЕЗЛИ ХОЛОДНУЮ", Description: "Сервис доставки подвел в самый голодный момент.", InitialVolume: 94, SupportScore: 300, UserID: student.ID},
		{Title: "Голосовые", Description: "4 минуты молчания в голосовом.", InitialVolume: 100, SupportScore: 6000, UserID: angry.ID},
		{Title: "кто оставил пустую коробку?", Description: "Молоко испарилось, коробка осталась.", InitialVolume: 17, SupportScore: 15, UserID: student.ID},
		{Title: "ЗАРЯДКА 1% АААА", Description: "Хроники умирающего телефона.", InitialVolume: 97, SupportScore: 600, UserID: student.ID},
		{Title: "СУП УБЕЖАЛ НА ПЛИТУ", Description: "Запах гари как признак готового обеда.", InitialVolume: 84, SupportScore: 150, UserID: angry.ID},
		{Title: "Поликлиника", Description: "'Мне только спросить!' на 40 минут.", InitialVolume: 90, SupportScore: 7200, UserID: angry.ID},
		{Title: "опять дождь, а я без зонта", Description: "Прогноз погоды опять обманул.", InitialVolume: 23, SupportScore: 25, UserID: quiet.ID},
		{Title: "выходные быстро кончились", Description: "Только моргнул - и уже понедельник.", InitialVolume: 24, SupportScore: 550, UserID: student.ID},
		{Title: "Я просто шепнул...", Description: "Но получилось как всегда громко.", InitialVolume: 10, SupportScore: 45, UserID: quiet.ID},
		{Title: "СОСЕД С ДРЕЛЬЮ В ВОСКРЕСЕНЬЕ", Description: "Симфония ремонта в 8 утра.", InitialVolume: 98, SupportScore: 999, UserID: angry.ID},
		{Title: "НОСОК ИСЧЕЗ В СТИРАЛКЕ", Description: "Портал в другое измерение снова открыт.", InitialVolume: 61, SupportScore: 70, UserID: admin.ID},
		{Title: "СНОВА ЗВОНЯТ МОШЕННИКИ", Description: "Разговор со службой безопасности банка.", InitialVolume: 90, SupportScore: 167, UserID: admin.ID},
		{Title: "КТО БРАЛ МОИ ТАПОЧКИ?!", Description: "Расследование пропажи века.", InitialVolume: 96, SupportScore: 85, UserID: angry.ID},
		{Title: "наступил коту на хвост", Description: "Прости меня, пушистый друг!!!", InitialVolume: 82, SupportScore: 750, UserID: catLover.ID},
		{Title: "акция закончилась вчера...", Description: "Боль упущенной выгоды.", InitialVolume: 20, SupportScore: 95, UserID: student.ID},
		{Title: "СРОЧНЫЕ НОВОСТИ", Description: "Никто не слушает, но я продолжаю вещать.", InitialVolume: 60, SupportScore: 850, UserID: admin.ID},
		{Title: "ПЕЛЬМЕНИ СЛИПЛИСЬ", Description: "Кулинарная трагедия на кухне.", InitialVolume: 93, SupportScore: 99, UserID: student.ID},
		{Title: "почему такси стоит как самолет?", Description: "Экономический анализ тарифов в час пик.", InitialVolume: 57, SupportScore: 250, UserID: student.ID},
		{Title: "забыл пакет дома", Description: "Стою на кассе и чувствую себя неловко.", InitialVolume: 68, SupportScore: 105, UserID: quiet.ID},
		{Title: "ОТКУДА СТОЛЬКО ПЫЛИ", Description: "Я же убирался буквально вчера!", InitialVolume: 81, SupportScore: 270, UserID: angry.ID},
		{Title: "почему никто не лайкает кота?", Description: "Он же такой милый, посмотрите!", InitialVolume: 38, SupportScore: 120, UserID: catLover.ID},
		{Title: "ТИШИНА В БИБЛИОТЕКЕ!", Description: "Попытка нарушить правила читального зала.", InitialVolume: 95, SupportScore: 340, UserID: quiet.ID},
		{Title: "КТО ПРИДУМАЛ ЭТИ ПРОБКИ", Description: "Философские размышления за рулем.", InitialVolume: 80, SupportScore: 410, UserID: angry.ID},
		{Title: "ОНА СКАЗАЛА 'ОЙ ВСЁ'", Description: "Анализ завершения спора.", InitialVolume: 58, SupportScore: 450, UserID: admin.ID},
	}

	for i := range posts {
		posts[i].MaxScreamVolume = posts[i].InitialVolume + 10
	}

	if err := db.Create(&posts).Error; err != nil {
		log.Printf("Error creating posts: %v", err)
	} else {
		log.Printf("Seeding complete. Created %d posts", len(posts))
	}
}
