import axios from 'axios';

const API_URL = 'http://localhost:8084/api';

const getMockPosts = () => {
  return [
    { id: 1, title: "ТИШИНА В БИБЛИОТЕКЕ!", description: "Попытка нарушить правила читального зала.", volumeLevel: 95, hp: 340 }, // Trending
    { id: 2, title: "Я просто шепнул...", description: "Но получилось как всегда громко.", volumeLevel: 10, hp: 45 }, // Normal (Слабый)
    { id: 3, title: "СРОЧНЫЕ НОВОСТИ", description: "Никто не слушает, но я продолжаю вещать.", volumeLevel: 60, hp: 850 }, // Viral
    { id: 4, title: "почему никто не лайкает кота?", description: "Он же такой милый, посмотрите!", volumeLevel: 38, hp: 120 }, // Trending (На грани)
    { id: 5, title: "АВТОБУС УЕХАЛ ПЕРЕД НОСОМ", description: "Драма в трех актах на остановке.", volumeLevel: 97, hp: 910 }, // Viral (Очень больно)
    { id: 6, title: "почему такси стоит как самолет?", description: "Экономический анализ тарифов в час пик.", volumeLevel: 57, hp: 250 }, // Trending
    { id: 7, title: "СОСЕД С ДРЕЛЬЮ В ВОСКРЕСЕНЬЕ", description: "Симфония ремонта в 8 утра.", volumeLevel: 98, hp: 999 }, // Viral (Максимум)
    { id: 8, title: "КТО БРАЛ МОИ ТАПОЧКИ?!", description: "Расследование пропажи века.", volumeLevel: 96, hp: 85 }, // Normal
    { id: 9, title: "ЗАРЯДКА 1% АААА", description: "Хроники умирающего телефона.", volumeLevel: 97, hp: 600 }, // Viral
    { id: 10, title: "ОНА СКАЗАЛА 'ОЙ ВСЁ'", description: "Анализ завершения спора.", volumeLevel: 58, hp: 450 }, // Trending
    { id: 11, title: "кто оставил пустую коробку?", description: "Молоко испарилось, коробка осталась.", volumeLevel: 17, hp: 15 }, // Normal (Совсем скучно)
    { id: 12, title: "СНОВА ЗВОНЯТ МОШЕННИКИ", description: "Разговор со службой безопасности банка.", volumeLevel: 90, hp: 167 }, // Trending
    { id: 13, title: "забыл имя собеседника...", description: "Неловкая пауза затянулась.", volumeLevel: 24, hp: 30 }, // Normal
    { id: 14, title: "ОТКУДА СТОЛЬКО ПЫЛИ", description: "Я же убирался буквально вчера!", volumeLevel: 81, hp: 270 }, // Trending
    { id: 15, title: "акция закончилась вчера...", description: "Боль упущенной выгоды.", volumeLevel: 20, hp: 95 }, // Normal
    { id: 16, title: "выходные быстро кончились", description: "Только моргнул - и уже понедельник.", volumeLevel: 24, hp: 550 }, // Viral (Жиза)
    { id: 17, title: "УДАРИЛСЯ МИЗИНЦЕМ", description: "Краткий пересказ боли и страданий.", volumeLevel: 99, hp: 1000 }, // Viral (Легендарно)
    { id: 18, title: "ПЕЛЬМЕНИ СЛИПЛИСЬ", description: "Кулинарная трагедия на кухне.", volumeLevel: 93, hp: 99 }, // Normal
    { id: 19, title: "ПИЦЦУ ПРИВЕЗЛИ ХОЛОДНУЮ", description: "Сервис доставки подвел в самый голодный момент.", volumeLevel: 94, hp: 300 }, // Trending
    { id: 20, title: "КТО ПРИДУМАЛ ЭТИ ПРОБКИ", description: "Философские размышления за рулем.", volumeLevel: 80, hp: 410 }, // Trending
    { id: 21, title: "НОСОК ИСЧЕЗ В СТИРАЛКЕ", description: "Портал в другое измерение снова открыт.", volumeLevel: 61, hp: 70 }, // Normal
    { id: 22, title: "СУП УБЕЖАЛ НА ПЛИТУ", description: "Запах гари как признак готового обеда.", volumeLevel: 84, hp: 150 }, // Trending
    { id: 23, title: "опять дождь, а я без зонта", description: "Прогноз погоды опять обманул.", volumeLevel: 23, hp: 25 }, // Normal
    { id: 24, title: "я же просил без лука...", description: "Внимательность повара оставляет желать лучшего.", volumeLevel: 10, hp: 10 }, // Normal
    { id: 25, title: "забыл пакет дома", description: "Стою на кассе и чувствую себя неловко.", volumeLevel: 68, hp: 105 }, // Trending (Едва-едва)
    { id: 26, title: "наступил коту на хвост", description: "Прости меня, пушистый друг!!!", volumeLevel: 82, hp: 750 } // Viral
  ];
};

export const api = {
  // Получить посты
  fetchPosts: async () => {
    try {
      // Пока бэк не работает, раскомментируй следующую строку:
      return getMockPosts(); 
      
      // const response = await axios.get(`${API_URL}/posts`);
      // return response.data;
    } catch (error) {
      console.warn("Бэк недоступен, отдаю моки");
      return getMockPosts();
    }
  },

  // Отправить пост
  createPost: async (title, volumeLevel, description = "") => {
    // Если description не передан, генерируем заглушку или берем часть тайтла
    const finalDesc = description || "Описание крика пока не добавлено...";
    
    return axios.post(`${API_URL}/posts`, { 
      title,
      description: finalDesc,
      initial_volume: volumeLevel 
    });
  }
};
