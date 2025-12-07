package models

import "time"

type Post struct {
	ID            uint   `json:"id" gorm:"primaryKey"`
	Title         string `json:"title"`
	Description   string `json:"description"`
	InitialVolume int    `json:"initial_volume"` // 0-120

	SupportScore    int `json:"support_score" gorm:"default:0"`
	MaxScreamVolume int `json:"max_scream_volume" gorm:"default:0"` 

	UserID    uint      `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
}

func (p *Post) AddSupport(volume int) {
	p.SupportScore += volume
	if volume > p.MaxScreamVolume {
		p.MaxScreamVolume = volume
	}
}
