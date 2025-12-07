package user

import (
	"context"
	"time"

	"oralo/internal/models"
	"oralo/internal/usecase"

	"github.com/golang-jwt/jwt/v5"
)

type Usecase struct {
	repo      usecase.UserRepo
	jwtSecret []byte
}

func NewUsecase(r usecase.UserRepo, secret string) *Usecase {
	return &Usecase{
		repo:      r,
		jwtSecret: []byte(secret),
	}
}

func (uc *Usecase) RegisterOrLogin(ctx context.Context, username string) (string, error) {
	user, err := uc.repo.GetByUsername(ctx, username)

	if err != nil {
		newUser := &models.User{
			Username:     username,
			TotalScreams: 0,
		}

		if err := uc.repo.Create(ctx, newUser); err != nil {
			return "", err
		}
		user = newUser
	}

	claims := jwt.MapClaims{
		"sub":      user.ID,
		"username": user.Username,
		"exp":      time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(uc.jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (uc *Usecase) GetLeaderboard(ctx context.Context) ([]models.User, error) {
	return uc.repo.GetTopScreamers(ctx, 10)
}

func (uc *Usecase) GetProfile(ctx context.Context, username string) (*models.User, error) {
	return uc.repo.GetByUsername(ctx, username)
}
