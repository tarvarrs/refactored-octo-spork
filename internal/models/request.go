package models

type Req struct {
	Content       string `json:"content" binding:"required"`
	InitialVolume int    `json:"initial_volume" binding:"required"`
}
