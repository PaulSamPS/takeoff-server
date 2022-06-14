const Followers = require('../../models/followers.model')
const FollowersUserDto = require('../../dto/followerrsUser.dto')
const ApiError = require('../../error/api.error')

const followersGet = async (userId) => {
  const user = await Followers.findOne({ user: userId }).populate('following.user')

  let followersUser = user.following.map((e) => {
    return new FollowersUserDto(e.user)
  })

  return { followersUser }
}

const follow = async (userId, userToFollowId) => {
  const user = await Followers.findOne({ user: userId })
  const userToFollow = await Followers.findOne({ user: userToFollowId })

  const isFollowing =
    user.following.length > 0 && user.following.filter((following) => following.user.toString() === userToFollowId).length > 0

  if (isFollowing) {
    return console.log('Пользователь уже в друзьях')
  }

  await user.following.unshift({ user: userToFollowId })
  await user.save()

  await userToFollow.followers.unshift({ user: userId })
  await userToFollow.save()

  let followersUser = user.following

  return { followersUser }
}

module.exports = { followersGet, follow }
