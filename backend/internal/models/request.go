package models

type Req struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	InitialVolume int    `json:"initial_volume" binding:"required"`
}
