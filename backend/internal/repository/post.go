package repo

import (
	"context"
	"oralo/internal/models"

	"gorm.io/gorm"
)

type PostRepo struct {
	db *gorm.DB
}

func NewPostRepo(db *gorm.DB) *PostRepo {
	return &PostRepo{db: db}
}

func (r *PostRepo) Create(ctx context.Context, post *models.Post) error {
	return r.db.WithContext(ctx).Create(post).Error
}

func (r *PostRepo) GetByID(ctx context.Context, id uint) (*models.Post, error) {
	var post models.Post
	if err := r.db.WithContext(ctx).First(&post, id).Error; err != nil {
		return nil, err
	}
	return &post, nil
}

func (r *PostRepo) Update(ctx context.Context, post *models.Post) error {
	return r.db.WithContext(ctx).Save(post).Error
}

func (r *PostRepo) GetAllActive(ctx context.Context) ([]models.Post, error) {
    var posts []models.Post
    err := r.db.WithContext(ctx).
        Order("created_at desc").
        Find(&posts).Error
    return posts, err
}
