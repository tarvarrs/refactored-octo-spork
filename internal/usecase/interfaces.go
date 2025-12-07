package usecase

import (
	"context"
	"oralo/internal/entity"
)

// --- REPOSITORY INTERFACES (Исходящие порты) ---
// Реализация будет лежать в internal/repo/postgres

type PostRepo interface {
	Create(ctx context.Context, post *entity.Post) error
	GetByID(ctx context.Context, id uint) (*entity.Post, error)
	GetAllActive(ctx context.Context) ([]entity.Post, error)
	Update(ctx context.Context, post *entity.Post) error // Для сохранения HP
}

type UserRepo interface {
	Create(ctx context.Context, user *entity.User) error
	GetByUsername(ctx context.Context, username string) (*entity.User, error)
	GetTopScreamers(ctx context.Context, limit int) ([]entity.User, error)
}

// --- USECASE INTERFACES (Входящие порты) ---
// Реализация будет лежать в internal/usecase

type PostUseCase interface {
	CreatePost(ctx context.Context, content string, volume int, userID uint) (*entity.Post, error)
	GetFeed(ctx context.Context) ([]entity.Post, error)
	ScreamAtPost(ctx context.Context, postID uint, damage int) (*entity.Post, error) // Возвращает обновленный пост
}

type AuthUseCase interface {
	RegisterOrLogin(ctx context.Context, username string) (string, error) // Возвращает JWT
}
