package repo

import (
	"context"
	"gorm.io/gorm"
	"oralo/internal/entity"
)

type UserRepo struct {
	db *gorm.DB
}

func NewUserRepo(db *gorm.DB) *UserRepo {
	return &UserRepo{db: db}
}

func (r *UserRepo) Create(ctx context.Context, user *entity.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *UserRepo) GetByUsername(ctx context.Context, username string) (*entity.User, error) {
	var user entity.User
	if err := r.db.WithContext(ctx).Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepo) GetTopScreamers(ctx context.Context, limit int) ([]entity.User, error) {
	var users []entity.User
	err := r.db.WithContext(ctx).
		Order("total_screams desc").
		Limit(limit).
		Find(&users).Error
	return users, err
}
