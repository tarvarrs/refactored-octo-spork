package post

import (
	"context"
	"errors"
	"oralo/internal/models"
	"oralo/internal/usecase"
)

type Usecase struct {
	repo usecase.PostRepo
}

func NewUsecase(r usecase.PostRepo) *Usecase {
	return &Usecase{repo: r}
}

func (uc *Usecase) CreatePost(ctx context.Context, content string, volume int, userID uint) (*models.Post, error) {
	if volume < 0 {
		return nil, errors.New("volume cannot be negative")
	}
	if volume > 120 {
		volume = 120 
	}

	post := &models.Post{
		Content:         content,
		InitialVolume:   volume,
		SupportScore:    0, 
		MaxScreamVolume: 0,
		UserID:          userID,
	}

	if err := uc.repo.Create(ctx, post); err != nil {
		return nil, err
	}

	return post, nil
}


func (uc *Usecase) ScreamAtPost(ctx context.Context, postID uint, volume int) (*models.Post, error) {
	post, err := uc.repo.GetByID(ctx, postID)
	if err != nil {
		return nil, err
	}
	post.AddSupport(volume)

	if err := uc.repo.Update(ctx, post); err != nil {
		return nil, err
	}

	return post, nil
}

func (uc *Usecase) GetFeed(ctx context.Context) ([]models.Post, error) {
	return uc.repo.GetAllActive(ctx)
}
