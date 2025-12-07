package models 

import "time"

type Post struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	Content       string    `json:"content"`
	InitialVolume int       `json:"initial_volume"` // 0-120
	
	SupportScore    int `json:"support_score" gorm:"default:0"`     // Общая поддержка
	MaxScreamVolume int `json:"max_scream_volume" gorm:"default:0"` // Рекорд крика

	UserID    uint      `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
}

func (p *Post) AddSupport(volume int) {
	p.SupportScore += volume
	if volume > p.MaxScreamVolume {
		p.MaxScreamVolume = volume
	}
}
