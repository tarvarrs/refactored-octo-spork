package post

import (
	"context"
	"errors"
	"oralo/internal/entity"
	"oralo/internal/usecase"
)

type Usecase struct {
	repo usecase.PostRepo
}

func NewUsecase(r usecase.PostRepo) *Usecase {
	return &Usecase{repo: r}
}

func (uc *Usecase) CreatePost(ctx context.Context, content string, volume int) (*entity.Post, error) {
	if volume < 0 {
		return nil, errors.New("volume cannot be negative")
	}
	if volume > 120 {
		volume = 120
	}

	post := &entity.Post{
		Content:       content,
		InitialVolume: volume,
		CurrentHP:     1000,
		IsDestroyed:   false,
	}

	if err := uc.repo.Create(ctx, post); err != nil {
		return nil, err
	}

	return post, nil
}

func (uc *Usecase) ScreamDamage(ctx context.Context, postID uint, damage int) (*entity.Post, error) {
	post, err := uc.repo.GetByID(ctx, postID)
	if err != nil {
		return nil, err
	}

	if post.IsDestroyed {
		return post, nil
	}

	post.CurrentHP -= damage
	if post.CurrentHP <= 0 {
		post.CurrentHP = 0
		post.IsDestroyed = true
	}

	if err := uc.repo.Update(ctx, post); err != nil {
		return nil, err
	}

	return post, nil
}
