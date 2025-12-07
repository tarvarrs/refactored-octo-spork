package user

import (
	"context"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"oralo/internal/entity"
	"oralo/internal/usecase"
)

type UserUseCaseImpl struct {
	repo      usecase.UserRepo
	jwtSecret []byte
}

func NewUserUseCase(r usecase.UserRepo, secret string) *UserUseCaseImpl {
	return &UserUseCaseImpl{
		repo:      r,
		jwtSecret: []byte(secret),
	}
}

func (uc *UserUseCaseImpl) RegisterOrLogin(ctx context.Context, username string) (string, error) {
	user, err := uc.repo.GetByUsername(ctx, username)

	if err != nil {
		newUser := &entity.User{
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

func (uc *UserUseCaseImpl) GetLeaderboard(ctx context.Context) ([]entity.User, error) {
	return uc.repo.GetTopScreamers(ctx, 10)
}

func (uc *UserUseCaseImpl) GetProfile(ctx context.Context, username string) (*entity.User, error) {
	return uc.repo.GetByUsername(ctx, username)
}
