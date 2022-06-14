const Followers = require('../models/followers.model')
const ApiError = require('../error/api.error')

class FollowersController {
    async append(req, res, next) {
        try {
            const { userId } = req.body;
            const { userToFollowId } = req.params;

            const user = await Followers.findOne({ user: userId });
            const userToFollow = await Followers.findOne({ user: userToFollowId });

            if (!user || !userToFollow) {
               next(ApiError.badRequest('Пользователь не найден'))
            }

            const isFollowing =
                user.following.length > 0 &&
                user.following.filter(following => following.user.toString() === userToFollowId)
                    .length > 0;

            if (isFollowing) {
                next(ApiError.badRequest('Пользователь уже в друзьях'))
            }

            await user.following.unshift({ user: userToFollowId });
            await user.save();

            await userToFollow.followers.unshift({ user: userId });
            await userToFollow.save();

            return res.status(200).send("Обновлено");
        } catch (error) {
            console.error(error);
            return next(ApiError.forbidden('Что-то пошло не так'))
        }
    }
}

module.exports = new FollowersController()
