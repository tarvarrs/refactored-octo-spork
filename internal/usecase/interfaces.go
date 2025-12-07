package usecase

import (
	"context"
	"oralo/internal/models"
)

type PostRepo interface {
	Create(ctx context.Context, post *models.Post) error
	GetByID(ctx context.Context, id uint) (*models.Post, error)
	GetAllActive(ctx context.Context) ([]models.Post, error)
	Update(ctx context.Context, post *models.Post) error 
}

type UserRepo interface {
	Create(ctx context.Context, user *models.User) error
	GetByUsername(ctx context.Context, username string) (*models.User, error)
	GetTopScreamers(ctx context.Context, limit int) ([]models.User, error)
}


type PostUseCase interface {
	CreatePost(ctx context.Context, content string, volume int, userID uint) (*models.Post, error)
	GetFeed(ctx context.Context) ([]models.Post, error)
	ScreamAtPost(ctx context.Context, postID uint, volume int) (*models.Post, error)
}

type AuthUseCase interface {
	RegisterOrLogin(ctx context.Context, username string) (string, error)
}

type UserUseCase interface {
	RegisterOrLogin(ctx context.Context, username string) (string, error)
	GetLeaderboard(ctx context.Context) ([]models.User, error)
	GetProfile(ctx context.Context, username string) (*models.User, error)
}
