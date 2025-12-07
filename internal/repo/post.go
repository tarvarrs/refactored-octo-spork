package repo

import (
	"context"
	"gorm.io/gorm"
	"oralo/internal/entity"
)

type PostRepo struct {
	db *gorm.DB
}

func NewPostRepo(db *gorm.DB) *PostRepo {
	return &PostRepo{db: db}
}

func (r *PostRepo) Create(ctx context.Context, post *entity.Post) error {
	return r.db.WithContext(ctx).Create(post).Error
}

func (r *PostRepo) GetByID(ctx context.Context, id uint) (*entity.Post, error) {
	var post entity.Post
	if err := r.db.WithContext(ctx).First(&post, id).Error; err != nil {
		return nil, err
	}
	return &post, nil
}

func (r *PostRepo) Update(ctx context.Context, post *entity.Post) error {
	return r.db.WithContext(ctx).Save(post).Error
}

func (r *PostRepo) GetAllActive(ctx context.Context) ([]entity.Post, error) {
	var posts []entity.Post
	err := r.db.WithContext(ctx).
		Where("is_destroyed = ?", false).
		Order("created_at desc").
		Find(&posts).Error
	return posts, err
}
